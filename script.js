document.addEventListener('DOMContentLoaded', () => {
  // Bewertungs-Keywords
  const guteGerichte = ['schnitzel "tiroler art"', 'gr. frikadelle "tiroler art"', 'hähnchen burger', 'jumbo'];
  const mittlereGerichte = ['vegetarischer burger', 'fleischkäse "tiroler art"', 'kl. frikadelle "tiroler art"', 'cordon bleu'];

  // API-URL dynamisch
  const apiUrl = `https://api.klickrhein.de/v6/cms/events/1546?startsAfter=${getYesterdayDateString()}`;
  const apiKey = '8526e6e1864c69674f8acb701dee2296';

  // Daten abrufen
  fetch(apiUrl, {
    headers: {
      'api-key': apiKey,
    },
  })
    .then(response => response.json())
    .then(data => {
      const gerichteContainer = document.getElementById('gerichte');
      gerichteContainer.innerHTML = '';

      if (!data.events || data.events.length === 0) {
        gerichteContainer.innerHTML = '<p>Keine Gerichte gefunden.</p>';
        return;
      }

      data.events.forEach(event => {
        const gerichtElement = document.createElement('div');
        gerichtElement.classList.add('gericht');

        const titel = event.title || 'Kein Titel';
        const startDate = new Date(event.starts);
        const endDate = event.ends ? new Date(event.ends) : null;

        // Heute und Morgen
        const heuteIst = isToday(startDate);
        const morgenIst = isTomorrow(startDate);

        // Bewertung zuerst (Farben)
        const lowerTitle = titel.toLowerCase();
        if (guteGerichte.some(g => lowerTitle.includes(g))) {
          gerichtElement.classList.add('bewertung-gruen');
        } else if (mittlereGerichte.some(m => lowerTitle.includes(m))) {
          gerichtElement.classList.add('bewertung-orange');
        } else {
          gerichtElement.classList.add('bewertung-rot');
        }

        // Heute und morgen visuell hervorheben
        if (heuteIst) {
          gerichtElement.classList.add('gericht-heute');
        }

        // Inhalt rendern: Nur „Heute“ und „Morgen“ ohne Datum
        gerichtElement.innerHTML = `
          ${heuteIst ? '<div class="badge-heute">📅 Heute</div>' : ''}
          ${morgenIst ? '<div class="badge-morgen">📅 Morgen</div>' : ''}
          ${!heuteIst && !morgenIst ? `<div class="gericht-datum">${formattedDate}</div>` : ''}
          <h3 class="gericht-titel">${titel}</h3>
        `;

        gerichteContainer.appendChild(gerichtElement);
      });
    })
    .catch(error => {
      console.error('Fehler beim Abrufen der Daten:', error);
      document.getElementById('gerichte').innerHTML = '<p>Fehler beim Laden der Daten.</p>';
    });

  // Hilfsfunktionen für "Heute" und "Morgen"
  function isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  function isTomorrow(date) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  }

  function getYesterdayDateString() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];  // Format: YYYY-MM-DD
  }
});
