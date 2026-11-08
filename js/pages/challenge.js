(function () {
  var game;
  var session = 0;
  var leaderboard;

  function stopLeaderboard() {
    if (leaderboard) leaderboard.destroy();
    leaderboard = null;
  }

  function node(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function encode(payload) {
    var bytes = new TextEncoder().encode(JSON.stringify(payload));
    var binary = '';
    bytes.forEach(function (value) { binary += String.fromCharCode(value); });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function decode(str) {
    try {
      if (typeof str !== 'string' || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
      var binary = atob(str.replace(/-/g, '+').replace(/_/g, '/'));
      var canonical = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      if (canonical !== str) return null;
      var bytes = Uint8Array.from(binary, function (value) { return value.charCodeAt(0); });
      var payload = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
      if (!payload || (payload.v !== 1 && payload.v !== 2) || Calc.quiz.TOPICS.indexOf(payload.topic) === -1) return null;
      if (payload.v === 1) payload.difficulty = 'mixed';
      if (Calc.quiz.DIFFICULTIES.indexOf(payload.difficulty) === -1) return null;
      if (payload.v === 2 && payload.cid !== undefined && (typeof payload.cid !== 'string' || !/^[A-Za-z0-9]{8}$/.test(payload.cid))) return null;
      if (!Number.isInteger(payload.seed) || payload.seed < 0 || payload.seed >= 4294967296) return null;
      if (!Array.isArray(payload.perQ) || payload.perQ.length !== 8 || !payload.perQ.every(function (value) {
        return Number.isInteger(value) && value >= 0 && value <= 200;
      })) return null;
      if (payload.score !== payload.perQ.reduce(function (sum, value) { return sum + value; }, 0)) return null;
      if (typeof payload.name !== 'string') return null;
      var length = Array.from(payload.name.trim()).length;
      if (length < 1 || length > 12) return null;
      return payload;
    } catch (error) {
      return null;
    }
  }

  function link(payload) {
    return window.location.href.split('#')[0] + '#challenge=' + encode(payload);
  }

  function goHome() {
    // 結算已把網址換成 #home，先清空才會觸發首頁路由。
    if (window.location.hash === '#home') Calc.router.replace('#');
    Calc.router.go('#home');
  }

  function homeLink() {
    var home = node('a', 'btn ghost', '回首頁');
    home.href = '#home';
    home.addEventListener('click', function (event) {
      if (window.location.hash !== '#home') return;
      event.preventDefault();
      goHome();
    });
    return home;
  }

  function offer(el, options) {
    stopLeaderboard();
    var difficulty = options.difficulty === undefined ? 'mixed' : options.difficulty;
    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var cid = Array.from(crypto.getRandomValues(new Uint8Array(8)), function (value) {
      return alphabet[value % alphabet.length];
    }).join('');
    var payload = { v: 2, cid: cid, name: options.name, topic: options.topic, difficulty: difficulty, seed: options.seed,
      score: options.summary.total, perQ: options.summary.perQ };
    var url = link(payload);
    var card = node('article', 'card challenge-card');
    card.appendChild(node('span', 'badge', '連結挑戰'));
    card.appendChild(node('h1', '', '換朋友來挑戰'));
    card.appendChild(node('p', 'challenge-name', options.name));
    card.appendChild(node('strong', 'challenge-score', options.summary.total + ' 分'));
    card.appendChild(node('p', 'challenge-meta', Calc.quiz.LABELS[options.topic] + '・' + Calc.quiz.DIFFICULTY_LABELS[difficulty] + '・8 題'));
    card.appendChild(node('p', '', '分享連結，朋友就能用同一組題目挑戰你的分數。'));
    var codeInfo = node('div', 'challenge-code-info');
    codeInfo.setAttribute('aria-live', 'polite');
    card.appendChild(codeInfo);
    var anchor = node('a', 'challenge-link', '產生挑戰碼中…');
    anchor.setAttribute('aria-label', '開啟挑戰連結');
    card.appendChild(anchor);
    var fallback = node('textarea', 'input challenge-copy');
    fallback.value = url;
    fallback.readOnly = true;
    fallback.hidden = true;
    fallback.rows = 4;
    fallback.setAttribute('aria-label', '挑戰連結，請手動複製');
    var status = node('p', 'challenge-status');
    status.setAttribute('role', 'status');
    function manualCopy() {
      fallback.hidden = false;
      fallback.focus();
      fallback.select();
      fallback.setSelectionRange(0, fallback.value.length);
      status.textContent = '請手動複製';
    }
    var actions = node('div', 'challenge-actions');
    var copy = node('button', 'btn primary', '複製連結');
    copy.type = 'button';
    copy.disabled = true;
    copy.addEventListener('click', async function () {
      try {
        await navigator.clipboard.writeText(url);
        status.textContent = '已複製連結，快傳給朋友！';
      } catch (error) {
        manualCopy();
      }
    });
    actions.appendChild(copy);
    if (typeof navigator.share === 'function') {
      var share = node('button', 'btn ghost', '分享');
      share.type = 'button';
      share.disabled = true;
      share.addEventListener('click', async function () {
        try {
          await navigator.share({ title: '微積分 PK 連結挑戰', url: url });
        } catch (error) {
          if (error.name !== 'AbortError') status.textContent = '分享未完成，請使用複製連結。';
        }
      });
      actions.appendChild(share);
    }
    actions.appendChild(homeLink());
    card.append(fallback, status, actions);
    el.replaceChildren(card);
    var board = node('section', 'card');
    el.appendChild(board);
    var mounted = leaderboard = Calc.leaderboard.mount(board, cid);
    Calc.leaderboard.submit({ challengeId: cid, name: options.name, score: options.summary.total,
      correct: options.summary.correct }).then(function () { mounted.refresh(); });
    Calc.leaderboard.createCode(payload).then(function (code) {
      if (code) {
        url = window.location.href.split('#')[0] + '#challenge=' + code;
        codeInfo.appendChild(node('strong', 'challenge-code', '挑戰碼 ' + code));
        codeInfo.appendChild(node('p', 'challenge-meta', '朋友在首頁「加入挑戰」輸入即可'));
        var records = Calc.store.get('myChallenges', []);
        records.unshift({ code: code, topic: options.topic, difficulty: difficulty, score: options.summary.total, at: Date.now() });
        Calc.store.set('myChallenges', records.slice(0, 5));
      } else {
        codeInfo.appendChild(node('p', 'challenge-meta', '挑戰碼暫時無法產生，請改用連結分享'));
      }
      anchor.href = url;
      anchor.textContent = url;
      fallback.value = url;
      copy.disabled = false;
      if (share) share.disabled = false;
    });
  }

  Calc.challenge = { encode: encode, decode: decode, link: link, offer: offer };
  Calc.pages.challenge = {
    mount: async function (el, param) {
      stopLeaderboard();
      var current = ++session;
      var card = node('article', 'card challenge-card');
      card.appendChild(node('span', 'badge', '連結挑戰'));
      var isCode = /^[0-9]{6}$/.test(param);
      var payload;
      var errorMessage = '這個挑戰連結無效或已損壞';
      if (isCode) {
        var loading = node('p', '', '讀取挑戰中…');
        loading.setAttribute('role', 'status');
        card.appendChild(loading);
        el.replaceChildren(card);
        var resolved = await Calc.leaderboard.resolveCode(param);
        if (current !== session) return;
        loading.remove();
        if (resolved === 'error') errorMessage = '暫時無法讀取挑戰，請稍後再試';
        else if (resolved === null) errorMessage = '找不到這個挑戰碼，請確認號碼是否正確';
        else payload = decode(encode(resolved));
      } else {
        payload = decode(param);
      }
      if (!payload) {
        card.appendChild(node('h1', '', errorMessage));
        card.appendChild(node('p', '', '請朋友重新傳送完整連結，或先回首頁練習。'));
        card.appendChild(homeLink());
        el.replaceChildren(card);
        return;
      }
      var cid = payload.v === 2 && payload.cid ? payload.cid : payload.topic + '-' + payload.seed;
      if (isCode && Calc.store.get('myChallenges', []).some(function (record) { return record.code === param; })) {
        card.appendChild(node('span', 'badge', '你發起的挑戰'));
      }
      card.appendChild(node('h1', '', payload.name + ' 挑戰你：' + payload.score + ' 分'));
      card.appendChild(node('p', 'challenge-meta', Calc.quiz.LABELS[payload.topic] + '・' + Calc.quiz.DIFFICULTY_LABELS[payload.difficulty] + '・題數 8'));
      card.appendChild(node('p', '', '同一組題目，比比誰的分數高！同分即平手。'));
      var form = node('form', 'challenge-form');
      var field = node('div', 'field');
      var label = node('label', 'field-label', '你的暱稱（最多 12 字）');
      label.htmlFor = 'challenge-name';
      var input = node('input', 'input');
      input.id = 'challenge-name';
      input.maxLength = 12;
      input.autocomplete = 'nickname';
      input.placeholder = '讓朋友認出你';
      input.value = String(Calc.store.get('name', '')).slice(0, 12);
      field.append(label, input);
      var accept = node('button', 'btn primary', '接受挑戰');
      accept.type = 'submit';
      form.append(field, accept);
      form.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (accept.disabled) return;
        accept.disabled = true;
        var name = input.value.trim() || '挑戰者';
        Calc.store.set('name', name);
        stopLeaderboard();
        await Calc.fx.countdown(el);
        if (current !== session) return;
        game = Calc.quiz.play(el, {
          questions: Calc.quiz.build(payload.topic, payload.seed, 8, payload.difficulty),
          mode: 'solo',
          onFinish: function (summary) {
            Calc.router.replace('#home');
            var extra = node('section');
            var board = node('div');
            var notice = node('p', 'leaderboard-status');
            notice.setAttribute('role', 'status');
            extra.append(board, notice);
            Calc.pages.result.render(el, {
              topic: payload.topic,
              difficulty: payload.difficulty,
              me: { name: name, summary: summary },
              opp: { name: payload.name, summary: { total: payload.score, perQ: payload.perQ } },
              extra: extra,
              actions: [
                { label: '回嗆', primary: true, onClick: function () {
                  offer(el, { name: name, topic: payload.topic, difficulty: payload.difficulty, seed: payload.seed, summary: summary });
                } },
                { label: '回首頁', onClick: goHome }
              ]
            });
            var mounted = leaderboard = Calc.leaderboard.mount(board, cid);
            Calc.leaderboard.submit({ challengeId: cid, name: name, score: summary.total, correct: summary.correct })
              .then(function (result) {
                if (result === 'duplicate') notice.textContent = '同一挑戰只計第一次成績';
                mounted.refresh();
              });
          }
        });
        game.start();
      });
      card.append(form, homeLink());
      el.replaceChildren(card);
      var board = node('section', 'card');
      el.appendChild(board);
      leaderboard = Calc.leaderboard.mount(board, cid);
    },
    unmount: function () {
      session++;
      stopLeaderboard();
      if (game) game.destroy();
      game = null;
    }
  };
}());
