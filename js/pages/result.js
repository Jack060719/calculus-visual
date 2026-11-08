(function () {
  var labels = { limit: '極限與連續', derivative: '導數', integral: '積分', series: '級數', mixed: '綜合' };

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
    card.appendChild(node('span', 'badge', labels[options.topic] + '・' + (opp ? '對戰結算' : '練習結算')));
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
      var question = summary.questions && summary.questions[index];
      if (question) {
        var details = node('details', 'result-solution');
        details.appendChild(node('summary', '', '查看詳解'));
        var stem = node('p');
        math(stem, question.stem);
        var answer = node('p');
        math(answer, '正確答案：$' + question.choices[question.answer] + '$');
        var solution = node('p');
        math(solution, question.solution);
        details.append(stem, answer, solution);
        item.appendChild(details);
      }
      list.appendChild(item);
    });
    card.appendChild(list);
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
