// app.js

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    });
  }
  
  // Handle the form submission and sync data
  const socket = io();
  
  // Function to update the UI with new requests
  socket.on('newRequest', (newRequest) => {
    const requestDiv = document.createElement('div');
    requestDiv.classList.add('request');
  
    requestDiv.innerHTML = `
      <p><strong>Name:</strong> ${newRequest.name}</p>
      <p><strong>Location:</strong> ${newRequest.location}</p>
      <p><strong>Description:</strong> ${newRequest.description}</p>
      ${newRequest.photo ? `<img src="/uploads/${newRequest.photo}" alt="photo">` : ''}
    `;
  
    document.getElementById('requestsContainer').appendChild(requestDiv);
  });
  
  // Handle form submission with offline support
  document.getElementById('requestForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('location', document.getElementById('location').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('photo', document.getElementById('photo').files[0]);
  
    // Check if online
    if (navigator.onLine) {
      fetch('/submit', {
        method: 'POST',
        body: formData
      })
      .then(response => response.text())
      .then(data => {
        console.log(data);
        alert('Request submitted successfully');
        document.getElementById('requestForm').reset();
      })
      .catch(error => {
        console.error('Error submitting request:', error);
        alert('Failed to submit request');
      });
    } else {
      // Save to IndexedDB for offline syncing
      saveToIndexedDB(formData);
    }
  });
  
  // Function to save form data for offline syncing
  function saveToIndexedDB(formData) {
    const request = indexedDB.open('offlineRequests', 1);
  
    request.onerror = (event) => {
      console.error('Database error:', event.target.error);
    };
  
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['requests'], 'readwrite');
      const objectStore = transaction.objectStore('requests');
  
      const requestData = {
        name: formData.get('name'),
        location: formData.get('location'),
        description: formData.get('description'),
        photo: formData.get('photo') ? formData.get('photo').name : null
      };
  
      objectStore.add(requestData);
      alert('Request saved for offline submission!');
    };
  }
  