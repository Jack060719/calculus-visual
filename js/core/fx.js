(function () {
  function node(tag, className, text) {
    var el = document.createElement(tag);
    el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function particles(el, confetti) {
    if (reducedMotion()) return;
    for (var i = 0; i < 24; i++) {
      var particle = node('i', confetti ? 'fx-confetti' : 'fx-particle');
      var angle = i * Math.PI / 12;
      var distance = 54 + i % 4 * 16;
      particle.style.setProperty('--fx-x', (confetti ? (i % 5 - 2) * 18 : Math.cos(angle) * distance) + 'px');
      particle.style.setProperty('--fx-y', Math.sin(angle) * distance + 'px');
      particle.style.setProperty('--fx-turn', (i * 47) + 'deg');
      if (confetti) {
        particle.style.left = (5 + i * 37 % 90) + '%';
        particle.style.animationDelay = (i % 4 * 45) + 'ms';
      }
      el.appendChild(particle);
    }
  }

  var feedbacks = new WeakMap();

  Calc.fx = {
    countdown: function (el) {
      var overlay = node('div', 'fx-countdown-overlay');
      var display = node('div', 'fx-countdown');
      var ring = node('span', 'fx-countdown-ring');
      var caption = node('p', 'fx-countdown-caption', '準備迎戰');
      var segments = [0, 1, 2].map(function (index) {
        var segment = node('span', 'fx-countdown-segment');
        segment.style.transform = 'rotate(' + index * 120 + 'deg)';
        ring.appendChild(segment);
        return segment;
      });
      ring.setAttribute('aria-hidden', 'true');
      display.setAttribute('role', 'status');
      display.setAttribute('aria-live', 'assertive');
      display.append(ring, caption);
      overlay.appendChild(display);
      el.replaceChildren();
      // 放在 body，避免頁面進場的 transform 限制全螢幕遮罩。
      document.body.appendChild(overlay);
      return new Promise(function (resolve) {
        var beats = ['3', '2', '1', '開始！'];
        var index = 0;
        var interval = reducedMotion() ? 100 : 1000;
        var value;
        function beat() {
          segments.forEach(function (segment, i) { segment.classList.toggle('is-past', i < index); });
          if (value) value.remove();
          value = node('strong', 'fx-countdown-value' + (index === 3 ? ' is-go' : ''), beats[index]);
          display.appendChild(value);
          if (index === 3) {
            caption.textContent = '把握每一秒';
            overlay.classList.add('is-leaving');
            window.setTimeout(function () { overlay.remove(); }, reducedMotion() ? 80 : 320);
            resolve();
            return;
          }
          index++;
          window.setTimeout(beat, interval);
        }
        beat();
      });
    },
    feedback: function (cardEl, outcome) {
      if (feedbacks.has(cardEl)) feedbacks.get(cardEl)();
      cardEl.classList.remove('is-correct', 'is-wrong', 'is-timeout');
      cardEl.classList.add('fx-feedback-card', 'is-' + outcome);
      var layer = node('div', 'fx-feedback fx-feedback-' + outcome);
      var labels = { correct: '✓', wrong: '✕', timeout: '時間到' };
      var mark = node('span', 'fx-feedback-mark', labels[outcome]);
      layer.setAttribute('aria-hidden', 'true');
      layer.appendChild(node('span', 'fx-feedback-halo'));
      layer.appendChild(mark);
      if (outcome === 'correct') particles(layer, false);
      cardEl.appendChild(layer);
      var shake = outcome === 'wrong' ? cardEl.animate([
        { transform: 'translateX(0)' }, { transform: 'translateX(-6px)' },
        { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' },
        { transform: 'translateX(0)' }
      ], { duration: reducedMotion() ? 0 : 300, easing: 'ease-out' }) : null;
      var timer = window.setTimeout(cleanup, reducedMotion() ? 120 : 950);
      function cleanup() {
        window.clearTimeout(timer);
        if (shake) shake.cancel();
        layer.remove();
        cardEl.classList.remove('fx-feedback-card');
        feedbacks.delete(cardEl);
      }
      feedbacks.set(cardEl, cleanup);
    },
    scoreBar: function (el, options) {
      var rows = {};
      el.replaceChildren();
      ['me', 'opp'].forEach(function (side) {
        var row = node('div', 'fx-score-row ' + side);
        var heading = node('div', 'fx-score-heading');
        var plate = node('div', 'fx-score-nameplate');
        var name = node('span', 'fx-score-name', side === 'me' ? options.meName : options.oppName);
        var leader = node('span', 'fx-score-leader', '♛ 領先');
        leader.hidden = true;
        var score = node('span', 'fx-score-number', '0');
        var status = node('span', 'fx-score-status', '');
        plate.append(name, leader);
        heading.append(plate, score);
        var track = node('div', 'fx-score-track');
        track.setAttribute('role', 'progressbar');
        track.setAttribute('aria-label', name.textContent + ' 的分數');
        track.setAttribute('aria-valuemin', '0');
        track.setAttribute('aria-valuemax', options.max);
        track.setAttribute('aria-valuenow', '0');
        track.setAttribute('aria-valuetext', '0 分');
        var fill = node('div', 'fx-score-fill');
        fill.style.transform = 'scaleX(0)';
        track.appendChild(fill);
        row.append(heading, track, status);
        el.appendChild(row);
        rows[side] = { row: row, plate: plate, leader: leader, score: score, track: track, fill: fill, status: status, value: 0 };
      });
      var frame;
      function set(me, opp) {
        window.cancelAnimationFrame(frame);
        var values = [me, opp];
        var from = [rows.me.value, rows.opp.value];
        var started = window.performance.now();
        var duration = reducedMotion() ? 0 : 450;
        values.forEach(function (value, i) {
          var row = rows[i === 0 ? 'me' : 'opp'];
          row.fill.style.transform = 'scaleX(' + Math.max(0, Math.min(1, value / options.max)) + ')';
          row.track.setAttribute('aria-valuenow', value);
          row.track.setAttribute('aria-valuetext', value + ' 分');
          row.leader.hidden = value <= values[1 - i];
          row.row.classList.toggle('is-leading', !row.leader.hidden);
        });
        function tick(now) {
          var progress = duration ? Math.min(1, (now - started) / duration) : 1;
          var eased = 1 - Math.pow(1 - progress, 3);
          values.forEach(function (value, i) {
            var row = rows[i === 0 ? 'me' : 'opp'];
            row.value = from[i] + (value - from[i]) * eased;
            row.score.textContent = Math.round(row.value);
          });
          if (progress < 1 && el.contains(rows.me.row)) frame = window.requestAnimationFrame(tick);
        }
        tick(started);
      }
      return {
        set: set,
        answered: function (side) {
          var row = rows[side];
          row.status.textContent = '已作答';
          row.plate.getAnimations().forEach(function (animation) { animation.cancel(); });
          row.plate.animate(reducedMotion() ? [{ opacity: 0.6 }, { opacity: 1 }] : [
            { transform: 'scale(1)' }, { transform: 'scale(1.04)' }, { transform: 'scale(1)' }
          ], { duration: reducedMotion() ? 80 : 360, easing: 'ease-out' });
        },
        reset: function () {
          set(0, 0);
          window.cancelAnimationFrame(frame);
          ['me', 'opp'].forEach(function (side) {
            var row = rows[side];
            row.value = 0;
            row.score.textContent = '0';
            row.status.textContent = '';
            row.plate.getAnimations().forEach(function (animation) { animation.cancel(); });
          });
        }
      };
    },
    verdict: function (el, outcome) {
      var labels = { win: '你贏了！', lose: '差一點！', draw: '平手' };
      var panel = node('div', 'fx-verdict ' + outcome + ' is-animating');
      var message = node('div', 'fx-verdict-message');
      if (outcome === 'win') {
        var trophy = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        trophy.setAttribute('viewBox', '0 0 24 24');
        trophy.setAttribute('class', 'fx-verdict-trophy');
        trophy.setAttribute('aria-hidden', 'true');
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M7 3h10v5c0 4-2 7-5 7s-5-3-5-7V3Zm0 2H3v3c0 3 2 5 5 5m9-8h4v3c0 3-2 5-5 5M12 15v5m-4 1h8');
        trophy.appendChild(path);
        message.appendChild(trophy);
      }
      message.appendChild(node('p', '', labels[outcome]));
      panel.appendChild(message);
      var ribbons = node('div', 'fx-ribbons');
      ribbons.setAttribute('aria-hidden', 'true');
      if (outcome === 'win') {
        particles(ribbons, true);
        panel.appendChild(ribbons);
      }
      el.replaceChildren(panel);
      return new Promise(function (resolve) {
        window.setTimeout(function () {
          ribbons.remove();
          panel.classList.remove('is-animating');
          resolve();
        }, reducedMotion() ? 100 : outcome === 'win' ? 1300 : 650);
      });
    }
  };
}());
