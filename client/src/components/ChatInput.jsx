import { Send } from "lucide-react";

const ChatInput = ({ input, setInput, isLoading, onSubmit }) => (
  <div className="p-6 bg-white border-t border-gray-100">
    <form onSubmit={onSubmit} className="max-w-3xl mx-auto relative group flex items-center">
      <input
        type="text" value={input} disabled={isLoading} onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your query..."
        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl py-4 pl-6 pr-14 outline-none focus:bg-white focus:border-blue-400 transition-all shadow-inner"
      />
      <button type="submit" disabled={isLoading} className={`absolute right-3 p-2.5 rounded-xl transition-all ${isLoading ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
        <Send size={18} />
      </button>
    </form>
  </div>
);

export default ChatInput;