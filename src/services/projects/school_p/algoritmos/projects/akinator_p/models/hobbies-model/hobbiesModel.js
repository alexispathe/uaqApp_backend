const mongoose = require('mongoose');
const schema = mongoose.Schema;

const hobbiesModel = schema({
    name:{
        type: String, 
        required: true,
        trim: true
        
    },
    idHobbie:{
        type: String,
        required: true,
        trim: true
    },
    idUsers:{
        type: Array,
        trim: true
    },
    categoryID: {
        type: String,
        trim: true
    },
    subCategoryID:{
        type: String,
        trim:true
    },
    userID: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('hobbies', hobbiesModel);