const success=(req, res, data)=>{
    return res.status(200).send({
        message: "Datos devueltos correctamente",
        data
    })
};

const created =(req, res, data)=>{
    return res.status(201).send({
        message: "Datos creados correctamente", 
        data
    })
};

const updated = (req, res, data)=>{
    return res.status(201).send({
        message: "Datos actualizados correctamente",
        data
    })
}
const notFound=(req, res)=>{
    return res.status(404).send("Datos no encontrados")
};

const deleted =(req, res)=>{
    return res.status(200).send("Datos borrados correctamente")
}

const errorServer =(req, res)=>{
    return res.status(500).send("Ocurrio un error en el servidor")
}
const badRequest =(req, res)=>{
    return res.status(400).send("Error")
}
const unauthorized =(req, res)=>{
    return res.status(401);
}

module.exports = {success, created, updated, notFound, deleted, errorServer,badRequest,unauthorized};