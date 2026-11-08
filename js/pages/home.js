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
        '<div class="topics" role="group" aria-labelledby="topic-label"></div></div></section>' +
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

      var topics = [
        ['limit', '極限與連續'], ['derivative', '導數'], ['integral', '積分'],
        ['series', '級數'], ['mixed', '綜合']
      ];
      var selected = Calc.store.get('topic', 'mixed');
      if (!topics.some(function (topic) { return topic[0] === selected; })) selected = 'mixed';
      var topicGroup = el.querySelector('.topics');
      topics.forEach(function (topic) {
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip';
        chip.textContent = topic[1];
        chip.setAttribute('aria-pressed', String(topic[0] === selected));
        chip.addEventListener('click', function () {
          Calc.store.set('topic', topic[0]);
          topicGroup.querySelectorAll('.chip').forEach(function (item) {
            item.setAttribute('aria-pressed', String(item === chip));
          });
        });
        topicGroup.appendChild(chip);
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
