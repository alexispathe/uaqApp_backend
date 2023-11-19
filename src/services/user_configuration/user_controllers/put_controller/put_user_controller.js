const mssql = require('mssql');
const jwt = require('jsonwebtoken');
const updateUserInformation = async (dbConfig, body, token, result) => {
    try {
        const verify = await jwt.verify(token, 'secretkey');
        if (verify) {
            const payload = await jwt.decode(token)
            // console.log(payload)
            if (payload) {
                // CHEAR LO DE LA FECHA *************************************+
                const query = `UPDATE userinformation SET phone = @phone, expediente = @expediente  WHERE userID = @userID`;
                const pool = await mssql.connect(dbConfig); //nos conectamos
                if (pool) {
                    const request = await pool.request();
                    request.input('phone', mssql.VarChar, body.phone);
                    request.input('expediente', mssql.Int, body.expediente);
                    request.input('userID', mssql.Int, payload.id)
                    
                    const dataUser = await request.query(query)
                    if (dataUser) {
                        await pool.close();
                        return result(dataUser);
                    } else {
                        await pool.close();
                        return result(404);
                    }
                }



            }
        } else {
            result("Error Token")
        } token

    } catch (err) {
        result({ code: 401 })
    }
};

module.exports = { updateUserInformation };
