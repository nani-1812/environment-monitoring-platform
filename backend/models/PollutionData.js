const mongoose = require("mongoose")

const PollutionDataSchema = new mongoose.Schema({
    industryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Industry",
        required: true
    },

    region: {
        type: String,
        required: true
    },

    PM25: {
        type: Number
    },

    SO2: {
        type: Number
    },

    noise: {
        type: Number
    },

    waterPH: {
        type: Number
    },

    temperature: {
        type: Number
    },

    recordedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("PollutionData", PollutionDataSchema)
