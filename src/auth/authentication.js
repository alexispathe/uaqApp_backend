const auth =(req, res, next)=>{
    const headers = req.headers['authorization'];
    if(headers.length>1){
        const headerToken = headers.replace(/"/g,'');
        // console.log(headerToken)
        req.token = headerToken;
        next()

    }else{
        return "Token no valido!!"
    }
};
module.exports = {auth};