'use strict';

const questions = require('../data/questions.js');
const topics = { limit: 'lim', derivative: 'der', integral: 'int', series: 'ser' };
const codes = ['DNE', '+inf', '-inf', 'converge', 'diverge'];
const close = (a, b) => Number.isFinite(a) && Number.isFinite(b) &&
  Math.abs(a-b) <= Math.max(1e-6, 1e-4*Math.max(Math.abs(a), Math.abs(b)));

// 有限取樣只供此題庫驗算，不是任意函數的極限或收斂證明；無法判定時直接報錯。
function trend(values) {
  const tail = values.slice(-4);
  if (!tail.every(Number.isFinite)) throw new Error('取樣出現非有限數值');
  if (tail.every(v => close(v, tail[3]))) return tail[3];
  const extrapolated = tail.slice(1).map((v, i) => 2*v-tail[i]);
  if (extrapolated.every(v => close(v, extrapolated[2])) &&
      Math.abs(tail[3]-tail[2]) < 0.6*Math.abs(tail[2]-tail[1])) return extrapolated[2];
  if (tail.every((v, i) => Math.abs(v) > 1e4 && Math.sign(v) === Math.sign(tail[0]) &&
      (i === 0 || Math.abs(v) > 1.5*Math.abs(tail[i-1])))) {
    return tail[3] > 0 ? '+inf' : '-inf';
  }
  throw new Error('取樣未呈現穩定極限');
}

const N = {
  diff(f, x) {
    const h = 1e-3;
    const central = step => (f(x+step)-f(x-step))/(2*step);
    // 中央差分的 Richardson 外推，亦支援題庫中的二、三階數值微分。
    return (4*central(h/2)-central(h))/3;
  },
  integrate(f, a, b) {
    const n = 4096;
    const h = (b-a)/n;
    let total = f(a)+f(b);
    for (let i = 1; i < n; i++) total += (i % 2 ? 4 : 2)*f(a+i*h);
    return total*h/3;
  },
  limit(f, a, side) {
    const oneSide = sign => {
      const values = [];
      // 避免太靠近零造成 1-cos(x) 的消去誤差。
      for (let k = 0; k < 12; k++) values.push(f(a+sign*0.01/2**k));
      return trend(values);
    };
    if (side === 'left') return oneSide(-1);
    if (side === 'right') return oneSide(1);
    if (side !== undefined) throw new Error('side 必須為 left 或 right');
    const left = oneSide(-1);
    const right = oneSide(1);
    if (typeof left === 'number' && typeof right === 'number') {
      return close(left, right) ? (left+right)/2 : 'DNE';
    }
    return left === right ? left : 'DNE';
  },
  limitInf(f) {
    return trend(Array.from({ length: 16 }, (_, k) => f(2**(k+4))));
  },
  sum(term, from, to) {
    let total = 0;
    for (let n = from; n <= to; n++) total += term(n);
    return total;
  },
  series(term) {
    // 觀察倍增區塊的和與通項；適用本題庫的等比、p 級數及規律交錯級數。
    const blocks = [];
    for (let k = 6; k <= 18; k++) {
      const end = 2**k;
      const last = term(end);
      const middle = term(end/2);
      if (!Number.isFinite(last) ||
          (Math.abs(last) > 0.01 && Math.abs(last/middle) >= 0.99)) return 'diverge';
      blocks.push(Math.abs(N.sum(term, end/2+1, end)));
    }
    const tail = blocks.slice(-4);
    if (tail.every(v => v < 1e-10) ||
        tail.every((v, i) => i === 0 || v < 0.9*tail[i-1])) return 'converge';
    if (tail.every(v => v > 0.01) &&
        tail.every((v, i) => i === 0 || v >= 0.99*tail[i-1])) return 'diverge';
    throw new Error('有限取樣無法判定此級數');
  }
};

