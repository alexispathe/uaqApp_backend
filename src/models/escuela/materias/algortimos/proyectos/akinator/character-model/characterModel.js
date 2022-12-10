const mongoose = require('mongoose');
const schema = mongoose.Schema;

const charactersModel = schema({
    name:{
        type: String, 
        required: true,
        trim: true
        
    },
    idUser:{
        type: String,
        required: true,
        trim: true
    },
    hobbies:{
        type: Array,
        trim: true
    },
    date:{
        type: Date,
        // trim: true
    }
});

module.exports = mongoose.model('characters', charactersModel);