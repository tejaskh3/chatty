import express from "express"
import { signup, login, logout } from "../controllers/auth.controllers.js"

export const authRouter = express.Router()

authRouter.post('/signup', signup).post('/login', login). post('/logout', logout)
