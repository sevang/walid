document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'https://api.klickrhein.de/v6/cms/events/1546?startsAfter=May+15+2025';
  const apiKey = '8526e6e1864c69674f8acb701dee2296';

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
