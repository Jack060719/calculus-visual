'use strict';
// 進度資料層（js/core/progress.js）的測試：node tools/test-progress.js
// 測：重複記錄、已掌握規則、連續天數、重練不算進答對率、舊資料補預設值、buildFromIds。

const assert = require('node:assert/strict');
require('../js/core/rng.js');
const questions = require('../data/questions.js');
const quiz = require('../js/core/quiz.js');
const progress = require('../js/core/progress.js');

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log('✓ ' + name);
  } catch (error) {
    console.error('✕ ' + name);
    console.error(error);
    process.exitCode = 1;
  }
}

// 假的儲存空間（代替 localStorage）
function memoryStore(initial) {
  const data = Object.assign({}, initial);
  return {
    data,
    get(key, fallback) { return Object.hasOwn(data, key) ? JSON.parse(data[key]) : fallback; },
    set(key, value) { data[key] = JSON.stringify(value); }
  };
}

// 可以手動調整的時鐘
function clock(text) {
  const state = { date: new Date(text) };
  return { state, now: () => new Date(state.date.getTime()) };
}

function setup(start, extra) {
  const store = memoryStore();
  const time = clock(start || '2026-11-26T10:00:00');
  const p = progress.create(Object.assign({ storage: store, now: time.now, questions }, extra));
  return { store, time, p };
}

// 做出一份和 quiz.play 結算一樣格式的 summary。results 每格：true 答對、false 答錯、null 超時
function summaryOf(ids, results) {
  const qs = quiz.buildFromIds(ids, 1);
  return {
    questions: qs,
    choices: qs.map((q, i) => results[i] === true ? q.answer : results[i] === false ? (q.answer + 1) % 4 : null),
    perQ: qs.map((q, i) => results[i] === true ? 150 : 0)
  };
}

const EIGHT = ['lim-01', 'lim-02', 'der-01', 'der-02', 'int-01', 'int-02', 'ser-01', 'ser-02'];

test('沒有資料時回傳空的進度', () => {
  const { p } = setup();
  assert.deepEqual(p.load(), { v: 1, wrong: {}, stats: {}, days: [], games: [] });
  assert.equal(p.wrongCount(), 0);
  assert.equal(p.streak(), 0);
  assert.equal(p.totalSeen(), 0);
  assert.deepEqual(p.topConcepts(), []);
});

test('壞掉或版本不同的資料會重置，不會讓頁面出錯', () => {
  ['亂碼', 123, null, [], { v: 2, wrong: {} }].forEach(raw => {
    const store = memoryStore({ progress: JSON.stringify(raw) });
    const p = progress.create({ storage: store, questions });
    assert.deepEqual(p.load(), { v: 1, wrong: {}, stats: {}, days: [], games: [] });
  });
});

test('舊資料沒有 reviews 欄位時補上空陣列', () => {
  const old = { v: 1, wrong: { 'int-07': { times: 2, last: '2026-11-25', streak: 0, mastered: false } }, stats: {}, days: [], games: [] };
  const p = progress.create({ storage: memoryStore({ progress: JSON.stringify(old) }), questions });
  assert.deepEqual(p.load().wrong['int-07'].reviews, []);
  assert.equal(p.wrongCount(), 1);
});

test('單人一局：答錯和超時都進錯題本，答對率與練習日期正確', () => {
  const { p } = setup();
  const result = p.record({ id: 'solo-1', mode: 'solo', summary: summaryOf(EIGHT, [true, false, true, null, true, true, false, true]) });
  assert.deepEqual(result, { recorded: true, wrong: 3, added: 3, mastered: [] });
  assert.deepEqual(p.wrongList().map(w => w.id), ['der-02', 'lim-02', 'ser-01']);
  assert.equal(p.totalSeen(), 8);
  const stats = p.topicStats();
  assert.deepEqual(stats.limit, { seen: 2, correct: 1, rate: 0.5 });
  assert.deepEqual(stats.integral, { seen: 2, correct: 2, rate: 1 });
  assert.equal(stats['derivative-app'].rate, null);
  assert.deepEqual(p.load().days, ['2026-11-26']);
  assert.equal(p.streak(), 1);
});

