import { DISTANCES, PUTTS_PER_DISTANCE } from "../utils/sequence.js";
import { usePuttTest } from "../hooks/usePuttTest.js";

export default function GameScreen({ onFinish, onCancel }) {
  const {
    currentIndex,
    totalPutts,
    currentDistance,
    isFinished,
    progressByDistance,
    attempts,
    answer,
    undoLast,
    canUndo,
  } = usePuttTest();

  // Kun testi valmistuu, ilmoitetaan tulokset ylös App-komponentille
  if (isFinished) {
    onFinish(attempts);
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f2f0] px-5 pt-5 pb-8 text-[#1b2b1e]">
      {/* Yläpalkki */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onCancel}
          className="text-sm text-[#1b2b1e]/70 underline underline-offset-2"
        >
          Keskeytä
        </button>
        <span className="font-display text-lg text-[#1b2b1e]/75">
          Putti {currentIndex + 1} / {totalPutts}
        </span>
      </div>

      {/* Edistymispalkki */}
      <div className="h-1.5 rounded-full bg-[#dfe2db] mb-8 overflow-hidden">
        <div
          className="h-full bg-[#e51c2d] transition-all duration-300"
          style={{ width: `${(currentIndex / totalPutts) * 100}%` }}
        />
      </div>

      {/* Nykyinen etäisyys */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="font-display text-[#1b2b1e]/60 text-xl mb-1">Etäisyys</p>
        <p className="font-display font-bold text-[132px] leading-none text-[#1b2b1e]">
          {currentDistance}
          <span className="text-6xl align-top ml-1 text-[#1b2b1e]/60">m</span>
        </p>
      </div>

      {/* Vastauspainikkeet */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => answer(true)}
          className="py-8 rounded-lg bg-[#e51c2d] text-white font-display text-4xl tracking-wide active:scale-[0.97] transition-transform shadow-[0_4px_0_0_#c81224]"
        >
          SISÄÄN
        </button>
        <button
          onClick={() => answer(false)}
          className="py-8 rounded-lg bg-[#1b2b1e] text-white font-display text-4xl tracking-wide active:scale-[0.97] transition-transform shadow-[0_4px_0_0_#0d1a15]"
        >
          ULOS
        </button>
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={undoLast}
          disabled={!canUndo}
          className="text-sm text-[#1b2b1e]/60 underline underline-offset-2 disabled:opacity-30 disabled:no-underline py-2 px-3"
        >
          ↺ Peruuta edellinen
        </button>
      </div>

      {/* Etäisyyskohtainen tilanne yhdellä silmäyksellä */}
      <div className="grid grid-cols-5 gap-2">
        {DISTANCES.map((d) => (
          <div
            key={d}
            className={`rounded-md border p-2 text-center ${
              d === currentDistance
                ? "border-[#e51c2d] bg-[#fce9eb]"
                : "border-[#dfe2db] bg-white/40"
            }`}
          >
            <p className="font-display text-sm text-[#1b2b1e]/60">{d}m</p>
            <p className="font-display text-lg font-semibold text-[#1b2b1e]">
              {progressByDistance[d]}/{PUTTS_PER_DISTANCE}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
