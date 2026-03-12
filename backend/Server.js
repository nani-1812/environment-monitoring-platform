const express = require("express"); // import express framework to create server
const cors = require("cors"); // allow frontend and backend communication

const app = express(); // create express application
const PORT = 5000; // server port number

// Import database connection
const connectDB = require("./database/Db"); // connect MongoDB database

// Import API route files
const authRoutes = require("./routes/AuthRoutes"); // authentication routes (login/register)
const industryRoutes = require("./routes/IndustryRoutes"); // industry management routes
const pollutionRoutes = require("./routes/PollutionRoutes"); // pollution data routes
const monitoringRoutes = require("./routes/MonitoringRoutes"); // monitoring team routes
const alertRoutes = require("./routes/AlertRoutes"); // pollution alert routes

// Connect database
connectDB(); // start MongoDB connection

// Middleware
app.use(express.json()); // allow server to receive JSON data
app.use(cors()); // allow cross-origin requests from frontend

// Register API routes
app.use("/api", authRoutes); // routes for login and registration
app.use("/api", industryRoutes); // routes for industry operations
app.use("/api", pollutionRoutes); // routes for pollution data submission
app.use("/api", monitoringRoutes); // routes for monitoring team activities
app.use("/api", alertRoutes); // routes for pollution alerts

// Test Route
app.get("/", (req, res) => { // simple test API to check backend
    res.send("Environmental Monitoring Backend is Running"); // send response message
});

// Start Server
app.listen(PORT, () => { // start server on defined port
    console.log(`Server running on port ${PORT}`); // log message in terminal
});
