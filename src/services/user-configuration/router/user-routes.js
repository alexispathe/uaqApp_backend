const express = require('express');
const router = express.Router();
const { created, deleted, errorServer, notFound, success, updated, badRequest, unauthorized } = require('../../../response/res');
const { register, getUsers, getUser, getUserAndUserInformation, login, updateUserInformation,getProfilePicture } = require('../controllers/user-controller');
const mysqlConnect = require('../../../database/mysql/mysqlDB');
const { auth } = require('../../../auth/authentication');
// METODOS GET
router.get('/get-users', (req, res) => {
    getUsers(mysqlConnect, result => {
        res.json(result);
    })
});
router.get('/get-user', auth, (req, res) => {
    try {
        getUser(mysqlConnect, req.token, result => {
            res.json(result);
        })
    } catch (err) {
        console.log(err)
    }
})
router.get('/get-user-information', auth, (req, res) => {
    try {
        getUserAndUserInformation(mysqlConnect, req.token, result => {
            if (result.code === 401) {
                res.json(result)
            } else {
                // console.log(result)
                res.json(result);

            }
        })
    } catch (err) {
        console.log(err)
    }
})
router.get('/get-profile-picture', auth,(req, res)=>{
    getProfilePicture(mysqlConnect, req.token, result=>{
        res.json(result);
    })
});
// METODOS POST
router.post('/register-user', (req, res) => {
    register(mysqlConnect, req.body, result => {
        // SI el correo ya existe pasara por esta condicion
        // console.log(result)
        if(result.code === "ER_DUP_ENTRY") res.json(result);
        // Si se guardo con exito entonces se ejecuta esta condicion
        if(result.affectedRows === 1) res.json();
        
    });
});

router.post('/login-user', (req, res) => {
    login(mysqlConnect, req.body, result => {
        // console.log(result)
        if(result.status === 404) res.json(result); //Cuando el correo o contraseña es incorrecta
        if(result.status !== 404) res.json(result); //Cuando todo es valido
    })
})
router.put('/update-information', auth, (req, res) => {
    try {
        updateUserInformation(mysqlConnect, req.body, req.token, result => {
            if (result.err === "ER_DUP_ENTRY") res.json(result);
            else if(result.code === 401){
                res.json(result)
            }else{
                res.json()

            }

        });
    } catch (err) {
        console.log(err)
    }
})


module.exports = router;