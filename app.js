const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 4011;
const app = express();
const cors = require('cors');
const path =require('path');
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors({origin: true, credentials: true}));

const userRoutes = require('./src/services/user_configuration/user_router/user-routes');
app.listen(port,()=>{
    console.log(`Servidor conectado correctamente en el pureto  ${port}`)
});
app.use('/api', userRoutes);

module.exports ={app};