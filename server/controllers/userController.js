
import User from "../models/User.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../lib/utils.js";
import { v2 as cloudinary } from 'cloudinary';

// Signup a new user
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing required details" })
        }
        
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "Account already exists" })
        }
        
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashPassword,
            bio: bio || ""
        })
        
        const token = generateToken(newUser._id)

        res.status(201).json({
            success: true,
            user: {
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                bio: newUser.bio,
                profilePic: newUser.profilePic
            },
            token,
            message: "Account created successfully"
        })
    }
    catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}

// controller to login a user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        
        const userData = await User.findOne({ email })
        
        if (!userData) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, userData.password)
        
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        
        const token = generateToken(userData._id)
        
        res.json({
            success: true,
            user: {
                _id: userData._id,
                fullName: userData.fullName,
                email: userData.email,
                bio: userData.bio,
                profilePic: userData.profilePic
            },
            token,
            message: "Login successful"
        })
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message })
    }
}

// controller to check if user is authenticated
export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user });
}

// controller to update user profile details
export const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body
        const userId = req.user._id;
        let updatedUser;
        
        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { bio, fullName },
                { new: true }
            ).select("-password")
        }
        else {
            const upload = await cloudinary.uploader.upload(profilePic)
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { profilePic: upload.secure_url, bio, fullName },
                { new: true }
            ).select("-password");
        }
        
        res.json({ success: true, user: updatedUser })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message })
    }
}