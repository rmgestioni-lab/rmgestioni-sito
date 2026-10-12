/* Meta Pixel (dataset "pixel audit", ID 2353537081854874) con consenso ai cookie di marketing.
   Incluso da tutte le pagine pubbliche, tranne privacy.html.

   - Consenso negato di default: fbq('consent', 'revoke') prima di fbq('init').
   - fbq('consent', 'grant') solo quando l'utente preme "Accetta" nel banner,
     oppure subito al caricamento se aveva gia' accettato in una visita precedente.
   - PageView su ogni pagina. Contact al clic su qualsiasi link wa.me.
   - L'evento Lead NON e' qui: parte solo dall'invio riuscito del modulo di check-up.html.
   - La scelta dell'utente e' in localStorage ('granted' | 'denied'), condivisa tra le pagine. */
(function () {
  var PIXEL_ID = '2353537081854874';
  var KEY = 'rm_marketing_consent';

  // Codice base standard di Meta
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}

  fbq('consent', 'revoke');
  fbq('init', PIXEL_ID);
  if (saved === 'granted') { fbq('consent', 'grant'); }
  fbq('track', 'PageView');

  // Evento Contact sui link WhatsApp, senza bloccare l'apertura.
  // Delegato su document: vale per qualsiasi link wa.me della pagina, anche aggiunto dopo.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me/"]');
    if (a && window.fbq) fbq('track', 'Contact');
  });

  // Banner di consenso (compare solo se l'utente non ha ancora scelto)
  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
  }

  function showBanner() {
    var css = document.createElement('style');
    css.textContent =
      '#rm-mkt-consent{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#141414;color:#F6F1E7;padding:16px 20px;font-family:inherit;font-size:14px;line-height:1.5;display:flex;flex-wrap:wrap;align-items:center;gap:14px;box-shadow:0 -2px 16px rgba(0,0,0,.25)}' +
      '#rm-mkt-consent p{margin:0;flex:1 1 260px}' +
      '#rm-mkt-consent a{color:#C9A45E;text-decoration:underline}' +
      '#rm-mkt-consent button{border:none;border-radius:8px;padding:10px 18px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit}' +
      '#rm-mkt-accept{background:#B08D4A;color:#141414}' +
      '#rm-mkt-reject{background:transparent;color:#F6F1E7;border:1px solid #D8D0C2 !important}';
    document.head.appendChild(css);

    var box = document.createElement('div');
    box.id = 'rm-mkt-consent';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Consenso cookie di marketing');
    box.innerHTML =
      '<p>Usiamo un cookie di marketing (Meta Pixel) per capire l\'efficacia di questa pagina. Leggi la <a href="/privacy.html">Privacy Policy</a>.</p>' +
      '<button id="rm-mkt-reject" type="button">Rifiuta</button>' +
      '<button id="rm-mkt-accept" type="button">Accetta</button>';
    document.body.appendChild(box);

    document.getElementById('rm-mkt-accept').addEventListener('click', function () {
      save('granted');
      fbq('consent', 'grant');
      box.remove();
    });
    document.getElementById('rm-mkt-reject').addEventListener('click', function () {
      save('denied');
      box.remove();
    });
  }

  if (saved !== 'granted' && saved !== 'denied') {
    if (document.body) { showBanner(); } else { document.addEventListener('DOMContentLoaded', showBanner); }
  }
})();
