(function () {
  Calc.pages = Calc.pages || {};
  var currentPage;

  function render() {
    var hash = window.location.hash;
    var name = 'home';
    var param;
    if (hash === '#solo') {
      name = 'solo';
    } else if (hash.indexOf('#challenge=') === 0 && hash.length > 11) {
      name = 'challenge';
      param = hash.slice(11);
    } else if (hash.indexOf('#room=') === 0 && hash.length > 6) {
      name = 'pk';
      param = hash.slice(6);
    } else if (hash !== '#home') {
      Calc.router.replace('#home');
    }

    if (currentPage) currentPage.unmount();
    // 倒數遮罩掛在 body 上，不會跟著頁面一起清掉；
    // 倒數中途換頁（例如按上一頁）時要手動移除，否則會蓋住新頁面好幾秒。
    document.querySelectorAll('.fx-countdown-overlay').forEach(function (overlay) {
      overlay.remove();
    });
    var pageEl = document.createElement('section');
    pageEl.className = 'page';
    document.getElementById('app').replaceChildren(pageEl);
    currentPage = Calc.pages[name];
    currentPage.mount(pageEl, param);
    window.scrollTo(0, 0);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { pageEl.classList.add('is-visible'); });
    });
  }

  Calc.router = {
    start: function () {
      window.addEventListener('hashchange', render);
      render();
    },
    go: function (hash) { window.location.hash = hash; },
    replace: function (hash) { window.history.replaceState(null, '', hash); }
  };
}());