function verifyQuestion(q) {
  const errors = [];
  if (!Object.hasOwn(topics, q.topic)) errors.push('topic 不合法');
  if (!Number.isInteger(q.difficulty) || q.difficulty < 1 || q.difficulty > 3) errors.push('difficulty 不合法');
  if (typeof q.id !== 'string' || !new RegExp('^'+topics[q.topic]+'-\\d{2}$').test(q.id)) errors.push('id 格式不合法');
  if (typeof q.stem !== 'string' || !q.stem.trim()) errors.push('缺少題幹');
  if (typeof q.solution !== 'string' || !q.solution.trim()) errors.push('缺少詳解');
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) errors.push('answer 不合法');
  if (!Array.isArray(q.choices) || q.choices.length !== 4) errors.push('選項必須恰好四個');
  else {
    if (q.choices.some(c => !c || typeof c.tex !== 'string' || !c.tex.trim())) errors.push('選項缺少 tex');
    if (new Set(q.choices.map(c => c && c.tex)).size !== 4) errors.push('選項 tex 重複');
    if (q.choices.some(c => !c || !(typeof c.value === 'function' ||
        (typeof c.value === 'number' && Number.isFinite(c.value)) || codes.includes(c.value)))) errors.push('選項 value 不合法');
  }
  const samples = q.samples === undefined ? [-0.75, -0.2, 0.4, 1.3, 2] : q.samples;
  if (!Array.isArray(samples) || samples.length < 2 || !samples.every(Number.isFinite)) errors.push('取樣點不合法');
  if (typeof q.check !== 'function') errors.push('缺少 check');
  if (errors.length) return errors;
  try {
    const actual = q.check(N);
    if (!(typeof actual === 'function' || (typeof actual === 'number' && Number.isFinite(actual)) || codes.includes(actual))) {
      throw new Error('check 未回傳合法結果');
    }
    const matches = [];
    q.choices.forEach((choice, i) => {
      let equal;
      if (typeof actual === 'function' || typeof choice.value === 'function') {
        equal = samples.every(x => close(
          typeof actual === 'function' ? actual(x) : actual,
          typeof choice.value === 'function' ? choice.value(x) : choice.value));
      } else if (typeof actual === 'number' && typeof choice.value === 'number') {
        equal = close(actual, choice.value);
      } else equal = actual === choice.value;
      if (equal) matches.push(i);
    });
    if (matches.length !== 1) errors.push('應恰好一個選項吻合，實際為 '+matches.length+' 個');
    else if (matches[0] !== q.answer) errors.push('驗算符合選項 '+matches[0]+'，answer 卻為 '+q.answer);
  } catch (error) {
    errors.push('驗算失敗：'+error.message);
  }
  return errors;
}

const failures = [];
const seen = new Set();
const counts = {};
Object.keys(topics).forEach(topic => { counts[topic] = [0, 0, 0]; });
questions.forEach(q => {
  const errors = verifyQuestion(q);
  if (seen.has(q.id)) errors.push('id 重複');
  seen.add(q.id);
  if (counts[q.topic] && Number.isInteger(q.difficulty) && q.difficulty >= 1 && q.difficulty <= 3) counts[q.topic][q.difficulty-1]++;
  if (errors.length) failures.push(q.id+'：'+errors.join('；'));
});
Object.keys(topics).forEach(topic => {
  const total = counts[topic].reduce((a, b) => a+b, 0);
  if (total < 10) failures.push(topic+'：不足 10 題');
  if (counts[topic].some(count => count < 2)) failures.push(topic+'：各難度至少需要 2 題');
});
if (questions.length !== 40) failures.push('題庫：總數必須為 40 題');

if (failures.length) {
  failures.forEach(failure => console.error(failure));
  process.exitCode = 1;
} else {
  Object.keys(topics).forEach(topic => console.log(topic+'：'+counts[topic].reduce((a, b) => a+b, 0)+' 題'));
  console.log('全部 40 題驗證通過');
  if (process.argv.includes('--selftest')) {
    let caught = 0;
    questions.forEach(q => {
      // 三個錯誤 answer 都必須被同一個驗證流程抓到。
      const detected = [0, 1, 2, 3].filter(answer => answer !== q.answer)
        .every(answer => verifyQuestion(Object.assign({}, q, { answer })).length > 0);
      if (detected) caught++;
      else console.error(q.id+'：錯置答案未被抓到');
    });
    console.log('抓到 '+caught+' / '+questions.length);
    if (caught !== questions.length) process.exitCode = 1;
  }
}
