(function () {
  function node(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function math(el, text) {
    text.split(/(\$[^$]+\$)/g).forEach(function (part) {
      var span = node('span');
      if (part[0] === '$' && part.length > 1 && window.katex) {
        window.katex.render(part.slice(1, -1), span, { throwOnError: false, trust: false });
      } else {
        span.textContent = part;
      }
      el.appendChild(span);
    });
  }

  function questionScore(summary, index, side) {
    var value = summary.perQ[index];
    var text = value > 0 ? '答對' : '答錯';
    var ms = summary.ms && summary.ms[index];
    if (ms >= Calc.quiz.LIMIT_MS) text = '逾時';
    var cell = node('div', 'result-cell ' + side);
    cell.appendChild(node('span', '', text));
    cell.appendChild(node('span', 'result-number', typeof ms === 'number' ? (ms / 1000).toFixed(2) + ' 秒' : '用時未提供'));
    cell.appendChild(node('strong', 'result-number', value + ' 分'));
    return cell;
  }

  async function render(el, options) {
    var me = options.me;
    var opp = options.opp;
    var summary = me.summary;
    var card = node('article', 'card result-card');
    card.appendChild(node('span', 'badge', Calc.quiz.LABELS[options.topic] + '・' + Calc.quiz.DIFFICULTY_LABELS[options.difficulty === undefined ? 'mixed' : options.difficulty]));
    card.appendChild(node('h1', '', '這一局的收穫'));
    var verdict = node('div', 'result-verdict');
    verdict.setAttribute('role', 'status');
    if (opp) card.appendChild(verdict);
    var players = node('div', opp ? 'result-players' : 'result-players solo');
    [me, opp].filter(Boolean).forEach(function (player, i) {
      var panel = node('div', 'result-player ' + (i === 0 ? 'me' : 'opp'));
      panel.appendChild(node('p', 'result-name', player.name));
      panel.appendChild(node('strong', 'result-total', player.summary.total));
      panel.appendChild(node('span', '', '分'));
      players.appendChild(panel);
    });
    card.appendChild(players);
    var correct = typeof summary.correct === 'number' ? summary.correct : summary.perQ.filter(function (value) { return value > 0; }).length;
    card.appendChild(node('p', '', '答對 ' + correct + ' / ' + summary.perQ.length + ' 題'));
    var list = node('ol', 'result-list');
    summary.perQ.forEach(function (value, index) {
      var item = node('li', 'result-item');
      item.appendChild(node('h2', '', '第 ' + (index + 1) + ' 題'));
      var row = node('div', opp ? 'result-comparison' : 'result-comparison solo');
      row.appendChild(questionScore(summary, index, 'me'));
      if (opp) row.appendChild(questionScore(opp.summary, index, 'opp'));
      item.appendChild(row);
      list.appendChild(item);
    });
    card.appendChild(list);
    if (summary.questions && summary.questions.length) {
      var review = node('section', 'result-review');
      review.setAttribute('aria-label', '看詳解');
      review.appendChild(node('h2', '', '看詳解'));
      var toggle = node('button', 'btn ghost');
      toggle.type = 'button';
      review.appendChild(toggle);
      var solutions = [];

      function updateToggle() {
        var allOpen = solutions.every(function (details) { return details.open; });
        toggle.textContent = allOpen ? '收合全部詳解' : '展開全部詳解';
        toggle.setAttribute('aria-expanded', String(allOpen));
      }

      summary.questions.forEach(function (question, index) {
        var details = node('details', 'result-solution');
        details.open = summary.perQ[index] === 0;
        details.appendChild(node('summary', '', '第 ' + (index + 1) + ' 題'));
        var stem = node('p');
        math(stem, question.stem);
        details.appendChild(stem);
        if (summary.choices) {
          var choice = summary.choices[index];
          var mine = node('p', 'result-answer' + (choice !== question.answer ? ' is-wrong' : ' is-correct'));
          math(mine, '你的答案：' + (choice === null ? '未作答（時間到）' : '$' + question.choices[choice] + '$'));
          details.appendChild(mine);
        }
        var answer = node('p', 'result-answer is-correct');
        math(answer, '正確答案：$' + question.choices[question.answer] + '$');
        var solution = node('p');
        math(solution, question.solution);
        details.append(answer, solution);
        details.addEventListener('toggle', updateToggle);
        solutions.push(details);
        review.appendChild(details);
      });
      toggle.addEventListener('click', function () {
        var open = !solutions.every(function (details) { return details.open; });
        solutions.forEach(function (details) { details.open = open; });
        updateToggle();
      });
      updateToggle();
      card.appendChild(review);
    }
    if (options.extra) card.appendChild(options.extra);
    var actions = node('div', 'result-actions');
    (options.actions || []).forEach(function (action) {
      var button = node('button', 'btn ' + (action.primary ? 'primary' : 'ghost'), action.label);
      button.type = 'button';
      button.addEventListener('click', action.onClick);
      actions.appendChild(button);
    });
    card.appendChild(actions);
    el.replaceChildren(card);
    if (opp) await Calc.fx.verdict(verdict, Calc.quiz.compare(summary, opp.summary));
  }

  Calc.pages.result = { render: render, mount: render, unmount: function () {} };
}());
