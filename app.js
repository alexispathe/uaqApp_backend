const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 4011;
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(express.urlencoded({extended:true}))
// rutas
const hobbieRoutes = require('./src/router/hobbies-routes/hobbieRoute');
const characterRoutes = require('./src/router/character-routes/characterRoute');

app.use(cors());

app.listen(port,()=>{
    console.log(`Servidor conectado correctamente en el pureto ${port}`)
});
app.use('/api', hobbieRoutes);
app.use('/api', characterRoutes);
module.exports ={app};