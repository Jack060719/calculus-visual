(function () {
  'use strict';
  var CV = window.CV;
  var math = {
    f: function (x) { return Math.sin(x) + 1; },
    F: function (x) { return x - Math.cos(x); },
    exact: function (a, b) { return math.F(b) - math.F(a); },
    samplePoints: function (a, b, n, method) {
      var dx = (b - a) / n;
      var offset = method === 'left' ? 0 : method === 'right' ? 1 : 0.5;
      return Array.from({ length: n }, function (_, i) { return a + (i + offset) * dx; });
    },
    riemann: function (a, b, n, method) {
      return math.samplePoints(a, b, n, method).reduce(function (sum, x) {
        return sum + math.f(x);
      }, 0) * (b - a) / n;
    }
  };

  function init(container) {
    var a = 0, b = 3, n = 20, method = 'mid';
    var exact = math.exact(a, b);
    var rectangles = [];
    var transition = null;
    var playback = null;
    var playing = false;
    var readoutsDirty = true;
    var markerAlpha = 1;
    var shell = CV.ui.shell(container, {
      title: '積分：把面積切成細條再加起來',
      lede: '把 f(x) = sin x + 1 在 [0, 3] 的面積切成矩形，加總後看看離真實面積還差多少。',
      tex: ''
    });
    var approximation = CV.ui.readout('近似值 Rₙ');
    var truth = CV.ui.readout('真值：4 − cos 3');
    var error = CV.ui.readout('誤差（Rₙ − 真值）');
    var relative = CV.ui.readout('相對誤差（%）');
    truth.set(exact.toFixed(8));

    function updateReadouts() {
      var value = math.riemann(a, b, n, method);
      var difference = value - exact;
      approximation.set(value.toFixed(8));
      error.set((difference >= 0 ? '+' : '') + difference.toFixed(8));
      relative.set((difference >= 0 ? '+' : '') + (difference / exact * 100).toFixed(6) + '%');
      CV.plot.renderTeX(shell.formulaEl,
        '\\sum_{i=1}^{' + n + '} f(x_i^*)\\,\\Delta x = ' + value.toFixed(4) +
        ',\\quad \\Delta x=\\frac{b-a}{' + n + '}=' + ((b - a) / n).toFixed(4));
    }

    // 保留當下幾何作為起點，快速拖曳時也不跳回上一個目標。
    function change(nextN, nextMethod, onDone) {
      if (transition) transition.cancel();
      n = nextN;
      method = nextMethod;
      var points = math.samplePoints(a, b, n, method);
      var dx = (b - a) / n;
      var count = Math.max(n, rectangles.length);
      var from = [], to = [];
      for (var i = 0; i < count; i++) {
        var target = i < n ? {
          left: a + i * dx, width: dx, x: points[i], height: math.f(points[i]), alpha: 1
        } : {
          left: rectangles[i].left, width: 0, x: rectangles[i].x, height: 0, alpha: 0
        };
        var current = rectangles[i] || {
          left: target.left, width: 0, x: target.x, height: 0, alpha: 0
        };
        from.push(Object.assign({}, current));
        to.push(target);
        rectangles[i] = current;
      }
      var fromMarkers = markerAlpha;
      var toMarkers = n <= 60 ? 1 : 0;
      readoutsDirty = true;
      transition = CV.plot.tween(0, 1, {
        duration: CV.theme.duration.normal,
        onUpdate: function (t) {
          for (var j = 0; j < count; j++) {
            var rect = rectangles[j], start = from[j], end = to[j];
            rect.left = CV.plot.lerp(start.left, end.left, t);
            rect.width = CV.plot.lerp(start.width, end.width, t);
            rect.x = CV.plot.lerp(start.x, end.x, t);
            rect.height = CV.plot.lerp(start.height, end.height, t);
            rect.alpha = CV.plot.lerp(start.alpha, end.alpha, t);
          }
          markerAlpha = CV.plot.lerp(fromMarkers, toMarkers, t);
        },
        onDone: function () {
          rectangles.length = n;
          transition = null;
          if (onDone) onDone();
        }
      });
    }

    function stopPlayback() {
      if (playback) playback.cancel();
      playback = null;
      playing = false;
      play.el.textContent = '播放';
    }

    var slider = CV.ui.slider({
      label: '矩形數 n', min: 1, max: 200, step: 1, value: n,
      onInput: function (value) {
        stopPlayback();
        change(value, method);
      }
    });
    var sampling = CV.ui.segmented({
      value: method,
      options: [
        { label: '左', value: 'left' },
        { label: '中點', value: 'mid' },
        { label: '右', value: 'right' }
      ],
      onChange: function (value) {
        stopPlayback();
        change(n, value);
      }
    });
    sampling.el.setAttribute('aria-label', '取樣方式');
    var play = CV.ui.button({
      label: '播放',
      onClick: function () {
        if (playing) { stopPlayback(); return; }
        playing = true;
        play.el.textContent = '暫停';
        slider.set(1);
        // 先平滑回到一條，再用四秒逐步細分。
        change(1, method, function () {
          if (!playing) return;
          playback = CV.plot.tween(1, 200, {
            duration: 4000,
            easing: CV.theme.easing.linear,
            onUpdate: function (value) {
              var next = Math.round(value);
              if (next === n) return;
              slider.set(next);
              change(next, method);
            },
            onDone: stopPlayback
          });
        });
      }
    });
    shell.panelEl.append(slider.el, sampling.el, play.el,
      approximation.el, truth.el, error.el, relative.el);

    var initialPoints = math.samplePoints(a, b, n, method);
    rectangles = initialPoints.map(function (x, i) {
      return { left: a + i * (b - a) / n, width: (b - a) / n, x: x, height: math.f(x), alpha: 1 };
    });
    CV.plot.create(shell.vizEl, {
      x: [-0.25, 3.25], y: [-0.25, 2.5], aspect: 4 / 3, zoom: false,
      draw: function (ctx, p) {
        if (readoutsDirty) { updateReadouts(); readoutsDirty = false; }
        p.area(math.f, a, b, { color: CV.theme.roles.highlight, alpha: 0.14 });
        rectangles.forEach(function (rect) {
          if (rect.width <= 0 || rect.alpha <= 0) return;
          p.rect(rect.left, 0, rect.left + rect.width, rect.height, {
            color: CV.theme.roles.active, alpha: 0.2 * rect.alpha, stroke: false
          });
          p.rect(rect.left, 0, rect.left + rect.width, rect.height, {
            color: CV.theme.roles.active, alpha: 0.7 * rect.alpha, fill: false, width: 0.7
          });
          if (markerAlpha > 0.01) p.dot(rect.x, rect.height, {
            color: CV.theme.roles.active, alpha: markerAlpha * rect.alpha, r: 3, glow: 0
          });
        });
        p.curve(math.f, { from: a, to: b, color: CV.theme.roles.curve, width: 2 });
        p.text('f(x) = sin x + 1', 1.5, 2.3, { color: CV.theme.roles.curve });
      }
    });
    updateReadouts();
  }

  CV.sections.integral = { init: init, math: math };
}());
