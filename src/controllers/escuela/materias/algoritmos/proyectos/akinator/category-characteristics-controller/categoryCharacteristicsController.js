const CategoryCharacteristicsModel = require(process.env.ROUTE_AKINATOR_MODEL + '/category-characteristics-model/categoryCharacteristicsModel');

const save = async (data) => {
    try {
        const categoryCharacteristicsModel = new CategoryCharacteristicsModel(data);
        categoryCharacteristicsModel.nameID = data.name.replace(/ /g, '-').toLowerCase().trim() + "-" + Math.floor(Math.random() * 1000);
        const categoryCharacteristics = await categoryCharacteristicsModel.save();
        return categoryCharacteristics;

    } catch (err) {
        return err;
    }
}
module.exports = {save};