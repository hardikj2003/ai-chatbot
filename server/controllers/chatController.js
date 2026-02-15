import Chat from "../models/Chat.js";
import OpenAI from "openai";

// Initialize OpenAI with your API Key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * @desc    Get all chat sessions for the logged-in user (Sidebar)
 * @route   GET /api/chat/all
 */
export const getAllUserChats = async (req, res) => {
  try {
    const userId = req.user.id;
    // Find all chats for user, sorted by most recently updated
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    res.status(200).json(chats);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching chat list", error: err.message });
  }
};

/**
 * @desc    Create a brand new chat session
 * @route   POST /api/chat/new
 */
export const createNewChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const newChat = new Chat({
      userId,
      title: "New Chat",
      messages: [],
    });
    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating new chat", error: err.message });
  }
};

/**
 * @desc    Process a message within a specific chat session
 * @route   POST /api/chat
 */
export const handleChat = async (req, res) => {
  try {
    const { prompt, chatId } = req.body;
    const userId = req.user.id;

    if (!chatId) {
      return res.status(400).json({ message: "chatId is required" });
    }

    // 1. Get AI Response from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const aiText = completion.choices[0].message.content;

    // 2. Find the existing chat session
    const chat = await Chat.findOne({ _id: chatId, userId });

    if (!chat) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    // 3. Save User and AI messages to history
    chat.messages.push({ role: "user", text: prompt });
    chat.messages.push({ role: "ai", text: aiText });

    // 4. Update title based on the first prompt if it's still the default
    if (chat.title === "New Chat" && chat.messages.length > 0) {
      chat.title =
        prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt;
    }

    await chat.save();
    res.status(200).json({ reply: aiText });
  } catch (err) {
    res
      .status(500)
      .json({ message: "AI Processing Error", error: err.message });
  }
};

/**
 * @desc    Get history for a specific chat session
 * @route   GET /api/chat/history/:chatId
 */
export const getHistory = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findOne({ _id: chatId, userId });

    if (!chat) {
      return res.status(404).json({ history: [], message: "Chat not found" });
    }

    res.status(200).json({ history: chat.messages });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching history", error: err.message });
  }
};

/**
 * @desc    Delete a specific chat session
 * @route   DELETE /api/chat/:chatId
 */
export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    // Find and delete the chat, ensuring it belongs to the logged-in user
    const deletedChat = await Chat.findOneAndDelete({ _id: chatId, userId });

    if (!deletedChat) {
      return res.status(404).json({ message: "Chat not found or unauthorized" });
    }

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting chat", error: err.message });
  }
};
