const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    titre: {type: String, default: ""},
    scenario: {type: String, default: ""},
    participants: [{type: mongoose.Schema.ObjectId, ref: "User"}]
})

module.exports = mongoose.model("game", gameSchema);
