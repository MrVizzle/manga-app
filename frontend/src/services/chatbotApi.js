import axios from 'axios';

const API_URL = import.meta.env.VITE_API_CHATBOT_URL;

// Helper function to attach token
function authHeader() {
  const user = localStorage.getItem("token");
  return { Authorization: `Bearer ${user}` };
}


export const sendMessageToChatbot = async (sessionId, mode = null, preferences = {}, message) => {
    try {
    const response = await axios.post(
      API_URL,
      { sessionId, mode, preferences, message },
      { headers: authHeader() } // attach token here
    );

        return response.data;
    } catch (error) {
        console.error('Error sending message to chatbot:', error);
        throw error.response?.data || {message: "Chatbot service is unavailable."};
    }
};