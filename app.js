const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 4011;
const app = express();
const cors = require('cors');
const path =require('path');
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// rutas
const hobbieRoutes = require(process.env.ROUTES_AKINATOR+'/hobbies-routes/hobbieRoute');
const characterRoutes = require(process.env.ROUTES_AKINATOR+'/character-routes/characterRoute');
const categoryRoutes = require(process.env.ROUTES_AKINATOR+'/category-routes/category-route');
const subCategoryRoutes = require(process.env.ROUTES_AKINATOR+'/category-routes/subCategory-routes/subCategory-route');
const categoryCharacteristicsRoutes = require(process.env.ROUTES_AKINATOR+'/category-characteristics-routes/categoryCharacteristicsRoute');

app.use(cors());

app.listen(port,()=>{
    console.log(`Servidor conectado correctamente en el pureto ${port}`)
});
app.use('/', express.static('public',{redirect:false}));
app.use('/api', hobbieRoutes);
app.use('/api', characterRoutes);
app.use('/api',categoryRoutes);
app.use('/api', subCategoryRoutes);
app.use('/api', categoryCharacteristicsRoutes)
app.get('*',(req, res)=>{
    res.sendFile(path.resolve('public/index.html'))
})
module.exports ={app};