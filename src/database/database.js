const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const uri = process.env.URILOCAL;
mongoose.connect(uri)
.then(()=>console.log("Se conecto a la base de datos"))
.catch(err=> console.log(err));

module.exports = mongoose;


