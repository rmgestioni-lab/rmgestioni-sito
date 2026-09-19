(function () {
  'use strict';

  // Filtro per argomento nell'indice del blog
  var chips = document.querySelectorAll('.chip');
  var cards = document.querySelectorAll('.post-grid [data-cat]');
  var count = document.getElementById('post-count');

  function applyFilter(filter) {
    var shown = 0;
    Array.prototype.forEach.call(chips, function (chip) {
      chip.setAttribute('aria-pressed', chip.dataset.filter === filter ? 'true' : 'false');
    });
    Array.prototype.forEach.call(cards, function (card) {
      var show = filter === 'all' || card.dataset.cat === filter;
      card.hidden = !show;
      if (show) shown++;
    });
    if (count) count.textContent = shown + (shown === 1 ? ' articolo' : ' articoli');
  }

  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener('click', function () {
      applyFilter(chip.dataset.filter);
      if (window.history && history.replaceState) {
        history.replaceState(null, '', chip.dataset.filter === 'all' ? location.pathname : '?argomento=' + chip.dataset.filter);
      }
    });
  });

  if (chips.length) {
    var wanted = new URLSearchParams(location.search).get('argomento');
    if (wanted && document.querySelector('.chip[data-filter="' + wanted + '"]')) applyFilter(wanted);
  }

  // Articolo: indice dei contenuti, barra di avanzamento
  var toc = document.querySelector('details.toc');
  if (toc && window.matchMedia('(max-width: 1040px)').matches) toc.removeAttribute('open');

  var prose = document.querySelector('.prose');
  var bar = document.querySelector('.progress');
  if (prose && bar) {
    var ticking = false;
    var update = function () {
      var rect = prose.getBoundingClientRect();
      var total = rect.height - window.innerHeight * 0.6;
      var done = Math.min(Math.max(-rect.top + window.innerHeight * 0.2, 0), Math.max(total, 1));
      bar.style.width = Math.min(100, (done / Math.max(total, 1)) * 100) + '%';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  var links = document.querySelectorAll('.toc a[href^="#"]');
  if (links.length && 'IntersectionObserver' in window) {
    var byId = {};
    Array.prototype.forEach.call(links, function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Array.prototype.forEach.call(links, function (a) { a.removeAttribute('aria-current'); });
        var link = byId[entry.target.id];
        if (link) link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    Array.prototype.forEach.call(document.querySelectorAll('.prose h2[id], .faq h2[id]'), function (h) { observer.observe(h); });
  }
})();
