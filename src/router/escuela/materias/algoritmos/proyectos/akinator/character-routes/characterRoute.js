const express = require('express');
const router = express.Router();
const { created, success, errorServer, notFound, updated } = require('../../../../../../../response/res');
const { getCharacters, saveCharacters, updateCharacters } = require(process.env.ROUTE_AKINATOR_CONTROLLER+'/characters-controller/characterController');
const { updateHobbiesCharacter } = require(process.env.ROUTE_AKINATOR_CONTROLLER+'/hobbies-controller/hobbiesController');
router.post('/save-personaje', async (req, res) => {
    try {
        const character = await saveCharacters(req.body);
        if (character) {
            const update = await updateHobbiesCharacter(character);
            update ? created(req, res, character) : errorServer(req, res);

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