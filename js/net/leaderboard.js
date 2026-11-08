(function () {
  function playerId() {
    var id = Calc.store.get('playerId');
    if (!id) {
      var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      id = Array.from(crypto.getRandomValues(new Uint8Array(16)), function (value) {
        return alphabet[value % alphabet.length];
      }).join('');
      Calc.store.set('playerId', id);
    }
    return id;
  }

  function node(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  Calc.leaderboard = {
    submit: async function (result) {
      try {
        var response = await Calc.realtime.client().from('challenge_results').insert({
          challenge_id: result.challengeId, player_id: playerId(), name: result.name,
          score: result.score, correct: result.correct
        });
        if (response.error) return response.error.code === '23505' ? 'duplicate' : 'error';
        return 'ok';
      } catch (error) {
        return 'error';
      }
    },
    fetch: async function (challengeId) {
      try {
        var response = await Calc.realtime.client().from('challenge_results')
          .select('player_id,name,score,correct,created_at').eq('challenge_id', challengeId)
          .order('score', { ascending: false }).order('correct', { ascending: false })
          .order('created_at', { ascending: true }).limit(50);
        return response.error ? null : response.data;
      } catch (error) {
        return null;
      }
    },
    mount: function (el, challengeId) {
      var destroyed = false;
      var request = 0;
      var heading = node('div', 'leaderboard-heading');
      heading.appendChild(node('h2', '', '本挑戰排行榜'));
      var button = node('button', 'btn ghost', '重新整理');
      button.type = 'button';
      heading.appendChild(button);
      var content = node('div', 'leaderboard-content');
      content.setAttribute('aria-live', 'polite');
      el.classList.add('leaderboard');
      el.replaceChildren(heading, content);

      async function refresh() {
        if (destroyed) return;
        var current = ++request;
        var rows = await Calc.leaderboard.fetch(challengeId);
        if (destroyed || current !== request) return;
        if (!rows || !rows.length) {
          content.replaceChildren(node('p', 'leaderboard-status', rows ? '還沒有人挑戰，成為第一個吧！' : '排行榜暫時無法載入'));
          return;
        }
        var table = node('table', 'leaderboard-table');
        var head = node('thead');
        var labels = node('tr');
        ['名次', '暱稱', '分數', '答對數'].forEach(function (label) {
          var cell = node('th', '', label);
          cell.scope = 'col';
          labels.appendChild(cell);
        });
        head.appendChild(labels);
        var body = node('tbody');
        var me = playerId();
        rows.forEach(function (row, index) {
          var tr = node('tr', row.player_id === me ? 'is-me' : '');
          [index + 1, row.name, row.score, row.correct].forEach(function (value) {
            tr.appendChild(node('td', '', value));
          });
          body.appendChild(tr);
        });
        table.append(head, body);
        content.replaceChildren(table);
      }

      function destroy() {
        destroyed = true;
        window.clearInterval(timer);
        window.removeEventListener('hashchange', destroy);
        window.removeEventListener('pagehide', destroy);
        button.removeEventListener('click', refresh);
      }

      button.addEventListener('click', refresh);
      var timer = window.setInterval(refresh, 10000);
      window.addEventListener('hashchange', destroy);
      window.addEventListener('pagehide', destroy);
      refresh();
      return { refresh: refresh, destroy: destroy };
    }
  };
}());
