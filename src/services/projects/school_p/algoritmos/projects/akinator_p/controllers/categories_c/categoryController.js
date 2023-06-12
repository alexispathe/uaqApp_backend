const CategoryModel = require('../../models/category-model/category-model');
const jwt = require('jsonwebtoken');
const save=async(data,token)=>{
    try{
        if(token){
            const verify = await jwt.verify(token,'secretkey');
            if(verify){
                const payload = await jwt.decode(token);
                const categoryModel = new CategoryModel(data);
                categoryModel.userID = payload.id;
                categoryModel.categoryID = categoryModel.name.replace(/ /g, '-').toLowerCase().trim()+ "-"+Math.floor(Math.random() * 1000);
                const category = await categoryModel.save();
                
                return {status: 200,categoryID: category.categoryID};
            }
        }else{
            return {status: 401}
        }
    }catch(err){
        return {status: 401};
    }
};
const getCategories = async()=>{
    try{
        const categories = await CategoryModel.find();
        return categories;
    }catch(err){
        return err;
    }
}
module.exports = {save,getCategories};