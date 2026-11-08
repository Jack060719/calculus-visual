(function (root) {
  var Calc = root.Calc = root.Calc || {};
  var TOPICS = ['limit', 'derivative', 'derivative-app', 'integral', 'integral-tech', 'series', 'mixed'];
  var LABELS = { limit: '極限與連續', derivative: '導數', 'derivative-app': '導數應用', integral: '積分', 'integral-tech': '積分技巧', series: '級數與泰勒', mixed: '綜合' };
  var DIFFICULTIES = [1, 2, 3, 'mixed'];
  var DIFFICULTY_LABELS = { 1: '初級', 2: '中級', 3: '高級', mixed: '混合' };
  var LIMIT_MS = 20000;
  var COUNT = 8;

  function build(topic, seed, count, difficulty) {
    if (count === undefined) count = COUNT;
    if (difficulty === undefined) difficulty = 'mixed';
    var rng = Calc.rng.create(seed, topic + '|' + difficulty);
    var bank = Calc.questions.slice().sort(function (a, b) {
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    });
    var topics = rng.shuffle(TOPICS.slice(0, 6));
    var levels = [];
    for (var i = 0; i < count; i++) {
      levels.push(difficulty === 'mixed' ? (i < Math.ceil(count * 3 / 8) ? 1 : i < Math.ceil(count * 6 / 8) ? 2 : 3) : difficulty);
    }
    levels = rng.shuffle(levels);
    var slots = levels.map(function (level, index) {
      return { topic: topic === 'mixed' ? topics[index % topics.length] : topic, difficulty: level, question: null };
    });
    var used = Object.create(null);

    function take(slot, sameTopic, level) {
      var candidates = bank.filter(function (q) {
        return !used[q.id] && (!sameTopic || q.topic === slot.topic) && q.difficulty === level;
      });
      var question = rng.shuffle(candidates)[0];
      if (question) {
        slot.question = question;
        used[question.id] = true;
      }
    }

    // 先保留各名額的精確配對，避免補題搶走其他主題的名額。
    slots.forEach(function (slot) { take(slot, true, slot.difficulty); });
    [true, false].forEach(function (sameTopic) {
      slots.forEach(function (slot) {
        var adjacent = slot.difficulty === 1 ? [1, 2, 3] : slot.difficulty === 2 ? [2, 1, 3] : [3, 2, 1];
        adjacent.forEach(function (level) {
          if (!slot.question) take(slot, sameTopic, level);
        });
      });
    });
    var selected = rng.shuffle(slots.map(function (slot) { return slot.question; }).filter(Boolean));
    if (difficulty === 'mixed') {
      // 分組串接保留同難度內的洗牌順序，不依賴排序的穩定性。
      selected = [1, 2, 3].reduce(function (all, level) {
        return all.concat(selected.filter(function (q) { return q.difficulty === level; }));
      }, []);
    }
    return selected.map(function (q) {
      var order = rng.shuffle([0, 1, 2, 3]);
      return {
        id: q.id, topic: q.topic, difficulty: q.difficulty, stem: q.stem,
        choices: order.map(function (i) { return q.choices[i].tex; }),
        answer: order.indexOf(q.answer), solution: q.solution
      };
    });
  }

  function score(correct, ms) {
    return !correct || ms >= LIMIT_MS ? 0 : 100 + Math.floor(Math.max(0, LIMIT_MS - ms) / 1000) * 5;
  }

  function compare(a, b) {
    if (a.total !== b.total) return a.total > b.total ? 'win' : 'lose';
    if (typeof a.totalMs === 'number' && typeof b.totalMs === 'number' && a.totalMs !== b.totalMs) {
      return a.totalMs < b.totalMs ? 'win' : 'lose';
    }
    return 'draw';
  }

  function node(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function math(el, text) {
    text.split(/(\$[^$]+\$)/g).forEach(function (part) {
      var span = node('span');
      if (part[0] === '$' && part.length > 1 && root.katex) {
        root.katex.render(part.slice(1, -1), span, { throwOnError: false, trust: false });
      } else {
        span.textContent = part;
      }
      el.appendChild(span);
    });
  }

  function play(el, options) {
    var questions = options.questions;
    var wrapper = node('div', 'quiz');
    var slot = node('div');
    slot.dataset.slot = 'scorebar';
    slot.hidden = options.mode !== 'pk';
    wrapper.appendChild(slot);
    el.replaceChildren(wrapper);
    var index = -1;
    var records = [];
    var card, buttons, status, timer, fill, seconds, displayedSeconds;
    var startedAt, frame, deadline, advance;
    var locked = false;
    var revealed = false;
    var destroyed = false;
    var finished = false;

    function stopTimer() {
      root.cancelAnimationFrame(frame);
      root.clearTimeout(deadline);
      root.clearTimeout(advance);
    }

    function updateSeconds(value) {
      if (value === displayedSeconds) return;
      displayedSeconds = value;
      seconds.textContent = value + ' 秒';
      timer.setAttribute('aria-label', '剩餘時間 ' + value + ' 秒');
    }

    function tick() {
      if (destroyed || locked) return;
      var remaining = Math.max(0, LIMIT_MS - (root.performance.now() - startedAt));
      fill.style.transform = 'scaleX(' + remaining / LIMIT_MS + ')';
      updateSeconds(Math.ceil(remaining / 1000));
      timer.classList.toggle('is-low', remaining <= 5000);
      if (!remaining) answer(null);
      else frame = root.requestAnimationFrame(tick);
    }

    function answer(choice) {
      if (destroyed || locked) return;
      locked = true;
      stopTimer();
      var ms = Math.min(LIMIT_MS, Math.max(0, Math.floor(root.performance.now() - startedAt)));
      var timeout = choice === null || ms >= LIMIT_MS;
      if (timeout) ms = LIMIT_MS;
      if (timeout) choice = null;
      var correct = !timeout && choice === questions[index].answer;
      var rec = { qIndex: index, choice: choice, correct: correct, ms: ms, score: score(correct, ms), timeout: timeout };
      records.push(rec);
      buttons.forEach(function (button) { button.disabled = true; });
      if (choice !== null) buttons[choice].classList.add('is-selected');
      if (timeout) {
        fill.style.transform = 'scaleX(0)';
        updateSeconds(0);
        timer.classList.add('is-low');
      }
      status.textContent = '等待對手…';
      if (options.mode === 'solo') reveal(index);
      if (options.onAnswer) options.onAnswer(rec);
    }

    function reveal(qIndex) {
      if (destroyed || !locked || revealed || qIndex !== index) return;
      revealed = true;
      var q = questions[index];
      var rec = records[index];
      buttons[q.answer].classList.add('is-correct');
      buttons[q.answer].appendChild(node('span', 'choice-mark', '✓ 正確答案'));
      if (rec.choice !== null && !rec.correct) {
        buttons[rec.choice].classList.add('is-wrong');
        buttons[rec.choice].appendChild(node('span', 'choice-mark', '✕ 你的選擇'));
      }
      buttons.forEach(function (button, i) {
        button.classList.toggle('is-muted', i !== q.answer && i !== rec.choice);
      });
      status.textContent = rec.timeout ? '⏱ 時間到，本題 0 分' : rec.correct ? '✓ 答對了，得到 ' + rec.score + ' 分' : '✕ 答錯了，本題 0 分';
      Calc.fx.feedback(card, rec.timeout ? 'timeout' : rec.correct ? 'correct' : 'wrong');
      if (options.mode === 'solo') {
        var reduced = root.matchMedia('(prefers-reduced-motion: reduce)').matches;
        advance = root.setTimeout(next, rec.correct ? (reduced ? 400 : 900) : (reduced ? 700 : 1500));
      }
    }

    function next() {
      if (destroyed || finished || (index >= 0 && !revealed)) return;
      stopTimer();
      index++;
      if (index === questions.length) {
        finished = true;
        var perQ = records.map(function (rec) { return rec.score; });
        var ms = records.map(function (rec) { return rec.ms; });
        var summary = {
          total: perQ.reduce(function (sum, value) { return sum + value; }, 0),
          perQ: perQ,
          choices: records.map(function (rec) { return rec.choice; }),
          correct: records.filter(function (rec) { return rec.correct; }).length,
          ms: ms,
          totalMs: ms.reduce(function (sum, value) { return sum + value; }, 0),
          questions: questions
        };
        if (options.onFinish) options.onFinish(summary);
        return;
      }
      locked = false;
      revealed = false;
      if (card) card.remove();
      card = node('article', 'card quiz-card');
      var meta = node('div', 'quiz-meta');
      meta.appendChild(node('span', '', '第 ' + (index + 1) + ' / ' + questions.length + ' 題'));
      meta.appendChild(node('span', 'badge', LABELS[questions[index].topic]));
      card.appendChild(meta);
      timer = node('div', 'timer');
      timer.setAttribute('role', 'timer');
      timer.setAttribute('aria-label', '剩餘時間 20 秒');
      displayedSeconds = 20;
      seconds = node('span', 'timer-seconds', '20 秒');
      var track = node('div', 'timer-track');
      fill = node('div', 'timer-fill');
      track.appendChild(fill);
      timer.append(seconds, track);
      card.appendChild(timer);
      var stem = node('h1', 'quiz-stem');
      math(stem, questions[index].stem);
      card.appendChild(stem);
      var choices = node('div', 'quiz-choices');
      buttons = questions[index].choices.map(function (tex, i) {
        var button = node('button', 'quiz-choice');
        button.type = 'button';
        var letter = String.fromCharCode(65 + i);
        button.appendChild(node('span', 'visually-hidden', '選項 ' + letter + '：'));
        var badge = node('span', 'choice-letter', letter);
        badge.setAttribute('aria-hidden', 'true');
        button.appendChild(badge);
        var content = node('span', 'choice-content');
        math(content, '$' + tex + '$');
        button.appendChild(content);
        button.addEventListener('click', function () { answer(i); });
        choices.appendChild(button);
        return button;
      });
      card.appendChild(choices);
      status = node('p', 'quiz-status');
      status.setAttribute('role', 'status');
      card.appendChild(status);
      wrapper.appendChild(card);
      startedAt = root.performance.now();
      deadline = root.setTimeout(function () { answer(null); }, LIMIT_MS);
      frame = root.requestAnimationFrame(tick);
    }

    return {
      start: function () { if (index === -1) next(); },
      reveal: reveal,
      next: function () { if (index >= 0) next(); },
      destroy: function () {
        destroyed = true;
        stopTimer();
        wrapper.remove();
      }
    };
  }

  Calc.quiz = { TOPICS: TOPICS, LABELS: LABELS, DIFFICULTIES: DIFFICULTIES, DIFFICULTY_LABELS: DIFFICULTY_LABELS, LIMIT_MS: LIMIT_MS, COUNT: COUNT, build: build, score: score, compare: compare, play: play };
  if (typeof module !== 'undefined') module.exports = Calc.quiz;
}(typeof window !== 'undefined' ? window : globalThis));
