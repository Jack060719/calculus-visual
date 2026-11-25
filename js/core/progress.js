// 學習進度（T12）：錯題本、各主題答對率、練習天數。
// 這是「唯一」讀寫進度資料的地方；其他頁面只呼叫這裡的函式，不直接碰 localStorage。
// 跟 data/questions.js 一樣，瀏覽器（window.Calc.progress）和 Node（module.exports）都能用，
// 方便用 node tools/test-progress.js 測試。
//
// 存在 Calc.store 的 'progress'（localStorage 的 calcpk:progress），格式（第 1 版）：
// {
//   v: 1,
//   wrong: {                       // 錯題本：只存題目 id，題目內容和觀念從題庫查
//     'int-07': {
//       times: 2,                  // 總共錯過幾次（任何玩法）
//       last: '2026-11-26',        // 最近一次答錯的日期
//       streak: 0,                 // 在「重練」中連續答對幾次；答錯就歸零
//       mastered: false,           // 連續答對 2 次 → 已掌握，不再被抽到
//       reviews: [false, true]     // 每次重練的對錯，最多留 10 筆（給報告算重練前後答對率）
//     }
//   },
//   stats: { integral: { '1': { seen: 12, correct: 9 } } },  // 主題 → 難度 → 作答數／答對數（不含重練）
//   days: ['2026-11-25', '2026-11-26'],                       // 有練習的日期（當地日期），最多 60 天
//   games: ['solo-123-abc']                                   // 最近 20 局的識別碼，防止同一局記兩次
// }
(function (root) {
  var Calc = root.Calc = root.Calc || {};
  var isNode = typeof module !== 'undefined' && typeof require === 'function';

  var VERSION = 1;
  var MASTER_STREAK = 2;   // 重練中連續答對幾次算「已掌握」
  var MAX_REVIEWS = 10;    // 每題保留幾筆重練紀錄
  var MAX_DAYS = 60;       // 保留幾天的練習日期
  var MAX_GAMES = 20;      // 保留幾局的識別碼
  var TOPICS = ['limit', 'derivative', 'derivative-app', 'integral', 'integral-tech', 'series'];

  // ---------- 日期工具：一律用使用者的「當地日期」，避免半夜跨日算錯 ----------

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  // Date → 'YYYY-MM-DD'（當地時間）
  function dateKey(date) {
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
  }

  // 'YYYY-MM-DD' 往前（負數）或往後（正數）移幾天
  function shiftDay(key, days) {
    var parts = key.split('-');
    return dateKey(new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]) + days));
  }

  // ---------- 資料整理：讀到舊資料或壞掉的資料時補上預設值 ----------

  function isObject(value) {
    return !!value && typeof value === 'object' && !Array.isArray(value);
  }

  function count(value) {
    return typeof value === 'number' && value >= 0 && isFinite(value) ? Math.floor(value) : 0;
  }

  function empty() {
    return { v: VERSION, wrong: {}, stats: {}, days: [], games: [] };
  }

  function normalize(raw) {
    if (!isObject(raw) || raw.v !== VERSION) return empty();
    var data = empty();
    if (isObject(raw.wrong)) {
      Object.keys(raw.wrong).forEach(function (id) {
        var entry = raw.wrong[id];
        if (!isObject(entry)) return;
        data.wrong[id] = {
          times: count(entry.times),
          last: typeof entry.last === 'string' ? entry.last : '',
          streak: count(entry.streak),
          mastered: entry.mastered === true,
          // 舊資料沒有 reviews 欄位時給空陣列
          reviews: Array.isArray(entry.reviews)
            ? entry.reviews.filter(function (r) { return typeof r === 'boolean'; }).slice(-MAX_REVIEWS)
            : []
        };
      });
    }
    if (isObject(raw.stats)) {
      Object.keys(raw.stats).forEach(function (topic) {
        if (!isObject(raw.stats[topic])) return;
        data.stats[topic] = {};
        Object.keys(raw.stats[topic]).forEach(function (level) {
          var cell = raw.stats[topic][level];
          if (!isObject(cell)) return;
          var seen = count(cell.seen);
          data.stats[topic][level] = { seen: seen, correct: Math.min(seen, count(cell.correct)) };
        });
      });
    }
    if (Array.isArray(raw.days)) {
      data.days = raw.days.filter(function (d) { return typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d); });
    }
    if (Array.isArray(raw.games)) {
      data.games = raw.games.filter(function (g) { return typeof g === 'string'; }).slice(-MAX_GAMES);
    }
    return data;
  }

  // ---------- 建立一個進度物件 ----------
  // options 都可以省略（瀏覽器用預設值）；Node 測試時可以換成假的儲存空間和固定的日期：
  //   storage：有 get(key, fallback)、set(key, value) 的物件（預設 Calc.store）
  //   now：回傳「現在時間」Date 的函式（預設 new Date()）
  //   questions：題庫陣列（預設 Calc.questions）
  //   concepts：觀念清單（預設 Calc.concepts）
  function create(options) {
    options = options || {};

    function storage() {
      return options.storage || Calc.store;
    }

    function now() {
      return options.now ? options.now() : new Date();
    }

    function questions() {
      if (options.questions) return options.questions;
      if (!Calc.questions && isNode) require('../../data/questions.js');
      return Calc.questions || [];
    }

    function concepts() {
      if (options.concepts) return options.concepts;
      if (!Calc.concepts && isNode) require('../../data/concepts.js');
      return Calc.concepts;
    }

    function rng() {
      if (!Calc.rng && isNode) require('./rng.js');
      return Calc.rng;
    }

    // 題目 id → 題目（每次重新建立，題庫很小，不需要快取）
    function questionMap() {
      var map = {};
      questions().forEach(function (q) { map[q.id] = q; });
      return map;
    }

    function load() {
      return normalize(storage().get('progress', null));
    }

    function save(data) {
      storage().set('progress', data);
    }

    function today() {
      return dateKey(now());
    }

    // 一局的識別碼：玩法＋種子＋開始時間。同一局重畫結算頁時用同一個識別碼，就不會重複記錄。
    function gameId(mode, seed) {
      return mode + '-' + seed + '-' + now().getTime().toString(36);
    }

    // 記錄一局（結算頁呼叫，三種玩法和重練共用這一個入口）
    // game = { id: 一局的識別碼, mode: 'solo'｜'challenge'｜'pk'｜'review', summary: quiz.play 結算的 summary }
    // 回傳 { recorded: 有沒有寫入, wrong: 本局答錯幾題, added: 新加入錯題本幾題, mastered: [本局新掌握的題目 id] }
    function record(game) {
      var summary = game && game.summary;
      var result = { recorded: false, wrong: 0, added: 0, mastered: [] };
      if (!game || typeof game.id !== 'string' || !game.id || !summary || !Array.isArray(summary.questions)) return result;

      // 先算本局對錯（就算這局已經記過，也要能顯示「本局答錯幾題」）
      var answers = summary.questions.map(function (q, i) {
        var choice = summary.choices ? summary.choices[i] : undefined;
        // 超時的 choice 是 null，一定算錯
        var correct = summary.choices ? choice === q.answer : summary.perQ[i] > 0;
        return { id: q.id, topic: q.topic, difficulty: q.difficulty, correct: correct };
      });
      result.wrong = answers.filter(function (a) { return !a.correct; }).length;

      var data = load();
      // 防重複：這一局已經記過就不再記
      if (data.games.indexOf(game.id) !== -1) return result;

      var date = today();
      var review = game.mode === 'review';
      answers.forEach(function (a) {
        // 1) 答對率統計：重練只抽錯題，算進去會讓雷達圖忽高忽低，所以不算
        if (!review) {
          var topicStats = data.stats[a.topic] = data.stats[a.topic] || {};
          var cell = topicStats[a.difficulty] = topicStats[a.difficulty] || { seen: 0, correct: 0 };
          cell.seen++;
          if (a.correct) cell.correct++;
        }

        // 2) 錯題本
        var entry = data.wrong[a.id];
        if (!a.correct) {
          // 不在錯題本裡、或之前已掌握 → 這次算「新加入」
          if (!entry || entry.mastered) result.added++;
          entry = data.wrong[a.id] = entry || { times: 0, last: '', streak: 0, mastered: false, reviews: [] };
          entry.times++;
          entry.last = date;
          entry.streak = 0;          // 答錯，連續答對次數歸零
          entry.mastered = false;    // 已掌握的題又答錯，回到錯題本
          if (review) entry.reviews.push(false);
        } else if (review && entry && !entry.mastered) {
          // 只有「重練」中答對才算進連續答對（單人、PK 答對不算）
          entry.streak++;
          entry.reviews.push(true);
          if (entry.streak >= MASTER_STREAK) {
            entry.mastered = true;
            result.mastered.push(a.id);
          }
        }
        if (entry && entry.reviews.length > MAX_REVIEWS) entry.reviews = entry.reviews.slice(-MAX_REVIEWS);
      });

      // 3) 練習日期（重練也算練習）
      if (data.days.indexOf(date) === -1) data.days.push(date);
      data.days.sort();
      data.days = data.days.slice(-MAX_DAYS);

      // 4) 記下這一局的識別碼
      data.games.push(game.id);
      data.games = data.games.slice(-MAX_GAMES);

      save(data);
      result.recorded = true;
      return result;
    }

    // 錯題本（未掌握、而且題庫裡還有這題），依題目 id 排序
    function wrongList() {
      var data = load();
      var map = questionMap();
      return Object.keys(data.wrong).sort().filter(function (id) {
        return !data.wrong[id].mastered && map[id];
      }).map(function (id) {
        var entry = data.wrong[id];
        return { id: id, question: map[id], times: entry.times, last: entry.last, streak: entry.streak, reviews: entry.reviews.slice() };
      });
    }

    function wrongCount() {
      return wrongList().length;
    }

    function masteredCount() {
      var data = load();
      return Object.keys(data.wrong).filter(function (id) { return data.wrong[id].mastered; }).length;
    }

    // 從錯題本抽最多 count 題（預設 8）給重練；已掌握的題不會被抽到。
    // 用種子亂數抽，同一個 seed 會抽到同一組。
    function pickReview(seed, count) {
      if (count === undefined) count = 8;
      var ids = wrongList().map(function (item) { return item.id; });
      return rng().create(seed, 'review-pick').shuffle(ids).slice(0, count);
    }

    // 連續練習天數：從今天往回數；今天還沒練的話從昨天開始數（今天練了就會接上）
    function streak() {
      var days = load().days;
      var day = today();
      if (days.indexOf(day) === -1) day = shiftDay(day, -1);
      var total = 0;
      while (days.indexOf(day) !== -1) {
        total++;
        day = shiftDay(day, -1);
      }
      return total;
    }

    // 最近 n 天（預設 7）有沒有練習，由舊到新：[{ date: '2026-11-20', practiced: true }, …]
    function recentDays(n) {
      if (n === undefined) n = 7;
      var days = load().days;
      var day = today();
      var list = [];
      for (var i = n - 1; i >= 0; i--) {
        var key = shiftDay(day, -i);
        list.push({ date: key, practiced: days.indexOf(key) !== -1 });
      }
      return list;
    }

    // 各主題的作答數、答對數、答對率（沒作答過的 rate 是 null）
    function topicStats() {
      var stats = load().stats;
      var result = {};
      TOPICS.forEach(function (topic) {
        var seen = 0, correct = 0;
        var levels = stats[topic] || {};
        Object.keys(levels).forEach(function (level) {
          seen += levels[level].seen;
          correct += levels[level].correct;
        });
        result[topic] = { seen: seen, correct: correct, rate: seen ? correct / seen : null };
      });
      return result;
    }

    // 已作答題數（不含重練）
    function totalSeen() {
      var stats = topicStats();
      return TOPICS.reduce(function (sum, topic) { return sum + stats[topic].seen; }, 0);
    }

    // 最常錯的 n 個觀念（預設 3）：
    // 每題的每個觀念都算，權重＝這題錯過幾次；已掌握的題和沒有標籤的題不算；
    // 同分時取最近答錯的。回傳 [{ id, label, weight, last }]
    function topConcepts(n) {
      if (n === undefined) n = 3;
      var tally = {};
      wrongList().forEach(function (item) {
        var tags = Array.isArray(item.question.concepts) ? item.question.concepts : [];
        tags.forEach(function (id) {
          var t = tally[id] = tally[id] || { id: id, weight: 0, last: '' };
          t.weight += item.times;
          if (item.last > t.last) t.last = item.last;
        });
      });
      var list = concepts();
      return Object.keys(tally).map(function (id) {
        var t = tally[id];
        t.label = list ? list.label(id) : id;
        return t;
      }).sort(function (a, b) {
        if (a.weight !== b.weight) return b.weight - a.weight;
        if (a.last !== b.last) return a.last < b.last ? 1 : -1;
        return a.id < b.id ? -1 : 1;
      }).slice(0, n);
    }

    return {
      load: load,
      today: today,
      gameId: gameId,
      record: record,
      wrongList: wrongList,
      wrongCount: wrongCount,
      masteredCount: masteredCount,
      pickReview: pickReview,
      streak: streak,
      recentDays: recentDays,
      topicStats: topicStats,
      totalSeen: totalSeen,
      topConcepts: topConcepts
    };
  }

  Calc.progress = create();
  Calc.progress.create = create;
  Calc.progress.dateKey = dateKey;
  Calc.progress.shiftDay = shiftDay;
  if (typeof module !== 'undefined') module.exports = Calc.progress;
}(typeof window !== 'undefined' ? window : globalThis));
