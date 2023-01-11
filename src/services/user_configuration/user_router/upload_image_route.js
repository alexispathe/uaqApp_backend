'use strict';

const router = require('express').Router();
const storage = require('../configure_images/multer');
const multer = require('multer');
const {uploadImage}  = require('../user_controllers/post_controller/image_controller');
const  mysqlConnect = require( '../../../database/mysql/mysqlDB');
const {auth} = require('../../../auth/authentication');

const uploader = multer({storage});

router.post('/upload-profile-picture', auth, uploader.single('file'), (req, res)=>{
    try{
       
        //   AQUI LLAMAMOS AL CONTROLADOR PARA GUARDAR EL NOMBRE DE LA IMAGEN AL REGISTRO DEL USUARIO
            uploadImage(mysqlConnect,req,result=>{
                res.json(result);
            })
        
    }catch(err){
        console.log(err)
    }
    
});

module.exports = router;