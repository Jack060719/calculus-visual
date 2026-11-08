(function () {
  var labels = { limit: '極限與連續', derivative: '導數', integral: '積分', series: '級數', mixed: '綜合' };
  var game;
  var session = 0;

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
      if (!payload || payload.v !== 1 || Calc.quiz.TOPICS.indexOf(payload.topic) === -1) return null;
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

  function homeLink() {
    var home = node('a', 'btn ghost', '回首頁');
    home.href = '#home';
    return home;
  }

  function offer(el, options) {
    var url = link({ v: 1, name: options.name, topic: options.topic, seed: options.seed,
      score: options.summary.total, perQ: options.summary.perQ });
    var card = node('article', 'card challenge-card');
    card.appendChild(node('span', 'badge', '連結挑戰'));
    card.appendChild(node('h1', '', '換朋友來挑戰'));
    card.appendChild(node('p', 'challenge-name', options.name));
    card.appendChild(node('strong', 'challenge-score', options.summary.total + ' 分'));
    card.appendChild(node('p', 'challenge-meta', labels[options.topic] + '・8 題'));
    card.appendChild(node('p', '', '分享連結，朋友就能用同一組題目挑戰你的分數。'));
    var anchor = node('a', 'challenge-link', url);
    anchor.href = url;
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
  }

  Calc.challenge = { encode: encode, decode: decode, link: link, offer: offer };
  Calc.pages.challenge = {
    mount: function (el, param) {
      var current = ++session;
      var payload = decode(param);
      var card = node('article', 'card challenge-card');
      card.appendChild(node('span', 'badge', '連結挑戰'));
      if (!payload) {
        card.appendChild(node('h1', '', '這個挑戰連結無效或已損壞'));
        card.appendChild(node('p', '', '請朋友重新傳送完整連結，或先回首頁練習。'));
        card.appendChild(homeLink());
        el.replaceChildren(card);
        return;
      }
      card.appendChild(node('h1', '', payload.name + ' 挑戰你：' + payload.score + ' 分'));
      card.appendChild(node('p', 'challenge-meta', labels[payload.topic] + '・題數 8'));
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
        await Calc.fx.countdown(el);
        if (current !== session) return;
        game = Calc.quiz.play(el, {
          questions: Calc.quiz.build(payload.topic, payload.seed),
          mode: 'solo',
          onFinish: function (summary) {
            Calc.pages.result.render(el, {
              topic: payload.topic,
              me: { name: name, summary: summary },
              opp: { name: payload.name, summary: { total: payload.score, perQ: payload.perQ } },
              actions: [
                { label: '回嗆', primary: true, onClick: function () {
                  offer(el, { name: name, topic: payload.topic, seed: payload.seed, summary: summary });
                } },
                { label: '回首頁', onClick: function () { Calc.router.go('#home'); } }
              ]
            });
          }
        });
        game.start();
      });
      card.append(form, homeLink());
      el.replaceChildren(card);
    },
    unmount: function () {
      session++;
      if (game) game.destroy();
      game = null;
    }
  };
}());
