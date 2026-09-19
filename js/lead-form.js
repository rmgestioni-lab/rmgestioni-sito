(function () {
  'use strict';
  var form = document.querySelector('form[data-lead]');
  if (!form) return;

  // Le richieste arrivano via email all'indirizzo qui sotto (servizio Formsubmit.co).
  var ENDPOINT = 'https://formsubmit.co/ajax/matteo@rmgestioni.it';
  var status = form.querySelector('.form-status');
  var button = form.querySelector('.submit');
  var idleLabel = button.textContent;

  function clearStatus() {
    status.className = 'form-status';
    status.textContent = '';
  }

  function showError() {
    var wa = document.querySelector('a[href^="https://wa.me/"]');
    status.className = 'form-status is-error';
    status.textContent = 'Non siamo riusciti a inviare la richiesta. Riprova, oppure scrivici ';
    if (wa) {
      var a = document.createElement('a');
      a.href = wa.href;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'su WhatsApp';
      status.appendChild(a);
      status.appendChild(document.createTextNode(' o a '));
    } else {
      status.appendChild(document.createTextNode('a '));
    }
    var mail = document.createElement('a');
    mail.href = 'mailto:matteo@rmgestioni.it';
    mail.textContent = 'matteo@rmgestioni.it';
    status.appendChild(mail);
    status.appendChild(document.createTextNode('.'));
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (form.elements._honey && form.elements._honey.value) return; // anti-spam: campo trappola compilato

    var payload = { _template: 'table', _captcha: 'false', Tipologia: form.dataset.tipo };
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name || el.name.charAt(0) === '_' || el.type === 'submit') return;
      var label = el.id && form.querySelector('label[for="' + el.id + '"]');
      var key = label ? label.textContent.trim() : el.name;
      if (el.type === 'checkbox') {
        payload['Consenso privacy'] = el.checked ? 'Sì' : 'No';
      } else if (el.value.trim()) {
        payload[key] = el.value.trim();
      }
    });
    var contatto = form.elements.contatto ? form.elements.contatto.value.trim() : '';
    if (contatto.indexOf('@') > 0) payload.email = contatto; // usato come "rispondi a"
    payload._subject = 'Nuova richiesta di valutazione (' + form.dataset.tipo + ') da ' + (form.elements.nome ? form.elements.nome.value.trim() : '');

    button.disabled = true;
    button.textContent = 'Invio in corso…';
    clearStatus();

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok || String(data.success) === 'false') throw new Error(data.message || res.status);
        });
      })
      .then(function () {
        form.classList.add('form-sent');
        status.className = 'form-status';
        status.textContent = 'Grazie, abbiamo ricevuto la tua richiesta. Ti rispondiamo entro 24 ore.';
      })
      .catch(function () {
        button.disabled = false;
        button.textContent = idleLabel;
        showError();
      });
  });
})();
