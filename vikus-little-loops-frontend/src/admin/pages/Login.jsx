import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/admin/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.detail || "Login failed. Check your credentials.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[#15101a] px-6">
      {/* glow */}
      <div className="pointer-events-none absolute h-[400px] w-[400px] rounded-full bg-blush-500/20 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#1c1522]/80 p-9 shadow-2xl backdrop-blur"
      >
        <div className="mb-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-blush-400 to-blush-600 text-2xl text-white shadow-soft">
            ✿
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-blush-200/60">Sign in to the Little Loops admin</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-blush-200/60">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-[#15101a] px-4 py-3 text-sm text-white outline-none transition focus:border-blush-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-blush-200/60">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-[#15101a] px-4 py-3 text-sm text-white outline-none transition focus:border-blush-500"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-gradient-to-br from-blush-400 to-blush-600 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:shadow-lift disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
