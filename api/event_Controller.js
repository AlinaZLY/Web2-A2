const { executeQuery } = require('./event_db');

//Distinguish the activities on the homepage into upcoming and ended ones
exports.getHomeEvents = (req, res) => {
  const sql = `
    SELECT e.*, o.org_name, c.category_name 
    FROM charity_events e
    JOIN charity_organizations o ON e.org_id = o.org_id
    JOIN event_categories c ON e.category_id = c.category_id
    WHERE e.is_active = 1
    ORDER BY e.event_date ASC
  `;

  executeQuery(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to get the event. Please try again later.' });
    }

    //Distinguish active status by the current time
    const now = new Date();
    const upcomingEvents = results.filter(event => new Date(event.event_date) >= now);
    const pastEvents = results.filter(event => new Date(event.event_date) < now);

    res.json({ upcomingEvents, pastEvents });
  });
};

//Search for activities by date, location, and category
exports.searchEvents = (req, res) => {
  const { eventMonth, location, category_id } = req.query;
  let sql = `
    SELECT e.*, o.org_name, c.category_name 
    FROM charity_events e
    JOIN charity_organizations o ON e.org_id = o.org_id
    JOIN event_categories c ON e.category_id = c.category_id
    WHERE e.is_active = 1
  `;
  const params = [];

  if (eventMonth) {
    const [year, month] = eventMonth.split('-');
    sql += ' AND YEAR(e.event_date) = ? AND MONTH(e.event_date) = ?';
    params.push(year, month);
  }
  if (location) {
    sql += ' AND e.location LIKE CONCAT("%", ?, "%")';
    params.push(location);
  }
  if (category_id) {
    sql += ' AND e.category_id = ?';
    params.push(category_id);
  }

  executeQuery(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'The search event failed. Please try again later.' });
    }
    res.json(results);
  });
};

//Get all categories
exports.getCategories = (req, res) => {
  const sql = 'SELECT category_id, category_name FROM event_categories ORDER BY category_name';
  executeQuery(sql, (err, results) => {
    if (err) {
      console.error('Categories query error:', err);
      return res.status(500).json({ error: 'Failed to load categories' });
    }
    console.log('Result:', results);
    res.json(results);
  });
};

//Query event details by ID
exports.getEventDetail = (req, res) => {
  const { event_id } = req.params;
  const sql = `
    SELECT e.*, o.org_name, o.contact_email, o.website, c.category_name 
    FROM charity_events e
    JOIN charity_organizations o ON e.org_id = o.org_id
    JOIN event_categories c ON e.category_id = c.category_id
    WHERE e.event_id = ? AND e.is_active = 1
  `;

  executeQuery(sql, [event_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to get event details' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'The event does not exist or has been removed from the shelves.' });
    }
    res.json(results[0]);
  });
};