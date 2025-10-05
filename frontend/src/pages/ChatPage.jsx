import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { sendMessageToChatbot } from "../services/chatbotApi";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../pages/PageStyles/ChatPage.css';

const ChatPage = () => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentMode, setCurrentMode] = useState(null); // Track current mode
  const [preferences, setPreferences] = useState({}); // Store questionnaire preferences
  const [awaitingPreferences, setAwaitingPreferences] = useState(false); // Flag for questionnaire flow

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();


 const helpText =  `
Here’s how I work! 🤖

**Modes:**
📝 *Questionnaire Mode* — I’ll ask about your preferences (genres, tone, length) and recommend manga based on your answers.  
📚 *Saved Mode* — I’ll show you manga you’ve saved before.

**Features:**
- Type normally to chat about manga.
- Type “reset” to start over.
- Type “help” anytime to see this message again.
- Click on any manga title to search for it.

Now, choose a mode to begin — or type “help” anytime if you get stuck!
  `;

  // Generate new session on mount
  useEffect(() => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);

    // Initial bot message
    setMessages([
      {
        role: "assistant",
        content: `Hi there! 👋 What can I help you with today?
        
Choose one of the following options to get manga recommendations. (Type 'help' for more info)`,
        showModeButtons: true,
      },
    ]);
  }, []);

  // Handle mode selection
  const handleModeSelect = async (mode) => {
    setCurrentMode(mode);

    const userMessage = { 
      role: "user", 
      content: `Selected: ${mode === "saved" ? "Saved Mode" : "Questionnaire Mode"}` 
    };
    setMessages((prev) => [...prev, userMessage]);

    if (mode === "questionnaire") {
      // Ask for preferences
      setAwaitingPreferences(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Great! Let me know your preferences:
          
Please tell me:
- Preferred genres (e.g., action, romance, fantasy)
- Preferred length (short, medium, long, any)
- Preferred tone (dark, light, serious, comedic, any)

You can type something like: "I like action and fantasy, any length, dark tone"`,
        },
      ]);
    } else {
      // Saved mode - directly fetch recommendations
      // setAwaitingSavedChoice(true);

      setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      content: `You're now in 📚 *Saved Mode*!

You can:
- Type a title you’ve saved to get similar manga, e.g. “recommend something like Attack on Titan”
- Or just say “recommend from my saved list” to get picks based on all your saved titles. But in the meantime, I’ll fetch some recommendations for you!`,
    },
  ]);
      await fetchRecommendations(mode, {});
    }
  };

   // Help system logic
  const handleHelpCommand = () => {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: helpText },
    ]);
  };


  // Fetch recommendations from backend
  const fetchRecommendations = async (mode, prefs = {}) => {
    try {
      const response = await sendMessageToChatbot(sessionId, mode, prefs, "");
      const botMessage = {
        role: "assistant",
        content: response.reply,
        recommendations: response.recommendations,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = error.message || "⚠️ Something went wrong. Please try again later.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage },
      ]);
    }
  };

  // Handle sending message
  const handleSend = async () => {
  if (!input.trim()) return;

  const messageToSend = input; // store current input
  setInput(""); // 🔹 Immediately clear the text field

  const userMessage = { role: "user", content: messageToSend };
  setMessages((prev) => [...prev, userMessage]);

  // Check if user typed "help"
  if (messageToSend.trim().toLowerCase() === "help") {
    handleHelpCommand();
    return;
  }

  // If we're waiting for preferences in questionnaire mode
  if (awaitingPreferences && currentMode === "questionnaire") {
    const parsedPrefs = parsePreferences(messageToSend);
    setPreferences(parsedPrefs);
    setAwaitingPreferences(false);

    await fetchRecommendations("questionnaire", parsedPrefs);
  } else if (currentMode) {
    try {
      const response = await sendMessageToChatbot(sessionId, currentMode, preferences, messageToSend);
      const botMessage = {
        role: "assistant",
        content: response.reply,
        recommendations: response.recommendations,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = error.message || "⚠️ Something went wrong. Please try again later.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage },
      ]);
    }
  } else {
    setMessages((prev) => [
      ...prev,
      { 
        role: "assistant", 
        content: "Please select a mode first by clicking one of the buttons above! 😊",
        showModeButtons: true,
      },
    ]);
  }
};

  // Simple preference parser
  const parsePreferences = (text) => {
    const lowerText = text.toLowerCase();
    const prefs = {};

    // Extract genres
    const genreKeywords = ["action", "romance", "fantasy", "horror", "comedy", "slice of life", "sci-fi", "thriller"];
    const foundGenres = genreKeywords.filter(genre => lowerText.includes(genre));
    if (foundGenres.length > 0) {
      prefs.genres = foundGenres.join(", ");
    }

    // Extract length
    if (lowerText.includes("short")) prefs.length = "short";
    else if (lowerText.includes("medium")) prefs.length = "medium";
    else if (lowerText.includes("long")) prefs.length = "long";
    else prefs.length = "any";

    // Extract tone
    if (lowerText.includes("dark")) prefs.tone = "dark";
    else if (lowerText.includes("light")) prefs.tone = "light";
    else if (lowerText.includes("serious")) prefs.tone = "serious";
    else if (lowerText.includes("comedic") || lowerText.includes("funny")) prefs.tone = "comedic";
    else prefs.tone = "any";

    return prefs;
  };

  // Handle reset
  const handleReset = () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setCurrentMode(null);
    setPreferences({});
    setAwaitingPreferences(false);
    setMessages([
      {
        role: "assistant",
        content: `Chat reset ✅ 

Hi again! 👋 Choose a mode to get started.
(Type 'help' for more info)`,
        showModeButtons: true,
      },
    ]);
    setInput("");
  };

  return (
  <div className="chat-page">
    <div className="chat-container">
      {!user ? (
  <div className="chat-locked-container">
    <div className="chat-locked-card">
      <h1 className="chat-title">🔒 Manga ChatBot</h1>
      <p className="locked-message">
        You must be logged in to chat with the bot. You cannot send messages while logged out.
      </p>
      <button className="login-btn" onClick={() => navigate("/login")}>
        Go to Login
      </button>
    </div>
  </div>
      ) : (
        // Logged-in chat UI
        <>
          <h1 className="chat-title">Manga ChatBot 🤖</h1>

          {/* Chat messages */}
          <div className="chat-box">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-bubble ${msg.role === "user" ? "user-bubble" : "bot-bubble"}`}
              >
                <p>{msg.content}</p>

                {/* Show mode selection buttons */}
                {msg.showModeButtons && !currentMode && (
                  <div className="mode-buttons">
                    <button
                      className="mode-btn saved-btn"
                      onClick={() => handleModeSelect("saved")}
                    >
                      📚 Saved Mode
                    </button>
                    <button
                      className="mode-btn questionnaire-btn"
                      onClick={() => handleModeSelect("questionnaire")}
                    >
                      📝 Questionnaire Mode
                    </button>
                  </div>
                )}

                {/* Show recommendations */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <ul className="recommendations-list">
                    {msg.recommendations.map((rec, i) => (
                      <li key={i} className="recommendation-item">
                        <span
                          className="recommendation-link"
                          onClick={() =>
                            navigate(`/search?q=${encodeURIComponent(rec.title)}`)
                          }
                        >
                          <strong>{rec.title}</strong>
                        </span>
                        {rec.reason && (
                          <p className="recommendation-reason">{rec.reason}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Input + buttons */}
          <div className="chat-input-area">
            <input
              type="text"
              placeholder={
                awaitingPreferences
                  ? "Tell me your preferences..."
                  : currentMode
                  ? "Type your message..."
                  : "Select a mode first..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={!user} // extra safety: prevent typing if logged out
            />
            <button className="reset-btn" onClick={handleReset} disabled={!user}>
              Reset
            </button>
            <button className="send-btn" onClick={handleSend} disabled={!user}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);
}


export default ChatPage;