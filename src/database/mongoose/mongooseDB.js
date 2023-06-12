const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const uri = process.env.URI;
mongoose.set('strictQuery',false);
mongoose.connect(uri)
.then(()=>console.log("Se conecto a mongodb"))
.catch(err=> console.log(err));

module.exports = mongoose;


