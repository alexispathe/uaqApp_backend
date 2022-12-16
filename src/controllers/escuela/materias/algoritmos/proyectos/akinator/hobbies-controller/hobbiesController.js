const HobbiesModel = require(process.env.ROUTE_AKINATOR_MODEL+'/hobbies-model/hobbiesModel');

const saveHobbies = async (data) => {
    try {
        // console.log("d", data)
        data.idHobbie = data.name.replace(/ /g, '-').toLowerCase().trim();
        const hobbiesModel = new HobbiesModel(data);
        // console.log(hobbiesModel)
        // console.log(hobbiesModel)
        const hobbies = await hobbiesModel.save({});
        // console.log("hobbies", hobbies)
        return hobbies;
    } catch (err) {
        return err;
    }
}

const getHobbies = async () => {
    try {
        const hobbies = await HobbiesModel.find({}, { _id: 0, __v: 0 }).sort({name:1});
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
const updateHobbiesCharacter = async (data) => {
    try {
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

        // console.log("H", hobbies);
        // console.log("id ", hobbies._id);
        // console.log("Nuevos datos ", hobbie)
        return hobbie;
    } catch (err) {
        return err;
    }
}
const searchHobbie = async (data) => {
    try {
        // console.log(data);
        const search = await HobbiesModel.find({
            $or:[
                {name: {
                    $regex: data, "$options": "i"
                }}
            ]
            
        });
        return search;
    } catch (err) {
        return err;
    }
};
module.exports = { saveHobbies, getHobbies, updateHobbies, updateHobbiesCharacter,searchHobbie }