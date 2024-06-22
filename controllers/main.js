const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

// Define an array to store chat history
let chatHistory = [];

const getResponse = async (req, res) => {
  const { prompt: data } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  // Pass the chat history to the chat session
  const chatSession = model.startChat({
    generationConfig,
    history: chatHistory,
  });

  try {
    const result = await chatSession.sendMessage(data);
    const response = result.response.text();

    // Add user message to chat history
    chatHistory.push({
      role: "user",
      parts: [{ text: data }],
    });

    // Add bot response to chat history
    chatHistory.push({
      role: "bot",
      parts: [{ text: response }],
    });

    res.status(200).json({ msg: response });
  } catch (error) {
    console.error("Error generating response:", error);
    res
      .status(500)
      .json({ error: "Failed to get a response. Please try again." });
  }
};

module.exports = {
  getResponse,
};
