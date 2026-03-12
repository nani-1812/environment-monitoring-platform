// Import express
const express = require("express")

// Create router
const router = express.Router()

// Import Industry model
const Industry = require("../models/Industry")


// ----------------------
// REGISTER INDUSTRY
// ----------------------

router.post("/register-industry", async (req, res) => {

    try {

        // Extract industry details from frontend
        const { name, type, region, location, latitude, longitude } = req.body

        // Create new industry object
        const industry = new Industry({
            name,
            type,
            region,
            location,
            latitude,
            longitude
        })

        // Save industry to database
        await industry.save()

        res.status(201).json({
            message: "Industry registered successfully",
            industry
        })

    } catch (error) {

        res.status(500).json({ message: error.message })

    }

})


// ----------------------
// GET ALL INDUSTRIES
// ----------------------

router.get("/industries", async (req, res) => {

    try {

        // Fetch all industries from database
        const industries = await Industry.find()

        res.json(industries)

    } catch (error) {

        res.status(500).json({ message: error.message })

    }

})


// ----------------------
// DELETE INDUSTRY
// ----------------------

router.delete("/industry/:id", async (req, res) => {

    try {

        // Remove industry using id
        await Industry.findByIdAndDelete(req.params.id)

        res.json({ message: "Industry removed by HQ" })

    } catch (error) {

        res.status(500).json({ message: error.message })

    }

})

module.exports = router
