const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
})

mongoose.model(process.env.USER_MODEL, userSchema, process.env.USER_COLLECTION);