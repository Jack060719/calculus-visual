(function () {
  var client;
  var removing = Promise.resolve();
  var announced = false;

  Calc.realtime = {
    join: async function (code, options) {
      await removing;
      var remote = !!(Calc.config.SUPABASE_URL && Calc.config.SUPABASE_ANON_KEY);
      var channel, heartbeat, settle;
      var closed = false;
      var members = {};
      var seen = {};
      var deadlines = {};
      var listeners = {};
      var presenceListeners = [];
      var me = { clientId: options.clientId, name: options.name, role: options.role, at: Date.now() };
      var resolveJoin, rejectJoin;
      var ready = new Promise(function (resolve, reject) { resolveJoin = resolve; rejectJoin = reject; });
      var joinTimeout = window.setTimeout(function () {
        room.leave();
        rejectJoin(new Error('連線逾時，請回首頁重試。'));
      }, 10000);

      function list() {
        return Object.keys(members).map(function (id) { return members[id]; }).filter(function (member) {
          return Date.now() - seen[member.clientId] < 6000;
        }).sort(function (a, b) { return a.at - b.at || a.clientId.localeCompare(b.clientId); });
      }

      function notify() {
        if (closed) return;
        var current = list();
        presenceListeners.forEach(function (fn) { fn(current); });
      }

      function heard(id) {
        seen[id] = Date.now();
        window.clearTimeout(deadlines[id]);
        if (id !== me.clientId) deadlines[id] = window.setTimeout(notify, 6000);
      }

      function joined() {
        if (settle || closed) return;
        settle = window.setTimeout(function () {
          window.clearTimeout(joinTimeout);
          resolveJoin(room);
        }, 250);
      }

      function receive(message) {
        if (closed || !message || message.clientId === me.clientId) return;
        var id = message.clientId;
        if (message.type === '_bye') {
          delete members[id];
          delete seen[id];
          window.clearTimeout(deadlines[id]);
          notify();
        } else if (message.type === '_hello' || message.type === '_heartbeat') {
          var isNew = !members[id];
          if (!remote) members[id] = message.payload;
          heard(id);
          notify();
          if (message.type === '_hello' || isNew) transmit('_heartbeat', me);
        } else {
          (listeners[message.type] || []).forEach(function (fn) { fn(message.payload, id); });
        }
      }

      function transmit(type, payload) {
        if (closed) return Promise.resolve('closed');
        var message = { clientId: me.clientId, type: type, payload: payload };
        if (remote) return channel.send({ type: 'broadcast', event: type, payload: message });
        channel.postMessage(message);
        return Promise.resolve('ok');
      }

      var room = {
        transport: remote ? 'supabase' : 'local',
        onPresence: function (fn) { presenceListeners.push(fn); fn(list()); },
        on: function (type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
        send: transmit,
        leave: function () {
          if (closed) return;
          transmit('_bye', me);
          closed = true;
          window.clearInterval(heartbeat);
          window.clearTimeout(settle);
          window.clearTimeout(joinTimeout);
          Object.keys(deadlines).forEach(function (id) { window.clearTimeout(deadlines[id]); });
          window.removeEventListener('pagehide', room.leave);
          if (remote) removing = client.removeChannel(channel);
          else channel.close();
        }
      };

      if (remote) {
        if (!window.supabase) {
          window.clearTimeout(joinTimeout);
          throw new Error('連線元件尚未載入，請確認網路後重試。');
        }
        if (!client) client = window.supabase.createClient(Calc.config.SUPABASE_URL, Calc.config.SUPABASE_ANON_KEY);
        channel = client.channel('calcpk:' + code, {
          config: { broadcast: { self: false }, presence: { key: me.clientId } }
        });
        function sync() {
          var state = channel.presenceState();
          var next = {};
          Object.keys(state).forEach(function (id) {
            var entry = state[id][0];
            if (!entry) return;
            next[id] = { clientId: id, name: entry.name, role: entry.role, at: entry.at };
            if (!members[id]) heard(id);
          });
          members = next;
          notify();
          if (members[me.clientId]) joined();
        }
        ['sync', 'join', 'leave'].forEach(function (event) { channel.on('presence', { event: event }, sync); });
        channel.on('broadcast', { event: '*' }, function (message) { receive(message.payload); });
        channel.subscribe(function (status) {
          if (closed) return;
          if (status === 'SUBSCRIBED') {
            channel.track({ name: me.name, role: me.role, at: me.at }).then(function (result) {
              if (result !== 'ok') {
                room.leave();
                rejectJoin(new Error('無法加入房間，請稍後重試。'));
              } else transmit('_hello', me);
            });
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            members = {};
            notify();
            room.leave();
            rejectJoin(new Error('連線中斷，請回首頁重試。'));
          }
        });
      } else {
        if (!announced) {
          console.info('未設定 Supabase，使用本機模式（僅同一瀏覽器的分頁之間）');
          announced = true;
        }
        channel = new BroadcastChannel('calcpk:' + code);
        channel.onmessage = function (event) { receive(event.data); };
        members[me.clientId] = me;
        seen[me.clientId] = Date.now();
        transmit('_hello', me);
        joined();
      }
      // 兩種傳輸都加上心跳，避免網路中斷時一直等待伺服器清除 presence。
      heartbeat = window.setInterval(function () {
        seen[me.clientId] = Date.now();
        transmit('_heartbeat', me);
        notify();
      }, 2000);
      window.addEventListener('pagehide', room.leave);
      return ready;
    }
  };
}());
