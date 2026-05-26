// src/pages/AuthPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import ai1 from "../assets/ai1.svg"
import ai2 from "../assets/ai2.svg"
import saly from "../assets/Saly.svg"
import ai3 from "../assets/ai3.png"
/* ═══════════════════════ ICONS ═══════════════════════ */
const EyeIcon = ({ open }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
    </svg>
  );

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

/* ═══════════════════════ ILLUSTRATION ═══════════════════════ */
const Illustration = () => (
  <div className="relative w-full h-full flex items-end justify-center overflow-hidden select-none">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-6 left-6 w-36 h-36 bg-[#ff9999] rounded-full opacity-30 blur-3xl" />
      <div className="absolute bottom-10 right-2 w-44 h-44 bg-[#ffcccc] rounded-full opacity-40 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-[#ffb3b3] rounded-full opacity-25 blur-2xl" />
    </div>

       {/* Character SVG */}
      <img src={ai3} className="w-full h-full object-contain float-animation forced-color-adjust-auto animate-pulse" alt="AI Character" />
  </div>
);

/* ═══════════════════════ REUSABLE COMPONENTS ═══════════════════════ */
const InputField = ({ icon, type, placeholder, value, onChange, name, rightIcon, onRightClick, autoComplete }) => (
  <div className="relative group">
    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff6b6b] transition-colors duration-200 pointer-events-none">
      {icon}
    </span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete || name}
      className="w-full pl-[42px] pr-11 py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50/70 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:border-[#ff6b6b] focus:bg-white transition-all duration-200 font-semibold"
    />
    {rightIcon && (
      <button type="button" onClick={onRightClick} tabIndex={-1}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ff6b6b] transition-colors duration-200">
        {rightIcon}
      </button>
    )}
  </div>
);

const Spinner = () => (
  <span className="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2 align-middle" />
);

const SocialBtn = ({ icon, label, onClick, disabled }) => (
  <button type="button" onClick={onClick} disabled={disabled} title={label}
    className="flex items-center justify-center w-[52px] h-[52px] rounded-2xl border-2 border-gray-100 bg-white hover:border-[#ff6b6b] hover:shadow-lg hover:shadow-red-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95">
    {icon}
  </button>
);

/* ═══════════════════════ FIREBASE ERROR MAP ═══════════════════════ */
const firebaseError = (code) => ({
  "auth/user-not-found":        "No account found with this email.",
  "auth/wrong-password":        "Incorrect password. Please try again.",
  "auth/invalid-email":         "Please enter a valid email address.",
  "auth/invalid-credential":    "Invalid email or password.",
  "auth/too-many-requests":     "Too many attempts. Please try again later.",
  "auth/email-already-in-use":  "This email is already registered.",
  "auth/weak-password":         "Password is too weak (min 6 characters).",
  "auth/network-request-failed":"Network error. Check your connection.",
  "auth/popup-closed-by-user":  null, // silent
}[code] || "Something went wrong. Please try again.");

