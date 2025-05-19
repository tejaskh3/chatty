import bcrypt from "bcryptjs"
import User from "../models/user.models.js"
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
try {
    const {email, fullName, password} = req.body

    if(!email || !fullName || !password) {
        return res.status(400).json({message: "All fields are required!"})
    }
    if(password.length < 8) {
        return res.status(400).json({message: "Password must be at least 8 characters"})
    }

    const existingUser = await User.findOne({email})
    if (existingUser) {
        return res.status(400).json({message: "User already exists"})
    }

    const salt = bcrypt.genSaltSync(10)
    const hashPassword = await bcrypt.hash(password, salt)

    
    const newUser = await User.create({email, fullName, password: hashPassword})
    if(newUser) {
    // to do add this into function later
    const token = jwt.sign({email}, process.env.SECRET_KEY, { expiresIn: "7d" })
    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: true,
        secure: process.env.NODE_ENV === "production"
    })

    res.status(201).json({token, user: newUser, message: "user created!"})
    }
    else{
        res.status(500).json({message: "Invalid user data!"})
    }
} catch (error) {
    console.log("unable to create user", error.message)
    res.status(500).send("unable to create user" + error.message)
}
}
export const login = async (req, res) => {
    try {
        const {email, password} = req.body
        if(!email || !password) {
            return res.status(400).json({message: "All fields are required!"})
        }
        if(password.length < 8) {
            return res.status(400).json({message: "Wrong password"})
        }

        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({message: "User does not exist"})
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect) {
            return res.status(400).json({message: "Wrong password"})
        }
        // todo: add this in a util function later
        const token = jwt.sign({email}, process.env.SECRET_KEY, { expiresIn: "7d" })
        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            sameSite: true,
            secure: process.env.NODE_ENV === "production"
        })

        res.status(200).json({token, user, message: "login successful!"})
    } catch (error) {
        console.log("unable to login", error.message)
        res.status(500).json({message: "unable to login" + error.message})
    }
}
export const logout = (req, res) => {
    res.send("Logout")
}
