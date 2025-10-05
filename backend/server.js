require ('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const savedMangaRoutes = require('./routes/savedMangaRoutes');
const chatBotRoutes = require('./routes/chatBotRoutes');
const profileRoutes = require('./routes/profileRoutes');

//express app
const app = express()

 app.use(cors( {    //connects frontend and backend
     origin: process.env.CLIENT_URL,  
     credentials: true // Allow cookies to be sent
}));



//middleware
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/saved-manga', savedMangaRoutes);
app.use('/api', chatBotRoutes); 
app.use('/api/profile', profileRoutes);


//connect to mongoDb
mongoose.connect(process.env.MONGODB_URL)
    .then((result) => {
        console.log('Connected to Database');
        app.listen(process.env.PORT);
    })
    .catch((err) => {
        console.log('Error at connecting database' + err)
    })