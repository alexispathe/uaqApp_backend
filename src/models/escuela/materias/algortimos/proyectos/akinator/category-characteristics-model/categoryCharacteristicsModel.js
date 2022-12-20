const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoryCharacteristicsModel = Schema({
    name:{
        type: String,
        trim: true,
        required: true
    },
    nameID:{
        type: String,
        trim: true,
        required: true
    },
    categoryID:{
        type: String,
        trim: true,
        required: true
    }
});
module.exports = mongoose.model('akinatorCategoryFeatures', categoryCharacteristicsModel)