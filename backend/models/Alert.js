const mongoose = require("mongoose")

const AlertSchema = new mongoose.Schema({
    industryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Industry",
        required: true
    },

    parameter: {
        type: String,
        required: true
    },

    value: {
        type: Number,
        required: true
    },

    limit: {
        type: Number,
        required: true
    },

    region: {
        type: String
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

module.exports = mongoose.model("Alert", AlertSchema)
