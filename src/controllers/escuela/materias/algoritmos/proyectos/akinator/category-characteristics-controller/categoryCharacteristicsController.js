const CategoryCharacteristicsModel = require(process.env.ROUTE_AKINATOR_MODEL + '/category-characteristics-model/categoryCharacteristicsModel');

const save = async (data) => {
    try {
        // console.log(data)
        const categoryCharacteristicsModel = new CategoryCharacteristicsModel(data);
        // CON EL FOR ESTAMOS AGREGANDO EL nameID a cada caracteristica que se encuentra dentro del ARRAY de characteristics
        for (let i = 0; i < categoryCharacteristicsModel.characteristics.length; i++) {
            categoryCharacteristicsModel.characteristics[i].nameID = categoryCharacteristicsModel.characteristics[i].name.replace(/ /g, '-').toLowerCase().trim() + "-" + Math.floor(Math.random() * 1000);
        }
        const categoryCharacteristics = await categoryCharacteristicsModel.save();
        return categoryCharacteristics;

    } catch (err) {
        return err;
    }
}
module.exports = { save };