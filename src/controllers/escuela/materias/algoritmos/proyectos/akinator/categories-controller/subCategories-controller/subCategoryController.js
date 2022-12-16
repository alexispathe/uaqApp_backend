const SubCategoryModel = require('../'+process.env.ROUTE_AKINATOR_MODEL+'/category-model/subCategory-model/subCategory-model');

const save =  async(data)=>{
    try{
        const subCategoryModel = new SubCategoryModel(data);
        subCategoryModel.subCategoryID = subCategoryModel.name.replace(/ /g, '-').toLowerCase().trim() + "-"+Math.floor(Math.random() * 1000);
        const subCategory = await subCategoryModel.save();
        return subCategory;
    }catch(err){
        return err;
    }
}
module.exports = {save}