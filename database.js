const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'heelercrap',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

async function result(query, parameters) {

    const result = await pool.query(query, [parameters])
    return result[0]
}

module.exports = {result};