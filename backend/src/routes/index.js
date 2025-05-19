import express from "express";
import { authRouter } from "./auth.routes.js";
export const router = express.Router()

router.use("/auth", authRouter)