const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

//Mount the route
const eventRoutes = require('./events_api');
const orgRoutes = require('./orgs_api');
app.use('/api/events', eventRoutes);
app.use('/api/organizations', orgRoutes);

//Root route and 404
app.get('/', (req, res) => {
  res.send('Charity Events API Service is running');
});
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'The requested interface does not exist', path: req.originalUrl });
});

//Error handling
app.use((err, req, res, next) => {
  console.error('error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

//Start the service
app.listen(PORT, () => {
  console.log(`The service has started.: http://localhost:${PORT}`);
  console.log('Available interfaces:');
  console.log('- GET /api/events/home');
  console.log('- GET /api/events/search');
  console.log('- GET /api/events/categories');
  console.log('- GET /api/events/:event_id');
  console.log('- GET /api/organizations');
  console.log('- GET /api/organizations/:org_id/events');
});