test('同一局記兩次（例如重畫結算頁）只算一次', () => {
  const { p, store } = setup();
  const game = { id: 'challenge-9-abc', mode: 'challenge', summary: summaryOf(EIGHT, [false, false, true, true, true, true, true, true]) };
  assert.equal(p.record(game).recorded, true);
  const before = store.data.progress;
  const again = p.record(game);
  assert.equal(again.recorded, false);
  assert.equal(again.wrong, 2, '重複時仍回傳本局答錯幾題，結算頁可以照常顯示');
  assert.equal(store.data.progress, before, '儲存的資料完全沒變');
  assert.equal(p.load().wrong['lim-01'].times, 1);
  assert.equal(p.totalSeen(), 8);
});

test('三種玩法都會寫入錯題本', () => {
  const { p } = setup();
  ['solo', 'challenge', 'pk'].forEach((mode, i) => {
    p.record({ id: mode + '-' + i, mode, summary: summaryOf([EIGHT[i]], [false]) });
  });
  assert.deepEqual(p.wrongList().map(w => w.id).sort(), ['der-01', 'lim-01', 'lim-02']);
});

test('重練：連續答對 2 次才標為已掌握，已掌握的題不再被抽到', () => {
  const { p } = setup();
  p.record({ id: 'solo-1', mode: 'solo', summary: summaryOf(['lim-01', 'lim-02'], [false, false]) });
  let r = p.record({ id: 'review-1', mode: 'review', summary: summaryOf(['lim-01', 'lim-02'], [true, false]) });
  assert.deepEqual(r.mastered, []);
  assert.equal(p.load().wrong['lim-01'].streak, 1);
  assert.equal(p.load().wrong['lim-02'].times, 2, '重練答錯也算錯過一次');
  r = p.record({ id: 'review-2', mode: 'review', summary: summaryOf(['lim-01', 'lim-02'], [true, true]) });
  assert.deepEqual(r.mastered, ['lim-01']);
  assert.equal(p.load().wrong['lim-01'].mastered, true);
  assert.deepEqual(p.load().wrong['lim-01'].reviews, [true, true]);
  assert.deepEqual(p.load().wrong['lim-02'].reviews, [false, true]);
  assert.deepEqual(p.wrongList().map(w => w.id), ['lim-02']);
  assert.equal(p.masteredCount(), 1);
  for (let seed = 0; seed < 200; seed++) assert.deepEqual(p.pickReview(seed), ['lim-02']);
});

test('重練中答錯會讓連續答對次數歸零', () => {
  const { p } = setup();
  p.record({ id: 'solo-1', mode: 'solo', summary: summaryOf(['der-01'], [false]) });
  p.record({ id: 'review-1', mode: 'review', summary: summaryOf(['der-01'], [true]) });
  p.record({ id: 'review-2', mode: 'review', summary: summaryOf(['der-01'], [null]) });
  p.record({ id: 'review-3', mode: 'review', summary: summaryOf(['der-01'], [true]) });
  const entry = p.load().wrong['der-01'];
  assert.equal(entry.streak, 1);
  assert.equal(entry.mastered, false);
  assert.deepEqual(entry.reviews, [true, false, true]);
});

test('單人／PK 答對不算進「連續答對」；已掌握的題再答錯會回到錯題本', () => {
  const { p } = setup();
  p.record({ id: 'solo-1', mode: 'solo', summary: summaryOf(['int-01'], [false]) });
  p.record({ id: 'pk-1', mode: 'pk', summary: summaryOf(['int-01'], [true]) });
  assert.equal(p.load().wrong['int-01'].streak, 0);
  p.record({ id: 'review-1', mode: 'review', summary: summaryOf(['int-01'], [true]) });
  p.record({ id: 'review-2', mode: 'review', summary: summaryOf(['int-01'], [true]) });
  assert.equal(p.wrongCount(), 0);
  const r = p.record({ id: 'pk-2', mode: 'pk', summary: summaryOf(['int-01'], [false]) });
  assert.equal(r.added, 1, '已掌握又答錯，算重新加入');
  assert.deepEqual(p.wrongList().map(w => w.id), ['int-01']);
  assert.equal(p.load().wrong['int-01'].streak, 0);
  assert.equal(p.load().wrong['int-01'].times, 2);
});

test('重練的作答不算進答對率與已作答題數', () => {
  const { p } = setup();
  p.record({ id: 'solo-1', mode: 'solo', summary: summaryOf(['lim-01', 'lim-02'], [false, true]) });
  const before = JSON.stringify(p.topicStats());
  p.record({ id: 'review-1', mode: 'review', summary: summaryOf(['lim-01'], [true]) });
  assert.equal(JSON.stringify(p.topicStats()), before);
  assert.equal(p.totalSeen(), 2);
});

