const CategoryCharacteristicsModel = require('../../models/category-characteristics-model/categoryCharacteristicsModel');
const jwt = require('jsonwebtoken');
const save = async (data,token) => {
    try {
       
        const verify = await jwt.verify(token, 'secretkey');
        if(verify){
            const payload = await jwt.decode(token);
            const categoryCharacteristicsModel = new CategoryCharacteristicsModel(data);
            categoryCharacteristicsModel.userID = payload.id;
            // CON EL FOR ESTAMOS AGREGANDO EL nameID a cada caracteristica que se encuentra dentro del ARRAY de characteristics
            for (let i = 0; i < categoryCharacteristicsModel.characteristics.length; i++) {
                categoryCharacteristicsModel.characteristics[i].nameID = categoryCharacteristicsModel.characteristics[i].name.replace(/ /g, '-').toLowerCase().trim() + "-" + Math.floor(Math.random() * 1000);
            }
            const categoryCharacteristics = await categoryCharacteristicsModel.save();
            return {status: 200};
    
        }
      
    } catch (err) {
        return {status:401};
    }
}
module.exports = { save };