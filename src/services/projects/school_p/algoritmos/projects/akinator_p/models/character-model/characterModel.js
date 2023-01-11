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
    },
    categoryID:{
        type: String,
    },
    subCategoryID:{
        type: String
    },
    userID: {
        type: Number,
        required: true
    },
    image:{
        type: String
    }
});

module.exports = mongoose.model('characters', charactersModel);