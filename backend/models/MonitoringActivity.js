const mongoose = require("mongoose")

const MonitoringActivitySchema = new mongoose.Schema({
    teamMember: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    industryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Industry"
    },

    region: {
        type: String
    },

    activityType: {
        type: String
    },

    result: {
        type: String
    },

    photos: {
        type: [String]
    },

    activityDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("MonitoringActivity", MonitoringActivitySchema)
