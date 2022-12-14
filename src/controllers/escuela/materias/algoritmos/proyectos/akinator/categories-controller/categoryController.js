const CategoryModel = require('../../../../../../../models/escuela/materias/algortimos/proyectos/akinator/category-model/category-model');

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
}
module.exports = {save};