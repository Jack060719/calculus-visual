(function () {
  'use strict';
  var CV = window.CV;
  var math = {
    fns: {
      continuous: {
        a: 1, leftLimit: 1, rightLimit: 1, fAtA: 1,
        tex: 'f(x)=\\frac{x^2}{2}+\\frac{1}{2}',
        f: function (x) { return x * x / 2 + 0.5; }
      },
      removable: {
        a: 1, leftLimit: 2, rightLimit: 2, fAtA: NaN,
        tex: 'f(x)=\\frac{x^2-1}{x-1}',
        // 約分後求值，避免靠近空洞時相減造成精度損失。
        f: function (x) { return x === 1 ? NaN : x + 1; }
      },
      jump: {
        a: 1, leftLimit: 2, rightLimit: 0, fAtA: 0,
        tex: 'f(x)=\\begin{cases}x+1&x<1\\\\\\frac{x}{2}-\\frac{1}{2}&x\\ge1\\end{cases}',
        left: function (x) { return x + 1; },
        right: function (x) { return x / 2 - 0.5; },
        f: function (x) { return x < 1 ? x + 1 : x / 2 - 0.5; }
      }
    },
    evalAt: function (fnKey, x) { return math.fns[fnKey].f(x); },
    approach: function (fnKey, delta) {
      var a = math.fns[fnKey].a;
      return { left: math.evalAt(fnKey, a - delta), right: math.evalAt(fnKey, a + delta) };
    },
    classify: function (fnKey) {
      var fn = math.fns[fnKey];
      if (fn.leftLimit !== fn.rightLimit) return 'jump';
      return fn.fAtA === fn.leftLimit ? 'continuous' : 'removable';
    },
    clampDelta: function (delta) { return Math.max(0.001, Math.min(2, delta)); },
    closeView: function (fnKey, delta) {
      var fn = math.fns[fnKey];
      var width = Math.max(0.02, 20 * delta);
      var center = (fn.leftLimit + fn.rightLimit) / 2;
      // 跳躍時保留兩個目標的高度，避免拉近後其中一側消失。
      var height = Math.max(width * 0.75, Math.abs(fn.leftLimit - fn.rightLimit) * 1.3);
      return { x: [fn.a - width / 2, fn.a + width / 2], y: [center - height / 2, center + height / 2] };
    },
    format: function (value) { return Number.isFinite(value) ? value.toFixed(4) : '未定義'; },
    formula: function (fnKey, delta) {
      var fn = math.fns[fnKey], values = math.approach(fnKey, delta);
      return '\\begin{aligned}&' + fn.tex +
        '\\\\&\\lim_{x\\to 1^-}f(x)=' + math.format(fn.leftLimit) +
        ',\\quad\\lim_{x\\to 1^+}f(x)=' + math.format(fn.rightLimit) +
        ',\\quad f(1)=' + (Number.isFinite(fn.fAtA) ? math.format(fn.fAtA) : '\\text{未定義}') +
        ',\\quad f(1-\\delta)=' + math.format(values.left) +
        ',\\quad f(1+\\delta)=' + math.format(values.right) + '\\end{aligned}';
    }
  };

  function init(container) {
    var theme = CV.theme, roles = theme.roles;
    var key = 'continuous', delta = 1;
    var weights = { continuous: 1, removable: 0, jump: 0 };
    var fade = null, motion = null, playing = false, focused = false;
    var lastFormula = math.formula(key, delta);
    var overview = { x: [-1.5, 3.5], y: [-1, 5.5] };
    var shell = CV.ui.shell(container, {
      title: '極限：越來越近，會到哪裡？',
      lede: '讓兩個點從左右靠近同一個位置，看看它們是否走向同一個高度，以及那裡是否真的有點。',
      tex: lastFormula
    });
    var badge = document.createElement('span');
    badge.className = 'cv-badge';
    var readouts = [
      CV.ui.readout('f(a−δ)'), CV.ui.readout('f(a+δ)'),
      CV.ui.readout('左極限'), CV.ui.readout('右極限'), CV.ui.readout('f(a)')
    ];
    var slider = CV.ui.slider({
      label: '距離 δ', min: 0.001, max: 2, log: true, value: delta,
      format: math.format,
      onInput: function (value) { moveDelta(value); }
    });
    var play = CV.ui.button({
      label: '播放 δ→0',
      onClick: function () {
        if (playing) { stopMotion(); return; }
        stopMotion();
        playing = true;
        focused = true;
        play.el.textContent = '停止播放';
        var fromDelta = delta;
        var fromView = { x: p.view.x.slice(), y: p.view.y.slice() };
        var toView = math.closeView(key, 0.001);
        motion = CV.plot.tween(0, 1, {
          duration: 3000, easing: theme.easing.easeInOutCubic,
          onUpdate: function (t) {
            delta = CV.plot.lerp(fromDelta, 0.001, t);
            slider.set(delta);
            p.setView({
              x: fromView.x.map(function (v, i) { return CV.plot.lerp(v, toView.x[i], t); }),
              y: fromView.y.map(function (v, i) { return CV.plot.lerp(v, toView.y[i], t); })
            }, { duration: 0 });
          },
          onDone: function () { motion = null; playing = false; play.el.textContent = '播放 δ→0'; }
        });
      }
    });
    var segmented = CV.ui.segmented({
      value: key,
      options: [
        { value: 'continuous', label: '連續' },
        { value: 'removable', label: '可去不連續' },
        { value: 'jump', label: '跳躍不連續' }
      ],
      onChange: function (next) {
        if (next === key) return;
        stopMotion();
        if (fade) fade.cancel();
        var before = Object.assign({}, weights);
        key = next;
        focused = false;
        p.setView(overview);
        fade = CV.plot.tween(0, 1, {
          duration: theme.duration.normal,
          onUpdate: function (t) {
            Object.keys(weights).forEach(function (name) {
              weights[name] = CV.plot.lerp(before[name], name === key ? 1 : 0, t);
            });
          },
          onDone: function () { fade = null; }
        });
        updateBadge();
      }
    });

    function stopMotion() {
      if (motion) motion.cancel();
      motion = null;
      playing = false;
      play.el.textContent = '播放 δ→0';
    }
    function moveDelta(value) {
      stopMotion();
      if (focused) { p.setView(overview); focused = false; }
      motion = CV.plot.tween(delta, math.clampDelta(value), {
        duration: theme.duration.fast,
        onUpdate: function (value) { delta = value; slider.set(delta); },
        onDone: function () { motion = null; }
      });
    }
    function updateBadge() {
      badge.textContent = {
        continuous: '連續', removable: '極限存在但不連續', jump: '極限不存在（左右不相等）'
      }[math.classify(key)];
    }
    function drawScene(plot, fnKey, alpha) {
      if (alpha <= 0) return;
      var fn = math.fns[fnKey], a = fn.a;
      var values = math.approach(fnKey, delta);
      var curveStyle = { color: roles.curve, alpha: alpha, glow: 8 };
      if (fnKey === 'jump') {
        plot.curve(fn.left, Object.assign({ to: a }, curveStyle));
        plot.curve(fn.right, Object.assign({ from: a }, curveStyle));
      } else {
        plot.curve(fn.f, curveStyle);
      }
      plot.segment(a, plot.view.y[0], a, plot.view.y[1], {
        color: roles.highlight, alpha: alpha * 0.35, dash: [3, 6], width: 1
      });
      [fn.leftLimit, fn.rightLimit].forEach(function (limit, i) {
        if (i && limit === fn.leftLimit) return;
        plot.segment(plot.view.x[0], limit, plot.view.x[1], limit, {
          color: roles.highlight, alpha: alpha * 0.45, dash: [6, 6], width: 1
        });
        plot.dot(a, limit, {
          color: roles.highlight, alpha: alpha, r: 6,
          hollow: !Number.isFinite(fn.fAtA) || limit !== fn.fAtA
        });
        plot.ctx.save();
        plot.ctx.globalAlpha = alpha;
        plot.text((fn.leftLimit === fn.rightLimit ? '極限' : i ? '右極限' : '左極限') + ' = ' + limit,
          plot.view.x[0], limit, { color: roles.highlight, align: 'left', offset: [12, -16] });
        plot.ctx.restore();
      });
      [-1, 1].forEach(function (side) {
        var x = a + side * delta, y = side < 0 ? values.left : values.right;
        var active = { color: roles.active, alpha: alpha * 0.6, dash: [4, 5], width: 1 };
        plot.segment(x, 0, x, y, active);
        plot.segment(0, y, x, y, active);
        plot.arrow(x, y, a, y, { color: roles.active, alpha: alpha * 0.8, width: 2 });
        plot.dot(x, y, { color: roles.active, alpha: alpha, r: 6, glow: 12 });
      });
    }
    var p = CV.plot.create(shell.vizEl, {
      x: overview.x, y: overview.y, aspect: 4 / 3,
      draw: function (ctx, plot) {
        Object.keys(weights).forEach(function (name) { drawScene(plot, name, weights[name]); });
        var fn = math.fns[key], values = math.approach(key, delta);
        [values.left, values.right, fn.leftLimit, fn.rightLimit, fn.fAtA].forEach(function (value, i) {
          readouts[i].set(math.format(value));
        });
        var formula = math.formula(key, delta);
        if (formula !== lastFormula) {
          CV.plot.renderTeX(shell.formulaEl, formula);
          lastFormula = formula;
        }
      }
    });
    [-1, 1].forEach(function (side) {
      p.addHandle({
        get: function () {
          var x = math.fns[key].a + side * delta;
          return { x: x, y: math.evalAt(key, x) };
        },
        set: function (x) { moveDelta(side * (x - math.fns[key].a)); },
        radius: 24
      });
    });
    updateBadge();
    shell.panelEl.append(segmented.el, slider.el, play.el, badge);
    readouts.forEach(function (readout) { shell.panelEl.append(readout.el); });
  }
  CV.sections.limit = { init: init, math: math };
}());
