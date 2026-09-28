const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const userRoutes = require("./routes/userRoute")
const cheatsheetRoutes = require("./routes/cheatsheetRoute")
const codeNoteRoutes = require("./routes/codeNoteRoute")
const classNoteRoutes = require("./routes/classNoteRoute")

require("dotenv").config();

const corsHandler = cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
    preflightContinue: true
})

app.use(corsHandler)

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected")
    })
    .catch(err => console.log(err))

app.use("/users", userRoutes)
app.use("/cheatsheets", cheatsheetRoutes)
app.use("/codeNotes", codeNoteRoutes)
app.use("/classNotes", classNoteRoutes)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})