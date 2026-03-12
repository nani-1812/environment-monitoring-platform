const mongoose = require("mongoose")

const CampaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    region: {
        type: String
    },

    description: {
        type: String
    },

    startDate: {
        type: Date
    },

    endDate: {
        type: Date
    },

    teamAssigned: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    status: {
        type: String,
        default: "active"
    }
})

module.exports = mongoose.model("Campaign", CampaignSchema)
