const mysql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const register = async (mysqlConnect, data, pool) => {
    try {
        if (data.password) {
           
            const hashed = await bcrypt.hash(data.password, 10);
            if (hashed) {
                console.log(data)
                var result = mysqlConnect.request().query(
                    `
                    INSERT INTO users(name, email, password, role, userStatus,registrationDay) 
                    VALUES (
                        [
                            ${data.name}, 
                            ${data.email.toLowerCase().trim()}, 
                            ${data.password},
                            user,
                            ${1}
                        ]
                    );
                    `
                )
                
                console.log("result", result)
                // GUARDAMOS LOS DATOS DEL REGISTRO DE USUARIOS EN LA TABLA 'users' DE LA BASE DE DATOS
               
            } else {
                console.log("Contraseña no encriptada")
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
        const sqlQuery = mysql.format(query, [body.email.toLowerCase().trim()]);
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
                                        const user ={
                                            id: resID[0].nUserID
                                        }
                                        jwt.sign( user , 'secretkey', { expiresIn: "1h" }, (err, token) => {
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


module.exports = { register, login };
