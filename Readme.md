# ResQWave - Disaster Relief Aid Request Platform

ResQWave is a progressive web application designed to help disaster-affected communities submit and track aid requests, even in areas with limited connectivity.

## Overview

ResQWave allows disaster victims to:

- Submit aid requests with descriptions and photos
- View all submitted requests
- Work offline and sync when connectivity is restored

The application is built with progressive enhancement principles to ensure it remains functional in areas with unstable internet connections.

## Features

- **Progressive Web App (PWA)** capabilities for offline use
- **Real-time updates** via Socket.io
- **Offline data storage** using IndexedDB
- **Background sync** when connection is restored
- **Photo upload** capability for better situation assessment
- **Mobile-friendly design**

## Project Structure

```
├── server/
│   ├── public/           # Client-side files
│   │   ├── index.html    # Aid request submission form
│   │   ├── view.html     # View all submitted requests
│   │   ├── script.js     # Client-side JavaScript
│   │   ├── style.css     # Styling
│   │   ├── app.js        # PWA functionality
│   │   └── service-worker.js # Service worker for offline functionality
│   ├── uploads/          # Stored uploaded images
│   ├── database.js       # Database connection setup
│   ├── fluvio.js         # Message broker integration (stub)
│   ├── inspectDb.js      # Database inspection utility
│   └── server.js         # Main Express server
├── relief.db             # SQLite database file
└── README.md             # This file
```

## Technical Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: SQLite
- **File Uploads**: Multer
- **Offline Support**: Service Workers, IndexedDB
- **Real-time Updates**: Socket.io
- **Message Broker**: Fluvio (currently stubbed)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/Bhup-GitHUB/ResQWave
   cd resqwave
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create uploads directory:

   ```
   mkdir uploads
   ```

4. Start the server:

   ```
   node server/server.js
   ```

5. Access the application at http://localhost:3000

## Database Schema

The application uses a SQLite database with the following schema:

### aid_requests table

- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `name`: TEXT
- `description`: TEXT
- `image_path`: TEXT

## Usage

### Submitting an Aid Request

1. Visit the homepage
2. Fill out the request form with your name and description
3. Optionally upload a photo
4. Submit the form

### Viewing Aid Requests

1. Click the "View All Submissions" link from the homepage
2. Browse through all submitted requests

### Offline Usage

The application works offline:

1. Once you've visited the site while online, it will be cached
2. You can submit forms even without an internet connection
3. When connectivity is restored, the service worker will sync your data

## Development

### Inspecting the Database

Use the included database inspection tool:

```
node server/inspectDb.js
```

### Adding Message Broker Support

The application includes a stub for Fluvio integration. To implement a real message broker:

1. Update the `fluvio.js` file with actual implementation
2. Uncomment the relevant code in `server.js`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
