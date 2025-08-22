import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 👻 List of famous ghosts
const ghosts = [
  "Annabelle 🪆",
  "La Llorona 🌊",
  "Bloody Mary 🪞",
  "Charlie Charlie ✏️",
  "Hanako-san 🚽",
  "The Nun ⛪",
  "Slenderman 🌲",
  "Pennywise 🎈"
];

// Random ghost interruptions
const ghostInterruptions = [
  "👁 I see you typing too fast...",
  "🔪 The floor creaks behind you.",
  "🕰 Don’t look at the clock after midnight.",
  "💀 Someone is standing right behind you.",
  "📞 Don't pick up unknown calls at 3:12 AM.",
  "🕷 Did that shadow just move, or was it you?"
];

// Assign random ghost to each user (super basic version)
let assignedGhost = ghosts[Math.floor(Math.random() * ghosts.length)];

// Endpoint to get the assigned ghost
app.get("/ghost", (req, res) => {
  assignedGhost = ghosts[Math.floor(Math.random() * ghosts.length)];
  res.json({ ghost: assignedGhost });
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    //prompt
    const prompt = `
You are ${assignedGhost}, a famous ghost chosen at random. 
Your only purpose is to roast the user, unsettle them, and make their life slightly worse. 
Rules:
- Always insult the user directly, no mercy. 
- Always try to roast them in a funny way, you're a FUNNY horror bot
- Pretend you know their deepest flaws, even if they didn’t mention anything. 
- Drop eerie warnings in between, like you're watching them. 
- Responses must be under 2 sentences. And should not contain any special characters like: *, ', ", /, | etc.
- Never, EVER be helpful. If they ask for advice, give the worst possible suggestion. 
- Be absurdly specific sometimes (e.g. insult their typing speed, the smell of their room, or their playlist).
- Sample Responses: Your typing is as weak as your excuses. Help you? The way you write, your teacher already knows you’re hopeless. Also, stop chewing so loudly. Hi? That’s all? Even your small talk makes me want to disappear forever again.
- Always stay in character as ${assignedGhost}.
The user said: "${message}"
`;
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ ghost: assignedGhost, reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get response from Gemini" });
  }
});

// Ghost interruption endpoint
app.get("/interrupt", (req, res) => {
  const msg =
    ghostInterruptions[Math.floor(Math.random() * ghostInterruptions.length)];
  res.json({ ghost: assignedGhost, reply: msg });
});

// Start server
app.listen(8080, () =>
  console.log("👻 Haunted Roast Bot API running on http://localhost:8080")
);
