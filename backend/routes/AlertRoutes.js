const express = require("express")
const router = express.Router()

// Import alert model
const Alert = require("../models/Alert")


// ----------------------
// CREATE ALERT
// ----------------------

router.post("/alerts", async (req, res) => {

    try {

        const { industryId, parameter, value, limit, region } = req.body

        const alert = new Alert({
            industryId,
            parameter,
            value,
            limit,
            region
        })

        await alert.save()

        res.json({
            message: "Pollution alert created",
            alert
        })

    } catch (error) {

        res.status(500).json({ message: error.message })

    }

})


// ----------------------
// GET ALERTS
// ----------------------

router.get("/alerts", async (req, res) => {

    try {

        const alerts = await Alert.find()

        res.json(alerts)

    } catch (error) {

        res.status(500).json({ message: error.message })

    }

})

module.exports = router
