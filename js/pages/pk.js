(function () {
  var cleanup = function () {};
  var labels = { limit: '極限與連續', derivative: '導數', integral: '積分', series: '級數', mixed: '綜合' };

  function node(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  Calc.pages.pk = {
    mount: async function (el, param) {
      var room, game, scoreBar, opponent;
      var disposed = false;
      var phase = 'joining';
      var timers = [];
      var round = 0;
      var current = 0;
      var mine = [], theirs = [], revealed = [];
      var participants = [];
      // randomUUID 只在 https／localhost 可用；區網 http 測試時改用 getRandomValues。
      var clientId = window.crypto.randomUUID ? window.crypto.randomUUID()
        : Array.from(window.crypto.getRandomValues(new Uint32Array(4)), function (n) { return n.toString(16); }).join('-');
      var name = String(Calc.store.get('name', '')).trim().slice(0, 12) || '同學';
      var topic = Calc.store.get('topic', 'mixed');
      if (!labels[topic]) topic = 'mixed';
      var role = param === 'new' ? 'host' : 'guest';
      var code = param;
      var lobby, status, startButton, badges, topicLabel;

      function later(fn, ms) {
        var timer = window.setTimeout(function () { if (!disposed) fn(); }, ms);
        timers.push(timer);
      }

      function clearTimers() {
        timers.forEach(window.clearTimeout);
        timers = [];
      }

      function home() {
        if (room) room.leave();
        Calc.router.go('#home');
      }

      function homeButton() {
        var button = node('button', 'btn ghost', '回首頁');
        button.type = 'button';
        button.addEventListener('click', home);
        return button;
      }

      function errorCard(message) {
        phase = 'error';
        round++;
        clearTimers();
        if (game) game.destroy();
        if (room) room.leave();
        var card = node('article', 'card pk-card');
        card.append(node('span', 'badge', '即時 PK'), node('h1', '', message), homeButton());
        el.replaceChildren(card);
      }

      function offline() {
        if (phase === 'offline' || phase === 'error') return;
        phase = 'offline';
        round++;
        clearTimers();
        if (game) game.destroy();
        var overlay = node('div', 'pk-overlay');
        overlay.setAttribute('role', 'alertdialog');
        overlay.setAttribute('aria-label', '對手已離線');
        overlay.setAttribute('aria-modal', 'true');
        var card = node('article', 'card pk-card');
        var button = homeButton();
        card.append(node('h1', '', '對手已離線'), node('p', '', '回首頁，再邀朋友來一局吧。'), button);
        overlay.appendChild(card);
        el.appendChild(overlay);
        button.focus();
      }

      cleanup = function () {
        disposed = true;
        round++;
        clearTimers();
        if (game) game.destroy();
        if (room) room.leave();
      };

      if (param !== 'new' && !/^[0-9]{4}$/.test(param)) {
        errorCard('房號格式錯誤');
        return;
      }
      el.replaceChildren(node('article', 'card pk-card', '正在連線…'));

      function updateLobby() {
        if (!lobby || phase !== 'lobby') return;
        badges.replaceChildren();
        [{ name: name, role: role }, opponent].forEach(function (player, i) {
          var badge = node('div', 'pk-player ' + (i ? 'opp' : 'me'));
          badge.append(node('span', '', i ? '對手' : '我方'), node('strong', '', player ? player.name : '等待加入'));
          if (player) badge.appendChild(node('small', '', player.role === 'host' ? '房主' : '挑戰者'));
          badges.appendChild(badge);
        });
        topicLabel.textContent = '對戰主題：' + (role === 'host' || opponent ? labels[topic] : '等待房主');
        status.textContent = !opponent ? '等待對手加入…' : role === 'host' ? '對手已就緒，可以開始！' : '等待房主開始';
        startButton.disabled = role !== 'host' || !opponent || participants.length < 2;
      }

      function startData() {
        var sentAt = Date.now();
        return { seed: Calc.rng.newSeed(), topic: topic, startAt: sentAt + 4000, sentAt: sentAt };
      }

      function launch(type) {
        if (role !== 'host' || !opponent || (phase !== 'lobby' && phase !== 'result')) return;
        var data = startData();
        room.send(type, data);
        begin(data);
      }

      function showLobby() {
        phase = 'lobby';
        lobby = node('article', 'card pk-card');
        var link = new URL(window.location.href);
        link.hash = 'room=' + code;
        var invitation = node('p', 'pk-link', link.href);
        var copy = node('button', 'btn ghost', '複製連結');
        copy.type = 'button';
        var fallback = node('textarea', 'input pk-copy');
        fallback.readOnly = true;
        fallback.hidden = true;
        fallback.setAttribute('aria-label', '邀請連結，可選取複製');
        fallback.textContent = link.href;
        copy.addEventListener('click', async function () {
          try {
            await navigator.clipboard.writeText(link.href);
            if (!disposed) copy.textContent = '已複製連結';
          } catch (error) {
            if (disposed) return;
            fallback.hidden = false;
            fallback.focus();
            fallback.select();
            copy.textContent = '請選取下方連結複製';
          }
        });
        badges = node('div', 'pk-players');
        status = node('p', 'pk-status');
        status.setAttribute('role', 'status');
        topicLabel = node('p', 'pk-topic');
        startButton = node('button', 'btn primary', role === 'host' ? '開始' : '等待房主開始');
        startButton.type = 'button';
        startButton.addEventListener('click', function () { launch('start'); });
        lobby.append(node('span', 'badge', room.transport === 'local' ? '即時 PK・本機模式' : '即時 PK'),
          node('p', '', '邀請朋友加入房間'), node('h1', 'pk-code', code), invitation, copy, fallback,
          topicLabel, badges, status, startButton, homeButton());
        el.replaceChildren(lobby);
        updateLobby();
      }

      function total(records) {
        return records.reduce(function (sum, rec) { return sum + rec.score; }, 0);
      }

      function showScores() {
        var me = 0, opp = 0;
        revealed.forEach(function (value, index) {
          if (value) {
            me += mine[index].score;
            opp += theirs[index].score;
          }
        });
        scoreBar.set(me, opp);
      }

      function reveal(index) {
        if (phase !== 'playing' || index !== current || revealed[index] || !mine[index] || !theirs[index]) return;
        revealed[index] = true;
        game.reveal(index);
        showScores();
        later(function () {
          current++;
          scoreBar.reset();
          showScores();
          game.next();
          if (phase === 'playing') questionStarted();
        }, 1200);
      }

      function questionStarted() {
        var index = current;
        if (theirs[index]) scoreBar.answered('opp');
        // 提早作答也要等到本題期限後再多等 3 秒，不能提早判定對手逾時。
        later(function () {
          if (phase !== 'playing' || index !== current || revealed[index]) return;
          if (!theirs[index]) theirs[index] = { qIndex: index, correct: false, ms: Calc.quiz.LIMIT_MS, score: 0 };
          reveal(index);
        }, Calc.quiz.LIMIT_MS + 3000);
      }

      async function begin(data) {
        if (!opponent || !labels[data.topic] || (phase !== 'lobby' && phase !== 'result')) return;
        var target = Date.now() + (data.startAt - data.sentAt);
        var thisRound = ++round;
        topic = data.topic;
        phase = 'countdown';
        clearTimers();
        if (game) game.destroy();
        mine = []; theirs = []; revealed = []; current = 0;
        await Calc.fx.countdown(el);
        if (disposed || round !== thisRound || phase !== 'countdown') return;
        later(function () {
          if (round !== thisRound || phase !== 'countdown') return;
          phase = 'playing';
          var questions = Calc.quiz.build(topic, data.seed);
          game = Calc.quiz.play(el, {
            questions: questions,
            mode: 'pk',
            onAnswer: function (rec) {
              mine[rec.qIndex] = rec;
              scoreBar.answered('me');
              room.send('answer', { qIndex: rec.qIndex, correct: rec.correct, ms: rec.ms, score: rec.score });
              reveal(rec.qIndex);
            },
            onFinish: function (summary) {
              phase = 'result';
              clearTimers();
              var oppSummary = {
                total: total(theirs), perQ: theirs.map(function (rec) { return rec.score; }),
                ms: theirs.map(function (rec) { return rec.ms; }),
                totalMs: theirs.reduce(function (sum, rec) { return sum + rec.ms; }, 0)
              };
              Calc.pages.result.render(el, {
                topic: topic, me: { name: name, summary: summary }, opp: { name: opponent.name, summary: oppSummary },
                actions: [
                  { label: '再來一局', primary: true, onClick: function () {
                    if (role === 'host') launch('rematch');
                    else {
                      room.send('rematch-request', {});
                      var button = el.querySelector('.result-actions .primary');
                      button.textContent = '已請房主開始';
                    }
                  } },
                  { label: '回首頁', onClick: home }
                ]
              });
            }
          });
          scoreBar = Calc.fx.scoreBar(el.querySelector('[data-slot=scorebar]'), { meName: name, oppName: opponent.name, max: questions.length * 200 });
          game.start();
          questionStarted();
        }, Math.max(0, target - Date.now()));
      }

      try {
        for (var attempt = 0; attempt < (role === 'host' ? 5 : 1); attempt++) {
          if (role === 'host') code = String(1000 + Calc.rng.newSeed() % 9000);
          room = await Calc.realtime.join(code, { name: name, role: role, clientId: clientId });
          if (disposed) { room.leave(); return; }
          var initial;
          room.onPresence(function (list) { initial = list; });
          if (role === 'guest' || !initial.some(function (player) { return player.clientId !== clientId; })) break;
          room.leave();
          if (attempt === 4) { errorCard('目前無法建房，請重試'); return; }
        }
        if (role === 'host') Calc.router.replace('#room=' + code);
        showLobby();
        room.on('lobby', function (data, sender) {
          if (phase === 'lobby' && opponent && sender === opponent.clientId && opponent.role === 'host' && labels[data.topic]) {
            topic = data.topic;
            updateLobby();
          }
        });
        ['start', 'rematch'].forEach(function (type) {
          room.on(type, function (data, sender) {
            if (role === 'guest' && opponent && opponent.role === 'host' && sender === opponent.clientId) begin(data);
          });
        });
        room.on('answer', function (rec, sender) {
          if (!opponent || sender !== opponent.clientId || (phase !== 'playing' && phase !== 'countdown')) return;
          var index = rec.qIndex;
          if (!Number.isInteger(index) || index < current || index >= Calc.quiz.COUNT || theirs[index] || revealed[index]) return;
          theirs[index] = rec;
          if (phase === 'playing' && index === current) {
            scoreBar.answered('opp');
            reveal(index);
          }
        });
        room.on('rematch-request', function (data, sender) {
          if (phase === 'result' && opponent && sender === opponent.clientId && role === 'host') {
            el.querySelector('.result-actions .primary').textContent = '對手想再來一局，開始';
          }
        });
        room.onPresence(function (list) {
          if (disposed || phase === 'error' || phase === 'offline') return;
          var index = list.findIndex(function (player) { return player.clientId === clientId; });
          if (index >= 2) { errorCard('房間已滿'); return; }
          var active = list.slice(0, 2);
          if (phase !== 'lobby') {
            if (index < 0 || !opponent || !active.some(function (player) { return player.clientId === opponent.clientId; })) offline();
            return;
          }
          participants = active;
          opponent = active.find(function (player) { return player.clientId !== clientId; });
          updateLobby();
          if (role === 'host' && opponent) room.send('lobby', { topic: topic });
        });
      } catch (error) {
        if (!disposed) errorCard(error.message);
      }
    },
    unmount: function () { cleanup(); }
  };
}());
