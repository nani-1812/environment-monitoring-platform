const express = require("express")
const router = express.Router()

// Import monitoring activity model
const MonitoringActivity = require("../models/MonitoringActivity")


// ----------------------
// ADD MONITORING ACTIVITY
// ----------------------

router.post("/monitoring-activity", async (req, res) => {

    try {

        const { teamMember, industryId, region, activityType, result } = req.body

        const activity = new MonitoringActivity({
            teamMember,
            industryId,
            region,
            activityType,
            result
        })

        await activity.save()

        res.json({
            message: "Monitoring activity recorded",
            activity
        })

    } catch (error) {

        res.status(500).json({ message: error.message })

    }

})


// ----------------------
// GET MONITORING ACTIVITIES
// ----------------------

router.get("/monitoring-activities", async (req, res) => {

    try {

        const activities = await MonitoringActivity.find()

        res.json(activities)

    } catch (error) {

        res.status(500).json({ message: error.message })

    }

})

module.exports = router
