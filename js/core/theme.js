(function () {
  'use strict';
  var CV = window.CV = window.CV || {};
  var colors = {
    bg: '#0b1020', surface: '#111a2e', surface2: '#19253c', grid: '#25334c',
    axis: '#657797', text: '#e8eef9', textDim: '#9aaac4',
    cyan: '#22f0ff', magenta: '#ff2fd0', amber: '#ffb020'
  };
  CV.theme = {
    colors: colors,
    roles: { curve: colors.cyan, active: colors.magenta, highlight: colors.amber },
    fonts: { ui: '"Noto Sans TC", sans-serif', mono: '"JetBrains Mono", monospace' },
    easing: {
      linear: function (t) { return t; },
      easeOutCubic: function (t) { return 1 - Math.pow(1 - t, 3); },
      easeInOutCubic: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
      // 將回彈曲線限制在契約要求的 0–1 範圍。
      easeOutBack: function (t) {
        var s = 1.70158;
        return Math.max(0, Math.min(1, 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2)));
      }
    },
    duration: { fast: 200, normal: 450, slow: 800 }
  };
  CV.sections = CV.sections || {};
}());
