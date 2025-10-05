const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true, //no duplicate usernames
        trim: true, //removes white space
        minlength: 3,
        maxlength: 30,
        match: /^[a-zA-Z0-9_]+$/ //only allows letters, numbers, and underscores
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: '',
        maxlength: 300,
        trim: true
    },
    profilePicture: {
        type: String,
        default: '' //URL to profile picture
    }

}, {timestamps: true});

const users = mongoose.model('users', userSchema);
module.exports = users; //export the users