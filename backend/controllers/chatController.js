const OpenAi = require("openai");
const mongoose = require('mongoose');
const SavedManga = require("../models/savedMangaModel");
const ChatUsage = require("../models/ChatUsage");

const openai = new OpenAi({
    apiKey: process.env.OPEN_AI_KEY
});

const chatSessions = {}; // Placeholder for future chat session management
const dailyLimit = 20; // Daily message limit per user

const chatWithBot = async (req, res) => {
    try{
        const { sessionId, mode, preferences = {}, message } = req.body;

        if(!sessionId) {
          return res.status(400).json({ message: "sessionId is required" });
        }
        
        const userId = new mongoose.Types.ObjectId(req.user.id); 

        //Daily usage Limit checker
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of the day

        // Increment count if exists, or create new doc with count = 1
        const usage = await ChatUsage.findOneAndUpdate(
          { userId, date: today },           // match by user + today
          { $inc: { count: 1 } },            // increment count
          { upsert: true, new: true }        // create if not exists, return updated doc
        );

        // Check if user exceeded limit
        if (usage.count > dailyLimit) {
          return res.status(429).json({
            message: `You have reached your daily chatbot limit of ${dailyLimit} messages. Come back tomorrow!`
          });
        }

        // Initalize tempo session if not exists
        if(!chatSessions[sessionId]) chatSessions[sessionId] = [];

        const userSavedManga = await SavedManga.find({ userId }); // acquire user's saved manga
        const savedTitles = userSavedManga.map(manga => manga.mangaTitle);
        const savedList = savedTitles.length ? savedTitles.join(", "): "You have no saved manga";

        const systemPrompt = `
          You are a super friendly and excited manga enthusiast bot.
          You love recommending manga to your friends in a fun, upbeat way.
          IMPORTANT: You MUST NOT reference any personal user information,
          emails, passwords, or any database content. Only use saved manga titles
          and user preferences to make recommendations.
        `;

        let prompt = "";

        if (mode === "saved") {
      prompt = `
        The user has these saved manga: ${savedList}.
        Recommend 5 manga that are similar in style, genre, or theme,
        but make sure NOT to include any titles already in their saved list.
        Respond in JSON format like this:
        [
          { "title": "Example", "reason": "Why this fits the user" }
        ]
      `;
    } else if (mode === "questionnaire") {
      prompt = `
        The user has these saved manga: ${savedList}.
        User preferences are: genres=${preferences.genres || "Any"},
        length=${preferences.length || "Any"},
        tone=${preferences.tone || "Any"}.
        Recommend 5 manga that match preferences and are NOT in saved list.
        Respond in JSON format like this:
        [
          { "title": "Example", "reason": "Why this fits the user" }
        ]
      `;
    } else {
      prompt = "The user wants manga recommendations. Recommend 5 titles.";
    }

    // Build messages array (system + prompt + optional chat message)
    const messages = [
      { role: "system", content: systemPrompt },
      ...chatSessions[sessionId] //previous chat messages
    ];

    messages.push({ role: "user", content: prompt });
    if (message) messages.push({ role: "user", content: message });

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Change model possiblely
            messages,
            max_tokens: 400, // Edit later, the number of tokens the response can have 
        });

        // Paresee the response
        const replyText = response.choices[0].message.content;

        let recommendations = [];

        
        try{
          recommendations = JSON.parse(replyText);
        } catch{
          const match = replyText.match(/\[.*\]/s);
          if(match) {
            try{
              recommendations = JSON.parse(match[0]);
            } catch(error) {
              console.error("Failed to parse JSON Recomendations:", error);
              recommendations = [];
            }
          } else{
             recommendations = [
            {
            title: "Recommendation Placeholder",
            reason: "I cannot share personal info, but I can reccomend manga based on your saved list and preferences!"
          }
          ];
          }
        }

        // Update session history with latest messages 
        chatSessions[sessionId].push({ role: "user", content: message || prompt });
        chatSessions[sessionId].push({ role: "assistant", content: replyText });


        //return response to frontend
        res.json({
            reply: "Here are some manga recommendations for you! 🎉",
            recommendations,
        });

    }catch(error){
        console.error("Error chatting with bot:", error);
        res.status(500).json({ message: "Something went wrong with the chatbot" });
    }
};

module.exports = { chatWithBot };