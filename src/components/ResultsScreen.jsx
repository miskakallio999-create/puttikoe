import { useEffect, useState } from "react";
import {
  DISTANCES,
  calculateScore,
  calculateAccuracy,
  buildBreakdown,
} from "../utils/sequence.js";
import { db } from "../firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ResultsScreen({ attempts, user, onRestart, onViewHistory }) {
  const [saveState, setSaveState] = useState(user ? "saving" : "guest");

  const totalScore = calculateScore(attempts);
  const accuracy = calculateAccuracy(attempts);
  const breakdown = buildBreakdown(attempts);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    async function save() {
      try {
        await addDoc(collection(db, "results"), {
          userId: user.uid,
          userName: user.displayName ?? "",
          userEmail: user.email ?? "",
          timestamp: serverTimestamp(),
          totalScore,
          accuracyPercentage: accuracy,
          breakdown,
        });
        if (!cancelled) setSaveState("saved");
      } catch (err) {
        console.error("Tuloksen tallennus epäonnistui:", err);
        if (!cancelled) setSaveState("error");
      }
    }
    save();
    return () => {
      cancelled = true;
    };
    // Tallennetaan vain kerran tulosnäytön avautuessa
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f2f0] px-5 pt-8 pb-8 text-[#1b2b1e]">
      <p className="font-display text-[#1b2b1e]/60 text-xl text-center mb-1">Tulos</p>
      <p className="font-display font-bold text-[96px] leading-none text-[#e51c2d] text-center mb-1">
        {totalScore}
        <span className="text-4xl align-top ml-1 text-[#1b2b1e]/60">p</span>
      </p>
      <p className="text-center text-[#2d3530] mb-8">
        {accuracy}% osumatarkkuus · {attempts.filter((a) => a.made).length}/{attempts.length} osumaa
      </p>

      {/* Erittely etäisyyksittäin */}
      <div className="flex flex-col gap-2 mb-8">
        {DISTANCES.map((d) => {
          const stat = breakdown[`${d}m`];
          const pct = stat.total ? Math.round((stat.made / stat.total) * 100) : 0;
          return (
            <div
              key={d}
              className="flex items-center gap-3 rounded-md border border-[#dfe2db] bg-white/40 px-3 py-2.5"
            >
              <span className="font-display text-xl w-12 text-[#1b2b1e]/70">{d}m</span>
              <div className="flex-1 h-2 rounded-full bg-[#dfe2db] overflow-hidden">
                <div
                  className="h-full bg-[#e51c2d]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="font-display text-lg w-20 text-right text-[#1b2b1e]">
                {stat.made}/{stat.total}
              </span>
              <span className="text-sm w-12 text-right text-[#1b2b1e]/50">{pct}%</span>
            </div>
          );
        })}
      </div>

      {/* Tallennustila */}
      <div className="mb-8">
        {saveState === "saving" && (
          <p className="text-sm text-center text-[#1b2b1e]/60">Tallennetaan tulosta…</p>
        )}
        {saveState === "saved" && (
          <p className="text-sm text-center text-[#e51c2d] font-medium">
            ✓ Tulos tallennettu suoritushistoriaasi
          </p>
        )}
        {saveState === "error" && (
          <p className="text-sm text-center text-[#9a1d2d] font-medium">
            Tuloksen tallennus epäonnistui. Tarkista verkkoyhteys ja yritä uudelleen.
          </p>
        )}
        {saveState === "guest" && (
          <p className="text-sm text-center text-[#1b2b1e]/70">
            Tulosta ei tallennettu. Kirjaudu Googlella, niin näet jatkossa kehityksesi.
          </p>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <button
          onClick={onRestart}
          className="w-full py-4 rounded-md bg-[#e51c2d] text-white font-display text-2xl tracking-wide active:scale-[0.98] transition-transform hover:bg-[#ca1525]"
        >
          Uusi peli
        </button>
        {user && (
          <button
            onClick={onViewHistory}
            className="w-full py-3 rounded-md border-2 border-[#dfe2db] text-[#1b2b1e] font-medium bg-white/40"
          >
            Omat suoritukset
          </button>
        )}
      </div>
    </div>
  );
}
