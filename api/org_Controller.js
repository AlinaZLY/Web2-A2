const { executeQuery } = require('./event_db');

//Get all organizations
exports.getAllOrganizations = (req, res) => {
  const sql = 'SELECT * FROM charity_organizations ORDER BY org_name ASC';
  executeQuery(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: '获取机构列表失败' });
    }
    res.json(results);
  });
};

//Get all events of an organization
exports.getEventsByOrg = (req, res) => {
  const { org_id } = req.params;
  const sql = `
    SELECT e.*, c.category_name 
    FROM charity_events e
    JOIN event_categories c ON e.category_id = c.category_id
    WHERE e.org_id = ? AND e.is_active = 1
    ORDER BY e.event_date ASC
  `;

  executeQuery(sql, [org_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: '获取机构活动失败' });
    }
    res.json(results);
  });
};