const express = require('express');
const router = express.Router();
const { created, deleted, errorServer, notFound, success, updated, badRequest, unauthorized } = require('../../../response/res');
const {getUsers, getUser, getUserAndUserInformation,getProfilePicture,getImage,getUserID } = require('../user_controllers/get_controller/get_user_controller');
const {login,register} = require('../user_controllers/post_controller/post_user_controller');
const {updateUserInformation} =require('../user_controllers/put_controller/put_user_controller');
const {dbConfig,mysqlConnect} = require('../../../database/mysql/mysqlDB');
const { auth } = require('../../../auth/authentication');

// METODOS POST
router.post('/register-user', (req, res) => {
    register(dbConfig, req.body, result => {
        // SI el correo ya existe pasara por esta condicion
        if(result.code === "ER_DUP_ENTRY")res.json(result);
        // Si se guardo con exito entonces se ejecuta esta condicion
        if(result.rowsAffected[0] === 1)  res.json(result)
        
    });
});

router.post('/login-user', (req, res) => {
    login(dbConfig, req.body, result => {
        // console.log("Resultado Login ",result)
        console.log(result)
        res.json(result); //Cuando todo es valido
    })
})
router.put('/update-information', auth, (req, res) => {
    try {
        updateUserInformation(dbConfig, req.body, req.token, result => {
            if (result.rowsAffected && result.rowsAffected[0] === 1) res.json(result); // si los datos son correctos
            else if(result.code === 401){
                res.json(result)
            }

        });
    } catch (err) {
        console.log(err)
    }
})



// METODOS GET
router.get('/get-users', (req, res) => {
    getUsers(mysqlConnect, result => {
        console.log(result)
        res.json(result);
    })
});
router.get('/get-user', auth, (req, res) => {
    try {
        getUser(dbConfig, req.token, result => {
            res.json(result);
        })
    } catch (err) {
        console.log(err)
    }
})
router.get('/get-user-information', auth, (req, res) => {
    try {
        getUserAndUserInformation(dbConfig, req.token, result => {
                res.json(result)
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
router.get('/get-image/:id',async(req, res)=>{
    try{
        const image = await getImage(req, res);
    }catch(err){
        console.log(err)
    }
})
router.get('/get-user-id', auth,async(req, res)=>{
    getUserID(mysqlConnect, req.token,result=>{
        res.json(result);
    })
})

module.exports = router;