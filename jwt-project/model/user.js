const mongoose = require("mongoose");

const personnageSchema = new mongoose.Schema({
    nom: {type: String, default: null},
    race: {type: String, default: null},
    attributs: {
        force: {type: Number, default: 1, max: 5},
        dexterite: {type: Number, default: 1, max: 5},
        vigeur: {type: Number, default: 1, max: 5},
        charisme: {type: Number, default: 1, max: 5},
        manipulation: {type: Number, default: 1, max: 5},
        apparence: {type: Number, default: 1, max: 5},
        perception: {type: Number, default: 1, max: 5},
        intelligence: {type: Number, default: 1, max: 5},
        astuce: {type: Number, default: 1, max: 5},
    },
    capacites: {
        melee: {type: Number, default: 1, max: 5},
        survie: {type: Number, default: 1, max: 5},
        furtivité: {type: Number, default: 1, max: 5},
        intimidation: {type: Number, default: 1, max: 5},
        commandements: {type: Number, default: 1, max: 5},
        vigilance: {type: Number, default: 1, max: 5},
    }
});


const userSchema = new mongoose.Schema({
    first_name: {type: String, default: null},
    last_name: {type: String, default: null},
    email: {type: String, unique: true},
    password: {type: String},
    token: {type: String},
    personnages: {type:Map, of:personnageSchema}
});

module.exports = mongoose.model("user", userSchema);
module.exports.personnageSchema = personnageSchema;
