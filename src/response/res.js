const success=(req, res, data)=>{
    return res.status(200).send({
        status: 200,
        data
    })
};

const created =(req, res, data)=>{
    return res.status(200).send({
        data
    })
};

const updated = (req, res, data)=>{
    return res.status(201).send({
        status:201,
        data
    })
}
const notFound=(req, res)=>{
    return res.status(404).send({status:404})
};

const deleted =(req, res)=>{
    return res.status(200).send({status: 200})
}

const errorServer =(req, res)=>{
    return res.status(500).send({status: 500})
}
const badRequest =(req, res)=>{
    return res.status(400).send({status:400})
}
const unauthorized =(req, res)=>{
    return res.status(401).send({status: 401});
}

module.exports = {success, created, updated, notFound, deleted, errorServer,badRequest,unauthorized};