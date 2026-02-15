import { Plus, MessageCircle, LogOut, Trash2 } from "lucide-react"; // Added Trash2 icon

// 1. Add the missing functions to your props destructuring
const Sidebar = ({
  chatList,
  activeChatId,
  onNewChat,
  onSwitchChat,
  fetchAllChats, // Added
  setMessages, // Added
  setActiveChatId, // Added
}) => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation(); // Prevents switching to the chat while deleting it

    try {
      const response = await fetch(`http://localhost:8000/api/chat/${chatId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        // These now work because they are passed as props!
        fetchAllChats();
        if (activeChatId === chatId) {
          setMessages([]);
          setActiveChatId(null);
        }
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-72 bg-gray-50 border-r border-gray-200">
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-2xl font-bold shadow-sm hover:bg-gray-50 transition-all active:scale-95"
        >
          <Plus size={18} /> New Chat
        </button>
      </div>

      <nav className="flex-1 px-3 mt-4 overflow-y-auto">
        <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold px-3 mb-3">
          History
        </p>

        <div className="space-y-1">
          {chatList && chatList.length > 0 ? (
            chatList.map((chat) => (
              <div key={chat._id} className="group relative">
                <button
                  onClick={() => onSwitchChat(chat)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium truncate pr-10 ${
                    activeChatId === chat._id
                      ? "bg-blue-50 text-blue-600 border border-blue-100"
                      : "text-gray-600 hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  <MessageCircle
                    size={18}
                    className={
                      activeChatId === chat._id
                        ? "text-blue-500"
                        : "text-gray-400"
                    }
                  />
                  <span className="truncate">
                    {chat.title || "New Conversation"}
                  </span>
                </button>

                {/* Delete Button - Only visible on hover */}
                <button
                  onClick={(e) => handleDeleteChat(e, chat._id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 px-3 italic">
              No previous chats
            </p>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-gray-500 hover:text-red-600 transition-colors text-sm font-semibold"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
