# 📚 Manga App (MERN Stack)

A full-stack manga discovery and management app built with the **MERN stack** (MongoDB, Express, React, Node.js).  
Users can search for manga, browse details, and save favorites.  

---

## 🚀 Features
- 🔍 **Search Manga** using MangaDex API  
- 📖 **View Manga Details** with cover, author, genres, and description  
- 💾 **Save Manga** to your personal list  
- 🔑 **Authentication** (login/register)  
- 📱 **Responsive UI** with React Bootstrap  

---

## ⚙️ Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)  
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)  
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- An [OpenAI API key](https://platform.openai.com/account/api-keys) for GPT-powered recommendations

---

## 📂 Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/manga-app.git
cd manga-app

## 🛠️ Setup & Running

### 1️⃣ Install Dependencies
From the project root, install dependencies for both **frontend** and **backend**:

```bash
cd frontend
npm install

cd ../backend
npm install

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env

### 🛑 Stopping the App
To stop either the frontend or backend server, go to the terminal window where it’s running and press:
CTRL + C
