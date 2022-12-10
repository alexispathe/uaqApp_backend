const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 4011;
const app = express();
const cors = require('cors');
const path =require('path');
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// rutas
const hobbieRoutes = require('./src/router/escuela/materias/algoritmos/proyectos/akinator/hobbies-routes/hobbieRoute');
const characterRoutes = require('./src/router/escuela/materias/algoritmos/proyectos/akinator/character-routes/characterRoute');

app.use(cors());

app.listen(port,()=>{
    console.log(`Servidor conectado correctamente en el pureto ${port}`)
});
app.use('/', express.static('public',{redirect:false}));
app.use('/api', hobbieRoutes);
app.use('/api', characterRoutes);
app.get('*',(req, res)=>{
    res.sendFile(path.resolve('public/index.html'))
})
module.exports ={app};