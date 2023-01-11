const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const uploadImage = async (mysqlConnect, req, pool) => {
    try {
        const verify = await jwt.verify(req.token, 'secretkey');
        // Validamos que la verificacion del token sea exitosa
        if (verify) {
            const payload = await jwt.decode(req.token);
            // Validamos que se haya decodificado el token
            if (payload) {
                // Validamos que exista informacion en el req.file, que la imagen pese maximo 1 MB y sea de formato png, jpg o jpeg
                if ((req.file) && (req.file.size <= 1000000) &&(req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpg' || req.file.mimetype === 'image/jpeg') ) {
                    const query = "UPDATE userinformation SET profilePicture = ? WHERE userID = ?;";
                    const sqlQuery = mysql.format(query, [req.file.filename, payload.id]);
                    mysqlConnect.getConnection((err, connection) => {
                        connection.query(sqlQuery, (err, result) => {
                            if (err) console.log(err);
                            connection.release()
                            pool(result);
                        });
                    })
                } else {
                    deleteImage(req.file.filename);
                    pool({code: 404});
                };
            }
        } else {
            pool("Ocurrio un error al verificar el token")
        }

    } catch (err) {
        pool("ocurrio un error")
    }
}
const deleteImage = async(filename)=>{
    try{
        //ponemos la ruta donde se encuentran las imagenes y hacemos la busqueda
    const file_path = './src/services/user_configuration/configure_images/upload/' + filename;
    if(fs.existsSync(path.resolve(file_path))){
        // Si existe la imagen la vamos a borrar
        await fs.unlinkSync(path.resolve(file_path));
    }
    }catch(err){
        console.log(err)
    }
};
module.exports ={uploadImage};