import axios from "axios";

const API_URL = import.meta.env.VITE_API_PROFILE_URL;

function authHeader() {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
}

export async function getUserProfile(username){
    try{
        const response = await axios.get(`${API_URL}/${username}`);
        return response.data;
    } catch(error){
        console.error('Error fetching profile:', error);
        throw error.response?.data || { message: "Failed to load profile" };
    }
}

export async function updateProfile(profileData) {
    try {
        const response = await axios.put(API_URL, profileData, { headers: authHeader() });
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error.response?.data || { message: "Failed to update profile" };
    }
}

export async function updateAvatar(profilePicture) {
    try {
        const response = await axios.put(`${API_URL}/avatar`, 
            { profilePicture }, 
            { headers: authHeader() }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating avatar:', error);
        throw error.response?.data || { message: "Failed to update avatar" };
    }
}

export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error('No file provided'));
            return;
        }

        if (!file.type.startsWith('image/')) {
            reject(new Error('File must be an image'));
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            reject(new Error('Image size must be less than 5MB'));
            return;
        }

        const reader = new FileReader();
        
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        
        reader.readAsDataURL(file);
    });
}

export function validateProfileData(profileData) {
    const errors = {};

    // Username validation
    if (profileData.userName !== undefined) {
        if (typeof profileData.userName !== 'string') {
            errors.userName = 'Username must be a string';
        } else if (profileData.userName.length < 3 || profileData.userName.length > 20) {
            errors.userName = 'Username must be 3-20 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(profileData.userName)) {
            errors.userName = 'Username can only contain letters, numbers, and underscores';
        }
    }

    // Bio validation
    if (profileData.bio !== undefined) {
        if (typeof profileData.bio !== 'string') {
            errors.bio = 'Bio must be a string';
        } else if (profileData.bio.length > 500) {
            errors.bio = 'Bio cannot exceed 500 characters';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

export function isProfileOwner(profileUsername, currentUser) {
    return currentUser && currentUser.userName === profileUsername;
}