const mysql = require('mysql2')
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // MySQL password,
        password: '102396Mustang$',
        database: 'election'
    },
    console.log('Connected to the election database.')
)

module.exports = db