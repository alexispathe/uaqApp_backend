const SubCategoryModel = require('../../../models/category-model/subCategory-model/subCategory-model');
const jwt = require('jsonwebtoken');
const save =  async(data,token)=>{
    try{
    
        const verify = await jwt.verify(token, 'secretkey');
        if(verify){
            const payload = await jwt.decode(token);
            const subCategoryModel = new SubCategoryModel(data);
            subCategoryModel.userID = payload.id;
            subCategoryModel.subCategoryID = subCategoryModel.name.replace(/ /g, '-').toLowerCase().trim() + "-"+Math.floor(Math.random() * 1000);
            const subCategory = await subCategoryModel.save();
            return {status: 200};
        }
        
    }catch(err){
        return {status: 401};
    }
}
const getSubCategories =async(category)=>{
    try{
        const subCategories = await SubCategoryModel.find({"categoryID": category});
        return subCategories;
    }catch(err){
        return err;
    }
}

module.exports = {save,getSubCategories}