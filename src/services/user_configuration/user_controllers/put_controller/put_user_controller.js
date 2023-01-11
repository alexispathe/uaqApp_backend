const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const updateUserInformation = async (mysqlConnect, body, token, pool) => {
    try {
        // console.log(body)
        const verify = await jwt.verify(token, 'secretkey');
        if (verify) {
            const payload = await jwt.decode(token)
            if (payload) {
                // CHEAR LO DE LA FECHA *************************************+
                const query = "UPDATE userinformation SET lastName = ?,userName =?, phone =?, country =?, birthDay = ?, address =? WHERE userID = ?;";
                const sqlQuery = mysql.format(query, [body.lastName, body.userName.toLowerCase().trim(), body.phone, body.country, body.birthDay,  body.address, payload.id]);
                // console.log(sqlQuery)
                mysqlConnect.getConnection((err, connection) => {
                    if (err) pool("Ocurrio un erro al conectarse")
                    connection.query(sqlQuery, (err, result) => {
                        if (err && err.code && err.code === "ER_DUP_ENTRY") pool({ err: "ER_DUP_ENTRY", code: 400 });
                        // console.log(err)
                        if (result) {
                            connection.release()
                            pool(result)
                        }
                    })
                })
            }
        } else {
            pool("Ocurrio un error al verificar el token")
        }

    } catch (err) {
        pool({ code: 401 })
    }
};

module.exports = {updateUserInformation};
