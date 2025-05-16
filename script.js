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
      gerichteContainer.innerHTML = ''; // Leeren Inhalt

      data.events.forEach(event => {
        const gerichtElement = document.createElement('div');
        gerichtElement.classList.add('gericht');

        const titel = event.title || 'Kein Titel verfügbar';
        const datum = event.date || 'Kein Datum verfügbar';
        const beschreibung = event.description || 'Keine Beschreibung verfügbar';

        gerichtElement.innerHTML = `
          <h3>${titel}</h3>
          <p><strong>Datum:</strong> ${datum}</p>
          <p><strong>Beschreibung:</strong> ${beschreibung}</p>
        `;

        gerichteContainer.appendChild(gerichtElement);
      });
    })
    .catch(error => {
      console.error('Fehler beim Abrufen der Daten:', error);
      document.getElementById('gerichte').innerHTML = '<p>Fehler beim Laden der Daten. Bitte versuche es später erneut.</p>';
    });
});
