const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const register = async (mysqlConnect, data, pool) => {
    try {
        if (data.password) {
            const hashed = await bcrypt.hash(data.password, 10);
            if (hashed) {
                const query = "INSERT INTO users(name, email, password, role, userStatus,registrationDay) VALUES (?,?,?,'user',true, CURRENT_TIMESTAMP());";
                const SQLquery = mysql.format(query, [data.name, data.email, hashed, data.role]);
                mysqlConnect.getConnection((err, connection) => {
                    if (err) throw console.log(err);
                    connection.query(SQLquery, (err, result) => {
                        if (err) console.log(err);
                        connection.release();
                        pool(result)
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

const getUser = async (mysqlConnect, token, pool) => {
    try {
        const verify = await jwt.verify(token, 'secretkey');
        if (verify) {
            const payload = await jwt.decode(token);
            if (payload) {
                const { nUserID } = payload;
                const query = "SELECT * FROM users WHERE nUserID = ?;";
                const sqlQuery = mysql.format(query, [nUserID.nUserID]);
                mysqlConnect.getConnection((err, connection) => {
                    connection.query(sqlQuery, (err, result) => {
                        if (err) console.log(err);
                        pool(result);
                    });
                })
            }
        } else {
            console.log("Ocurrio un error al verificar el token")
        }

    } catch (err) {
        console.log(err)
    }
}
const getUsers = async (mysqlConnect, pool) => {
    try {
        const SqlQuery = "SELECT * FROM users";
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

module.exports = { register, getUsers, getUser, login };