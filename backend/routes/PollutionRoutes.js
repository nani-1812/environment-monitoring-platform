const express = require("express")
const router = express.Router()

// Import pollution model
const PollutionData = require("../models/PollutionData")


// ----------------------
// ADD POLLUTION DATA
// ----------------------

router.post("/pollution-data", async (req, res) => {

    try {

        // Extract pollution values sent from sensors
        const { industryId, region, PM25, SO2, noise, waterPH, temperature } = req.body

        // Create pollution data object
        const pollution = new PollutionData({
            industryId,
            region,
            PM25,
            SO2,
            noise,
            waterPH,
            temperature
        })

        // Save pollution data in database
        await pollution.save()

        res.json({
            message: "Pollution data recorded",
            pollution
        })

    } catch (error) {

        res.status(500).json({ message: error.message })

    }

})


// ----------------------
// GET POLLUTION DATA
// ----------------------

router.get("/pollution-data", async (req, res) => {

    try {

        // Fetch pollution readings
        const data = await PollutionData.find()

        res.json(data)

    } catch (error) {

        res.status(500).json({ message: error.message })

    }

})

module.exports = router
