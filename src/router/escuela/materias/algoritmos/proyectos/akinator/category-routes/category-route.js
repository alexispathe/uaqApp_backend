const express = require('express');
const router = express.Router();
const {save} = require(process.env.ROUTE_AKINATOR_CONTROLLER+'/categories-controller/categoryController');
const {created,deleted,errorServer,notFound,success,updated} = require('../../../../../../../response/res');
router.post('/save-category', async(req, res)=>{
    try{
        const category = await save(req.body);
        return created(req, res, category);
    }catch(err){
        return errorServer(req, res)
    }
})

module.exports = router;