const SavedManga = require('../models/savedMangaModel');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const createSavedManga = async(req, res) => {
    try {

        const {mangaId, mangaTitle, chapter, readingStatus} = req.body;
        const userId = new mongoose.Types.ObjectId(req.user.id);  // from auth middleware

        // Prevent diplicate entries
        const existingManga = await SavedManga.findOne({ userId, mangaId});
        if(existingManga){
            return res.status(400).json({
                success: false,
                message: 'Manga already saved to this user!'
            });
        }


        // Create new saved manga entry
        const savedManga = new SavedManga({
            userId,
            mangaId,
            mangaTitle,
            chapter,
            readingStatus
        });

        await savedManga.save();

        return res.status(201).json({
            success: true,
            message: 'Manga saved successfully',
            data: savedManga
        });

    }
    catch (error){
        if (error && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Manga already saved to this user!'
      });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Error saving manga', error: error.message });
    }
};

// Get all saved manga for a user once logged in
const getAllSavedManga = async(req, res) => {
    try {
        const userId = req.user.id;
        const savedMangaList = await SavedManga.find({userId}).sort({createdAt: -1}); // Sort by most recent
        res.status(200).json({
            success: true,
            data: savedMangaList
        })
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve saves' });
    }
}

const getSaveByMangaId = async(req, res) => {
    try {
        const userId = req.user.id;
        const { mangaId} = req.params;
        
        const savedManga = await SavedManga.findOne({ userId, mangaId });
        if (!savedManga) return res.status(404).json({ error: 'Save not found or doesnt exist' });

        res.status(200).json({
            success: true,
            data: savedManga
        })
    } catch(error){
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve save' });
    }
}

const updateSavedManga = async(req, res) => {
    try {
        const userId = req.user.id;
        const { mangaId} = req.params;
        const { chapter, readingStatus} = req.body;

        const updatedSave = await SavedManga.findOneAndUpdate(
            { userId, mangaId},
            { chapter, readingStatus},
            {new: true} // Return the updated document
        );

        if(!updatedSave) return res.status(404).json({ error: 'Save not found' });

        res.status(200).json({
            success: true,
            data: updatedSave
        })
    } catch(error){
        console.error(error);
        res.status(500).json({ error: 'Failed to update save' });
    }
}

const deleteSavedManga = async(req, res) => {
    try {
        const userId = req.user.id;
        const {mangaId} = req.params;

        const deletedSave = await SavedManga.findOneAndDelete({ userId, mangaId });
        if(!deletedSave) return res.status(404).json({ error: 'Save not found' });

        // TODO: add logic to remove from user custom folders

        res.status(200).json({ message: 'Save deleted', deletedSave });
    } catch(error){
        console.error(error);
        res.status(500).json({ error: 'Failed to delete save' });
    }
}


module.exports = {
    createSavedManga,
    getAllSavedManga,
    getSaveByMangaId, 
    updateSavedManga,
    deleteSavedManga
}