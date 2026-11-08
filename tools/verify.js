'use strict';

const questions = require('../data/questions.js');
const topics = { limit: 'lim', derivative: 'der', 'derivative-app': 'dap', integral: 'int', 'integral-tech': 'itc', series: 'ser' };
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

// 每個取樣峰谷都細化，並保留端點；極窄尖峰仍可能落在取樣間隙。
function extremum(f, a, b, sign) {
  const n = 4096;
  const xs = Array.from({ length: n+1 }, (_, i) => a+(b-a)*i/n);
  const values = xs.map(f);
  let best = 0;
  values.forEach((v, i) => { if (sign*v > sign*values[best]) best = i; });
  let result = { x: xs[best], value: values[best] };
  for (let i = 1; i < n; i++) {
    if (sign*values[i] <= sign*values[i-1] || sign*values[i] < sign*values[i+1]) continue;
    let left = xs[i-1], right = xs[i+1];
    for (let k = 0; k < 60; k++) {
      const u = left+(right-left)/3, v = right-(right-left)/3;
      if (sign*f(u) < sign*f(v)) left = u;
      else right = v;
    }
    const x = (left+right)/2, value = f(x);
    if (sign*value > sign*result.value) result = { x, value };
  }
  return result;
}

// 瑕積分以端點附近的倍減區塊估計尾端；不把雙側發散的主值誤當積分。
function quadrature(f, a, b, tolerance = 1e-9, depth = 18) {
  const mid = (a+b)/2;
  const fa = f(a), fm = f(mid), fb = f(b);
  const fl = f((a+mid)/2), fr = f((mid+b)/2);
  if (![fa, fm, fb, fl, fr].every(Number.isFinite)) throw new Error('積分取樣出現非有限數值');
  const whole = (b-a)*(fa+4*fm+fb)/6;
  const halves = (b-a)*(fa+4*fl+2*fm+4*fr+fb)/12;
  if (Math.abs(halves-whole) <= 15*tolerance) return halves+(halves-whole)/15;
  if (!depth) throw new Error('積分細化仍未穩定');
  return quadrature(f, a, mid, tolerance/2, depth-1)+quadrature(f, mid, b, tolerance/2, depth-1);
}

function endpointIntegral(f, right) {
  let total = 0;
  const blocks = [];
  for (let k = 1; k <= 40; k++) {
    const a = 2**(-k-1), b = 2**(-k);
    const block = right ? quadrature(f, 1-b, 1-a) : quadrature(f, a, b);
    blocks.push(block);
    total += block;
    if (k < 8) continue;
    const tail = blocks.slice(-4);
    if (tail.every(v => Math.abs(v) < 1e-10*Math.max(1, Math.abs(total)))) return total;
    const ratios = tail.slice(1).map((v, i) => v/tail[i]);
    const ratio = ratios[2];
    if (ratio > 0 && ratio < 0.95 && ratios.every(r => Math.abs(r-ratio) < 1e-6)) {
      return total+block*ratio/(1-ratio);
    }
    if (tail.every(v => Math.abs(v) > 1e-7) && ratios.every(r => r >= 1-1e-8)) return 'diverge';
  }
  throw new Error('有限取樣無法判定此瑕積分');
}

