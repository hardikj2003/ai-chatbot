import React from "react";
import { User, Bot } from "lucide-react";

const MessageBubble = ({ role, text }) => (
  <div
    className={`flex gap-4 ${role === "user" ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`flex gap-4 max-w-[85%] ${role === "user" ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${role === "user" ? "bg-blue-600 shadow-md" : "bg-gray-100 border border-gray-200"}`}
      >
        {role === "user" ? (
          <User size={18} className="text-white" />
        ) : (
          <Bot size={18} className="text-gray-500" />
        )}
      </div>
      <div
        className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm ${role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-gray-50 text-gray-800 border rounded-tl-none"}`}
      >
        {text}
      </div>
    </div>
  </div>
);


export default MessageBubble;