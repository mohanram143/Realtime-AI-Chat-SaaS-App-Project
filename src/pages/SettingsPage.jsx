// src/pages/SettingsPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth }     from "../context/AuthContext";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db }    from "../firebase/config";
import toast, { Toaster } from "react-hot-toast";

/* ── Small Icon ── */
const Icon = ({ d, size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

/* ── Toggle Switch ── */
const Toggle = ({ on, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${on ? "bg-[#10a37f]" : "bg-white/10"}`}
  >
    <span className={`absolute top-0.5 bottom-0.5 aspect-square rounded-full bg-white shadow transition-all duration-200 ${on ? "right-0.5" : "left-0.5"}`} />
  </button>
);

/* ── Section card ── */
const Section = ({ title, children }) => (
  <div className="bg-[#2f2f2f] border border-white/[0.06] rounded-2xl overflow-hidden mb-4">
    <div className="px-5 py-4 border-b border-white/[0.06]">
      <h3 className="text-[13.5px] font-black text-[#ececf1] uppercase tracking-wide">{title}</h3>
    </div>
    <div className="divide-y divide-white/[0.04]">{children}</div>
  </div>
);

/* ── Row in a section ── */
const Row = ({ label, desc, children }) => (
  <div className="flex items-center justify-between gap-4 px-5 py-4">
    <div className="min-w-0">
      <p className="text-[13.5px] font-semibold text-[#ececf1]">{label}</p>
      {desc && <p className="text-[12px] text-[#8e8ea0] mt-0.5">{desc}</p>}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

const TABS = [
  { id: "general",    label: "General" },
  { id: "account",    label: "Account" },
  { id: "appearance", label: "Appearance" },
  { id: "privacy",    label: "Privacy" },
];

export default function SettingsPage() {
  const { user, logout }   = useAuth();
  const navigate           = useNavigate();
  const [tab, setTab]      = useState("general");
  const [name, setName]    = useState(user?.displayName || "");
  const [saving, setSaving]         = useState(false);
  const [notifications, setNotif]   = useState(true);
  const [analytics, setAnalytics]   = useState(false);
  const [history, setHistory]       = useState(true);
  const [theme, setTheme]           = useState("dark");

  const saveName = async () => {
    if (!name.trim()) return toast.error("Name can't be empty.");
    setSaving(true);
    try {
      await updateProfile(auth.currentUser, { displayName: name.trim() });
      await updateDoc(doc(db, "users", user.uid), { displayName: name.trim() });
      toast.success("Name updated successfully ✅");
    } catch {
      toast.error("Update failed. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out. See you soon!");
    navigate("/auth", { replace: true });
  };

  const initial = user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#212121] text-[#ececf1]" style={{ fontFamily: "'Nunito', system-ui, sans-serif" }}>

      <Toaster position="top-center" toastOptions={{
        style: {
          background: "#2f2f2f", color: "#ececf1",
          borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)",
          fontWeight: "600", fontSize: "13px",
        },
        success: { iconTheme: { primary: "#10a37f", secondary: "#2f2f2f" } },
        error:   { iconTheme: { primary: "#ff6b6b", secondary: "#2f2f2f" } },
      }} />

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-[#171717] border-b border-white/[0.06] flex items-center gap-4 px-6 py-4">
        <button
          onClick={() => navigate("/chat")}
          className="p-2 rounded-xl hover:bg-white/5 text-[#8e8ea0] hover:text-white transition-all"
        >
          <Icon d="M19 12H5M12 5l-7 7 7 7" size={18} />
        </button>
        <div>
          <h1 className="text-[17px] font-black text-[#ececf1]">Settings</h1>
          <p className="text-[12px] text-[#8e8ea0]">Manage your account and preferences</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-[#2f2f2f] border border-white/[0.06] rounded-2xl p-1 mb-8">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-150 ${
                tab === t.id
                  ? "bg-white/10 text-white"
                  : "text-[#8e8ea0] hover:text-[#ececf1]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── GENERAL ── */}
        {tab === "general" && (
          <>
            <Section title="Profile">
              <Row label="Display name" desc="Shown in the chat interface">
                <div className="flex gap-2">
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && saveName()}
                    className="bg-[#171717] border border-white/10 rounded-xl px-3 py-2 text-[13px] text-[#ececf1] outline-none focus:border-white/25 w-40 transition-all"
                  />
                  <button
                    onClick={saveName}
                    disabled={saving}
                    className="px-4 py-2 bg-[#10a37f] hover:bg-[#0d8a6c] text-white text-[12px] font-bold rounded-xl transition-all disabled:opacity-50 active:scale-95"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              </Row>
              <Row label="Email" desc="Your account email (read-only)">
                <span className="text-[12.5px] text-[#8e8ea0] font-mono bg-[#171717] border border-white/[0.06] px-3 py-1.5 rounded-xl">
                  {user?.email}
                </span>
              </Row>
            </Section>

            <Section title="Notifications">
              <Row label="Desktop notifications" desc="Get notified when Mofi finishes a reply">
                <Toggle on={notifications} onToggle={() => setNotif(p => !p)} />
              </Row>
            </Section>
          </>
        )}

        {/* ── ACCOUNT ── */}
        {tab === "account" && (
          <>
            {/* Avatar + info card */}
            <div className="flex items-center gap-4 bg-[#2f2f2f] border border-white/[0.06] rounded-2xl px-5 py-5 mb-4">
              {user?.photoURL
                ? <img src={user.photoURL} alt="avatar" className="w-14 h-14 rounded-full ring-2 ring-white/10" />
                : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ff6b6b] to-[#ff4444] flex items-center justify-center text-xl font-black text-white flex-shrink-0">
                    {initial}
                  </div>
                )
              }
              <div>
                <p className="font-black text-[15px] text-[#ececf1]">{user?.displayName || "User"}</p>
                <p className="text-[12px] text-[#8e8ea0]">{user?.email}</p>
                <span className="inline-block mt-1.5 text-[10px] font-black bg-[#10a37f]/15 text-[#10a37f] border border-[#10a37f]/25 px-2.5 py-0.5 rounded-full">
                  Free Plan
                </span>
              </div>
            </div>

            <Section title="Account Details">
              <Row label="User ID" desc="Your unique identifier">
                <span className="text-[11px] text-[#8e8ea0] font-mono bg-[#171717] border border-white/[0.06] px-3 py-1.5 rounded-xl max-w-[150px] truncate block">
                  {user?.uid}
                </span>
              </Row>
              <Row label="Auth provider" desc="How you sign in">
                <span className="text-[12.5px] text-[#ececf1] font-bold capitalize bg-[#171717] border border-white/[0.06] px-3 py-1.5 rounded-xl">
                  {user?.providerData?.[0]?.providerId?.replace(".com", "") || "Email"}
                </span>
              </Row>
            </Section>

            <Section title="Danger Zone">
              <Row label="Sign out" desc="Log out of this device">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[12px] font-bold rounded-xl transition-all active:scale-95"
                >
                  Logout
                </button>
              </Row>
              <Row label="Delete account" desc="Permanently remove your account and all data">
                <button
                  onClick={() => toast("Account deletion coming soon.", { icon: "⚠️" })}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[12px] font-bold rounded-xl transition-all active:scale-95"
                >
                  Delete
                </button>
              </Row>
            </Section>
          </>
        )}

        {/* ── APPEARANCE ── */}
        {tab === "appearance" && (
          <Section title="Theme">
            <div className="px-5 py-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "dark",   emoji: "🌙", label: "Dark"   },
                  { id: "light",  emoji: "☀️",  label: "Light"  },
                  { id: "system", emoji: "💻", label: "System" },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setTheme(t.id); toast(`${t.label} theme coming soon!`); }}
                    className={`flex flex-col items-center gap-2.5 p-5 rounded-2xl border transition-all ${
                      theme === t.id
                        ? "border-[#10a37f] bg-[#10a37f]/10 text-[#10a37f]"
                        : "border-white/[0.08] text-[#8e8ea0] hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span className="text-3xl">{t.emoji}</span>
                    <span className="text-[13px] font-bold capitalize">{t.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-[11.5px] text-[#8e8ea0] text-center mt-4">
                Currently only dark theme is available. Light theme coming soon!
              </p>
            </div>
          </Section>
        )}

        {/* ── PRIVACY ── */}
        {tab === "privacy" && (
          <>
            <Section title="Data & Privacy">
              <Row label="Save chat history" desc="Store conversations to Firestore">
                <Toggle on={history} onToggle={() => setHistory(p => !p)} />
              </Row>
              <Row label="Usage analytics" desc="Share anonymous usage data to improve Mofi">
                <Toggle on={analytics} onToggle={() => setAnalytics(p => !p)} />
              </Row>
            </Section>

            <Section title="Data Controls">
              <Row label="Export my data" desc="Download all your conversations as JSON">
                <button
                  onClick={() => toast("Data export coming soon! 📦")}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[#ececf1] border border-white/[0.08] text-[12px] font-bold rounded-xl transition-all active:scale-95"
                >
                  Export
                </button>
              </Row>
              <Row label="Clear all chats" desc="Permanently delete all your conversations">
                <button
                  onClick={() => toast("Clear history coming soon! 🗑️")}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[12px] font-bold rounded-xl transition-all active:scale-95"
                >
                  Clear All
                </button>
              </Row>
            </Section>
          </>
        )}

      </div>
    </div>
  );
}