const N = {
  diff(f, x) {
    const h = 1e-3;
    const central = step => (f(x+step)-f(x-step))/(2*step);
    // 中央差分的 Richardson 外推，亦支援題庫中的二、三階數值微分。
    return (4*central(h/2)-central(h))/3;
  },
  integrate(f, a, b) {
    if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(f(a)) || !Number.isFinite(f(b))) {
      const value = N.improper(f, a, b);
      if (value === 'diverge') throw new Error('瑕積分發散');
      return value;
    }
    const n = 4096;
    const h = (b-a)/n;
    let total = f(a)+f(b);
    for (let i = 1; i < n; i++) total += (i % 2 ? 4 : 2)*f(a+i*h);
    return total*h/3;
  },
  improper(f, a, b) {
    if (a === b) return 0;
    if (a > b) {
      const value = N.improper(f, b, a);
      return value === 'diverge' ? value : -value;
    }
    if (a === -Infinity && b === Infinity) {
      const left = N.improper(f, a, 0), right = N.improper(f, 0, b);
      return left === 'diverge' || right === 'diverge' ? 'diverge' : left+right;
    }
    const transformed = b === Infinity ? t => f(a+t/(1-t))/(1-t)**2 :
      a === -Infinity ? t => f(b-t/(1-t))/(1-t)**2 : t => f(a+(b-a)*t)*(b-a);
    const left = endpointIntegral(transformed, false);
    const right = endpointIntegral(transformed, true);
    return left === 'diverge' || right === 'diverge' ? 'diverge' : left+right;
  },
  roots(f, a, b) {
    const roots = [];
    const add = x => { if (!roots.some(r => Math.abs(r-x) < 1e-7)) roots.push(x); };
    const n = 4096;
    let left = a, fl = f(a);
    if (fl === 0) add(a);
    for (let i = 1; i <= n; i++) {
      const right = a+(b-a)*i/n, fr = f(right);
      if (fr === 0) add(right);
      if (Number.isFinite(fl) && Number.isFinite(fr) && Math.sign(fl)*Math.sign(fr) < 0) {
        let lo = left, hi = right, flo = fl;
        for (let k = 0; k < 60; k++) {
          const mid = (lo+hi)/2, fm = f(mid);
          if (fm === 0) { lo = hi = mid; break; }
          if (Math.sign(flo)*Math.sign(fm) < 0) hi = mid;
          else { lo = mid; flo = fm; }
        }
        const x = (lo+hi)/2;
        // 變號也可能是極點，僅接納殘差足夠小的候選根。
        if (Number.isFinite(f(x)) && Math.abs(f(x)) < 1e-7) add(x);
      }
      left = right;
      fl = fr;
    }
    return roots.sort((x, y) => x-y);
  },
  maximize(f, a, b) { return extremum(f, a, b, 1); },
  minimize(f, a, b) { return extremum(f, a, b, -1); },
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

function validValue(value) {
  return typeof value === 'function' || typeof value === 'string' ||
    (typeof value === 'number' && Number.isFinite(value)) ||
    (Array.isArray(value) && value.every(Number.isFinite));
}

function equalValue(a, b, samples, upToConstant) {
  if (typeof a === 'function' || typeof b === 'function') {
    if (![a, b].every(v => typeof v === 'function' || typeof v === 'number')) return false;
    const at = (v, x) => typeof v === 'function' ? v(x) : v;
    const anchorA = upToConstant ? at(a, samples[0]) : 0;
    const anchorB = upToConstant ? at(b, samples[0]) : 0;
    return samples.every(x => close(at(a, x)-anchorA, at(b, x)-anchorB));
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => close(v, b[i]));
  }
  return typeof a === 'number' && typeof b === 'number' ? close(a, b) : a === b;
}

function verifyQuestion(q) {
  const errors = [];
  if (!Object.hasOwn(topics, q.topic)) errors.push('topic 不合法');
  if (!Number.isInteger(q.difficulty) || q.difficulty < 1 || q.difficulty > 3) errors.push('difficulty 不合法');
  if (typeof q.id !== 'string' || !new RegExp('^'+topics[q.topic]+'-(0[1-9]|[1-4]\\d|50)$').test(q.id)) errors.push('id 格式不合法');
  if (typeof q.stem !== 'string' || !q.stem.trim()) errors.push('缺少題幹');
  if (typeof q.solution !== 'string' || !q.solution.trim()) errors.push('缺少詳解');
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) errors.push('answer 不合法');
  if (!Array.isArray(q.choices) || q.choices.length !== 4) errors.push('選項必須恰好四個');
  else {
    if (q.choices.some(c => !c || typeof c.tex !== 'string' || !c.tex.trim())) errors.push('選項缺少 tex');
    if (new Set(q.choices.map(c => c && c.tex)).size !== 4) errors.push('選項 tex 重複');
    if (q.choices.some(c => !c || !validValue(c.value))) errors.push('選項 value 不合法');
  }
  const samples = q.samples === undefined ? [-0.75, -0.2, 0.4, 1.3, 2] : q.samples;
  if (!Array.isArray(samples) || samples.length < 2 || !samples.every(Number.isFinite)) errors.push('取樣點不合法');
  if (q.upToConstant !== undefined && typeof q.upToConstant !== 'boolean') errors.push('upToConstant 必須為布林值');
  if (typeof q.check !== 'function') errors.push('缺少 check');
  if (errors.length) return errors;
  try {
    q.choices.forEach((choice, i) => {
      if (q.choices.slice(0, i).some(other => equalValue(choice.value, other.value, samples, q.upToConstant))) {
        errors.push('選項 value 重複：'+i);
      }
    });
    const actual = q.check(N);
    if (!validValue(actual)) {
      throw new Error('check 未回傳合法結果');
    }
    const matches = [];
    q.choices.forEach((choice, i) => {
      if (equalValue(actual, choice.value, samples, q.upToConstant)) matches.push(i);
    });
    if (matches.length !== 1) errors.push('應恰好一個選項吻合，實際為 '+matches.length+' 個');
    else if (matches[0] !== q.answer) errors.push('驗算符合選項 '+matches[0]+'，answer 卻為 '+q.answer);
  } catch (error) {
    errors.push('驗算失敗：'+error.message);
  }
  return errors;
}

