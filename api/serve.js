const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Mount the route
const eventRoutes = require('./events_api');
const orgRoutes = require('./orgs_api');
app.use('/api/events', eventRoutes);
app.use('/api/organizations', orgRoutes);

//Start the service
app.listen(PORT, () => {
  console.log(`The API server has been started, Address:http://localhost:${PORT}`);
});