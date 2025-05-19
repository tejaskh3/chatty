import express from "express"
import { BASE_URL } from "./constants/urls.js"
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"

import { router } from "./routes/index.js"
import { connectDB } from "./lib/connection.js"

const app = express()
app.use(express.json())
dotenv.config()
app.use(cookieParser())

app.get(`${BASE_URL}/health`, (req, res) => {
    res.send('OK')
})

// routes 
app.use(`${BASE_URL}`, router)

const PORT = process.env.PORT || 8001
const start = (async () => {
    app.listen(PORT, () => {
        console.log("APP is working on the port...", PORT)
    })
    await connectDB(process.env.MONGO_URI)
})()
