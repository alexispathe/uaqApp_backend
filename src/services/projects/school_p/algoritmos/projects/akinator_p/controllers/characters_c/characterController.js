const CharacterModel = require('../../models/character-model/characterModel');
const jwt = require('jsonwebtoken');
const saveCharacters = async (data,token) => {
    try {
        // console.log("d", data)
        const verify = await jwt.verify(token, 'secretkey');
        if(verify){
            const payload = await jwt.decode(token);
            const date = new Date();
            data.date = date;
            data.idUser = data.name.replace(/ /g, '-').toLowerCase().trim() + "-"+Math.floor(Math.random() * 1000);
            data.userID = payload.id;
            const characterModel = new CharacterModel(data);
            // console.log(data)
            const character = await characterModel.save();
            return [character, {status: 200}];

        }else{
            return {status:401}
        }
       
    } catch (err) {
        return {status:401};
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