// 錯題本（T13）：#review 列出錯題、#review/play 錯題重練。
// 錯題資料都從 Calc.progress 讀；重練打完一樣走結算頁（Calc.pages.result），由結算頁寫入進度。
(function () {
  var game;
  var session = 0;   // 每次進入頁面 +1，用來判斷倒數結束時使用者是不是已經離開了
  var stopWatching = null;   // 離開頁面時停止監看版面寬度

  // 長公式在手機上會變成可以左右捲動的框（CSS overflow-x: auto）。
  // 只用鍵盤的人要能捲動，框就必須拿得到焦點：真的超出寬度的公式加 tabIndex=0，
  // 聚焦後就能用左右方向鍵捲動；沒超出的公式不加，避免 Tab 要按很多次（審查 PR #4 第 1 點）。
  // 超出 4px 以內是 KaTeX 排版的誤差（看不出被切掉），不算。
  function markScrollable(root) {
    root.querySelectorAll('.review-item .katex').forEach(function (formula) {
      if (formula.scrollWidth > formula.clientWidth + 4) {
        formula.tabIndex = 0;
      } else {
        formula.removeAttribute('tabindex');
      }
    });
  }

  // 畫面排好、字型載入完、轉向或版面寬度改變時，都重新檢查一次
  function watchScrollable(el) {
    var pending = false;
    function check() {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(function () {
        pending = false;
        markScrollable(el);
      });
    }
    check();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(check);
    if (window.ResizeObserver) {
      // 版面寬度一變（轉向、視窗縮放）就重新檢查
      var observer = new window.ResizeObserver(check);
      observer.observe(el);
      stopWatching = function () { observer.disconnect(); };
    } else {
      window.addEventListener('resize', check);
      stopWatching = function () { window.removeEventListener('resize', check); };
    }
  }

  function node(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  // 把含 $…$ 的文字畫成 KaTeX；一般文字用 textContent，不用 innerHTML
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

  function link(text, href, primary) {
    var a = node('a', 'btn ' + (primary ? 'primary' : 'ghost'), text);
    a.href = href;
    return a;
  }

  // '2026-11-26' → '11/26'
  function shortDate(key) {
    var parts = String(key).split('-');
    return parts.length === 3 ? Number(parts[1]) + '/' + Number(parts[2]) : '';
  }

  // 沒有錯題時的畫面
  function emptyCard(title, message) {
    var card = node('article', 'card review-empty');
    card.append(node('span', 'badge', '錯題本'), node('h1', '', title), node('p', '', message),
      link('開始單人練習', '#solo', true), link('回首頁', '#home'));
    return card;
  }

  // 一題錯題：錯過幾次、題目、正確答案、詳解（點開才顯示）
  function itemView(item) {
    var q = item.question;
    var li = node('li', 'review-item');
    var meta = '錯過 ' + item.times + ' 次';
    if (item.last) meta += '・最近 ' + shortDate(item.last);
    if (item.streak > 0) meta += '・重練已連續答對 ' + item.streak + ' 次';
    li.appendChild(node('p', 'review-meta', meta));
    var stem = node('p', 'review-stem');
    math(stem, q.stem);
    li.appendChild(stem);
    var answer = node('p', 'result-answer is-correct');
    math(answer, '正確答案：$' + q.choices[q.answer].tex + '$');
    li.appendChild(answer);
    var details = node('details', 'result-solution');
    details.appendChild(node('summary', '', '看詳解'));
    var solution = node('p');
    math(solution, q.solution);
    details.appendChild(solution);
    // 詳解收合時量不到寬度，打開後再檢查一次公式要不要能用鍵盤捲動
    details.addEventListener('toggle', function () { if (details.open) markScrollable(details); });
    li.appendChild(details);
    return li;
  }

  // #review：依主題分組列出錯題
  function renderList(el) {
    var items = Calc.progress.wrongList();
    var mastered = Calc.progress.masteredCount();
    if (!items.length) {
      el.replaceChildren(emptyCard('目前沒有錯題',
        mastered ? '錯題都掌握了，共 ' + mastered + ' 題！再去練習一局，挑戰新題目吧。'
          : '去練習一局吧！答錯或超時的題目會自動收進這裡。'));
      return;
    }

    var head = node('article', 'card review-head');
    head.append(node('span', 'badge', '錯題本'), node('h1', '', '錯題本'));
    var count = node('p', 'review-count');
    count.textContent = '目前 ' + items.length + ' 題' + (mastered ? '・已掌握 ' + mastered + ' 題' : '');
    head.appendChild(count);
    head.appendChild(node('p', 'review-hint', '重練一局最多 8 題、每題限時 20 秒；同一題在重練中連續答對 2 次，就會標為「已掌握」並移出錯題本。'));
    head.append(link('開始重練', '#review/play', true), link('回首頁', '#home'));
    el.replaceChildren(head);

    // 依首頁的主題順序分組（不含「綜合」）
    Calc.quiz.TOPICS.filter(function (topic) { return topic !== 'mixed'; }).forEach(function (topic) {
      var group = items.filter(function (item) { return item.question.topic === topic; });
      if (!group.length) return;
      var section = node('section', 'card review-group');
      var heading = node('h2', '', Calc.quiz.LABELS[topic]);
      heading.appendChild(node('span', 'review-group-count', group.length + ' 題'));
      section.appendChild(heading);
      var list = node('ol', 'review-list');
      group.forEach(function (item) { list.appendChild(itemView(item)); });
      section.appendChild(list);
      el.appendChild(section);
    });
    watchScrollable(el);
  }

  // #review/play：從錯題本抽最多 8 題重打一局
  async function play(el) {
    var current = ++session;
    if (game) game.destroy();
    game = null;
    var seed = Calc.rng.newSeed();
    var ids = Calc.progress.pickReview(seed, 8);
    if (!ids.length) {
      el.replaceChildren(emptyCard('沒有需要重練的題目', '錯題本是空的。去練習一局，答錯的題目會自動收進來。'));
      return;
    }
    var questions = Calc.quiz.buildFromIds(ids, seed);
    var gameId = Calc.progress.gameId('review', seed);
    var name = String(Calc.store.get('name', '')).trim() || '練習者';
    await Calc.fx.countdown(el);
    if (current !== session) return;
    game = Calc.quiz.play(el, {
      questions: questions,
      mode: 'solo',
      onFinish: function (summary) {
        Calc.pages.result.render(el, {
          mode: 'review',
          gameId: gameId,
          badge: '錯題重練',
          me: { name: name, summary: summary },
          actions: [
            { label: '再練一輪', primary: true, onClick: function () { play(el); } },
            { label: '回錯題本', onClick: function () { Calc.router.go('#review'); } },
            { label: '回首頁', onClick: function () { Calc.router.go('#home'); } }
          ]
        });
      }
    });
    game.start();
  }

  Calc.pages.review = {
    mount: function (el, param) {
      if (param === 'play') play(el);
      else renderList(el);
    },
    unmount: function () {
      session++;
      if (stopWatching) stopWatching();
      stopWatching = null;
      if (game) game.destroy();
      game = null;
    }
  };
}());
