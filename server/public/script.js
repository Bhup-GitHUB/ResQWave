// script.js

// Handle form submission on index.html
const form = document.getElementById('aidForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const res = await fetch('/submit', { method: 'POST', body: formData });
      const json = await res.json();
      if (json.success) {
        alert('Aid request submitted successfully!');
        form.reset();
      } else {
        alert('Submission failed: ' + (json.error || 'unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Server error while submitting.');
    }
  });
}

// Populate view.html
const viewContainer = document.getElementById('viewContainer');
if (viewContainer) {
  (async function fetchAndRender() {
    try {
      const res = await fetch('/requests');
      const list = await res.json();
      if (!Array.isArray(list) || list.length === 0) {
        viewContainer.innerHTML = '<p>No aid requests yet.</p>';
        return;
      }
      viewContainer.innerHTML = ''; // clear
      list.forEach(req => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h2>${req.name}</h2>
          <p>${req.description}</p>
          ${req.image_path ? `<img src="/uploads/${req.image_path}" alt="Uploaded Image">` : ''}
          <small>Request #${req.id}</small>
        `;
        viewContainer.appendChild(card);
      });
    } catch (err) {
      console.error(err);
      viewContainer.innerHTML = '<p>Failed to load submissions.</p>';
    }
  })();
}
