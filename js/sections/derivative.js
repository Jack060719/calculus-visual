(function () {
  'use strict';
  var CV = window.CV;
  var math = {
    f: function (x) { return x * x * x / 3 - x; },
    df: function (x) { return x * x - 1; },
    // 展開差商，避免 h 很小時兩個相近函數值相減的消去誤差。
    secantSlope: function (x0, h) { return x0 * x0 - 1 + x0 * h + h * h / 3; },
    tangentLine: function (x0) {
      var slope = math.df(x0);
      return { slope: slope, intercept: math.f(x0) - slope * x0 };
    },
    geometry: function (x0, h) {
      var y0 = math.f(x0);
      var xq = x0 + h;
      var slope = math.secantSlope(x0, h);
      var tangent = math.tangentLine(x0);
      return {
        xq: xq, y0: y0, yq: math.f(xq), slope: slope, tangent: tangent,
        dx: h, dy: slope * h, error: Math.abs(slope - tangent.slope),
        tangentAlpha: 0.25 + 0.65 * Math.log(2 / h) / Math.log(2000),
        right: Math.max(3, xq + 0.5), top: Math.max(3.5, math.f(xq) + 0.5),
        bottom: Math.min(-3.5, math.f(xq) - 0.5)
      };
    }
  };

  function init(container) {
    var shell = CV.ui.shell(container, {
      title: '導數：瞬間的變化率',
      lede: '拖曳曲線上的 P，讓 Q 靠近 P，看兩點間的平均斜率變成當下的變化率。',
      tex: "f(x)=\\frac{x^3}{3}-x,\\qquad f'(x)=x^2-1"
    });
    var roles = CV.theme.roles;
    var x0 = 1.2;
    var targetX = x0;
    var h = 1;
    var animation = null;
    var handle;
    var radius = 6;
    var lastTex = '';
    var lastH = h;
    function fmt(value, digits) {
      return CV.plot.fmt(Math.abs(value) < Math.pow(10, -digits) / 2 ? 0 : value, digits);
    }
    var slider = CV.ui.slider({
      label: 'h（對數刻度，2 → 0.001）', min: 0.001, max: 2, log: true, value: h,
      format: function (value) { return fmt(value, 3); },
      onInput: function (value) { animateH(value, CV.theme.duration.fast); }
    });
    // 數值由左至右遞減，沿用共用滑桿的對數映射。
    slider.el.querySelector('input').dir = 'rtl';
    var position = CV.ui.readout('拖曳 P（青色曲線上的洋紅點）');
    var secant = CV.ui.readout('割線斜率 m（洋紅）');
    var tangent = CV.ui.readout('切線斜率 f′(x₀)（琥珀）');
    var difference = CV.ui.readout('斜率差值 |m − f′(x₀)|');
    var deltas = CV.ui.readout('直角三角形：水平 Δx、垂直 Δy');

    function animateH(to, duration) {
      if (animation) animation.cancel();
      animation = CV.plot.tween(h, to, {
        duration: duration, easing: CV.theme.easing.easeInOutCubic,
        onUpdate: function (value) { h = value; },
        onDone: function () { h = to; animation = null; }
      });
    }

    var p = CV.plot.create(shell.vizEl, {
      x: [-3, 3], y: [-3.5, 3.5], zoom: false,
      draw: function (ctx, plot, dt) {
        x0 = CV.plot.damp(x0, targetX, 24, dt);
        if (Math.abs(x0 - targetX) < 0.000001) x0 = targetX;
        radius = CV.plot.damp(radius, handle && (handle.hover || handle.active) ? 9 : 6, 24, dt);
        var g = math.geometry(x0, h);
        plot.curve(math.f, { color: roles.curve, glow: 8 });
        plot.lineThrough(x0, g.y0, g.tangent.slope, {
          color: roles.highlight, alpha: g.tangentAlpha, width: 4, glow: 6
        });
        plot.segment(x0, g.y0, g.xq, g.y0, {
          color: roles.active, dash: [4, 4], alpha: 0.7
        });
        plot.segment(g.xq, g.y0, g.xq, g.yq, {
          color: roles.active, dash: [4, 4], alpha: 0.7
        });
        plot.lineThrough(x0, g.y0, g.slope, { color: roles.active, width: 2, glow: 10 });
        plot.dot(g.xq, g.yq, { color: roles.active, hollow: true, r: 5 });
        plot.dot(x0, g.y0, { color: roles.active, r: radius, glow: 16 });
        plot.text('P', x0, g.y0, { color: roles.active, offset: [-14, -20] });
        plot.text('Q', g.xq, g.yq, { color: roles.active, offset: [14, -20] });
        plot.text('Δx = ' + fmt(g.dx, 3), (x0 + g.xq) / 2, g.y0, {
          color: roles.active, offset: [0, g.dy >= 0 ? 22 : -42], size: 12
        });
        // 朝向畫面內側標示，避免 Q 靠右時數字被裁掉。
        plot.text('Δy = ' + fmt(g.dy, 3), g.xq, (g.y0 + g.yq) / 2, {
          color: roles.active, offset: [-12, g.dy >= 0 ? -40 : 22], align: 'right', size: 12
        });
        if (lastH !== h) { slider.set(h); lastH = h; }
        position.set('x₀ = ' + fmt(x0, 2) + '，f(x₀) = ' + fmt(g.y0, 3));
        secant.set(fmt(g.slope, 6));
        tangent.set(fmt(g.tangent.slope, 6));
        difference.set(fmt(g.error, 6));
        deltas.set('Δx = ' + fmt(g.dx, 3) + '，Δy = ' + fmt(g.dy, 6));
        var tex = '\\begin{aligned}' +
          'm&=\\frac{f(x_0+h)-f(x_0)}{h}=\\frac{f(' + fmt(x0, 2) + '+' + fmt(h, 3) + ')-f(' + fmt(x0, 2) + ')}{' + fmt(h, 3) + '}=' + fmt(g.slope, 3) + '\\\\' +
          "f(x)&=\\frac{x^3}{3}-x,\\quad f'(x_0)=" + fmt(g.tangent.slope, 3) + ',\\quad |m-f\'(x_0)|=' + fmt(g.error, 6) +
          '\\end{aligned}';
        if (tex !== lastTex) { CV.plot.renderTeX(shell.formulaEl, tex); lastTex = tex; }
        // 下一幀平滑擴大視窗，讓本幀網格與曲線使用相同座標。
        plot.view.x[1] = CV.plot.damp(plot.view.x[1], g.right, 24, dt);
        plot.view.y[0] = CV.plot.damp(plot.view.y[0], g.bottom, 24, dt);
        plot.view.y[1] = CV.plot.damp(plot.view.y[1], g.top, 24, dt);
      }
    });
    handle = p.addHandle({
      get: function () { return { x: x0, y: math.f(x0) }; },
      set: function (x) { targetX = Math.max(-2.6, Math.min(2.6, x)); },
      radius: 24
    });
    shell.panelEl.append(slider.el, CV.ui.button({
      label: '播放 h→0', onClick: function () { animateH(0.001, 2500); }
    }).el, CV.ui.button({
      label: '重設 h', onClick: function () { animateH(1, CV.theme.duration.slow); }
    }).el, position.el, secant.el, tangent.el, difference.el, deltas.el);
  }

  CV.sections.derivative = { init: init, math: math };
}());
