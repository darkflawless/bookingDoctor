

import { log } from "console";
import OpenAI from "openai";
import { getMultipartRequestOptions } from "openai/_shims/index.mjs";

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENAI_API_KEY ,
});

let chatHistory = [];

const autoRep = async (req, res) => {
  try {

    const { message } = req.body;

    if (message === 'Hello Assistant') {
      chatHistory = [];
    }
    
    console.log("message:", message);

    // Cập nhật lịch sử trò chuyện (chỉ giữ 3 tin nhắn gần nhất)
    chatHistory.push({ role: "user", content: message });
    if (chatHistory.length > 6) {
      chatHistory = chatHistory.slice(-6); // Chỉ giữ lại 3 cặp user-bot
    }

    const messages = [
      { role: "system", content: "You are a medical assistant." },
      ...chatHistory,
    ];

    // Gọi API 
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-4-maverick:free",
      messages,
    });

    const botResponse = completion.choices[0].message.content || "HEllO";

    console.log("botResponse:", botResponse);
    
    if (!botResponse) {
      return res.status(500).json({ success: false, message: "No response from AI" });
    }
    chatHistory.push({ role: "assistant", content: botResponse });

    res.json({ success: true, response: botResponse });

  } catch (error) {
    console.error("error:", error);
    res.status(500).json({success: false, error: error.message });
  }
};

export { autoRep };
