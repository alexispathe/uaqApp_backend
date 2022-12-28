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
                        if (err) {
                            pool({ code: err.code })
                            connection.release();
                        };
                        // Esta condicioon entrara cuando no ocurra ningun error al hacer la consulta de arriba
                        if (result) {
                            // CREMOS OTRO REGISTRO PARA LA TABLA DE 'userInformation'
                            // const query = ` INSERT INTO userInformation(lastName, userName, birthDay,phone,country,address,userID) 
                            //                 VALUES('',null,CURRENT_TIMESTAMP(),null,'','',?);`;
                            const query = ` INSERT INTO userInformation(birthDay,userID,profilePicture) 
                        VALUES(CURRENT_TIMESTAMP(),?,'https://marketplace.canva.com/EAEkB8aSmJU/2/0/1600w/canva-rosa-y-amarillo-gato-moderno-dibujado-a-mano-abstracto-imagen-de-perfil-de-twitch-bI-Ixh9fAbQ.jpg');`;
                            const sqlQuery = mysql.format(query, [result.insertId]);
                            connection.query(sqlQuery, (err, result) => {
                                if (err) console.log(err);
                                // const {insertID} = result;
                                pool(result)
                                connection.release();
                            })
                        }

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
                        if (!res) pool({ status: 404 }); //Esta condicion entra cuando la contraseña no es correcta
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
                                        jwt.sign({ nUserID }, 'secretkey', { expiresIn: "1h" }, (err, token) => {
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
                if (resEmail.length === 0) pool({ status: 404 })// cuando el correo no es encontrado
            })

        })
    } catch (err) {
        console.log(err)
    }
};

module.exports = {register, login}
