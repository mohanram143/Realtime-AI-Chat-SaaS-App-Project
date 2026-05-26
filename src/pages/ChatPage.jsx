// src/pages/ChatPage.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth }     from "../context/AuthContext";
import { useChat }     from "../hooks/useChat";
import { renderMarkdown } from "../state/lib/markdown";
import toast, { Toaster } from "react-hot-toast";

/* ════════════════════════════════════════════
   SVG ICON SYSTEM
════════════════════════════════════════════ */
const Icon = ({ d, size = 18, className = "", strokeWidth = 1.8 }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    {Array.isArray(d)
      ? d.map((p, i) => <path key={i} d={p} />)
      : <path d={d} />}
  </svg>
);

const IC = {
  menu:      ["M3 12h18", "M3 6h18", "M3 18h18"],
  newChat:   "M12 5v14M5 12h14",
  search:    "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  send:      "M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z",
  trash:     ["M3 6h18", "M19 6l-1 14H6L5 6", "M9 6V4h6v2"],
  copy:      ["M20 9H11a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z", "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 0 2 2v1"],
  mic:       ["M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z", "M19 10v2a7 7 0 0 1-14 0v-2", "M12 19v4", "M8 23h8"],
  attach:    ["M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"],
  logout:    ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  settings:  ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
  projects:  ["M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"],
  library:   ["M4 19.5A2.5 2.5 0 0 1 6.5 17H20", "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"],
  apps:      ["M12 2L2 7l10 5 10-5-10-5z", "M2 17l10 5 10-5", "M2 12l10 5 10-5"],
  more:      ["M5 12h.01", "M12 12h.01", "M19 12h.01"],
  check:     "M20 6L9 17l-5-5",
  chevDown:  "M6 9l6 6 6-6",
};

/* ════════════════════════════════════════════
   DATA
════════════════════════════════════════════ */
const SUGGESTIONS = [
  { icon: "🖼️", label: "Create an image",     sub: "Generate visuals with AI" },
  { icon: "✍️", label: "Write or edit",        sub: "Draft, refine, improve" },
  { icon: "🔍", label: "Look something up",    sub: "Research any topic fast" },
  { icon: "💻", label: "Help with code",        sub: "Debug, explain, generate" },
];

const QUICK_PROMPTS = [
  "Explain quantum computing simply",
  "Write a professional email",
  "Debug my JavaScript code",
  "Create a weekly plan for me",
  "Summarise a topic in 5 bullets",
  "Give me a creative story idea",
];

/* ════════════════════════════════════════════
   SIDEBAR NAV ITEM
════════════════════════════════════════════ */
function NavItem({ iconKey, label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-150 group ${
        active
          ? "bg-white/10 text-white"
          : "text-[#8e8ea0] hover:bg-white/5 hover:text-[#ececf1]"
      }`}
    >
      <Icon d={IC[iconKey]} size={16} className="flex-shrink-0 opacity-75 group-hover:opacity-100" />
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="text-[10px] font-black bg-[#10a37f] text-white px-1.5 py-0.5 rounded-full leading-none">
          {badge}
        </span>
      )}
    </button>
  );
}

/* ════════════════════════════════════════════
   CHAT HISTORY ITEM
════════════════════════════════════════════ */
function HistoryItem({ title, active, onClick, onDelete }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[12.5px] transition-all duration-150 group ${
        active
          ? "bg-white/10 text-[#ececf1]"
          : "text-[#8e8ea0] hover:bg-white/5 hover:text-[#c5c5d2]"
      }`}
    >
      <span className="flex-1 text-left truncate leading-snug">{title}</span>
      <span
        role="button"
        tabIndex={-1}
        onClick={e => { e.stopPropagation(); onDelete(); }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all flex-shrink-0"
      >
        <Icon d={IC.trash} size={12} />
      </span>
    </button>
  );
}

