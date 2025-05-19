import express from "express"
import { BASE_URL } from "./constants/urls.js"

const app = express()

app.get(`${BASE_URL}/health`, (req, res) => {
    res.send('OK')
})

app.listen(8000, () => {
    console.log("APP is working on the port", 8000)
})