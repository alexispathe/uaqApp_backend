const express = require('express');
const router = express.Router();
const {save} = require('../'+process.env.ROUTE_AKINATOR_CONTROLLER+'/categories-controller/subCategories-controller/subCategoryController');
const {created,deleted,errorServer,notFound,success,updated} =require('../../../../../../../../response/res');
router.post('/save-sub-category', async(req, res)=>{
    try{    
        const subCategory = await save(req.body);
        subCategory ? created(req, res, subCategory): errorServer(req, res);
    }catch(err){
        return errorServer(req, res)
    }
})
module.exports = router;