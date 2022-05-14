const mongoose = require("mongoose");
const {personnageSchema} = require("./user")
const gameSchema = new mongoose.Schema({
    titre: {type: String, default: ""},
    scenario: {type: String, default: ""},
    participants: [{type: mongoose.Schema.ObjectId, ref: "User"}],
    personnages: {type:Map, of:personnageSchema, default: {}}
})

module.exports = mongoose.model("game", gameSchema);