function verifyBank(bank, selectedTopics = Object.keys(topics), noCount = false) {
  const failures = [];
  const seen = new Set();
  const stems = {};
  const counts = {};
  selectedTopics.forEach(topic => { counts[topic] = [0, 0, 0]; });
  bank.forEach(q => {
    const errors = verifyQuestion(q);
    if (seen.has(q.id)) errors.push('id 重複');
    seen.add(q.id);
    const normalized = typeof q.stem === 'string' ? q.stem.replace(/\s/g, '').replace(/\d+/g, '#') : '';
    const key = q.topic+':'+normalized;
    if (stems[key]) errors.push('題幹僅數字不同或重複：'+stems[key]);
    stems[key] = q.id;
    if (counts[q.topic] && Number.isInteger(q.difficulty) && q.difficulty >= 1 && q.difficulty <= 3) counts[q.topic][q.difficulty-1]++;
    if (errors.length) failures.push(q.id+'：'+errors.join('；'));
  });
  if (!noCount) selectedTopics.forEach(topic => {
    const total = bank.filter(q => q.topic === topic).length;
    if (total !== 50) failures.push(topic+'：題數必須恰好 50 題，實際 '+total+' 題');
    if (counts[topic].some(count => count < 15 || count > 18)) {
      failures.push(topic+'：難度 1／2／3 各需 15–18 題，實際 '+counts[topic].join('／'));
    }
  });
  return { failures, counts };
}

function main(args) {
  let selectedTopics = Object.keys(topics);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--topic') {
      const topic = args[++i];
      if (!Object.hasOwn(topics, topic)) throw new Error('--topic 必須為 '+Object.keys(topics).join('、'));
      selectedTopics = [topic];
    } else if (!['--no-count', '--selftest'].includes(args[i])) throw new Error('未知參數：'+args[i]);
  }
  const bank = questions.filter(q => selectedTopics.includes(q.topic) || selectedTopics.length === Object.keys(topics).length);
  const { failures, counts } = verifyBank(bank, selectedTopics, args.includes('--no-count'));
  if (failures.length) {
    failures.forEach(failure => console.error(failure));
    process.exitCode = 1;
  } else {
    selectedTopics.forEach(topic => console.log(topic+'：'+counts[topic].reduce((a, b) => a+b, 0)+' 題'));
    console.log('全部 '+bank.length+' 題驗證通過');
  }
  if (args.includes('--selftest')) {
    let caught = 0;
    bank.forEach(q => {
      // 三個錯誤 answer 都必須被同一個驗證流程抓到。
      const detected = [0, 1, 2, 3].filter(answer => answer !== q.answer)
        .every(answer => verifyQuestion(Object.assign({}, q, { answer })).length > 0);
      if (detected) caught++;
      else console.error(q.id+'：錯置答案未被抓到');
    });
    console.log('抓到 '+caught+' / '+bank.length);
    if (caught !== bank.length) process.exitCode = 1;
  }
}

module.exports = { N, verifyQuestion, verifyBank };
if (require.main === module) {
  try { main(process.argv.slice(2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
