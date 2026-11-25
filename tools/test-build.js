'use strict';
// 證明 PK 與連結挑戰的出題沒有被改到：node tools/test-build.js [git 版本]
//
// 做法：從 git 取出「加入錯題本之前」的 js/core/quiz.js（預設是 d206f72，T12 之前最後一次上線的版本），
// 和現在的 js/core/quiz.js 各自載入，用「同一份題庫、同一組種子」呼叫 build，逐題比對輸出。
// 7 個主題選項 × 4 個難度選項 × 300 個種子，全部完全相同才算通過。
// 另外也比對 build 函式的原始碼是否一字不差。

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');

const BASE = process.argv[2] || 'd206f72';
const root = path.join(__dirname, '..');
const rngSource = fs.readFileSync(path.join(root, 'js/core/rng.js'), 'utf8');
const questions = require('../data/questions.js');

let oldSource;
try {
  oldSource = execFileSync('git', ['show', BASE + ':js/core/quiz.js'], { cwd: root, encoding: 'utf8' });
} catch (error) {
  console.error('找不到 git 版本 ' + BASE + ' 的 js/core/quiz.js（需要在 git repo 裡執行）');
  process.exit(1);
}
const newSource = fs.readFileSync(path.join(root, 'js/core/quiz.js'), 'utf8');

// 在獨立的環境載入 quiz.js，兩個版本互不影響；題庫用同一份
function load(source) {
  const context = vm.createContext({ crypto: globalThis.crypto });
  vm.runInContext(rngSource, context);
  context.Calc.questions = questions;
  vm.runInContext(source, context);
  return context.Calc.quiz;
}

// 取出 build 函式的原始碼（從 "function build(" 到對應的右大括號）
function buildSource(source) {
  const start = source.indexOf('function build(');
  let depth = 0;
  for (let i = source.indexOf('{', start); i < source.length; i++) {
    if (source[i] === '{') depth++;
    if (source[i] === '}' && --depth === 0) return source.slice(start, i + 1).replace(/\r\n/g, '\n');
  }
  return null;
}

const oldQuiz = load(oldSource);
const newQuiz = load(newSource);
const topics = ['limit', 'derivative', 'derivative-app', 'integral', 'integral-tech', 'series', 'mixed'];
const difficulties = [1, 2, 3, 'mixed'];
// 種子：0～149，再加 150 個分散在整個 32 位元範圍的種子（挑戰連結與 PK 用的就是這種隨機種子）
const seeds = [];
for (let i = 0; i < 150; i++) seeds.push(i);
for (let i = 0; i < 150; i++) seeds.push((Math.imul(i + 1, 2654435761) >>> 0));

let compared = 0;
let different = 0;
const failures = [];  // 只列前 5 組，避免洗版
topics.forEach(topic => difficulties.forEach(difficulty => seeds.forEach(seed => {
  const a = JSON.stringify(oldQuiz.build(topic, seed, 8, difficulty));
  const b = JSON.stringify(newQuiz.build(topic, seed, 8, difficulty));
  compared++;
  if (a !== b) different++;
  if (a !== b && failures.length < 5) failures.push(topic + '／' + difficulty + '／seed ' + seed);
})));

const sameSource = buildSource(oldSource) === buildSource(newSource);
console.log('比對版本：' + BASE + ' 的 quiz.js vs 現在的 quiz.js');
console.log('build 原始碼一字不差：' + (sameSource ? '是' : '否'));
console.log('比對 ' + compared + ' 組（主題 × 難度 × 種子），不同的有 ' + different + ' 組');
if (!sameSource || different) {
  failures.forEach(f => console.error('出題不同：' + f));
  process.exitCode = 1;
} else {
  console.log('PK 與連結挑戰的出題結果完全相同');
}