test('reviews 最多保留 10 筆', () => {
  const { p } = setup();
  p.record({ id: 'solo-1', mode: 'solo', summary: summaryOf(['ser-01'], [false]) });
  for (let i = 0; i < 12; i++) p.record({ id: 'review-' + i, mode: 'review', summary: summaryOf(['ser-01'], [false]) });
  assert.equal(p.load().wrong['ser-01'].reviews.length, 10);
});

test('pickReview 最多 8 題、同一個種子抽到同一組、題目不重複', () => {
  const { p } = setup();
  const ids = questions.slice(0, 20).map(q => q.id);
  p.record({ id: 'solo-1', mode: 'solo', summary: summaryOf(ids, ids.map(() => false)) });
  const a = p.pickReview(42);
  assert.equal(a.length, 8);
  assert.equal(new Set(a).size, 8);
  assert.deepEqual(p.pickReview(42), a);
  assert.notDeepEqual(p.pickReview(43), a);
  assert.equal(p.pickReview(1, 30).length, 20);
});

test('連續練習天數：今天沒練從昨天算、中斷就重算、跨月也正確', () => {
  const { p, time } = setup('2026-11-28T09:00:00');
  ['2026-11-28', '2026-11-29', '2026-11-30', '2026-12-01'].forEach((day, i) => {
    time.state.date = new Date(day + 'T12:00:00');
    p.record({ id: 'solo-' + i, mode: 'solo', summary: summaryOf(['lim-01'], [true]) });
  });
  assert.equal(p.streak(), 4);
  time.state.date = new Date('2026-12-02T08:00:00');
  assert.equal(p.streak(), 4, '今天還沒練，昨天以前的連續天數仍保留');
  time.state.date = new Date('2026-12-03T08:00:00');
  assert.equal(p.streak(), 0, '昨天和今天都沒練就歸零');
  p.record({ id: 'solo-x', mode: 'solo', summary: summaryOf(['lim-01'], [true]) });
  assert.equal(p.streak(), 1);
  assert.deepEqual(p.recentDays(7).map(d => d.practiced), [false, true, true, true, true, false, true]);
  assert.equal(p.recentDays(7)[6].date, '2026-12-03');
});

test('用當地日期：23:59 和隔天 00:01 是不同天', () => {
  const { p, time } = setup('2026-11-26T23:59:00');
  p.record({ id: 'solo-a', mode: 'solo', summary: summaryOf(['lim-01'], [true]) });
  time.state.date = new Date('2026-11-27T00:01:00');
  p.record({ id: 'solo-b', mode: 'solo', summary: summaryOf(['lim-01'], [true]) });
  assert.deepEqual(p.load().days, ['2026-11-26', '2026-11-27']);
  assert.equal(p.streak(), 2);
});

test('days 最多 60 天、games 最多 20 局', () => {
  const { p, time } = setup('2026-09-01T12:00:00');
  for (let i = 0; i < 70; i++) {
    p.record({ id: 'solo-' + i, mode: 'solo', summary: summaryOf(['lim-01'], [true]) });
    time.state.date = new Date(time.state.date.getTime() + 86400000);
  }
  const data = p.load();
  assert.equal(data.days.length, 60);
  assert.equal(data.games.length, 20);
  assert.equal(data.games[19], 'solo-69');
});

test('最常錯的觀念：權重＝錯過次數、已掌握與沒標籤的不算、同分取最近答錯', () => {
  const fake = [
    { id: 'der-01', topic: 'derivative', difficulty: 1, answer: 0, concepts: ['der.chain', 'der.basic'] },
    { id: 'der-02', topic: 'derivative', difficulty: 1, answer: 0, concepts: ['der.product'] },
    { id: 'der-03', topic: 'derivative', difficulty: 1, answer: 0, concepts: ['der.implicit'] },
    { id: 'der-04', topic: 'derivative', difficulty: 1, answer: 0 },
    { id: 'der-05', topic: 'derivative', difficulty: 1, answer: 0, concepts: ['der.log'] }
  ];
  const { p, time } = setup('2026-11-26T10:00:00', { questions: fake });
  const game = (id, mode, ids, results) => p.record({ id, mode, summary: {
    questions: ids.map(q => fake.find(f => f.id === q)),
    choices: results.map(r => r ? 0 : 1)
  } });
  game('g1', 'solo', ['der-01', 'der-02', 'der-04', 'der-05'], [false, false, false, false]);
  game('g2', 'solo', ['der-01', 'der-04'], [false, false]);
  time.state.date = new Date('2026-11-27T10:00:00');
  game('g3', 'solo', ['der-03'], [false]);
  // der-05 重練掌握 → der.log 不算
  game('r1', 'review', ['der-05'], [true]);
  game('r2', 'review', ['der-05'], [true]);
  const top = p.topConcepts();
  assert.deepEqual(top.map(t => [t.id, t.weight]), [['der.basic', 2], ['der.chain', 2], ['der.implicit', 1]]);
  // 第三名 der.implicit（11/27 答錯）與 der.product（11/26 答錯）同為 1 次，取最近答錯的
  assert.equal(top[2].id, 'der.implicit');
  assert.equal(top[0].label, '基本求導公式');
});