/* ════════════════════════════════════════════
   TYPING DOTS
════════════════════════════════════════════ */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1.5">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[#8e8ea0]"
          style={{
            animation: "mofiBounce 0.8s ease-in-out infinite",
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════
   MESSAGE BUBBLE
════════════════════════════════════════════ */
function MessageBubble({ msg }) {
  const isUser  = msg.role === "user";
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(msg.content).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 group mb-6 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-black flex-shrink-0 shadow-lg ${
        isUser
          ? "bg-gradient-to-br from-[#ff6b6b] to-[#ff4444] text-white"
          : "bg-gradient-to-br from-[#10a37f] to-[#0d8a6c] text-white"
      }`}>
        {isUser ? "U" : "M"}
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-1 max-w-[76%] ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-3 rounded-2xl text-[13.5px] leading-relaxed shadow-sm ${
          isUser
            ? "bg-[#2f2f2f] text-[#ececf1] rounded-tr-sm"
            : "bg-[#1e1e2e] text-[#ececf1] rounded-tl-sm border border-white/[0.06]"
        }`}>
          {isUser
            ? <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
            : <div className="prose-dark font-medium" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
          }
        </div>

        {/* Actions */}
        {!isUser && (
          <button
            onClick={copy}
            className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-[11px] text-[#8e8ea0] hover:text-white transition-all duration-150 px-2 py-1 rounded-lg hover:bg-white/5"
          >
            <Icon d={copied ? IC.check : IC.copy} size={12} />
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN CHAT PAGE
════════════════════════════════════════════ */
export default function ChatPage() {
  const { user, logout }                        = useAuth();
  const navigate                                = useNavigate();
  const { messages, loading, sendMessage, clearMessages } = useChat();

  const [sidebarOpen,    setSidebarOpen]    = useState(true);
  const [input,          setInput]          = useState("");
  const [activeNav,      setActiveNav]      = useState("chat");
  const [searchOpen,     setSearchOpen]     = useState(false);
  const [searchQuery,    setSearchQuery]    = useState("");
  const [activeChatId,   setActiveChatId]   = useState(1);
  const [chatHistories,  setChatHistories]  = useState([
    { id: 1, title: "New chat" },
  ]);

  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);

  /* Scroll to bottom when messages change */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* Auto-resize textarea */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [input]);

  /* ── Send message ── */
  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    // Name the chat from the first message
    if (messages.length === 0) {
      const title = text.slice(0, 42) + (text.length > 42 ? "…" : "");
      setChatHistories(prev =>
        prev.map(c => (c.id === activeChatId ? { ...c, title } : c))
      );
    }

    await sendMessage(text);
  }, [input, loading, messages.length, sendMessage, activeChatId]);

  /* Enter = send, Shift+Enter = newline */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ── New chat ── */
  const newChat = useCallback(() => {
    clearMessages();
    const id = Date.now();
    setChatHistories(prev => [{ id, title: "New chat" }, ...prev]);
    setActiveChatId(id);
    setInput("");
    textareaRef.current?.focus();
  }, [clearMessages]);

  /* ── Delete a history item ── */
  const deleteHistory = (id) => {
    setChatHistories(prev => prev.filter(c => c.id !== id));
    if (id === activeChatId) {
      clearMessages();
      const rest = chatHistories.filter(c => c.id !== id);
      if (rest.length) setActiveChatId(rest[0].id);
    }
  };

  /* ── Logout ── */
  const handleLogout = async () => {
    await logout();
    toast.success("Logged out. See you soon! 👋");
    navigate("/auth", { replace: true });
  };

  const filteredHistory = chatHistories.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const initial    = user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";
  const firstName  = user?.displayName?.split(" ")[0] || "there";
  const isEmpty    = messages.length === 0;

  /* ════════════════════ RENDER ════════════════════ */
  return (
    <div className="flex h-screen bg-[#212121] text-[#ececf1] overflow-hidden" style={{ fontFamily: "'Nunito', system-ui, sans-serif" }}>

      <Toaster position="top-center" toastOptions={{
        style: {
          background: "#2f2f2f", color: "#ececf1",
          borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)",
          fontWeight: "600", fontSize: "13px",
        },
        success: { iconTheme: { primary: "#10a37f", secondary: "#2f2f2f" } },
        error:   { iconTheme: { primary: "#ff6b6b", secondary: "#2f2f2f" } },
      }} />

      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside
        className="flex flex-col bg-[#171717] flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out"
        style={{ width: sidebarOpen ? 260 : 0 }}
      >
        <div className="flex flex-col h-full w-[260px]">

          {/* Top row */}
          <div className="flex items-center justify-between px-3 pt-4 pb-2 flex-shrink-0">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-xl hover:bg-white/5 text-[#8e8ea0] hover:text-white transition-all"
              title="Close sidebar"
            >
              <Icon d={IC.menu} size={18} />
            </button>
            <button
              onClick={newChat}
              className="p-2 rounded-xl hover:bg-white/5 text-[#8e8ea0] hover:text-white transition-all"
              title="New chat"
            >
              <Icon d={IC.newChat} size={18} />
            </button>
          </div>

          {/* Navigation */}
          <div className="px-3 py-1 space-y-0.5 flex-shrink-0">
            <NavItem iconKey="newChat"  label="New Chat"     active={false}                onClick={newChat} />
            <NavItem iconKey="search"   label="Search Chats" active={searchOpen}           onClick={() => setSearchOpen(p => !p)} />
            <NavItem iconKey="projects" label="Projects"     active={activeNav==="projects"} onClick={() => { setActiveNav("projects"); toast("Projects coming soon 🚀"); }} />
            <NavItem iconKey="library"  label="Library"      active={activeNav==="library"}  onClick={() => { setActiveNav("library");  toast("Library coming soon 📚"); }} />
            <NavItem iconKey="apps"     label="Mofi Apps"    active={activeNav==="apps"}     onClick={() => { setActiveNav("apps");     toast("Apps coming soon ⚡"); }} badge="New" />
            <NavItem iconKey="more"     label="More"         active={false}                onClick={() => toast("More options soon 🔧")} />
          </div>

          {/* Search box */}
          {searchOpen && (
            <div className="px-3 pb-2 flex-shrink-0">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                <Icon d={IC.search} size={14} className="text-[#8e8ea0] flex-shrink-0" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search your chats…"
                  autoFocus
                  className="flex-1 bg-transparent text-[13px] text-[#ececf1] placeholder-[#8e8ea0] outline-none"
                />
              </div>
            </div>
          )}

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-3 pb-2 sidebar-scroll">
            <p className="text-[10.5px] font-black text-[#8e8ea0] uppercase tracking-widest px-2 mb-2 mt-3">
              Recents
            </p>
            {filteredHistory.map(chat => (
              <HistoryItem
                key={chat.id}
                title={chat.title}
                active={activeChatId === chat.id}
                onClick={() => setActiveChatId(chat.id)}
                onDelete={() => deleteHistory(chat.id)}
              />
            ))}
            {filteredHistory.length === 0 && (
              <p className="text-[12px] text-[#8e8ea0] text-center py-6 px-2">No chats found</p>
            )}
          </div>

          {/* Bottom nav */}
          <div className="px-3 pt-2 pb-2 border-t border-white/[0.06] flex-shrink-0 space-y-0.5">
            <NavItem iconKey="settings" label="Settings" active={false} onClick={() => navigate("/settings")} />
          </div>

          {/* User row */}
          <div className="px-3 pb-4 pt-1 border-t border-white/[0.06] flex-shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all group"
            >
              {user?.photoURL
                ? <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0" />
                : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b6b] to-[#ff4444] flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                    {initial}
                  </div>
                )
              }
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[13px] font-bold text-[#ececf1] truncate leading-tight">
                  {user?.displayName || "User"}
                </p>
                <p className="text-[11px] text-[#8e8ea0] truncate">Free plan</p>
              </div>
              <Icon d={IC.logout} size={15} className="text-[#8e8ea0] group-hover:text-[#ff6b6b] transition-colors flex-shrink-0" />
            </button>
          </div>

        </div>
      </aside>

      {/* ══════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-xl hover:bg-white/5 text-[#8e8ea0] hover:text-white transition-all"
                >
                  <Icon d={IC.menu} size={18} />
                </button>
                <button
                  onClick={newChat}
                  className="p-2 rounded-xl hover:bg-white/5 text-[#8e8ea0] hover:text-white transition-all"
                >
                  <Icon d={IC.newChat} size={18} />
                </button>
              </>
            )}

            {/* Model selector */}
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 text-[#ececf1] transition-all">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#10a37f] to-[#0d8a6c] flex items-center justify-center shadow-sm">
                <span className="text-[8px] font-black text-white">M</span>
              </div>
              <span className="text-[13.5px] font-bold">Mohan Ram AI</span>
              <Icon d={IC.chevDown} size={13} className="text-[#8e8ea0]" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!isEmpty && (
              <button
                onClick={newChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10a37f] hover:bg-[#0d8a6c] text-white text-[12.5px] font-bold transition-all shadow-lg shadow-emerald-900/30 active:scale-95"
              >
                <Icon d={IC.newChat} size={13} />
                New chat
              </button>
            )}
            {user?.photoURL
              ? <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full ring-2 ring-white/10" />
              : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b6b] to-[#ff4444] flex items-center justify-center text-xs font-black text-white">
                  {initial}
                </div>
              )
            }
          </div>
        </header>

        {/* ── Chat area ── */}
        <div className="flex-1 overflow-y-auto main-scroll">
          {isEmpty ? (
            /* ── EMPTY / HOME STATE ── */
            <div className="flex flex-col items-center justify-center h-full px-4 pb-16 pt-8">

              {/* Logo */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10a37f] to-[#0d8a6c] flex items-center justify-center mb-6 shadow-2xl shadow-emerald-900/40">
                <span className="text-3xl font-black text-white">M</span>
              </div>

              <h1 className="text-[30px] font-black text-[#ececf1] mb-2 text-center leading-tight">
                What are you working on?
              </h1>
              <p className="text-[#8e8ea0] text-[14px] font-semibold mb-10 text-center">
                Hey {firstName}! I'm Mofi — your AI assistant. Ask me anything.
              </p>

              {/* Suggestion cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-[680px] mb-8">
                {SUGGESTIONS.map(({ icon, label, sub }) => (
                  <button
                    key={label}
                    onClick={() => { setInput(label); textareaRef.current?.focus(); }}
                    className="flex flex-col gap-2 p-4 rounded-2xl bg-[#2f2f2f] border border-white/[0.06] hover:border-white/[0.14] hover:bg-[#383838] transition-all duration-200 text-left group"
                  >
                    <span className="text-2xl">{icon}</span>
                    <span className="text-[13px] font-bold text-[#ececf1] leading-snug">{label}</span>
                    <span className="text-[11.5px] text-[#8e8ea0] leading-snug">{sub}</span>
                  </button>
                ))}
              </div>

              {/* Quick prompts */}
              <div className="flex flex-wrap gap-2 justify-center max-w-[600px]">
                {QUICK_PROMPTS.map(p => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="px-3.5 py-1.5 rounded-full bg-[#2f2f2f] border border-white/[0.08] text-[12.5px] text-[#c5c5d2] hover:text-white hover:border-white/20 hover:bg-[#383838] transition-all duration-200 font-semibold"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ── MESSAGE THREAD ── */
            <div className="max-w-[760px] mx-auto w-full px-4 pt-8 pb-4">
              {messages.map(msg => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10a37f] to-[#0d8a6c] flex items-center justify-center text-[13px] font-black text-white flex-shrink-0 shadow-lg">
                    M
                  </div>
                  <div className="bg-[#1e1e2e] border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-2.5">
                    <TypingDots />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* ══════════════════════════════════
            INPUT BAR
        ══════════════════════════════════ */}
        <div className="px-4 pb-6 pt-3 flex-shrink-0">
          <div className="max-w-[760px] mx-auto">
            <div className="flex items-end gap-2 bg-[#2f2f2f] border border-white/[0.08] rounded-2xl px-4 py-3 focus-within:border-white/[0.18] transition-all duration-200 shadow-xl shadow-black/40">

              {/* Attach */}
              <button
                className="flex-shrink-0 p-1.5 rounded-xl text-[#8e8ea0] hover:text-white hover:bg-white/5 transition-all mb-0.5"
                title="Attach file"
              >
                <Icon d={IC.attach} size={18} />
              </button>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything…"
                rows={1}
                disabled={loading}
                className="flex-1 bg-transparent text-[#ececf1] placeholder-[#8e8ea0] text-[13.5px] outline-none resize-none leading-relaxed py-1 max-h-[200px] disabled:opacity-60 font-semibold"
              />

              {/* Mic */}
              <button
                className="flex-shrink-0 p-1.5 rounded-xl text-[#8e8ea0] hover:text-white hover:bg-white/5 transition-all mb-0.5"
                title="Voice input"
              >
                <Icon d={IC.mic} size={18} />
              </button>

              {/* Send */}
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 mb-0.5 ${
                  input.trim() && !loading
                    ? "bg-white text-[#212121] hover:bg-gray-200 shadow-lg active:scale-95"
                    : "bg-white/10 text-[#8e8ea0] cursor-not-allowed"
                }`}
                title="Send (Enter)"
              >
                <Icon d={IC.send} size={14} />
              </button>
            </div>

            <p className="text-center text-[11.5px] text-[#8e8ea0] mt-3 font-medium">
              Mofi can make mistakes. Verify important information.
            </p>
          </div>
        </div>

      </main>

      {/* ══════════════════════════════════
          GLOBAL STYLES
      ══════════════════════════════════ */}
      <style>{`
        /* Scrollbars */
        .sidebar-scroll::-webkit-scrollbar,
        .main-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-track,
        .main-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb,
        .main-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover,
        .main-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.16); }

        /* Typing animation */
        @keyframes mofiBounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50%       { transform: translateY(-5px); opacity: 1; }
        }

        /* ── Markdown prose (AI bubbles) ── */
        .prose-dark p.md-p              { margin: 0 0 8px; line-height: 1.7; }
        .prose-dark p.md-p:last-child   { margin-bottom: 0; }
        .prose-dark strong              { color: #fff; font-weight: 800; }
        .prose-dark em                  { color: #c5c5d2; font-style: italic; }
        .prose-dark .md-h1              { font-size: 1.1em; font-weight: 900; color: #fff; margin: 14px 0 6px; }
        .prose-dark .md-h2              { font-size: 1.0em; font-weight: 800; color: #fff; margin: 12px 0 5px; }
        .prose-dark .md-h3              { font-size: 0.95em; font-weight: 800; color: #ececf1; margin: 10px 0 4px; }
        .prose-dark .md-ul              { margin: 4px 0 8px; padding: 0; list-style: none; }
        .prose-dark .md-li              { position: relative; padding-left: 16px; margin-bottom: 4px; line-height: 1.6; color: #ececf1; }
        .prose-dark .md-li::before      { content: "•"; position: absolute; left: 2px; color: #10a37f; font-weight: 900; }
        .prose-dark .md-hr             { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 12px 0; }
        .prose-dark .code-block        { background: #13131f; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; margin: 8px 0; overflow: hidden; }
        .prose-dark .code-lang         { background: rgba(255,255,255,0.04); color: #8e8ea0; font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; padding: 5px 14px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .prose-dark pre                 { margin: 0; padding: 14px; overflow-x: auto; }
        .prose-dark code                { font-family: 'Fira Code', 'Consolas', monospace; font-size: 12.5px; color: #a8d8b9; line-height: 1.65; }
        .prose-dark .inline-code       { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 5px; padding: 1px 6px; font-size: 12px; color: #a8d8b9; font-family: monospace; }
      `}</style>

    </div>
  );
}