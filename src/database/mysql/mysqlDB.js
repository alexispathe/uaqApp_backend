const sql = require('mssql');

const dbConfig = {
    user: process.env.USER,
    password: process.env.PASSWORD,
    server: process.env.HOST,
    database: process.env.DATABASE,

    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
};
async function executeQuery(query) {
    try {
        // Crear una instancia de conexión
        const pool = await sql.connect(dbConfig);
        if (pool) {
            console.log("sql server conectado")
            // Ejecutar la consulta
            const result = await pool.request().query(query);

            // Cerrar la conexión
            await pool.close();

            // Devolver los resultados
            return result.recordset;
        }

    } catch (error) {
        console.error('Error en la ejecución de la consulta:', error);
    }
}
executeQuery();
module.exports = {executeQuery, dbConfig};