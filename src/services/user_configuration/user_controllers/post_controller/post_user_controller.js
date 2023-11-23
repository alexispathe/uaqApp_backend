const mysql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const register = async (dbConfig, data, result) => {
    try {
        // console.log("Datos ", data)
        if (data.password) {
            // Encriptamos la contraseña
            const hashed = await bcrypt.hash(data.password, 5);
            if (hashed) {
                const pool = await mysql.connect(dbConfig);
                // Crear una instancia de solicitud
                const request = pool.request();
                // Creamos la query para insertar los datos
                const query = `INSERT INTO users(name, email, password, role, registrationDay) 
                            VALUES (@name, @email, @password, @role,CURRENT_TIMESTAMP);`;
                request.input('name', mysql.VarChar, data.name);
                request.input('email', mysql.VarChar, data.email.toLowerCase().trim());
                request.input('password', mysql.VarChar, hashed);
                request.input('role', mysql.VarChar, 'user');
                const dataUser = await request.query(query);
                // pool.close();
                // return result(dataUser)
                // Una vez creado el usuario, tambien creamos su referencia en la tabla userInformation
                if(dataUser){
                    const queryNUserID = "SELECT nUserID FROM users WHERE email = @emailUser;";
                    request.input('emailUser', mysql.VarChar, data.email.toLowerCase().trim());
                    const userID = await request.query(queryNUserID); //buscamos el id del usuario creado con el correo nuevo

                    const queryUserInformation = "INSERT INTO userInformation(userID) VALUES (@nUserID);";
                    console.log("nUserID del usuario registrado ",userID.recordset[0].nUserID)
                    // // console.log(nUserID.recordset[0])
                    const x = await request.input('nUserID', mysql.Int, userID.recordset[0].nUserID); //Insertamos el nUser en la tabla
                    console.log("Datos del usuario ", x)
                    await request.query(queryUserInformation);
                    await pool.close();
                    return result(dataUser);
                }
                
               
            } else {
                console.log("Contraseña no encriptada");
                pool.close();

            }

        }
    }
    catch (err) {
        console.log(err);
    }

};
const login = async (dbConfig, body, result) => {
    try {
        const pool = await mysql.connect(dbConfig);
        const request = pool.request();
        // buscamos al usuario con su correo para devolver solo el correo y la contraseña
        const query = "SELECT email, password FROM users WHERE email = @email;";
        request.input('email', mysql.VarChar, body.email.toLowerCase().trim());

        // const sqlQuery = mysql.format(query, [body.email.toLowerCase().trim()]);
        const resultEmail = await request.query(query);
        if(resultEmail){
            // const {recordset} = resultEmail;
            // console.log(resultEmail.recordset[0].password)
            console.log("Dentro " ,resultEmail);
            bcrypt.compare(body.password, resultEmail.recordset[0].password).then(res => {
                if (!res) result({ status: 404 }); //Esta condicion entra cuando la contraseña no es correcta
                if (res) {
                    //  HACEMOS OTRA CONSULTA PARA DEVOLVER SOLO EL ID DEL USUARIO PARA GUARDARLO EN EL TOKEN
                    const query = "SELECT nUserID FROM users WHERE email = @emailID;";
                    request.input('emailID', mysql.VarChar, resultEmail.recordset[0].email);
                    request.query(query,(err, resID)=>{
                        // if (err) console.log(err);
                        if (resID.recordset.length >= 1) {
                            const user ={
                                id: resID.recordset[0].nUserID
                            }
                            jwt.sign( user , 'secretkey', { expiresIn: "4h" }, (err, token) => {
                                if (err) console.log(err);
                                if (token) {
                                    result(token)
                                } else {
                                    result(token)
                                }
                            })
                        } else {
                            result("No se encontro al usuario")
                        }
                    });

                }
            }).catch(err => console.log(err))
        }else{
            console.log("No se encontro el usuario")
        }
        // mysqlConnect.getConnection((err, connection) => {
        //     if (err) console.log(err);
        //     connection.query(sqlQuery, (err, resEmail) => {
        //         if (err) console.log(err);
        //         if (resEmail.length >= 1) {
        //             const [data] = resEmail;
        //             // console.log(data.email)
        //             connection.release()
        //             bcrypt.compare(body.password, data.password).then(res => {
        //                 if (!res) pool({ status: 404 }); //Esta condicion entra cuando la contraseña no es correcta
        //                 if (res) {
        //                     //  HACEMOS OTRA CONSULTA PARA DEVOLVER SOLO EL ID DEL USUARIO PARA GUARDARLO EN EL TOKEN
        //                     const query = "SELECT nUserID FROM users WHERE email = ?";
        //                     const sqlQuery = mysql.format(query, data.email);
        //                     mysqlConnect.getConnection((err, connection) => {
        //                         if (err) console.log(err);
        //                         connection.query(sqlQuery, (err, resID) => {
        //                             if (err) console.log(err);

        //                             if (resID.length >= 1) {
        //                                 const user ={
        //                                     id: resID[0].nUserID
        //                                 }
        //                                 jwt.sign( user , 'secretkey', { expiresIn: "1h" }, (err, token) => {
        //                                     if (err) console.log(err);
        //                                     if (token) {
        //                                         pool(token)
        //                                     } else {
        //                                         pool(token)
        //                                     }
        //                                 })
        //                             } else {
        //                                 pool("No se encontro al usuario")
        //                             }
        //                         })
        //                     })
        //                 }
        //             }).catch(err => console.log(err))
        //         }
        //         if (resEmail.length === 0) pool({ status: 404 })// cuando el correo no es encontrado
        //     })

        // })
    } catch (err) {
        console.log(err)
    }
};


module.exports = { register, login };
