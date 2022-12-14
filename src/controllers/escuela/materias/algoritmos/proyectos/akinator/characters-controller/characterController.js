const CharacterModel = require('../../../../../../../models/escuela/materias/algortimos/proyectos/akinator/character-model/characterModel');

const saveCharacters = async (data) => {
    try {
        // console.log("d", data)
        const date = new Date();
        data.date = date;
        data.idUser = data.name.replace(/ /g, '-').toLowerCase().trim() + -+Math.floor(Math.random() * 1000);

        const characterModel = new CharacterModel(data);
        // console.log(data)
        const character = await characterModel.save();
        return character;
    } catch (err) {
        return err;
    }
}

const getCharacters = async () => {
    try {
        const character = await CharacterModel.find({},{_id:0, __v:false, date:0});
        return character;
    } catch (err) {
        return err;
    }
}

const updateCharacters = async (id, data) => {
    try {
        const character = await CharacterModel.findById(id, { data }, { new: true });
        return character;
    } catch (err) {
        return err;
    }
}

module.exports = { saveCharacters, getCharacters, updateCharacters }