const express = require('express');
const router = express.Router();
const {created, success, errorServer, notFound, updated} = require('../../response/res'); 
const {saveHobbies,getHobbies, updateHobbies,searchHobbie} = require('../../controllers/hobbies-controller/hobbiesController');
router.post('/save-hobbies',async(req, res)=>{
    try{
        const hobbies = await saveHobbies(req.body);
        hobbies ? created(req, res, hobbies): errorServer(req, res);
    }catch(err){
        return errorServer(req, res);
    }
});

router.get('/hobbies', async(req, res)=>{
    try{
        const hobbies = await getHobbies();
        hobbies ? success(req, res, hobbies): notFound(req, res);
    }catch(err){
        return errorServer(req, res);
    }
});
router.put('/actualizar-hobbies/:id', async(req, res)=>{
    try{
        const hobbies = await updateHobbies(req.params.id,req.body);
        hobbies ? updated(req, res, hobbies): notFound(req, res);
    }catch(err){
        return errorServer(req, res);
    }
});

router.get('/search/:id', async(req, res)=>{
    const search = await searchHobbie(req.params.id);
    search? success(req, res, search): errorServer(req, res);
})
module.exports = router;