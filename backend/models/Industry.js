const mongoose = require("mongoose")

const IndustrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    type: {
        type: String
    },

    region: {
        type: String,
        required: true
    },

    location: {
        type: String
    },

    latitude: {
        type: Number
    },

    longitude: {
        type: Number
    },

    status: {
        type: String,
        default: "active"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Industry", IndustrySchema)
