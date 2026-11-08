(function () {
  var game;
  var session = 0;

  Calc.pages.solo = {
    mount: function (el) {
      var current = ++session;
      var topic = Calc.store.get('topic', 'mixed');
      if (Calc.quiz.TOPICS.indexOf(topic) === -1) topic = 'mixed';
      var difficulty = Calc.store.get('difficulty', 'mixed');
      if (Calc.quiz.DIFFICULTIES.indexOf(difficulty) === -1) difficulty = 'mixed';
      var name = String(Calc.store.get('name', '')).trim() || '練習者';

      async function start() {
        if (game) game.destroy();
        var seed = Calc.rng.newSeed();
        var questions = Calc.quiz.build(topic, seed, 8, difficulty);
        await Calc.fx.countdown(el);
        if (current !== session) return;
        game = Calc.quiz.play(el, {
          questions: questions,
          mode: 'solo',
          onFinish: function (summary) {
            var key = 'best:' + topic + ':' + difficulty;
            Calc.store.set(key, Math.max(Calc.store.get(key, 0), summary.total));
            var actions = [
              { label: '再玩一次', primary: true, onClick: start },
              { label: '回首頁', onClick: function () { Calc.router.go('#home'); } }
            ];
            if (Calc.challenge) {
              actions.push({ label: '發起挑戰', onClick: function () {
                Calc.challenge.offer(el, { name: name, topic: topic, difficulty: difficulty, seed: seed, summary: summary });
              } });
            }
            Calc.pages.result.render(el, { topic: topic, difficulty: difficulty, me: { name: name, summary: summary }, actions: actions });
          }
        });
        game.start();
      }

      start();
    },
    unmount: function () {
      session++;
      if (game) game.destroy();
      game = null;
    }
  };
}());
