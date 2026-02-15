import { Bot } from "lucide-react";

const ThinkingIndicator = () => (
  <div className="flex gap-4 justify-start">
    <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 border animate-pulse">
      <Bot size={18} className="text-gray-400" />
    </div>
    <div className="px-5 py-3.5 rounded-2xl bg-gray-50 text-gray-400 text-sm italic">
      AI is thinking...
    </div>
  </div>
);


export default ThinkingIndicator;