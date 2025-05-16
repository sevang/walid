document.addEventListener('DOMContentLoaded', () => {
  // Bewertungs-Keywords
  const guteGerichte = ['schnitzel "tiroler art"', 'gr. frikadelle "tiroler art"', 'hähnchen burger', 'jumbo'];
  const mittlereGerichte = ['vegetarischer burger', 'fleischkäse "tiroler art"', 'kl. frikadelle "tiroler art"', 'cordon bleu'];

  // Gestern als ISO-Date für API-Parameter
  const getYesterdayDateString = () => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  };

  // Vergleich: Ist das Datum heute?
  const isToday = (date) => {
    const d = new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  };

  // Vergleich: Ist das Datum morgen?
  const isTomorrow = (date) => {
    const d = new Date(date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Morgen berechnen
    return d.toDateString() === tomorrow.toDateString();
  };

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

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedStart = startDate.toLocaleDateString('de-DE', options);
        let formattedDate = formattedStart;

        if (endDate && startDate.toDateString() !== endDate.toDateString()) {
          const formattedEnd = endDate.toLocaleDateString('de-DE', options);
          formattedDate = `${formattedStart} – ${formattedEnd}`;
        }

        // Bewertung zuerst (Farben)
        const lowerTitle = titel.toLowerCase();
        if (guteGerichte.some(g => lowerTitle.includes(g))) {
          gerichtElement.classList.add('bewertung-gruen');
        } else if (mittlereGerichte.some(m => lowerTitle.includes(m))) {
          gerichtElement.classList.add('bewertung-orange');
        } else {
          gerichtElement.classList.add('bewertung-rot');
        }

        // Heutiger Tag oder Morgen — separater Stil
        const heuteIst = isToday(startDate);
        const morgenIst = isTomorrow(startDate);
        
        if (heuteIst) {
          gerichtElement.classList.add('heute');
        } else if (morgenIst) {
          gerichtElement.classList.add('morgen');
        }

        // Inhalt rendern
        gerichtElement.innerHTML = `
          ${heuteIst ? '<div class="badge-heute">Heute</div>' : ''}
          ${morgenIst ? '<div class="badge-morgen">Morgen</div>' : ''}
          <div class="gericht-datum">${heuteIst || morgenIst ? '' : `📆 ${formattedDate}`}</div>
          <h3 class="gericht-titel">${titel}</h3>
        `;

        gerichteContainer.appendChild(gerichtElement);
      });
    })
    .catch(error => {
      console.error('Fehler beim Abrufen der Daten:', error);
      document.getElementById('gerichte').innerHTML = '<p>Fehler beim Laden der Daten.</p>';
    });
});
