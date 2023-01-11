const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 4011;
const app = express();
const cors = require('cors');
const path =require('path');
app.use(express.json());
app.use(express.urlencoded({extended:true}))


const hobbieRoutes = require(   './src/services/projects/school_p/algoritmos/projects/akinator_p/routes/hobbies-routes/hobbieRoute');
const characterRoutes = require('./src/services/projects/school_p/algoritmos/projects/akinator_p/routes/character-routes/characterRoute');
const categoryRoutes = require('./src/services/projects/school_p/algoritmos/projects/akinator_p/routes/category-routes/category-route');
const subCategoryRoutes = require('./src/services/projects/school_p/algoritmos/projects/akinator_p/routes/category-routes/subCategory-routes/subCategory-route');
const categoryCharacteristicsRoutes = require('./src/services/projects/school_p/algoritmos/projects/akinator_p/routes/category_characteristics_routes/categoryCharacteristicsRoute');
const userRoutes = require('./src/services/user_configuration/user_router/user-routes');
const uploadImage = require('./src/services/user_configuration/user_router/upload_image_route');
app.use(cors());
app.listen(port,()=>{
    console.log(`Servidor conectado correctamente en el pureto  ${port}`)
});
app.use('/', express.static('public',{redirect:false}));
app.use('/api', hobbieRoutes);
app.use('/api', characterRoutes);
app.use('/api',categoryRoutes);
app.use('/api', subCategoryRoutes);
app.use('/api', categoryCharacteristicsRoutes);
app.use('/api', userRoutes);
app.use(express.static(path.join(__dirname, './src/services/user_configuration/configure_images/upload/image.jpg')));
app.use('/api', uploadImage)
app.get('*',(req, res)=>{
    res.sendFile(path.resolve('public/index.html'))
})

module.exports ={app};