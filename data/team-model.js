const mongoose = require("mongoose")

const playerSchema = mongoose.Schema({

    name: String,
    age: Number,
    yearJoined: Number
})

const teamSchema = mongoose.Schema({
    country: {
        type: String,
    },
    yearEstablished: Number,
    totalWorldCupWon: Number,
    players: {
        type: [playerSchema]
    }
})

mongoose.model(process.env.TEAM_MODEL, teamSchema, "teams");