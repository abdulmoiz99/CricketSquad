const mongoose = require("mongoose")

const playerSchema = mongoose.Schema({

    name: String,
    age: Number,
    yearJoined: Number
})

const teamSchema = mongoose.Schema({
    country: String,
    yearEstablished: Number,
    totalWorldCupWon: Number,
    player: playerSchema
})

mongoose.model(process.env.TEAM_MODEL, teamSchema, "teams");