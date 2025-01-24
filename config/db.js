const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',    
    password: 'oasys',    
    database: 'nursing_db',
    waitForConnections: true,
    connectionLimit: 10, // Number of connections in the pool
    queueLimit: 0,
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

module.exports = connection;
