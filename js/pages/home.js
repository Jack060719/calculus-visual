(function () {
  Calc.pages.home = {
    mount: function (el) {
      el.innerHTML = '<header class="hero">' +
        '<span class="badge">一起練習，一起進步</span>' +
        '<h1>微積分 PK</h1><p>把每一次思考，變成下一次的勝算。</p></header>' +
        '<section class="card profile" aria-label="練習設定">' +
        '<div class="field"><label class="field-label" for="name">你的暱稱<span>最多 12 字</span></label>' +
        '<input class="input" id="name" maxlength="12" placeholder="讓朋友認出你" autocomplete="nickname"></div>' +
        '<div class="field"><p class="field-label" id="topic-label">這次想練什麼？</p>' +
        '<div class="topics topic-grid" role="group" aria-labelledby="topic-label"></div></div>' +
        '<div class="field"><p class="field-label" id="difficulty-label">選擇難度</p>' +
        '<div class="difficulties" role="group" aria-labelledby="difficulty-label"></div></div></section>' +
        '<div class="modes"><article class="card mode featured">' +
        '<div class="mode-heading"><span class="mode-number">01</span><div><h2>單人練習</h2><p>照自己的步調，累積解題手感。</p></div></div>' +
        '<a class="btn primary" href="#solo">開始練習</a></article>' +
        '<article class="card mode"><div class="mode-heading"><span class="mode-number">02</span>' +
        '<div><h2>建立 PK 房間</h2><p>邀一位朋友，來場腦力切磋。</p></div></div>' +
        '<a class="btn ghost" href="#room=new">建立房間</a></article>' +
        '<article class="card mode"><div class="mode-heading"><span class="mode-number">03</span>' +
        '<div><h2>加入房間</h2><p>朋友準備好了？輸入房號就出發。</p></div></div>' +
        '<form id="join-room" novalidate><label class="field-label" for="room">4 位數房號</label>' +
        '<div class="room-controls"><input class="input" id="room" type="text" inputmode="numeric" pattern="[0-9]{4}" placeholder="例如 1234" autocomplete="off" aria-describedby="room-error">' +
        '<button class="btn ghost" type="submit">加入</button></div>' +
        '<div class="room-error" id="room-error" role="status" aria-live="polite"></div></form></article></div>' +
        '<p class="footnote">「連結挑戰」會在單人練習結算後產生。</p>';

      var nameInput = el.querySelector('#name');
      nameInput.value = String(Calc.store.get('name', '')).slice(0, 12);
      nameInput.addEventListener('input', function () {
        nameInput.value = nameInput.value.slice(0, 12);
        Calc.store.set('name', nameInput.value);
      });

      var descriptions = {
        limit: '從趨近的變化，掌握連續的條件。',
        derivative: '練習變化率與微分的基本功。',
        'derivative-app': '用導數找切線、極值與變化趨勢。',
        integral: '從累積量出發，理解積分。',
        'integral-tech': '運用代換與分部積分解題。',
        series: '探索無窮和與函數的展開。',
        mixed: '交錯練習六個主題，串起觀念。'
      };
      var selected = Calc.store.get('topic', 'mixed');
      if (Calc.quiz.TOPICS.indexOf(selected) === -1) selected = 'mixed';
      var topicGroup = el.querySelector('.topics');
      Calc.quiz.TOPICS.forEach(function (topic) {
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip topic-chip';
        var title = document.createElement('strong');
        title.textContent = Calc.quiz.LABELS[topic];
        var description = document.createElement('span');
        description.textContent = descriptions[topic];
        chip.append(title, description);
        chip.setAttribute('aria-pressed', String(topic === selected));
        chip.addEventListener('click', function () {
          Calc.store.set('topic', topic);
          topicGroup.querySelectorAll('.chip').forEach(function (item) {
            item.setAttribute('aria-pressed', String(item === chip));
          });
        });
        topicGroup.appendChild(chip);
      });

      var difficulty = Calc.store.get('difficulty', 'mixed');
      if (Calc.quiz.DIFFICULTIES.indexOf(difficulty) === -1) difficulty = 'mixed';
      var difficultyGroup = el.querySelector('.difficulties');
      Calc.quiz.DIFFICULTIES.forEach(function (level) {
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip';
        chip.textContent = Calc.quiz.DIFFICULTY_LABELS[level];
        chip.setAttribute('aria-pressed', String(level === difficulty));
        chip.addEventListener('click', function () {
          Calc.store.set('difficulty', level);
          difficultyGroup.querySelectorAll('.chip').forEach(function (item) {
            item.setAttribute('aria-pressed', String(item === chip));
          });
        });
        difficultyGroup.appendChild(chip);
      });

      var roomInput = el.querySelector('#room');
      var roomError = el.querySelector('#room-error');
      roomInput.addEventListener('input', function () {
        roomInput.removeAttribute('aria-invalid');
        roomError.textContent = '';
      });
      el.querySelector('#join-room').addEventListener('submit', function (event) {
        event.preventDefault();
        if (!/^[0-9]{4}$/.test(roomInput.value)) {
          roomInput.setAttribute('aria-invalid', 'true');
          roomError.textContent = '請輸入 4 位數字的房號。';
          roomInput.focus();
          return;
        }
        Calc.router.go('#room=' + roomInput.value);
      });
    },
    unmount: function () {}
  };
}());
