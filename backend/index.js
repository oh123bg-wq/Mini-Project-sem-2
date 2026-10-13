const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

// Import feature route handlers
const userRoutes = require("./routes/userRoute");
const cheatsheetRoutes = require("./routes/cheatsheetRoute");
const codeNoteRoutes = require("./routes/codeNoteRoute");
const classNoteRoutes = require("./routes/classNoteRoute");

// Load environment variables from .env file
require("dotenv").config();

// Configure CORS handler to allow requests from the frontend
const corsHandler = cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
    preflightContinue: true
});

// Apply CORS middleware globally
app.use(corsHandler);

// Connect to MongoDB Atlas database
mongoose
    .connect(process.env.MONGODB_URI)
    // if successfully connect send this
    .then(() => {
        console.log("MongoDB Connected");
    })
    // otherwise send this
    .catch(err => console.log(err));

// Mount route endpoints
app.use("/users", userRoutes);
app.use("/cheatsheets", cheatsheetRoutes);
app.use("/codeNotes", codeNoteRoutes);
app.use("/classNotes", classNoteRoutes);

// Define server running port
const PORT = process.env.PORT;

// Start listening for incoming requests
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});