/* ═══════════════════════ MAIN AUTH PAGE ═══════════════════════ */
export default function AuthPage() {
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  const [tab,             setTab]             = useState("login");
  const [showPass,        setShowPass]        = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [googleLoading,   setGoogleLoading]   = useState(false);
  const [mounted,         setMounted]         = useState(false);

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  useEffect(() => { setMounted(true); }, []);

  /* Redirect if already authenticated */
  useEffect(() => {
    if (user) navigate("/chat", { replace: true });
  }, [user, navigate]);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    setShowPass(false);
    setShowConfirm(false);
  };

  /* ── Tab Switch ── */
  const switchTab = (next) => {
    if (next === tab) return;
    resetForm();
    setTab(next);
    toast(next === "login" ? "👋 Welcome back! Sign in to continue." : "🎉 Let's create your account!", {
      duration: 2000,
      style: { fontWeight: "700", fontSize: "13px" },
    });
  };

  /* ── Login ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) return toast.error("Please fill in all fields.");
    setLoading(true);
    try {
      await signIn(form.email.trim(), form.password);
      toast.success("Welcome back! Redirecting... 🎉", { duration: 1500 });
      // Small delay so user sees the toast
      setTimeout(() => navigate("/chat", { replace: true }), 800);
    } catch (err) {
      const msg = firebaseError(err.code);
      if (msg) toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Sign Up ── */
  const handleSignUp = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = form;
    if (!name.trim() || !email.trim() || !password || !confirmPassword)
      return toast.error("Please fill in all fields.");
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters.");
    if (password !== confirmPassword)
      return toast.error("Passwords don't match! Check and retry.");
    setLoading(true);
    try {
      await signUp(email.trim(), password, name.trim());
      toast.success("Account created! Welcome to Mohan Ram Ai 🚀", { duration: 2000 });
      setTimeout(() => navigate("/chat", { replace: true }), 1000);
    } catch (err) {
      const msg = firebaseError(err.code);
      if (msg) toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Google ── */
  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Signed in with Google! 🎊", { duration: 1500 });
      setTimeout(() => navigate("/chat", { replace: true }), 800);
    } catch (err) {
      const msg = firebaseError(err.code);
      if (msg) toast.error(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  /* ════════ RENDER ════════ */
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#fff0f0] via-[#fff5f5] to-[#ffe8e8] p-4 overflow-hidden relative">
      {/* Ambient blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#ffb3b3] rounded-full opacity-[0.15] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#ffd6d6] rounded-full opacity-[0.15] blur-3xl pointer-events-none" />

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "14px",
            background: "#fff",
            color: "#1a1a2e",
            boxShadow: "0 8px 32px rgba(255,107,107,0.18), 0 1px 4px rgba(0,0,0,0.06)",
            border: "1px solid #ffe0e0",
            fontFamily: "Nunito, Poppins, system-ui, sans-serif",
            fontWeight: "600",
            fontSize: "13.5px",
          },
          success: { iconTheme: { primary: "#ff6b6b", secondary: "#fff" } },
          error:   { iconTheme: { primary: "#ff3b30", secondary: "#fff" } },
        }}
      />

      {/* ══════════════ CARD ══════════════ */}
      <div
        className={`relative w-full max-w-[900px] bg-white rounded-[28px] shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-[0.98]"
        }`}
        style={{
          minHeight: "580px",
          boxShadow: "0 40px 100px rgba(255,100,100,0.16), 0 2px 10px rgba(0,0,0,0.07)",
        }}
      >
        {/* ── LEFT PANEL ── */}
        <div className="hidden md:flex md:w-[43%] bg-gradient-to-br from-[#ffcdd2] via-[#ffb0b0] to-[#ff9a9a] relative flex-col overflow-hidden">
          {/* Brand mark */}
          <div className="p-7 z-10 relative">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/25 backdrop-blur-sm flex items-center justify-center border border-white/40">
                <span className="text-white font-black text-[15px]">M</span>
              </div>
              <span className="text-white font-black text-[22px] tracking-tight drop-shadow">Mohan Ram Ai.</span>
            </div>
            <p className="text-white/70 text-xs mt-1.5 font-semibold tracking-wide">AI-Powered SaaS Workspace</p>
          </div>

          {/* Tagline */}
          <div className="px-7 z-10 relative">
            <h2 className="text-white font-black text-2xl leading-snug drop-shadow-sm">
              Chat smarter,<br />work faster. ✨
            </h2>
          </div>

          {/* Character */}
          <div className="flex-1 flex items-end justify-center mt-4">
            <Illustration />
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 flex flex-col justify-center px-7 sm:px-10 py-10 overflow-y-auto">

          {/* Mobile brand */}
          <div className="flex md:hidden items-center gap-2 mb-7">
            <div className="w-9 h-9 rounded-xl bg-[#ff6b6b] flex items-center justify-center shadow-md shadow-red-200">
              <span className="text-white font-black text-sm">M</span>
            </div>
            <span className="text-gray-900 font-black text-xl tracking-tight">Mohan Ram Ai.</span>
          </div>

          {/* Heading */}
          <h1 className="text-[26px] sm:text-3xl font-black text-gray-900 leading-tight mb-1">
            {tab === "login" ? "Welcome back 👋" : "Create account 🚀"}
          </h1>
          <p className="text-gray-400 text-[13.5px] font-semibold mb-7">
            {tab === "login"
              ? "Sign in to access your AI workspace"
              : "Join Mohan Ram Ai — it's free to start"}
          </p>

          {/* ── TAB SWITCHER ── */}
          <div className="flex bg-gray-100/80 rounded-2xl p-1 mb-7 gap-1">
            {[["login","Sign In"], ["signup","Sign Up"]].map(([t, label]) => (
              <button key={t} onClick={() => switchTab(t)}
                className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300 ${
                  tab === t
                    ? "bg-white text-[#ff6b6b] shadow-md shadow-red-100/80"
                    : "text-gray-400 hover:text-gray-600"
                }`}>
                {label}
              </button>
            ))}
          </div>

          {/* ── LOGIN FORM ── */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
              <InputField
                icon={<MailIcon />} type="email" name="email"
                placeholder="Email address" value={form.email} onChange={handleChange}
                autoComplete="email"
              />
              <InputField
                icon={<LockIcon />} type={showPass ? "text" : "password"} name="password"
                placeholder="Password" value={form.password} onChange={handleChange}
                rightIcon={<EyeIcon open={showPass} />} onRightClick={() => setShowPass(p => !p)}
                autoComplete="current-password"
              />
              <div className="flex justify-end -mt-1.5">
                <button type="button"
                  className="text-[12.5px] text-[#ff6b6b] font-bold hover:underline"
                  onClick={() => toast("Password reset coming soon! 🔧", { icon: "🔧" })}>
                  Forgot Password?
                </button>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ff6b6b] to-[#ff4444] text-white font-black text-[14.5px] tracking-wide hover:shadow-xl hover:shadow-red-200 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center mt-1">
                {loading ? <><Spinner />Signing in...</> : "Log In →"}
              </button>
            </form>
          )}

          {/* ── SIGNUP FORM ── */}
          {tab === "signup" && (
            <form onSubmit={handleSignUp} className="flex flex-col gap-3.5" noValidate>
              <InputField
                icon={<UserIcon />} type="text" name="name"
                placeholder="Full name" value={form.name} onChange={handleChange}
                autoComplete="name"
              />
              <InputField
                icon={<MailIcon />} type="email" name="email"
                placeholder="Email address" value={form.email} onChange={handleChange}
                autoComplete="email"
              />
              <InputField
                icon={<LockIcon />} type={showPass ? "text" : "password"} name="password"
                placeholder="Password (min. 6 characters)" value={form.password} onChange={handleChange}
                rightIcon={<EyeIcon open={showPass} />} onRightClick={() => setShowPass(p => !p)}
                autoComplete="new-password"
              />
              <InputField
                icon={<LockIcon />} type={showConfirm ? "text" : "password"} name="confirmPassword"
                placeholder="Confirm password" value={form.confirmPassword} onChange={handleChange}
                rightIcon={<EyeIcon open={showConfirm} />} onRightClick={() => setShowConfirm(p => !p)}
                autoComplete="new-password"
              />
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ff6b6b] to-[#ff4444] text-white font-black text-[14.5px] tracking-wide hover:shadow-xl hover:shadow-red-200 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center mt-1">
                {loading ? <><Spinner />Creating account...</> : "Create Account →"}
              </button>
            </form>
          )}

          {/* ── DIVIDER ── */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[11.5px] text-gray-400 font-bold tracking-wide uppercase">Or continue with</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* ── SOCIAL BUTTONS ── */}
          <div className="flex items-center justify-center gap-4">
            <SocialBtn icon={googleLoading ? <Spinner /> : <GoogleIcon />} label="Google" onClick={handleGoogle} disabled={googleLoading || loading} />
            {/* <SocialBtn icon={<FacebookIcon />} label="Facebook" onClick={() => toast("Facebook auth coming soon! 🔧")} disabled={loading} />
            <SocialBtn icon={<AppleIcon />}    label="Apple"    onClick={() => toast("Apple auth coming soon! 🔧")}    disabled={loading} /> */}
          </div>

          {/* ── FOOTER SWITCH ── */}
          <p className="text-center text-[12.5px] text-gray-400 font-semibold mt-6">
            {tab === "login" ? (
              <>Don't have an account?{" "}
                <button onClick={() => switchTab("signup")} className="text-[#ff6b6b] font-black hover:underline">Sign Up here</button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => switchTab("login")} className="text-[#ff6b6b] font-black hover:underline">Sign In</button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}