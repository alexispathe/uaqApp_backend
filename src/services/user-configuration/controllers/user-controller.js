const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const register = async (mysqlConnect, data, pool) => {
    try {
        if (data.password) {
            const hashed = await bcrypt.hash(data.password, 10);
            if (hashed) {
                // GUARDAMOS LOS DATOS DEL REGISTRO DE USUARIOS EN LA TABLA 'users' DE LA BASE DE DATOS
                const query = "INSERT INTO users(name, email, password, role, userStatus,registrationDay) VALUES (?,?,?,'user',true, CURRENT_TIMESTAMP());";
                const SQLquery = mysql.format(query, [data.name, data.email, hashed, data.role]);
                mysqlConnect.getConnection((err, connection) => {
                    if (err) console.log(err);
                    connection.query(SQLquery, (err, result) => {
                        if (err) console.log(err);
                        // CREMOS OTRO REGISTRO PARA LA TABLA DE 'userInformation'
                        const query = ` INSERT INTO userInformation(lastName, userName, birthDay,phone,country,address,userID) 
                                        VALUES(null,null,CURRENT_TIMESTAMP(),null,null,null,?);`;
                        const sqlQuery = mysql.format(query, [result.insertId]);
                        connection.query(sqlQuery, (err, result) => {
                            if (err) console.log(err);
                            // const {insertID} = result;
                            pool(result)
                            connection.release();
                        })
                    })
                });
            } else {
                console.log("Contraseña encriptada")
            }

        }
    }
    catch (err) {

    }

};
const login = async (mysqlConnect, body, pool) => {
    try {
        // buscamos al usuario con su correo para devolver solo el correo y la contraseña
        const query = "SELECT email, password FROM users WHERE email = ?;";
        const sqlQuery = mysql.format(query, [body.email]);
        mysqlConnect.getConnection((err, connection) => {
            if (err) console.log(err);
            connection.query(sqlQuery, (err, resEmail) => {
                if (err) console.log(err);
                if (resEmail.length >= 1) {
                    const [data] = resEmail;
                    // console.log(data.email)
                    connection.release()
                    bcrypt.compare(body.password, data.password).then(res => {
                        if (!res) pool("Contraseña incorrecta");
                        if (res) {
                            //  HACEMOS OTRA CONSULTA PARA DEVOLVER SOLO EL ID DEL USUARIO PARA GUARDARLO EN EL TOKEN
                            const query = "SELECT nUserID FROM users WHERE email = ?";
                            const sqlQuery = mysql.format(query, data.email);
                            mysqlConnect.getConnection((err, connection) => {
                                if (err) console.log(err);
                                connection.query(sqlQuery, (err, resID) => {
                                    if (err) console.log(err);

                                    if (resID.length >= 1) {
                                        const [nUserID] = resID;
                                        // console.log(nUserID.nUserID)
                                        jwt.sign({ nUserID }, 'secretkey', { expiresIn: "30m" }, (err, token) => {
                                            if (err) console.log(err);
                                            if (token) {
                                                pool(token)
                                            } else {
                                                pool(token)
                                            }
                                        })
                                    } else {
                                        pool("No se encontro al usuario")
                                    }
                                })
                            })
                        }
                    }).catch(err => console.log(err))
                }
                if (resEmail.length === 0) pool("Correo no encontrado")
            })

        })
    } catch (err) {
        console.log(err)
    }
}


// METODOS GET
const getUser = async (mysqlConnect, token, pool) => {
    try {
        const verify = await jwt.verify(token, 'secretkey');
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
                const query = `SELECT u.name,ui.lastName,ui.userName,ui.birthDay,ui.phone,ui.country,ui.address 
                                FROM users as u
                                INNER JOIN userInformation as ui
                                ON u.nUserID = ui.userID
                                WHERE nUserID = ?;`;
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

// METODOS PUT
const updateUserInformation = async (mysqlConnect, body, token, pool) => {
    try {
        const verify = await jwt.verify(token, 'secretkey');
        if (verify) {
            const payload = await jwt.decode(token)
            if (payload) {
                const { nUserID } = payload;
                // CHEAR LO DE LA FECHA *************************************+
                const query = "UPDATE userinformation SET lastName = ?,userName =?, phone =?, country =?, address =? WHERE userID = ?;";
                const sqlQuery = mysql.format(query, [body.lastName, body.userName, body.phone, body.country, body.address, nUserID.nUserID]);
                // console.log(nUserID.nUserID)
                console.log(sqlQuery)
                mysqlConnect.getConnection((err, connection) => {
                    if (err) pool("Ocurrio un erro al conectarse")
                    connection.query(sqlQuery, (err, result) => {
                        if (err) pool("Error en  la query");
                        if (result) {
                            pool(result)
                        }
                    })
                })
            }
        } else {
            pool("Ocurrio un error al verificar el token")
        }

    } catch (err) {
        pool("Ocurrio un error")
    }
}


module.exports = { register, getUsers, getUser, getUserAndUserInformation, login, updateUserInformation };