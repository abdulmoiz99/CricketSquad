const mongoose = require("mongoose")

const playerSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'player name is required']
    },
    age: {
        type: Number,
        required: [true, 'player age is required']
    },
    yearJoined: {
        type: Number,
        required: [true, 'player year joined is required']
    }
})

const teamSchema = mongoose.Schema({
    country: {
        type: String,
        required: [true, 'country is required']
    },
    yearEstablished: {
        type: Number,
        required: [true, 'year established is required']
    },
    totalWorldCupWon: {
        type: Number,

    },
    players: {
        type: [playerSchema]
    }
})

mongoose.model(process.env.TEAM_MODEL, teamSchema, "teams");