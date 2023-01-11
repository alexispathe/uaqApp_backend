const express = require('express');
const router = express.Router();
const {created,deleted,errorServer,notFound,success,updated, unauthorized} =require('../../../../../../../../../response/res');
const {auth} = require('../../../../../../../../../auth/authentication');
const {save, getSubCategories} = require('../../../controllers/categories_c/subCategories/subCategory');
router.post('/save-sub-category',auth, async(req, res)=>{
    try{    
        if(req.token){
            const subCategory = await save(req.body, req.token);
            subCategory.status === 200 ? created(req, res): unauthorized(req, res);
        }else{
            return unauthorized(req, res);
        }
      
    }catch(err){
        return errorServer(req, res)
    }
});
router.get('/get-sub-categories/:id', async(req, res)=>{
    try{
        const subCategories = await getSubCategories(req.params.id);
        subCategories.length >= 1 ?success(req, res, subCategories): notFound(req, res);
    }catch(err){
        return errorServer(req, res);
    }
})

module.exports = router;

