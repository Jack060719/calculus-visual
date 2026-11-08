(function () {
  'use strict';
  var CV = window.CV;
  var theme = CV.theme;
  var texCache = new WeakMap();

  function lerp(a, b, t) { return a + (b - a) * t; }
  // dt 以秒為單位，duration 以毫秒為單位。
  function damp(cur, target, lambda, dt) { return lerp(cur, target, 1 - Math.exp(-lambda * dt)); }
  function copyView(view) { return { x: view.x.slice(), y: view.y.slice() }; }
  function tickStep(span, pixels) {
    var raw = span / Math.max(2, pixels / 80);
    var power = Math.pow(10, Math.floor(Math.log10(raw)));
    var fraction = raw / power;
    return (fraction < 1.5 ? 1 : fraction < 3 ? 2 : fraction < 7 ? 5 : 10) * power;
  }
  function tickLabel(value, step) {
    if (Math.abs(value) < step * 1e-6) return '0';
    if (Math.abs(value) >= 1e5 || step < 1e-4) return value.toExponential(1);
    return value.toFixed(Math.max(0, -Math.floor(Math.log10(step))));
  }
  function tween(from, to, options) {
    var duration = options.duration === undefined ? theme.duration.normal : options.duration;
    var easing = options.easing || theme.easing.easeOutCubic;
    if (typeof easing === 'string') easing = theme.easing[easing];
    var start = performance.now();
    var cancelled = false;
    var frame;
    function update(now) {
      if (cancelled) return;
      var t = duration <= 0 ? 1 : Math.min(1, (now - start) / duration);
      options.onUpdate(lerp(from, to, easing(t)));
      if (cancelled) return;
      if (t < 1) frame = requestAnimationFrame(update);
      else if (options.onDone) options.onDone();
    }
    frame = requestAnimationFrame(update);
    return { cancel: function () { cancelled = true; cancelAnimationFrame(frame); } };
  }
  function renderTeX(el, tex) {
    if (texCache.get(el) === tex) return;
    texCache.set(el, tex);
    if (window.katex) window.katex.render(tex, el, { throwOnError: false });
    else el.textContent = tex;
  }
  function fmt(value, digits) {
    return Number(value).toFixed(digits === undefined ? 2 : digits);
  }

  function create(host, options) {
    options = options || {};
    var initial = { x: (options.x || [-5, 5]).slice(), y: (options.y || [-3, 3]).slice() };
    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-label', '互動函數圖；可拖曳觀察點，或使用旁邊的控制項調整。');
    canvas.setAttribute('role', 'img');
    canvas.style.touchAction = 'none';
    canvas.style.width = '100%';
    canvas.style.display = 'block';
    host.append(canvas);
    var ctx = canvas.getContext('2d');
    var p = { canvas: canvas, ctx: ctx, width: 0, height: 0, view: copyView(initial) };
    var zoom = options.zoom !== false;
    var dpr = 0;
    var visible = false;
    var frame = 0;
    var lastTime = 0;
    var viewAnimation = null;
    var handles = [];
    var pointers = new Map();
    var gesture = null;
    var lastTap = null;

    p.toPx = function (x, y) {
      return {
        x: (x - p.view.x[0]) / (p.view.x[1] - p.view.x[0]) * p.width,
        y: (p.view.y[1] - y) / (p.view.y[1] - p.view.y[0]) * p.height
      };
    };
    p.toWorld = function (px, py) {
      return {
        x: lerp(p.view.x[0], p.view.x[1], px / p.width),
        y: lerp(p.view.y[1], p.view.y[0], py / p.height)
      };
    };
    p.setView = function (view, settings) {
      var duration = settings && settings.duration !== undefined ? settings.duration : theme.duration.normal;
      var target = { x: (view.x || p.view.x).slice(), y: (view.y || p.view.y).slice() };
      if (duration <= 0) {
        p.view = target;
        viewAnimation = null;
      } else {
        viewAnimation = { from: copyView(p.view), to: target, start: performance.now(), duration: duration };
      }
      schedule();
    };
    p.resetView = function () { p.setView(initial, { duration: theme.duration.normal }); };

    function resize() {
      var width = canvas.getBoundingClientRect().width;
      var height = Math.min(width / (options.aspect || 4 / 3), window.innerHeight * 0.6);
      var ratio = window.devicePixelRatio || 1;
      if (width === p.width && height === p.height && ratio === dpr) return;
      p.width = width;
      p.height = height;
      dpr = ratio;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.height = height + 'px';
      schedule();
    }
    function schedule() {
      if (!frame && visible && !document.hidden && p.width > 0 && p.height > 0) frame = requestAnimationFrame(render);
    }
    function pause() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    }
    function render(now) {
      frame = 0;
      if (!visible || document.hidden) return;
      if (dpr !== (window.devicePixelRatio || 1)) resize();
      var dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = now;
      if (viewAnimation) {
        var t = Math.min(1, (now - viewAnimation.start) / viewAnimation.duration);
        var eased = theme.easing.easeInOutCubic(t);
        ['x', 'y'].forEach(function (axis) {
          p.view[axis] = viewAnimation.from[axis].map(function (v, i) { return lerp(v, viewAnimation.to[axis][i], eased); });
        });
        if (t === 1) viewAnimation = null;
      }
      ctx.setTransform(canvas.width / p.width, 0, 0, canvas.height / p.height, 0, 0);
      ctx.clearRect(0, 0, p.width, p.height);
      drawGrid();
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, p.width, p.height);
      ctx.clip();
      if (options.draw) options.draw(ctx, p, dt);
      ctx.restore();
      schedule();
    }
    function drawGrid() {
      var xStep = tickStep(p.view.x[1] - p.view.x[0], p.width);
      var yStep = tickStep(p.view.y[1] - p.view.y[0], p.height);
      var zero = p.toPx(0, 0);
      ctx.save();
      ctx.lineWidth = 1;
      ctx.font = '11px ' + theme.fonts.mono;
      ctx.fillStyle = theme.colors.textDim;
      // 刻度標籤留在畫面內，即使原點已平移到畫面外。
      var labelY = Math.max(16, Math.min(p.height - 8, zero.y + 18));
      var labelX = Math.max(8, Math.min(p.width - 50, zero.x + 8));
      for (var x = Math.ceil(p.view.x[0] / xStep) * xStep; x <= p.view.x[1]; x += xStep) {
        var px = p.toPx(x, 0).x;
        if (options.grid !== false) {
          ctx.strokeStyle = theme.colors.grid;
          ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, p.height); ctx.stroke();
        }
        if (options.axes !== false && px > 18 && px < p.width - 18) {
          ctx.textAlign = 'center'; ctx.fillText(tickLabel(x, xStep), px, labelY);
          ctx.strokeStyle = theme.colors.axis;
          ctx.beginPath(); ctx.moveTo(px, zero.y - 3); ctx.lineTo(px, zero.y + 3); ctx.stroke();
        }
      }
      for (var y = Math.ceil(p.view.y[0] / yStep) * yStep; y <= p.view.y[1]; y += yStep) {
        var py = p.toPx(0, y).y;
        if (options.grid !== false) {
          ctx.strokeStyle = theme.colors.grid;
          ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(p.width, py); ctx.stroke();
        }
        if (options.axes !== false && Math.abs(y) > yStep * 1e-6 && py > 14 && py < p.height - 14) {
          ctx.textAlign = 'left'; ctx.fillText(tickLabel(y, yStep), labelX, py - 5);
          ctx.strokeStyle = theme.colors.axis;
          ctx.beginPath(); ctx.moveTo(zero.x - 3, py); ctx.lineTo(zero.x + 3, py); ctx.stroke();
        }
      }
      if (options.axes !== false) {
        ctx.strokeStyle = theme.colors.axis;
        ctx.beginPath();
        ctx.moveTo(0, zero.y); ctx.lineTo(p.width, zero.y);
        ctx.moveTo(zero.x, 0); ctx.lineTo(zero.x, p.height);
        ctx.stroke();
      }
      ctx.restore();
    }

    function style(settings, defaultColor, defaultGlow) {
      settings = settings || {};
      ctx.strokeStyle = settings.color || defaultColor || theme.roles.curve;
      ctx.fillStyle = ctx.strokeStyle;
      ctx.lineWidth = settings.width === undefined ? 2 : settings.width;
      ctx.globalAlpha = settings.alpha === undefined ? 1 : settings.alpha;
      ctx.setLineDash(settings.dash || []);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = settings.glow === undefined ? defaultGlow || 0 : settings.glow === true ? 12 : settings.glow || 0;
    }
    p.curve = function (f, settings) {
      settings = settings || {};
      var from = Math.max(p.view.x[0], settings.from === undefined ? p.view.x[0] : settings.from);
      var to = Math.min(p.view.x[1], settings.to === undefined ? p.view.x[1] : settings.to);
      if (to < from) return;
      var count = Math.max(1, Math.ceil((to - from) / (p.view.x[1] - p.view.x[0]) * p.width));
      ctx.save(); style(settings, theme.roles.curve, 10);
      ctx.beginPath();
      var previous = null;
      for (var i = 0; i <= count; i++) {
        var x = lerp(from, to, i / count);
        var y = f(x);
        if (!Number.isFinite(y)) { previous = null; continue; }
        var point = p.toPx(x, y);
        if (!Number.isFinite(point.y)) { previous = null; continue; }
        if (!previous || Math.abs(point.y - previous.y) > p.height) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
        previous = point;
      }
      ctx.stroke(); ctx.restore();
    };
    p.segment = function (x1, y1, x2, y2, settings) {
      var a = p.toPx(x1, y1), b = p.toPx(x2, y2);
      ctx.save(); style(settings);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.restore();
    };
    p.lineThrough = function (x0, y0, slope, settings) {
      if (!Number.isFinite(slope)) { p.segment(x0, p.view.y[0], x0, p.view.y[1], settings); return; }
      // 從視窗邊界求交點，避免陡斜率產生極大畫布座標。
      var hits = [];
      p.view.x.forEach(function (x) {
        var y = y0 + slope * (x - x0);
        if (y >= p.view.y[0] && y <= p.view.y[1]) hits.push({ x: x, y: y });
      });
      if (slope !== 0) p.view.y.forEach(function (y) {
        var x = x0 + (y - y0) / slope;
        if (x >= p.view.x[0] && x <= p.view.x[1]) hits.push({ x: x, y: y });
      });
      hits.sort(function (a, b) { return a.x - b.x || a.y - b.y; });
      if (hits.length >= 2) p.segment(hits[0].x, hits[0].y, hits[hits.length - 1].x, hits[hits.length - 1].y, settings);
    };
    p.dot = function (x, y, settings) {
      settings = settings || {};
      var point = p.toPx(x, y);
      ctx.save(); style(settings, theme.roles.active, 8);
      ctx.beginPath(); ctx.arc(point.x, point.y, settings.r === undefined ? 5 : settings.r, 0, Math.PI * 2);
      if (settings.hollow) {
        ctx.fillStyle = theme.colors.surface; ctx.fill(); ctx.stroke();
      } else ctx.fill();
      ctx.restore();
    };
    // 面積樣式共用 color / alpha；矩形可另設 fill:false 或 stroke:false。
    p.rect = function (x1, y1, x2, y2, settings) {
      settings = settings || {};
      var a = p.toPx(x1, y1), b = p.toPx(x2, y2);
      ctx.save(); style(settings, theme.roles.active);
      if (settings.fill !== false) {
        ctx.globalAlpha = settings.alpha === undefined ? 0.18 : settings.alpha;
        ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
      }
      if (settings.stroke !== false) {
        ctx.globalAlpha = settings.alpha === undefined ? 0.7 : settings.alpha;
        ctx.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y);
      }
      ctx.restore();
    };
    p.area = function (f, a, b, settings) {
      var from = Math.max(Math.min(a, b), p.view.x[0]);
      var to = Math.min(Math.max(a, b), p.view.x[1]);
      if (to < from) return;
      var count = Math.max(1, Math.ceil((to - from) / (p.view.x[1] - p.view.x[0]) * p.width));
      var baseline = p.toPx(0, 0).y;
      ctx.save(); style(settings, theme.roles.highlight);
      ctx.globalAlpha = settings && settings.alpha !== undefined ? settings.alpha : 0.15;
      var previous = null;
      for (var i = 0; i <= count; i++) {
        var x = lerp(from, to, i / count), y = f(x);
        var point = p.toPx(x, y);
        if (!Number.isFinite(y) || !Number.isFinite(point.y) || (previous && Math.abs(point.y - previous.y) > p.height)) {
          if (previous) { ctx.lineTo(previous.x, baseline); ctx.closePath(); ctx.fill(); }
          previous = null;
          if (!Number.isFinite(y) || !Number.isFinite(point.y)) continue;
        }
        if (!previous) { ctx.beginPath(); ctx.moveTo(point.x, baseline); }
        ctx.lineTo(point.x, point.y);
        previous = point;
      }
      if (previous) { ctx.lineTo(previous.x, baseline); ctx.closePath(); ctx.fill(); }
      ctx.restore();
    };
    p.vband = function (x1, x2, settings) {
      p.rect(x1, p.view.y[0], x2, p.view.y[1], Object.assign({ color: theme.roles.highlight, alpha: 0.12, stroke: false }, settings));
    };
    p.arrow = function (x1, y1, x2, y2, settings) {
      var a = p.toPx(x1, y1), b = p.toPx(x2, y2);
      var angle = Math.atan2(b.y - a.y, b.x - a.x);
      p.segment(x1, y1, x2, y2, settings);
      ctx.save(); style(settings);
      ctx.beginPath(); ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x - 9 * Math.cos(angle - Math.PI / 6), b.y - 9 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(b.x - 9 * Math.cos(angle + Math.PI / 6), b.y - 9 * Math.sin(angle + Math.PI / 6));
      ctx.closePath(); ctx.fill(); ctx.restore();
    };
    p.text = function (str, x, y, settings) {
      settings = settings || {};
      var point = p.toPx(x, y), offset = settings.offset || [0, 0];
      ctx.save();
      ctx.font = (settings.size || 13) + 'px ' + theme.fonts[settings.font || 'ui'];
      ctx.fillStyle = settings.color || theme.colors.text;
      ctx.textAlign = settings.align || 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(str, point.x + offset[0], point.y + offset[1]); ctx.restore();
    };
    p.addHandle = function (settings) {
      var h = { get: settings.get, set: settings.set, radius: settings.radius === undefined ? 16 : settings.radius, hover: false, active: false };
      handles.push(h);
      return h;
    };

    function local(event) {
      var bounds = canvas.getBoundingClientRect();
      return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    }
    function hit(point) {
      var nearest = null, distance = Infinity;
      handles.forEach(function (h) {
        var world = h.get(), px = p.toPx(world.x, world.y);
        var d = Math.hypot(point.x - px.x, point.y - px.y);
        if (d <= h.radius && d < distance) { nearest = h; distance = d; }
      });
      return nearest;
    }
    function hover(point) {
      var h = point ? hit(point) : null;
      handles.forEach(function (handle) { handle.hover = handle === h; });
      canvas.style.cursor = h ? 'grab' : zoom ? 'move' : 'default';
    }
    function startGesture() {
      var pair = Array.from(pointers.values());
      pair.forEach(function (pointer) {
        if (pointer.handle) pointer.handle.active = false;
        pointer.handle = null;
        pointer.moved = true;
      });
      var center = { x: (pair[0].point.x + pair[1].point.x) / 2, y: (pair[0].point.y + pair[1].point.y) / 2 };
      gesture = {
        view: copyView(p.view), anchor: p.toWorld(center.x, center.y),
        distance: Math.max(1, Math.hypot(pair[0].point.x - pair[1].point.x, pair[0].point.y - pair[1].point.y))
      };
      viewAnimation = null;
      lastTap = null;
    }
    canvas.addEventListener('pointerdown', function (event) {
      if (event.button !== 0 || pointers.size >= 2) return;
      var point = local(event);
      var h = pointers.size === 0 ? hit(point) : null;
      if (!h && !zoom) return;
      canvas.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, { point: point, start: point, view: copyView(p.view), handle: h, moved: false, time: performance.now() });
      if (h) { h.active = true; h.hover = true; canvas.style.cursor = 'grabbing'; }
      else viewAnimation = null;
      if (pointers.size === 2 && zoom) startGesture();
    });
    canvas.addEventListener('pointermove', function (event) {
      var point = local(event), pointer = pointers.get(event.pointerId);
      if (!pointer) { hover(point); return; }
      pointer.point = point;
      if (Math.hypot(point.x - pointer.start.x, point.y - pointer.start.y) > 5) pointer.moved = true;
      if (pointers.size === 2 && zoom) {
        var pair = Array.from(pointers.values());
        var center = { x: (pair[0].point.x + pair[1].point.x) / 2, y: (pair[0].point.y + pair[1].point.y) / 2 };
        var distance = Math.max(1, Math.hypot(pair[0].point.x - pair[1].point.x, pair[0].point.y - pair[1].point.y));
        var scale = Math.max(1e-6, Math.min(1e6, gesture.distance / distance));
        var spanX = (gesture.view.x[1] - gesture.view.x[0]) * scale;
        var spanY = (gesture.view.y[1] - gesture.view.y[0]) * scale;
        var left = gesture.anchor.x - center.x / p.width * spanX;
        var top = gesture.anchor.y + center.y / p.height * spanY;
        p.setView({ x: [left, left + spanX], y: [top - spanY, top] }, { duration: 0 });
      } else if (pointer.handle) {
        var world = p.toWorld(point.x, point.y);
        pointer.handle.set(world.x, world.y);
      } else if (zoom) {
        var dx = (point.x - pointer.start.x) / p.width * (pointer.view.x[1] - pointer.view.x[0]);
        var dy = (point.y - pointer.start.y) / p.height * (pointer.view.y[1] - pointer.view.y[0]);
        p.setView({ x: pointer.view.x.map(function (v) { return v - dx; }), y: pointer.view.y.map(function (v) { return v + dy; }) }, { duration: 0 });
      }
    });
    function release(event) {
      var pointer = pointers.get(event.pointerId);
      if (!pointer) return;
      if (pointer.handle) pointer.handle.active = false;
      pointers.delete(event.pointerId);
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      if (zoom && event.type === 'pointerup' && event.pointerType === 'touch' && !pointer.moved && performance.now() - pointer.time < 300) {
        if (lastTap && performance.now() - lastTap.time < 350 && Math.hypot(pointer.point.x - lastTap.x, pointer.point.y - lastTap.y) < 28) {
          p.resetView(); lastTap = null;
        } else lastTap = { x: pointer.point.x, y: pointer.point.y, time: performance.now() };
      } else lastTap = null;
      gesture = null;
      pointers.forEach(function (remaining) {
        remaining.start = remaining.point;
        remaining.view = copyView(p.view);
        remaining.moved = true;
      });
      hover(event.pointerType === 'mouse' ? local(event) : null);
    }
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('lostpointercapture', release);
    canvas.addEventListener('pointerleave', function () { if (!pointers.size) hover(null); });
    if (zoom) {
      canvas.addEventListener('wheel', function (event) {
        if (!event.ctrlKey && !event.metaKey) return;
        event.preventDefault();
        var point = local(event), anchor = p.toWorld(point.x, point.y);
        var delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? p.height : 1);
        var scale = Math.exp(Math.max(-1, Math.min(1, delta * 0.003)));
        var base = viewAnimation ? viewAnimation.to : p.view;
        var spanX = Math.max(initial.x[1] - initial.x[0], 1) * 1e-6;
        var spanY = Math.max(initial.y[1] - initial.y[0], 1) * 1e-6;
        var width = Math.max(spanX, Math.min(spanX * 1e12, (base.x[1] - base.x[0]) * scale));
        var height = Math.max(spanY, Math.min(spanY * 1e12, (base.y[1] - base.y[0]) * scale));
        var left = anchor.x - point.x / p.width * width;
        var top = anchor.y + point.y / p.height * height;
        p.setView({ x: [left, left + width], y: [top - height, top] }, { duration: theme.duration.fast });
      }, { passive: false });
      canvas.addEventListener('dblclick', function (event) { event.preventDefault(); p.resetView(); });
    }

    var resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    var intersectionObserver = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) { resize(); schedule(); } else pause();
    });
    intersectionObserver.observe(canvas);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); else schedule(); });
    if (document.fonts) document.fonts.ready.then(function () { resize(); schedule(); });
    resize();
    return p;
  }

  function element(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }
  CV.plot = { create: create, tween: tween, damp: damp, lerp: lerp, renderTeX: renderTeX, fmt: fmt };
  CV.ui = {
    shell: function (container, options) {
      var head = element('header', 'cv-head');
      var title = element('h2', 'cv-title', options.title);
      title.dataset.number = container.dataset.number || '';
      var formulaEl = element('div', 'cv-formula');
      renderTeX(formulaEl, options.tex || '');
      head.append(title, element('p', 'cv-lede', options.lede), formulaEl);
      var body = element('div', 'cv-body');
      var vizEl = element('div', 'cv-viz');
      var panelEl = element('div', 'cv-panel');
      body.append(vizEl, panelEl);
      container.append(head, body);
      return { el: container, formulaEl: formulaEl, vizEl: vizEl, panelEl: panelEl };
    },
    slider: function (options) {
      var el = element('div', 'cv-control');
      var label = element('label');
      var caption = element('span', '', options.label);
      var output = element('output');
      var input = element('input', 'cv-slider');
      input.type = 'range';
      input.min = options.log ? 0 : options.min;
      input.max = options.log ? 1 : options.max;
      input.step = options.log ? 'any' : options.step === undefined ? 1 : options.step;
      input.setAttribute('aria-label', options.label);
      label.append(caption, output, input);
      // 包含 input 的 label 保留原生鍵盤與觸控操作。
      label.style.flexWrap = 'wrap';
      el.append(label);
      function valueOfInput() {
        var v = options.log ? Math.exp(lerp(Math.log(options.min), Math.log(options.max), Number(input.value))) : Number(input.value);
        if (options.log && options.step) v = options.min + Math.round((v - options.min) / options.step) * options.step;
        return Math.max(options.min, Math.min(options.max, v));
      }
      function updateOutput(v) {
        var text = options.format ? options.format(v) : fmt(v, options.step && options.step < 1 ? Math.ceil(-Math.log10(options.step)) : options.log ? 3 : 0);
        output.textContent = text;
        input.setAttribute('aria-valuetext', text);
      }
      var control = {
        el: el,
        set: function (value) {
          var v = Math.max(options.min, Math.min(options.max, value));
          input.value = options.log ? (Math.log(v) - Math.log(options.min)) / (Math.log(options.max) - Math.log(options.min)) : v;
          updateOutput(valueOfInput());
        }
      };
      input.addEventListener('input', function () {
        var v = valueOfInput();
        updateOutput(v);
        if (options.onInput) options.onInput(v);
      });
      control.set(options.value === undefined ? options.min : options.value);
      return control;
    },
    segmented: function (options) {
      var el = element('div', 'cv-seg');
      el.setAttribute('role', 'group');
      var buttons = options.options.map(function (option) {
        var button = element('button', '', option.label);
        button.type = 'button';
        button.setAttribute('aria-pressed', String(option.value === options.value));
        button.addEventListener('click', function () {
          buttons.forEach(function (item) { item.button.setAttribute('aria-pressed', String(item.value === option.value)); });
          if (options.onChange) options.onChange(option.value);
        });
        el.append(button);
        return { button: button, value: option.value };
      });
      return { el: el };
    },
    button: function (options) {
      var el = element('button', 'cv-btn', options.label);
      el.type = 'button';
      el.addEventListener('click', options.onClick);
      return { el: el };
    },
    readout: function (label) {
      var el = element('div', 'cv-readout');
      var output = element('output');
      el.append(element('span', '', label), output);
      return { el: el, set: function (text) { if (output.textContent !== String(text)) output.textContent = text; } };
    }
  };
}());
