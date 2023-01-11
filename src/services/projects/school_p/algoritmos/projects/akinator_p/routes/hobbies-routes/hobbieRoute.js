const express = require('express');
const router = express.Router();
const { created, success, errorServer, notFound, updated,unauthorized } = require('../../../../../../../../response/res');
const { saveHobbies, getHobbies, updateHobbies, searchHobbie, getCategoryHobbies } = require('../../controllers/hobbies_c/hobbiesController');
const { auth } = require('../../../../../../../../auth/authentication');
router.post('/save-hobbies', auth, async (req, res) => {
    try {
        if (req.token) {
            const hobbies = await saveHobbies(req.body, req.token);
            hobbies.status ===200 ? created(req, res) : unauthorized(req, res);
        }else{
            unauthorized(req, res);
        }

    } catch (err) {
        return errorServer(req, res);
    }
});

router.get('/hobbies', async (req, res) => {
    try {
        const hobbies = await getHobbies();
        hobbies ? success(req, res, hobbies) : notFound(req, res);
    } catch (err) {
        return errorServer(req, res);
    }
});
router.get('/get-category-hobbies/:id', async (req, res) => {
    try {
        const hobbies = await getCategoryHobbies(req.params.id);
        hobbies.length >= 1 ? success(req, res, hobbies) : notFound(req, res);
    } catch (err) {
        return errorServer(req, res);
    }
});
router.put('/actualizar-hobbies/:id', async (req, res) => {
    try {
        const hobbies = await updateHobbies(req.params.id, req.body);
        hobbies ? updated(req, res, hobbies) : notFound(req, res);
    } catch (err) {
        return errorServer(req, res);
    }
});

router.get('/search/:id', async (req, res) => {
    const search = await searchHobbie(req.params.id);
    search ? success(req, res, search) : errorServer(req, res);
})
module.exports = router;