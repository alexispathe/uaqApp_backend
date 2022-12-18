const CategoryModel = require(process.env.ROUTE_AKINATOR_MODEL+'/category-model/category-model');

const save=async(data)=>{
    try{
        const categoryModel = new CategoryModel(data);
        console.log(categoryModel)
        categoryModel.categoryID = categoryModel.name.replace(/ /g, '-').toLowerCase().trim()+ "-"+Math.floor(Math.random() * 1000);;
        const category = await categoryModel.save();
        return category;
    }catch(err){
        return err;
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