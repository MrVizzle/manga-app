const User = require('../models/userModels');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ============================
// 📌 User Registration
// ============================
const registerUser = async (req, res) =>{
    try{
        const {userName, email, password} = req.body;

        //Validate required fields
        if(!userName || !email || !password){
            return res.status(400).json({error: 'All fields are required'});
        }

        //If user already exists, by email or username
        const existingUser = await User.findOne({$or: [{email}, {userName}] });
        if(existingUser){
            return res.status(400).json({error: 'User already exists'});
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10); //Scrambles password to prevent hackers from reading it

        //Create and Save uswer
        const user = new User({userName, email, password: hashedPassword});
        await user.save();

        //Send back user info without password
        const token = jwt.sign(
            {userId: user._id, userName: user.userName},
            process.env.JWT_SECRET,
        );

        // Return user info/token for auto-login
        res.status(201).json({
            token,
            user: {
                userName: user.userName,
                email: user.email,
                userId: user._id
            }
        });

    }
    catch(error){
        res.status(500).json({error: 'Registration failed'})
    }
};

// ============================
// 🔐 User Login
// ============================

const loginUser = async (req, res) => {
    try{
        const {identifier, password} = req.body; //identifier = email or username

        if(!identifier || !password){
            return res.status(400).json({error: 'Username or Email and password are required!'});
        }

        // Find user by Username or Email
        const user = await User.findOne({
            $or: [{email: identifier}, {userName: identifier}],
        });

        //if no user, return error
        if(!user){
            return res.status(401).json({error: 'Authentication failed'});
        }

        //compare provided password with hashed one in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            return res.status(401).json({error: 'Authentication failed, passwords dont match!'});
        }

        //if valid, log in user
        const token = jwt.sign(
            {userId: user._id, userName: user.userName},
            process.env.JWT_SECRET,
        );
        //Send back token and user info to frontend
        res.status(200).json({ token, 
            user: {
                userName: user.userName,
                email: user.email,
                userId: user._id,
                profilePicture: user.profilePicture || null
            } 

        });
    }
    catch(error){
        res.status(500).json({error: 'Login failed'});
    }
}

module.exports = {
    registerUser,
    loginUser
}