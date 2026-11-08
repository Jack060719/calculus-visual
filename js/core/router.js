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
