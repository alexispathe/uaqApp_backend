const express = require('express');
const router = express.Router();
const {created,deleted,errorServer,notFound,success,updated} = require('../../../response/res');
const {register,getUsers, getUser,login} = require('../controllers/user-controller');
const mysqlConnect = require('../../../database/mysql/mysqlDB');
const {auth} = require('../../../auth/authentication');
router.post('/register-user', (req, res)=>{
    register(mysqlConnect, req.body, result=>{
      res.json();
    });
});
router.get('/get-users',(req, res)=>{
    getUsers(mysqlConnect, result=>{
        res.json(result);
    })
});
router.get('/get-user',auth,(req, res)=>{
    try{
        getUser(mysqlConnect, req.token, result=>{
            res.json(result);
        })
    }catch(err){
        console.log(err)
    }
})
router.post('/login-user', (req, res)=>{
    login(mysqlConnect,req.body,result=>{
        res.json(result);
    })
})


module.exports = router;