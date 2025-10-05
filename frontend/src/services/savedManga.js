import axios from 'axios';

const API_URL = import.meta.env.VITE_API_SAVE_URL;

function authHeader() {     // User authorization to access their manga data
    const user = localStorage.getItem('token');
    return {Authorization: `Bearer ${user}`};
}

export async function getSavedManga() {
    try {
        const response = await axios.get(API_URL, {headers: authHeader()});
        return response.data.data;
    } catch(error){
        console.error('Error fetching saved manga:', error);
        throw error.response?.data || { message: "Failed to load saved manga" };
    }
}

export async function createSavedManga(newData) {
    try{
        const response = await axios.post(API_URL, newData, {headers: authHeader()});
    } catch(error){
        console.error("Error creating saved manga:", error);
        throw error.response?.data || { message: "Failed to create saved manga" };
    }
}

// Update a saved manga's details (e.g chapter or reading status)
export async function updateSavedManga(mangaId, updateData) {
    try {
        const response = await axios.put(`${API_URL}/${mangaId}`, updateData, {
      headers: authHeader()});
        return response.data.data;
    } catch(error){
        console.error(`Error updating saved manga, with Id ${mangaId}:`, error);
        throw error.response?.data || { message: "Failed to update saved manga" };
    }
}

export async function deleteSavedManga(mangaId) {
    try {
        await axios.delete(`${API_URL}/${mangaId}`, {headers: authHeader()});
        return true;
    } catch(error) {
        console.error(`Error deleting saved manga with ID ${mangaId}:`, error);
        throw error.response?.data || { message: "Failed to delete saved manga" };
    }
}