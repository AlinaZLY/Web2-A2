const mysql = require('mysql2');

const DB_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '09090106y',
  database: 'charityevents_db',
};

const pool = mysql.createPool(DB_CONFIG);

console.log('Start testing the database connection pool');

pool.getConnection((err, connection) => {
  console.log('The connection pool callback has been triggered');
  if (err) {
    const errorMap = {
      'ER_ACCESS_DENIED_ERROR': 'Incorrect username/password',
      'ER_BAD_DB_ERROR': 'The database does not exist',
      'ECONNREFUSED': 'MySQL service is not started or there is a port error',
      'ETIMEDOUT': 'Connection timed out (check the network or MySQL service)'
    };
    const errorMsg = errorMap[err.code] || `Unknown error（${err.code}）`;
    console.error(`Connection failed:${errorMsg}\nDetailed information:${err.message}`);
    return; 
  }

  console.log('Connection successful, starting test query');
  connection.query('SELECT 1 + 1 AS result', (queryErr, results) => {
    connection.release();
    console.log('The connection has been released back to the connection pool.');
    if (queryErr) {
      console.error(`Test query failed：${queryErr.message}`);
      return;
    }
    if (results[0].result === 2) {
      console.log('The database connection pool has been initialized successfully! The test result is correct (1+1=2)');
    } else {
      console.warn('Test result is abnormal:', results[0].result);
    }
  });
});

const executeQuery = (sql, params, callback) => {
  if (typeof params === 'function') {
    callback = params;
    params = [];
  }

  pool.query(sql, params, (err, results) => {
    if (err) {
      console.error(`SQL execution failed: ${err.message}\nSQL: ${sql}\nParameter: `, params);
      callback(err, null);
      return;
    }
    callback(null, results);
  });
};

module.exports = {
  pool,
  executeQuery
};