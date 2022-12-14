const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const subCategoryModel = Schema({
    name: {
        type: String, 
        required: true, 
        trim: true
    },
    subCategoryID:{
        type: String,
        required: true, 
        trim: true
    },
    categoryID:{
        type: String, 
        required: true, 
        trim: true
    }
});

module.exports = mongoose.model("subCategoryAkinator", subCategoryModel);