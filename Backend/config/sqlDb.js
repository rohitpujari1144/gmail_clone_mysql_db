const mysql = require('mysql2/promise')
const sqlPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'user@123',
    database: 'users_database'
})

module.exports = sqlPool