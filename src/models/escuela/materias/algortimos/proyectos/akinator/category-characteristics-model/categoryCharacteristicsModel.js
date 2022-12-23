const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoryCharacteristicsModel = Schema({
    categoryID:{
        type: String,
        trim: true,
        required: true
    },
    characteristics:[{
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
    }]
});
module.exports = mongoose.model('akinatorCategoryFeatures', categoryCharacteristicsModel)