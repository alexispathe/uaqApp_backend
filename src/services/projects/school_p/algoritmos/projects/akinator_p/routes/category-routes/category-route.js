const express = require('express');
const router = express.Router();
const {save,getCategories} = require('../../controllers/categories_c/categoryController');
const {created,deleted,errorServer,notFound,success,updated,badRequest,unauthorized} = require('../../../../../../../../response/res');
 const {auth} = require('../../../../../../../../auth/authentication');
router.post('/save-category', auth, async(req, res)=>{
    try{
        const category = await save(req.body, req.token);
        // console.log(category)
        category.status === 200?  created(req, res,category):unauthorized(req, res);
    }catch(err){
        return errorServer(req, res)
    }
})
router.get('/get-categories', async(req, res)=>{
    try{
        const categories = await getCategories();
        categories.length >=1 ? success(req, res, categories): notFound(req, res);
    }catch(err){
        return errorServer(req, res)
    }
});
module.exports = router;