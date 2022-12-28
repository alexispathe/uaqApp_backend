const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const getUser = async (mysqlConnect, token, pool) => {
    try {
        const verify = await jwt.verify(token, 'secretkey');
        console.log(verify)
        if (verify) {
            const payload = await jwt.decode(token);
            if (payload) {
                const { nUserID } = payload;
                const query = "SELECT name,email,role FROM users WHERE nUserID = ?;";
                const sqlQuery = mysql.format(query, [nUserID.nUserID]);
                mysqlConnect.getConnection((err, connection) => {
                    connection.query(sqlQuery, (err, result) => {
                        if (err) console.log(err);
                        connection.release()
                        pool(result);
                    });
                })
            }
        } else {
            pool("Ocurrio un error al verificar el token")
        }

    } catch (err) {
        pool("ocurrio un error")
    }
}
const getUserAndUserInformation = async (mysqlConnect, token, pool) => {
    try {
        const verify = await jwt.verify(token, 'secretkey');
        if (verify) {

            const payload = await jwt.decode(token);
            if (payload) {
                const { nUserID } = payload;
                const query = `SELECT u.name,ui.lastName,ui.userName,ui.profilePicture, ui.birthDay,ui.phone,ui.country,ui.address 
                                FROM users as u
                                INNER JOIN userInformation as ui
                                ON u.nUserID = ui.userID
                                WHERE nUserID = ?;`;
                const sqlQuery = mysql.format(query, [nUserID.nUserID]);
                mysqlConnect.getConnection((err, connection) => {
                    if (err) console.log(err)
                    connection.query(sqlQuery, (err, result) => {
                        if (err) console.log(err);
                        connection.release()
                        pool(result);
                    });
                })
            }
        } else {
            pool("Ocurrio un error al verificar el token")
        }

    } catch (err) {
        pool({ code: 401 })
    }
}
const getUsers = async (mysqlConnect, pool) => {
    try {
        const SqlQuery = "SELECT name FROM users";
        mysqlConnect.getConnection((err, connect) => {
            if (err) console.log(err);
            connect.query(SqlQuery, (err, result) => {
                if (err) console.log(err);
                pool(result);
                connect.release();
            })
        })
    } catch (err) {

    }
}
const getProfilePicture = async (mysqlConnect, token, pool) => {
    try {
        const verify = await jwt.verify(token, 'secretkey');
        if (verify) {
            const payload = await jwt.decode(token);
            const { nUserID } = payload;
            if (payload) {
                const query = "SELECT profilePicture FROM userInformation WHERE userID = ?";
                const sqlQuery = mysql.format(query, [nUserID.nUserID]);
                mysqlConnect.getConnection((err, connection) => {
                    if (err) console.log(err);
                    if (connection) {
                        connection.query(sqlQuery, (err, result) => {
                            if (err) console.log(err) 

                            else if (result) {
                                pool(result);
                                connection.release();
                            } else connection.release();
                        })
                    } else connection.release();

                })
            } else if (!payload) {
                pool("Error al decodificar")
            }
        } else if (!verify) {
            pool("Ocurrio un error al verificar el token")
        }
    } catch (err) {
        pool({status: 401}); //Cuando ocurre un error al verificar  el token se ejecuta este catch
    }
}

module.exports = {getUser,getUserAndUserInformation,getUsers, getProfilePicture}