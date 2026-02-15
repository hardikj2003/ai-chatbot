import { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import ThinkingIndicator from "./ThinkingIndicator";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const scrollRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Fetch all chat sessions for the sidebar on component load
  const fetchAllChats = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/chat/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setChatList(data);
        // Automatically load the most recent chat if no active chat is set
        if (data.length > 0 && !activeChatId) {
          setActiveChatId(data[0]._id);
          setMessages(data[0].messages);
        }
      }
    } catch (err) {
      console.error("Failed to fetch chat list", err);
    }
  };

  useEffect(() => {
    fetchAllChats();
  }, []);

  const startNewChat = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/chat/new", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setActiveChatId(data._id);
        setMessages([]);
        setChatList((prev) => [data, ...prev]);
      }
    } catch (err) {
      console.error("Error creating new chat", err);
    }
  };

  const switchChat = (chat) => {
    setActiveChatId(chat._id);
    setMessages(chat.messages);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // If no active chat exists, create one first or handle error
    if (!activeChatId) {
      await startNewChat();
    }

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userText }]); // Distinct display
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: userText,
          chatId: activeChatId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
        fetchAllChats();
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Error connecting to AI. Try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-800 overflow-hidden font-sans">
      {/* Pass session handlers to Sidebar */}
      <Sidebar
        chatList={chatList}
        activeChatId={activeChatId}
        onNewChat={startNewChat}
        onSwitchChat={switchChat}
        fetchAllChats={fetchAllChats} 
        setMessages={setMessages} 
        setActiveChatId={setActiveChatId} 
      />

      <main className="flex-1 flex flex-col relative bg-white">
        <header className="px-6 py-4 border-b border-gray-100 font-extrabold text-lg text-gray-900">
          AI Chatbot
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-8 bg-white">
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-gray-400 mt-20">
                Start a new conversation...
              </div>
            )}
            {messages.map((msg, i) => (
              <MessageBubble key={i} role={msg.role} text={msg.text} />
            ))}
            {isLoading && <ThinkingIndicator />}
            <div ref={scrollRef} />
          </div>
        </div>

        <ChatInput
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          onSubmit={handleSendMessage}
        />
      </main>
    </div>
  );
};

export default Chat;
