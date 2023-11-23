const mysql = require('mssql');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const getUserID = async (mysqlConnect, token, pool) => {
    try {
        // Validamos que de verdad se envie el token
        if (token) {
            const verify = await jwt.verify(token, 'secretkey');
            if (verify) {
                const payload = await jwt.decode(token);
                // console.log(payload.nUserID)
                pool({ id: payload.id });
            }
        } else {
            pool({ code: 401 })
        }

    } catch (err) {
        pool({ code: 401 })
    }
}
const getUser = async (dbConfig, token, result) => {
    try {
        const pool = await mysql.connect(dbConfig);
        const request = pool.request();
        const verify = await jwt.verify(token, 'secretkey');
        // console.log(verify)
        if (verify) {
            const payload = await jwt.decode(token);
            if (payload) {
                const query = "SELECT name,email,role FROM users WHERE nUserID = @id;";
                request.input('id', mysql.Int, payload.id);
                const user = await request.query(query);

                result(user);
                await pool.close();
            }
        } else {
            result("Ocurrio un error al verificar el token")
        }
    } catch (err) {
        result("ocurrio un error")
    }
}
const getUserAndUserInformation = async (dbConfig, token, result) => {
    try {

        const verify = await jwt.verify(token, 'secretkey');
        // console.log("verify", verify);
        if (verify) {
            const payload = await jwt.decode(token);
            if (payload) {
                const query = `SELECT u.name,u.email, ui.phone, ui.expediente
                                FROM users as u
                                INNER JOIN userInformation as ui
                                ON u.nUserID = ui.userID
                                WHERE nUserID = @id`;
                const pool = await mysql.connect(dbConfig);
                if (pool) {
                    const request = await pool.request();
                    request.input('id', mysql.Int, payload.id);
                    const dataUser = await request.query(query);
                    result(dataUser);
                    await pool.close();
                }else{
                    await pool.close();
                    return result(404);
                }

            }
        } else {
            result("Ocurrio un error al verificar el token")
        }

    } catch (err) {
        result({ code: 401 })
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
// Devolver el nombre de la imagen que se encuentra en el registro de la base de datos
const getProfilePicture = async (mysqlConnect, token, pool) => {
    try {
        const verify = await jwt.verify(token, 'secretkey');
        if (verify) {
            const payload = await jwt.decode(token);
            if (payload) {
                const query = "SELECT profilePicture FROM userInformation WHERE userID = ?";
                const sqlQuery = mysql.format(query, [payload.id]);
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
        pool({ status: 401 }); //Cuando ocurre un error al verificar  el token se ejecuta este catch
    }
}
// Devolver la imagen donde esta gurdada
const getImage = async (req, res) => {
    try {
        const file_path = './src/services/user_configuration/configure_images/upload/' + req.params.id;
        fs.exists(file_path, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(file_path));
            }
            return res.status(404).send({ message: "Imagen no encontrada" })
        })
    } catch (err) {
        console.log(err)
    }
}
module.exports = { getUser, getUserAndUserInformation, getUsers, getProfilePicture, getImage, getUserID }