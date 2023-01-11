const mongoose = require('mongoose');
const schema = mongoose.Schema;

const categoryModel = schema({
    name:{
        type: String,
        required: true, 
        trim: true
    },
    categoryID: {
        type: String, 
        required: true,
        trim: true
    }
    ,
    subCategoryID:{
        type:Array,
        required: true, 
        trim: true
    },
    userID:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('categoryAkinator', categoryModel);