test('buildFromIds：照 ids 順序出題、跳過不存在與重複的 id、答案對應正確選項', () => {
  const ids = ['ser-03', 'lim-10', 'nope-99', 'lim-10', 'int-20'];
  const a = quiz.buildFromIds(ids, 7);
  assert.deepEqual(a.map(q => q.id), ['ser-03', 'lim-10', 'int-20']);
  assert.deepEqual(quiz.buildFromIds(ids, 7), a, '同一個種子結果相同');
  a.forEach(q => {
    const original = questions.find(item => item.id === q.id);
    assert.equal(q.choices[q.answer], original.choices[original.answer].tex);
    assert.deepEqual(q.choices.slice().sort(), original.choices.map(c => c.tex).sort());
    assert.deepEqual(Object.keys(q), ['id', 'topic', 'difficulty', 'stem', 'choices', 'answer', 'solution']);
  });
});

test('呼叫 buildFromIds 不會影響 build 的結果', () => {
  const before = JSON.stringify(quiz.build('mixed', 12345, 8, 'mixed'));
  quiz.buildFromIds(['lim-01', 'der-02'], 12345);
  assert.equal(JSON.stringify(quiz.build('mixed', 12345, 8, 'mixed')), before);
});

test('答對率最低的主題：至少 2 個主題各答過 3 題以上才標（審查 PR #5）', () => {
  const { p } = setup();
  const play = (id, ids, results) => p.record({ id, mode: 'solo', summary: summaryOf(ids, results) });
  // 只練過一個主題（積分 8 題全對）→ 不標
  play('g1', ['int-01', 'int-02', 'int-03', 'int-04', 'int-05', 'int-06', 'int-07', 'int-08'], [true, true, true, true, true, true, true, true]);
  assert.equal(p.weakestTopic(), null);
  // 第二個主題只答 2 題（還不到 3 題）→ 仍然不標
  play('g2', ['der-01', 'der-02'], [false, false]);
  assert.equal(p.weakestTopic(), null);
  // 導數答到第 3 題 → 兩個主題都達標，標答對率較低的導數（1/3）
  play('g3', ['der-03'], [true]);
  assert.equal(p.weakestTopic(), 'derivative');
  // 極限只答 2 題、全錯（0%）：沒達 3 題，不會搶走「最低」
  play('g4', ['lim-01', 'lim-02'], [false, false]);
  assert.equal(p.weakestTopic(), 'derivative');
  // 極限答到第 3 題（0 / 3）→ 達標，成為最低
  play('g5', ['lim-01'], [false]);
  assert.equal(p.weakestTopic(), 'limit', '極限 0/3 達標後成為最低');
});

test('答對率最低的主題：同分取主題順序在前面的', () => {
  const { p } = setup();
  p.record({ id: 'g1', mode: 'solo', summary: summaryOf(['der-01', 'der-02', 'der-03', 'lim-01', 'lim-02', 'lim-03'], [true, true, false, true, true, false]) });
  assert.equal(p.weakestTopic(), 'limit');
});

test('重練的作答不會讓主題達到「最低」的門檻', () => {
  const { p } = setup();
  p.record({ id: 'g1', mode: 'solo', summary: summaryOf(['int-01', 'int-02', 'int-03', 'der-01'], [true, true, true, false]) });
  p.record({ id: 'r1', mode: 'review', summary: summaryOf(['der-01'], [false]) });
  p.record({ id: 'r2', mode: 'review', summary: summaryOf(['der-01'], [false]) });
  assert.equal(p.topicStats().derivative.seen, 1);
  assert.equal(p.weakestTopic(), null);
});

console.log(passed + ' 項測試通過' + (process.exitCode ? '，有測試失敗' : ''));
