const express = require('express');
const router = express.Router();
const {created,deleted,errorServer,notFound,success,updated} = require('../../../../../../../response/res');
const {save} = require(process.env.ROUTE_AKINATOR_CONTROLLER+'/category-characteristics-controller/categoryCharacteristicsController');
router.post('/save-category-characteristics', async(req, res)=>{
  try{
        const categoryCharacteristics = await save(req.body);
        categoryCharacteristics ? created(req, res,categoryCharacteristics): notFound(req, res);
  } catch(err){
    return errorServer(req, res);
  } 
})
module.exports = router;