// 學習診斷（T14）：#progress
// 能力雷達圖（6 個主題的答對率）、已作答題數、連續練習天數、最近 7 天、最常錯的 3 個觀念。
// 數字全部從 Calc.progress 算；重練的作答不算進答對率與已作答題數（重練只抽錯題，算進去會失真）。
(function () {
  var SVG = 'http://www.w3.org/2000/svg';
  var WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

  function node(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  // 建立 SVG 元素（SVG 要用 createElementNS 才畫得出來）
  function svg(tag, attrs, className) {
    var el = document.createElementNS(SVG, tag);
    Object.keys(attrs || {}).forEach(function (key) { el.setAttribute(key, attrs[key]); });
    if (className) el.setAttribute('class', className);
    return el;
  }

  function link(text, href, primary) {
    var a = node('a', 'btn ' + (primary ? 'primary' : 'ghost'), text);
    a.href = href;
    return a;
  }

  function percent(rate) {
    return rate === null ? '尚未作答' : Math.round(rate * 100) + '%';
  }


  // 上方三個數字：已作答、連續天數、錯題本
  function summaryCard() {
    var card = node('section', 'card progress-summary');
    card.setAttribute('aria-label', '練習概況');
    var tiles = node('div', 'progress-tiles');
    [
      { value: Calc.progress.totalSeen(), unit: '題', label: '已作答' },
      { value: Calc.progress.streak(), unit: '天', label: '連續練習' },
      { value: Calc.progress.wrongCount(), unit: '題', label: '錯題本' }
    ].forEach(function (item) {
      var tile = node('div', 'progress-tile');
      var number = node('p', 'progress-number', String(item.value));
      number.appendChild(node('span', 'progress-unit', item.unit));
      tile.append(number, node('p', 'progress-label', item.label));
      tiles.appendChild(tile);
    });
    card.appendChild(tiles);
    card.appendChild(node('p', 'progress-note', '已作答題數與答對率來自單人、連結挑戰、即時 PK；錯題重練不列入。'));
    return card;
  }

  // 能力雷達圖：6 軸、每軸 0～100%。用 inline SVG 自己畫，不用圖表套件。
  function radarCard(topics, stats, weakest) {
    var card = node('section', 'card progress-radar');
    var heading = node('h2', '', '能力雷達圖');
    heading.id = 'radar-heading';
    card.appendChild(heading);

    var R = 90;   // 100% 的半徑
    // 第 i 個主題的方向：從正上方開始，順時針每 60 度一軸
    function point(i, r) {
      var angle = -Math.PI / 2 + i * Math.PI * 2 / topics.length;
      return [r * Math.cos(angle), r * Math.sin(angle)];
    }
    function polygon(r) {
      return topics.map(function (topic, i) { return point(i, r(topic)).map(function (v) { return v.toFixed(1); }).join(','); }).join(' ');
    }

    var chart = svg('svg', { viewBox: '-180 -140 360 280', role: 'img', 'aria-labelledby': 'radar-heading radar-desc' }, 'radar');
    var desc = svg('desc', { id: 'radar-desc' });
    desc.textContent = topics.map(function (topic) { return Calc.quiz.LABELS[topic] + ' ' + percent(stats[topic].rate); }).join('，');
    chart.appendChild(desc);

    // 背景格線：25%、50%、75%、100% 四圈，和 6 條軸線
    [0.25, 0.5, 0.75, 1].forEach(function (ratio) {
      chart.appendChild(svg('polygon', { points: polygon(function () { return R * ratio; }) }, 'radar-grid'));
    });
    topics.forEach(function (topic, i) {
      var end = point(i, R);
      chart.appendChild(svg('line', { x1: 0, y1: 0, x2: end[0].toFixed(1), y2: end[1].toFixed(1) }, 'radar-grid'));
    });

    // 答對率的範圍（沒作答過的主題畫在中心點）
    chart.appendChild(svg('polygon', { points: polygon(function (topic) { return R * (stats[topic].rate || 0); }) }, 'radar-area'));
    topics.forEach(function (topic, i) {
      var p = point(i, R * (stats[topic].rate || 0));
      chart.appendChild(svg('circle', { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: topic === weakest ? 6 : 3.5 },
        'radar-dot' + (topic === weakest ? ' is-weakest' : '')));
    });

    // 主題名稱與百分比，放在每軸外側
    topics.forEach(function (topic, i) {
      var p = point(i, R + 16);
      var anchor = Math.abs(p[0]) < 1 ? 'middle' : p[0] > 0 ? 'start' : 'end';
      var y = p[1] < -1 ? p[1] - 14 : p[1] > 1 ? p[1] + 6 : p[1] - 4;
      var text = svg('text', { x: p[0].toFixed(1), y: y.toFixed(1), 'text-anchor': anchor },
        'radar-label' + (topic === weakest ? ' is-weakest' : ''));
      var name = svg('tspan', { x: p[0].toFixed(1) });
      name.textContent = Calc.quiz.LABELS[topic];
      var value = svg('tspan', { x: p[0].toFixed(1), dy: '1.3em' }, 'radar-value');
      value.textContent = percent(stats[topic].rate);
      text.append(name, value);
      chart.appendChild(text);
    });
    card.appendChild(chart);

    // 「最低」只在至少 2 個主題各答過 3 題以上時才標（規則在 Calc.progress.weakestTopic）
    if (weakest) {
      var note = node('p', 'progress-weakest');
      note.textContent = '答對率最低：' + Calc.quiz.LABELS[weakest] + '（' + percent(stats[weakest].rate) + '），可以多練這個主題。';
      card.appendChild(note);
    }

    // 文字版的各主題數字（也讓報讀器使用者看得到）
    var list = node('ul', 'progress-topics');
    topics.forEach(function (topic) {
      var s = stats[topic];
      var item = node('li', 'progress-topic' + (topic === weakest ? ' is-weakest' : ''));
      var name = node('span', '', Calc.quiz.LABELS[topic]);
      if (topic === weakest) name.appendChild(node('span', 'progress-flag', '最低'));
      item.append(name, node('span', 'progress-topic-value', s.seen ? '答對 ' + s.correct + ' / ' + s.seen + '・' + percent(s.rate) : '尚未作答'));
      list.appendChild(item);
    });
    card.appendChild(list);
    return card;
  }

  // 最近 7 天有沒有練習
  function daysCard() {
    var card = node('section', 'card progress-days');
    card.appendChild(node('h2', '', '最近 7 天'));
    var row = node('ol', 'progress-week');
    var today = Calc.progress.today();
    Calc.progress.recentDays(7).forEach(function (day) {
      var parts = day.date.split('-');
      var date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      var item = node('li', 'progress-day' + (day.practiced ? ' is-done' : '') + (day.date === today ? ' is-today' : ''));
      var label = (day.date === today ? '今天' : Number(parts[1]) + '/' + Number(parts[2])) + '（' + WEEKDAYS[date.getDay()] + '）' + (day.practiced ? '有練習' : '沒有練習');
      // 報讀器不一定會念一般 <li> 上的 aria-label（審查 PR #5 第 3 點），
      // 改成放一段畫面上看不到、報讀器念得到的文字；畫面上的「五」「✓」對報讀器隱藏。
      var spoken = node('span', 'visually-hidden', label);
      var weekday = node('span', 'progress-weekday', day.date === today ? '今' : WEEKDAYS[date.getDay()]);
      var dot = node('span', 'progress-dot', day.practiced ? '✓' : '');
      weekday.setAttribute('aria-hidden', 'true');
      dot.setAttribute('aria-hidden', 'true');
      item.append(spoken, weekday, dot);
      row.appendChild(item);
    });
    card.appendChild(row);
    var streak = Calc.progress.streak();
    card.appendChild(node('p', 'progress-note', streak ? '已連續練習 ' + streak + ' 天，繼續保持！' : '今天練一局，開始累積連續天數。'));
    return card;
  }

  // 最常錯的 3 個觀念
  function conceptsCard() {
    var card = node('section', 'card progress-concepts');
    card.appendChild(node('h2', '', '最常錯的觀念'));
    var top = Calc.progress.topConcepts(3);
    if (!top.length) {
      // 沒有錯題，或錯題都還沒有觀念標籤（題庫組標註中）
      card.appendChild(node('p', 'progress-note', Calc.progress.wrongCount()
        ? '錯題的觀念標籤還在整理中，先參考上面的主題答對率。'
        : '目前沒有錯題，這裡會列出你最常卡住的觀念。'));
      return card;
    }
    var list = node('ol', 'progress-concept-list');
    top.forEach(function (concept) {
      var item = node('li', 'progress-concept');
      var info = Calc.concepts && Calc.concepts.byId[concept.id];
      item.appendChild(node('strong', '', concept.label));
      item.appendChild(node('span', 'progress-concept-meta', (info ? Calc.quiz.LABELS[info.topic] + '・' : '') + '錯 ' + concept.weight + ' 次'));
      list.appendChild(item);
    });
    card.appendChild(list);
    card.appendChild(node('p', 'progress-note', '依錯題本裡還沒掌握的題目計算，重練掌握後就會往下掉。'));
    return card;
  }

  Calc.pages.progress = {
    mount: function (el) {
      var head = node('header', 'hero');
      head.append(node('span', 'badge', '學習診斷'), node('h1', '', '學習診斷'), node('p', '', '看看各主題的狀況，找出下一步要補的地方。'));
      el.appendChild(head);

      var topics = Calc.quiz.TOPICS.filter(function (topic) { return topic !== 'mixed'; });
      var stats = Calc.progress.topicStats();
      if (!Calc.progress.totalSeen()) {
        // 還沒有任何作答紀錄
        var empty = node('article', 'card progress-empty');
        empty.append(node('h2', '', '還沒有作答紀錄'), node('p', '', '打完一局單人練習、連結挑戰或即時 PK，這裡就會出現你的能力雷達圖。'),
          link('開始單人練習', '#solo', true), link('回首頁', '#home'));
        el.appendChild(empty);
        return;
      }
      el.append(summaryCard(), radarCard(topics, stats, Calc.progress.weakestTopic()), daysCard(), conceptsCard());
      var actions = node('div', 'progress-actions');
      actions.append(link('去錯題本', '#review', true), link('回首頁', '#home'));
      el.appendChild(actions);
    },
    unmount: function () {}
  };
}());
