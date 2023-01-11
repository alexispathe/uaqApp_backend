const express = require('express');
const router = express.Router();
const {created,deleted,errorServer,notFound,success,updated,unauthorized,badRequest} = require('../../../../../../../../response/res');
const {save} = require('../../controllers/category_characteristics_c/categoryCharacteristicsController');
const {auth} = require('../../../../../../../../auth/authentication');
router.post('/save-category-characteristics',auth, async(req, res)=>{
  try{
      if(req.token){
        const categoryCharacteristics = await save(req.body,req.token);
        categoryCharacteristics.status === 200 ? created(req, res): unauthorized(req, res);
      }else{
        unauthorized(req, res);
      }
        
  } catch(err){
    return errorServer(req, res);
  } 
})
module.exports = router;