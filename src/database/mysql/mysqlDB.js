const mysql = require('mysql');

const connection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD
});
connection.getConnection((err)=>{
    if(err) console.log( err);
    console.log("Conectado a MYSQL")
});
module.exports = connection;