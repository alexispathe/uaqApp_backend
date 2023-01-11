const HobbiesModel = require('../../models/hobbies-model/hobbiesModel');
const jwt = require('jsonwebtoken');
const saveHobbies = async (data, token) => {
    try {
        const verify = await jwt.verify(token, 'secretkey');
        if (verify) {
            const payload = await jwt.decode(token);
            data.idHobbie = data.name.replace(/ /g, '-').toLowerCase().trim() + "-" + Math.floor(Math.random() * 1000);
            data.userID = payload.id;
            const hobbiesModel = new HobbiesModel(data);
            const hobbies = await hobbiesModel.save({});
            // console.log("hobbies", hobbies)
            return { status: 200 };

        }

    } catch (err) {
        return { status: 401 };
    }
}

const getHobbies = async () => {
    try {
        const hobbies = await HobbiesModel.find({}, { _id: 0, __v: 0 }).sort({ name: 1 });
        return hobbies;
    } catch (err) {
        return err;
    }
}
const getCategoryHobbies = async (id) => {
    try {
        const hobbies = await HobbiesModel.find({ "subCategoryID": id }, { _id: 0, __v: 0 }).sort({ name: 1 });
        return hobbies;
    } catch (err) {
        return err;
    }
}

const updateHobbies = async (id, data) => {
    try {

        const hobbies = await HobbiesModel.findByIdAndUpdate(id, data, { new: true });
        return hobbies;
    } catch (err) {
        return err;
    }
}
// ESTA FUNCION NOS PERMITIRA ACTUALIZAR EL HOBBI ID PARA HACER LA RELACION CON EL USUARIO
const updateHobbiesCharacter = async (data, token) => {
    try {
        const verify = await jwt.verify(token, 'secretkey');
        if (verify) {
            // console.log("Usuario ", data);
            const idUser = data.idUser;
            // console.log("Este es el usuario ", idUser)
            // console.log("x ", data.hobbies[0]);
            let hobbies = "";
            let hobbie = {};
            for (let i = 0; i < data.hobbies.length; i++) {
                hobbies = await HobbiesModel.findOne({ idHobbie: data.hobbies[i] });
                // console.log("h-user ", hobbies.idUsers)
                hobbies.idUsers = [...hobbies.idUsers, idUser];
                hobbie = await HobbiesModel.findOneAndUpdate({ idHobbie: hobbies.idHobbie }, hobbies, { new: true });
            }

            return {status:201};

        }

    } catch (err) {
        return {status:401};
    }
}
const searchHobbie = async (data) => {
    try {
        // console.log(data);
        const search = await HobbiesModel.find({
            $or: [
                {
                    name: {
                        $regex: data, "$options": "i"
                    }
                }
            ]

        });
        return search;
    } catch (err) {
        return err;
    }
};
module.exports = { saveHobbies, getHobbies, updateHobbies, updateHobbiesCharacter, searchHobbie, getCategoryHobbies }