const { get } = require('mongoose');
const User  = require('../models/userModels');
const jwt = require('jsonwebtoken');

// 📋 Get Public Profile

const getProfile = async(req, res) => {
    try{
        const {username} = req.params;

        // find User by username, exclude password
        const user = await User.findOne({userName: username}, {password: 0});

        if(!user){
            return res.status(404).json({error: 'User not found or does not exist!'});
        }

        //return profile data
          res.status(200).json({
            userName: user.userName,
            bio: user.bio,
            profilePicture: user.profilePicture,
        });

    }catch(error){
        res.status(500).json({error: 'Failed to fetch profile'});
    }
}

// ✏️ Update Own Profile (Bio, Username)

const updateProfile = async(req, res) => {
    try{
        const {userName, bio} = req.body;
        const userId = req.user.id; // auth middleware

        // User has been authenticated by middleware
        const currentUser = await User.findById(userId);
        if(!currentUser){
            return res.status(404).json({error: 'User not found'});
        }

        // Validation
        if (userName && (userName.length < 3 || userName.length > 20)) {
            return res.status(400).json({ error: 'Username must be 3-20 characters' });
        }
        
        if (userName && !/^[a-zA-Z0-9_]+$/.test(userName)) {
            return res.status(400).json({ error: 'Username can only contain letters, numbers, and underscores' });
        }
        
        if (bio && bio.length > 500) {
            return res.status(400).json({ error: 'Bio cannot exceed 500 characters' });
        }

        // Check if new username already exists
        if(userName){
            const existingUser  = await User.findOne({userName: userName, _id: {$ne: userId}});

            if(existingUser) {
                return res.status(400).json({error: 'Username is already taken'});
            }
        }

        // Update fields
        const updateData = {};
        if(userName !== undefined) updateData.userName = userName;
        if(bio !== undefined) updateData.bio = bio;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, select: '-password' } // Return updated user without password
        );

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                userName: updatedUser.userName,
                bio: updatedUser.bio,
                profilePicture: updatedUser.profilePicture
            }
        });

    } catch(error){
        res.status(500).json({ error: 'Failed to update profile' });
    }
}

// 📷 Update Profile Picture

const updateAvatar = async (req, res) => {
    try {
        const { profilePicture } = req.body;
        const userId = req.user.id; // From your requireAuth middleware
        
      
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        if (!profilePicture) {
            return res.status(400).json({ error: 'Profile picture data required' });
        }
        
        // Basic validation for base64 image
        if (!profilePicture.startsWith('data:image/')) {
            return res.status(400).json({ error: 'Invalid image format' });
        }
        
        // Update user's profile picture
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicture },
            { new: true, select: '-password' }
        );
        
        res.status(200).json({
            message: 'Profile picture updated successfully',
            profilePicture: updatedUser.profilePicture
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile picture' });
    }
};

module.exports = {getProfile, updateProfile, updateAvatar};