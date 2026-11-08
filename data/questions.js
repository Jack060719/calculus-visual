(function (root) {
  var Calc = root.Calc = root.Calc || {};
  var topics = ['limit', 'derivative', 'derivative-app', 'integral', 'integral-tech', 'series'];
  var questions = [];
  topics.forEach(function (topic) {
    var bank = typeof module !== 'undefined' ? require('./questions/' + topic + '.js') : Calc.questionBank[topic];
    questions = questions.concat(bank);
  });
  Calc.questions = questions;
  if (typeof module !== 'undefined') module.exports = questions;
}(typeof window !== 'undefined' ? window : globalThis));
