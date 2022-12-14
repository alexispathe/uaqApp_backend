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
    subCategoryID:{
        type: String,
        trim:true
    }
});

module.exports = mongoose.model('hobbies', hobbiesModel);