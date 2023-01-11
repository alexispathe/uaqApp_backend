const express = require('express');
const router = express.Router();
const { created, success, errorServer, notFound, updated ,unauthorized,} = require('../../../../../../../../response/res');
const { getCharacters, saveCharacters, updateCharacters } = require('../../controllers/characters_c/characterController');
const { updateHobbiesCharacter } = require('../../controllers/hobbies_c/hobbiesController');
const {auth} = require('../../../../../../../../auth/authentication');
router.post('/save-personaje',auth, async (req, res) => {
    try {
        if(req.token){
            const character = await saveCharacters(req.body, req.token);
            if (character[1].status === 200) {
                const update = await updateHobbiesCharacter(character[0],req.token);
                // console.log(update)
                update.status === 201 ? created(req, res) : unauthorized(req, res);
    
            }else{
                unauthorized(req, res)
            }
        }else{
            unauthorized(req, res);
        }   
       

    } catch (err) {
        return errorServer(req, res);
    }
});

router.get('/personajes', async (req, res) => {
    try {
        const character = await getCharacters();
        character ? success(req, res, character) : notFound(req, res);
    } catch (err) {
        return errorServer(req, res);
    }
});
router.put('/actualizar-personaje/:id', async (req, res) => {
    try {
        const character = await updateCharacters(req.params.id, req.body);
        character ? updated(req, res, character) : notFound(req, res);
    } catch (err) {
        return errorServer(req, res);
    }
});

module.exports = router;