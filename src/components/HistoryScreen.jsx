import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase.js";

export default function HistoryScreen({ user, onBack }) {
  const [state, setState] = useState("loading"); // loading | ready | error
  const [runs, setRuns] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const q = query(
          collection(db, "results"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        );
        const snap = await getDocs(q);
        if (cancelled) return;
        setRuns(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
        setState("ready");
      } catch (err) {
        console.error("Historian lataus epäonnistui:", err);
        if (!cancelled) setState("error");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user.uid]);

  const average =
    runs.length > 0
      ? Math.round(
          (runs.reduce((s, r) => s + (r.totalScore ?? 0), 0) / runs.length) * 10
        ) / 10
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f2f0] px-5 pt-5 pb-8 text-[#1b2b1e]">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-sm text-[#1b2b1e]/65 underline underline-offset-2"
        >
          ← Takaisin
        </button>
        <span className="font-display text-lg text-[#1b2b1e]/75">Omat suoritukset</span>
        <span className="w-16" />
      </div>

      {average !== null && (
        <div className="rounded-md border border-[#dfe2db] bg-[#fff3f4] px-4 py-3 mb-6 flex items-center justify-between">
          <span className="text-[#1b2b1e]/70 text-sm">Keskiarvo ({runs.length} testiä)</span>
          <span className="font-display text-2xl text-[#e51c2d]">{average} p</span>
        </div>
      )}

      {state === "loading" && (
        <p className="text-center text-[#1b2b1e]/60 py-10">Ladataan suorituksia…</p>
      )}

      {state === "error" && (
        <p className="text-center text-[#9a1d2d] py-10">
          Suorituksia ei voitu ladata juuri nyt. Yritä hetken kuluttua uudelleen.
        </p>
      )}

      {state === "ready" && runs.length === 0 && (
        <p className="text-center text-[#1b2b1e]/60 py-10">
          Ei vielä suorituksia. Ensimmäinen testi näkyy tässä heti kun pelaat sen loppuun.
        </p>
      )}

      {state === "ready" && runs.length > 0 && (
        <div className="flex flex-col gap-2">
          {runs.map((run) => (
            <div
              key={run.id}
              className="flex items-center justify-between rounded-md border border-[#dfe2db] bg-white/40 px-4 py-3"
            >
              <div>
                <p className="font-medium text-[#1b2b1e]">
                  {formatDate(run.timestamp)}
                </p>
                <p className="text-sm text-[#1b2b1e]/60">
                  {run.accuracyPercentage ?? 0}% osumatarkkuus
                </p>
              </div>
              <p className="font-display text-2xl text-[#e51c2d]">{run.totalScore ?? 0} p</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(timestamp) {
  if (!timestamp?.toDate) return "—";
  return timestamp.toDate().toLocaleDateString("fi-FI", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
