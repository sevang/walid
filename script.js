document.addEventListener('DOMContentLoaded', () => {
  const getYesterdayDateString = () => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return today.toISOString().split('T')[0];
  };

  const isToday = (date) => {
    const d = new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  };

  const apiUrl = `https://api.klickrhein.de/v6/cms/events/1546?startsAfter=${getYesterdayDateString()}`;
  const apiKey = '8526e6e1864c69674f8acb701dee2296';

  fetch(apiUrl, {
    headers: { 'api-key': apiKey },
  })
    .then(response => response.json())
    .then(data => {
      const gerichteContainer = document.getElementById('gerichte');
      gerichteContainer.innerHTML = '';

      if (!data.events || data.events.length === 0) {
        gerichteContainer.innerHTML = '<p>Keine Gerichte gefunden.</p>';
        return;
      }

      const guteGerichte = ['schnitzel tiroler', 'gr. frikadelle tiroler'];
      const mittlereGerichte = ['vegetarischer burger', 'kl. frikadelle tiroler', 'cordon bleu'];


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
      
        const lowerTitle = titel.toLowerCase();
        if (guteGerichte.some(g => lowerTitle.includes(g))) {
          gerichtElement.classList.add('bewertung-gruen');
        } else if (mittlereGerichte.some(m => lowerTitle.includes(m))) {
          gerichtElement.classList.add('bewertung-orange');
        } else {
          gerichtElement.classList.add('bewertung-rot');
        }
      
        if (isToday(startDate)) {
          gerichtElement.classList.add('heute');
        }
      
        gerichtElement.innerHTML = `
          <div class="gericht-datum">${formattedDate}</div>
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


