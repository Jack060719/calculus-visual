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

  // 把這一局寫進錯題本與學習進度（T12）。三種玩法和錯題重練都從這裡寫入，只有這一個寫入點。
  // options.gameId 是一局的識別碼：同一局就算重畫結算頁，progress.record 也只會記一次。
  // 回傳本局的結果（答錯幾題、新加入幾題、掌握了哪些題），沒有 gameId 時回傳 null。
  function recordProgress(options) {
    if (!options.gameId || !Calc.progress) return null;
    try {
      return Calc.progress.record({ id: options.gameId, mode: options.mode, summary: options.me.summary });
    } catch (error) {
      // 進度資料出問題時，結算頁照常顯示
      return null;
    }
  }

  // 錯題重練的結算提示：本局掌握了幾題、錯題本還剩幾題（T13）
  // 報讀器（VoiceOver、TalkBack）只會念出 live region「後來變動」的內容：
  // 所以先放一個空的 role=status 區塊，等結算卡放進畫面後的下一個 frame 再填文字（審查 PR #4 第 3 點）。
  // lines 是 [{ text, main }]，main 為 true 的那行用粗體強調。
  function liveNote(note, lines) {
    var status = node('div', 'result-progress-text');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    note.appendChild(status);
    window.requestAnimationFrame(function () {
      lines.forEach(function (line) {
        status.appendChild(node('p', line.main ? 'result-progress-main' : '', line.text));
      });
    });
    return status;
  }

  function reviewNote(outcome) {
    var note = node('div', 'result-progress');
    var left = Calc.progress.wrongCount();
    liveNote(note, [
      { main: true, text: outcome.mastered.length ? '✓ 本局 ' + outcome.mastered.length + ' 題已掌握，移出錯題本' : '同一題在重練中連續答對 2 次就能掌握' },
      { text: left ? '錯題本還有 ' + left + ' 題' : '錯題本清空了，太厲害了！' }
    ]);
    return note;
  }

  // 單人、挑戰、PK 的結算提示（T15）：「本局 X 題加入錯題本」＋「去重練」按鈕
  function wrongNote(outcome) {
    var note = node('div', 'result-progress');
    note.setAttribute('role', 'status');
    if (!outcome.wrong) {
      note.appendChild(node('p', 'result-progress-main', '✓ 全部答對，沒有新的錯題'));
      return note;
    }
    note.appendChild(node('p', 'result-progress-main', '本局 ' + outcome.wrong + ' 題加入錯題本'));
    note.appendChild(node('p', '', '錯題本共 ' + Calc.progress.wrongCount() + ' 題，趁記憶還新，馬上重練一次吧。'));
    var button = node('button', 'btn ghost', '去重練');
    button.type = 'button';
    button.addEventListener('click', function () { Calc.router.go('#review/play'); });
    note.appendChild(button);
    return note;
  }

  async function render(el, options) {
    var me = options.me;
    var opp = options.opp;
    var summary = me.summary;
    // 結算時寫入進度；outcome 之後在結算頁顯示「本局 X 題加入錯題本」
    var outcome = recordProgress(options);
    var card = node('article', 'card result-card');
    // options.badge 可以自訂上方小標（例如錯題重練）；沒有的話顯示主題・難度
    card.appendChild(node('span', 'badge', options.badge || Calc.quiz.LABELS[options.topic] + '・' + Calc.quiz.DIFFICULTY_LABELS[options.difficulty === undefined ? 'mixed' : options.difficulty]));
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
    if (options.mode === 'review' && outcome) card.appendChild(reviewNote(outcome));
    else if (outcome) card.appendChild(wrongNote(outcome));
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
