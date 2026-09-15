import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase.js";
import LoginScreen from "./components/LoginScreen.jsx";
import GameScreen from "./components/GameScreen.jsx";
import ResultsScreen from "./components/ResultsScreen.jsx";
import HistoryScreen from "./components/HistoryScreen.jsx";

// Näkymät: "login" | "game" | "results" | "history"
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [view, setView] = useState("login");
  const [lastAttempts, setLastAttempts] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  async function handleGoogleLogin() {
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Google-kirjautuminen epäonnistui:", err);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    await signOut(auth);
    setView("login");
  }

  function handleFinish(attempts) {
    setLastAttempts(attempts);
    setView("results");
  }

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-display text-xl text-ink/50">Ladataan…</p>
      </div>
    );
  }

  return (
    <>
      {view === "login" && (
        <LoginScreen
          user={user}
          authLoading={authLoading}
          onGuestStart={() => setView("game")}
          onGoogleLogin={handleGoogleLogin}
          onLogout={handleLogout}
          onViewHistory={() => setView("history")}
          onStart={() => setView("game")}
        />
      )}

      {view === "game" && (
        <GameScreen onFinish={handleFinish} onCancel={() => setView("login")} />
      )}

      {view === "results" && lastAttempts && (
        <ResultsScreen
          attempts={lastAttempts}
          user={user}
          onRestart={() => setView("game")}
          onViewHistory={() => setView("history")}
        />
      )}

      {view === "history" && user && (
        <HistoryScreen user={user} onBack={() => setView("login")} />
      )}
    </>
  );
}
