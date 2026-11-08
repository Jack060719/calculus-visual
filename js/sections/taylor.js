(function () {
  'use strict';
  var CV = window.CV;
  var theme = CV.theme;
  var presets = {
    sin: { label: 'sin x', min: 0, max: 15, x: [-7, 7], y: [-3, 3] },
    exp: { label: 'eˣ', min: 0, max: 12, x: [-4, 4], y: [-2, 12] },
    ln1p: { label: 'ln(1+x)', min: 1, max: 20, x: [-1.5, 1.6], y: [-4, 2] }
  };

  var math = {
    coeffs: function (fnKey, N) {
      var values = [], factorial = 1;
      for (var k = 0; k <= N; k++) {
        if (k) factorial *= k;
        values.push(fnKey === 'exp' ? 1 / factorial : fnKey === 'sin'
          ? (k % 2 ? (k % 4 === 1 ? 1 : -1) / factorial : 0)
          : (k ? (k % 2 ? 1 : -1) / k : 0));
      }
      return values;
    },
    evalCoeffs: function (values, x) {
      var result = 0;
      for (var k = values.length - 1; k >= 0; k--) result = result * x + values[k];
      return result;
    },
    taylorEval: function (fnKey, N, x) {
      return math.evalCoeffs(math.coeffs(fnKey, N), x);
    },
    termEval: function (fnKey, k, x) {
      return math.coeffs(fnKey, k)[k] * Math.pow(x, k);
    },
    original: function (fnKey, x) {
      return fnKey === 'sin' ? Math.sin(x) : fnKey === 'exp' ? Math.exp(x) : Math.log1p(x);
    },
    // 回傳包含 0 的連續誤差區間；不把遠處偶然相交的小區間算進來。
    rangeForCoeffs: function (fnKey, values, eps) {
      function inside(x) {
        return Math.abs(math.evalCoeffs(values, x) - math.original(fnKey, x)) < eps;
      }
      function boundary(direction) {
        var lo = 0, hi = 0.025;
        while (inside(direction * hi)) { lo = hi; hi *= 1.25; }
        for (var i = 0; i < 42; i++) {
          var mid = (lo + hi) / 2;
          if (inside(direction * mid)) lo = mid;
          else hi = mid;
        }
        return direction * (lo + hi) / 2;
      }
      return { from: boundary(-1), to: boundary(1) };
    },
    goodRange: function (fnKey, N, eps) {
      return math.rangeForCoeffs(fnKey, math.coeffs(fnKey, N), eps);
    },
    convergence: function (fnKey) {
      return fnKey === 'ln1p'
        ? { from: -1, to: 1, closedRight: true, label: '收斂範圍：(−1, 1]' }
        : { from: -Infinity, to: Infinity, closedRight: false, label: '收斂範圍：全體實數' };
    },
    mixCoeffs: function (from, to, t) {
      var values = [];
      for (var k = 0; k < Math.max(from.length, to.length); k++) {
        values.push((from[k] || 0) * (1 - t) + (to[k] || 0) * t);
      }
      return values;
    },
    termTeX: function (fnKey, k) {
      var coefficient = math.coeffs(fnKey, k)[k];
      if (!coefficient) return '0';
      var power = k === 0 ? '1' : k === 1 ? 'x' : 'x^{' + k + '}';
      var denominator = k < 2 ? '' : String(k) + (fnKey === 'ln1p' ? '' : '!');
      return (coefficient < 0 ? '-' : '') + (denominator ? '\\frac{' + power + '}{' + denominator + '}' : power);
    },
    expansion: function (fnKey, N) {
      var terms = math.coeffs(fnKey, N).map(function (value, k) {
        return value ? math.termTeX(fnKey, k) : '';
      }).filter(Boolean);
      if (terms.length > 5) terms = terms.slice(0, 3).concat(['\\cdots', terms[terms.length - 1]]);
      return terms.length ? terms.map(function (term, i) {
        return i && term.charAt(0) !== '-' ? '+' + term : term;
      }).join('') : '0';
    }
  };

  function init(container) {
    var general = 'P_N(x)=\\sum_{k=0}^{N}\\frac{f^{(k)}(0)}{k!}x^k\\quad(a=0)';
    var shell = CV.ui.shell(container, {
      title: '泰勒展開：用多項式一項一項逼近',
      lede: '從 0 出發，每加一項就修正一次曲線；階數越高，看看哪些地方會越貼近原函數。',
      tex: general
    });
    var key = 'sin', order = 1, target = 1;
    var values = math.coeffs(key, order);
    var outgoing = [], opacity = 1;
    var fade = null, animation = null, step = null;
    var playing = false, resetting = false;
    var range = math.goodRange(key, order, 0.05);
    var formula = '', dirty = true;
    var slider;
    var convergence = CV.ui.readout('無限級數的收斂範圍');
    var accuracy = CV.ui.readout('目前 |Pₙ − f| < 0.05 的區間（含 0）');
    var status = CV.ui.readout('逐項疊加');
    var legend = CV.ui.readout('圖例');
    legend.set('青色：原函數；洋紅：Pₙ；淡洋紅虛線：本階新項；洋紅細帶：誤差 < 0.05；琥珀帶：收斂範圍。');

    function stopPlaying() {
      playing = false;
      play.el.textContent = '播放';
    }

    function makeSlider() {
      var next = CV.ui.slider({
        label: '階數 N', min: presets[key].min, max: presets[key].max, step: 1, value: target,
        onInput: function (value) { stopPlaying(); target = value; dirty = true; advance(); }
      });
      if (slider) slider.el.replaceWith(next.el);
      slider = next;
    }

    // 每次只走一階，快速拖曳時保留當前動畫，再追上最新的目標。
    function advance() {
      if (animation || resetting) return;
      if (order === target) {
        if (!playing) return;
        if (order === presets[key].max) { stopPlaying(); dirty = true; return; }
        target = order + 1;
        slider.set(target);
      }
      var next = order + (target > order ? 1 : -1);
      var from = values.slice(), to = math.coeffs(key, next);
      step = {
        low: Math.min(order, next), k: Math.max(order, next),
        coefficient: next > order ? to[next] : from[order],
        t: next > order ? 0 : 1, adding: next > order
      };
      animation = CV.plot.tween(0, 1, {
        duration: theme.duration.normal, easing: 'easeOutCubic',
        onUpdate: function (t) {
          values = math.mixCoeffs(from, to, t);
          step.t = step.adding ? t : 1 - t;
          dirty = true;
        },
        onDone: function () {
          order = next; values = to; step = null; animation = null; dirty = true; advance();
        }
      });
    }

    function switchFunction(nextKey) {
      if (nextKey === key) return;
      stopPlaying();
      if (animation) animation.cancel();
      animation = null; step = null; resetting = false;
      if (fade) fade.cancel();
      outgoing.push({ key: key, values: values.slice(), alpha: opacity, range: range });
      outgoing = outgoing.filter(function (layer) { return layer.alpha > 0.001; });
      var alphas = outgoing.map(function (layer) { return layer.alpha; });
      key = nextKey;
      order = target = Math.max(presets[key].min, Math.min(presets[key].max, target));
      values = math.coeffs(key, order);
      range = math.goodRange(key, order, 0.05);
      opacity = 0; dirty = true;
      makeSlider();
      p.setView({ x: presets[key].x, y: presets[key].y });
      fade = CV.plot.tween(0, 1, {
        duration: theme.duration.normal,
        onUpdate: function (t) {
          opacity = t;
          outgoing.forEach(function (layer, i) { layer.alpha = alphas[i] * (1 - t); });
        },
        onDone: function () { outgoing = []; fade = null; }
      });
    }

    var functions = CV.ui.segmented({
      value: key,
      options: Object.keys(presets).map(function (name) { return { value: name, label: presets[name].label }; }),
      onChange: switchFunction
    });
    var play = CV.ui.button({
      label: '播放',
      onClick: function () {
        if (playing) {
          stopPlaying();
          target = resetting ? presets[key].min : step ? (step.adding ? step.k : step.low) : order;
          slider.set(target);
          return;
        }
        if (animation) animation.cancel();
        animation = null; step = null;
        playing = true; resetting = true;
        play.el.textContent = '暫停';
        target = presets[key].min;
        slider.set(target);
        var from = values.slice(), to = math.coeffs(key, target);
        animation = CV.plot.tween(0, 1, {
          duration: theme.duration.normal,
          onUpdate: function (t) { values = math.mixCoeffs(from, to, t); dirty = true; },
          onDone: function () {
            order = presets[key].min; values = to; animation = null; resetting = false; dirty = true; advance();
          }
        });
      }
    });
    makeSlider();
    shell.panelEl.append(functions.el, slider.el, play.el, status.el, convergence.el, accuracy.el, legend.el);

    function updateReadouts() {
      range = math.rangeForCoeffs(key, values, 0.05);
      convergence.set(math.convergence(key).label);
      accuracy.set('(' + range.from.toFixed(3) + ', ' + range.to.toFixed(3) + ')（邊界為數值近似）');
      var tex = '\\begin{gathered}' + general + '\\\\';
      if (step) {
        var term = math.termTeX(key, step.k);
        tex += 'P_{' + step.low + '}(x)+' + step.t.toFixed(2) + '\\left(' + term + '\\right)';
        status.set((step.adding ? '疊加' : '移除') + '第 ' + step.k + ' 階：' + Math.round(step.t * 100) + '%'
          + (term === '0' ? '；此階係數為 0，曲線不變' : '') + '；目標 N = ' + target);
      } else if (resetting) {
        tex += '\\text{平滑回到最低階 }N=' + presets[key].min;
        status.set('回到最低階，準備逐項播放');
      } else {
        tex += 'P_{' + order + '}(x)=' + math.expansion(key, order);
        status.set('目前 N = ' + order + (playing ? '；逐項播放中' : '；拖動滑桿或播放，觀察每階新項'));
      }
      // 保留分數與括號所需的行高，避免兩行公式仍因項目不同而跳動。
      tex += '\\vphantom{\\left(\\frac{x^{20}}{20!}\\right)}\\end{gathered}';
      if (tex !== formula) { formula = tex; CV.plot.renderTeX(shell.formulaEl, tex); }
      dirty = false;
    }

    function drawLayer(plot, layerKey, coefficients, alpha, good) {
      if (alpha <= 0) return;
      if (layerKey === 'ln1p') {
        plot.vband(-1, 1, { color: theme.roles.highlight, alpha: 0.1 * alpha });
        plot.segment(-1, plot.view.y[0], -1, plot.view.y[1], {
          color: theme.roles.highlight, dash: [5, 5], alpha: 0.7 * alpha
        });
        plot.dot(1, 0, { color: theme.roles.highlight, r: 4, alpha: alpha, glow: 0 });
      }
      // 細帶固定在畫面底部，與整片收斂帶分開辨識。
      var bottom = plot.toWorld(0, plot.height - 7).y;
      var top = plot.toWorld(0, plot.height - 13).y;
      var left = Math.max(plot.view.x[0], good.from), right = Math.min(plot.view.x[1], good.to);
      if (left < right) plot.rect(left, bottom, right, top, {
        color: theme.roles.active, alpha: 0.6 * alpha, stroke: false
      });
      plot.curve(function (x) { return math.original(layerKey, x); }, {
        color: theme.roles.curve, alpha: alpha, glow: 6,
        from: layerKey === 'ln1p' ? -1 + 1e-8 : undefined
      });
      plot.curve(function (x) { return math.evalCoeffs(coefficients, x); }, {
        color: theme.roles.active, alpha: alpha, glow: 6
      });
    }

    var p = CV.plot.create(shell.vizEl, {
      x: presets[key].x, y: presets[key].y, aspect: 4 / 3,
      draw: function (ctx, plot) {
        if (dirty) updateReadouts();
        outgoing.forEach(function (layer) { drawLayer(plot, layer.key, layer.values, layer.alpha, layer.range); });
        drawLayer(plot, key, values, opacity, range);
        if (step) {
          plot.curve(function (x) { return step.coefficient * Math.pow(x, step.k); }, {
            color: theme.roles.active, width: 1.5, dash: [6, 5], glow: 0,
            alpha: 0.5 * Math.sin(Math.PI * step.t) * opacity
          });
        }
      }
    });
    updateReadouts();
  }

  CV.sections.taylor = { init: init, math: math };
}());
