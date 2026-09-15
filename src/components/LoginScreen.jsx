import { DISTANCES, PUTTS_PER_DISTANCE, TOTAL_PUTTS } from "../utils/sequence.js";

export default function LoginScreen({
  user,
  authLoading,
  onGuestStart,
  onGoogleLogin,
  onLogout,
  onViewHistory,
  onStart,
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f3f2f0] text-[#1b2b1e]">
      <div className="px-5 pt-5 flex items-center justify-between border-b border-[#dfe2db] bg-[#f3f2f0]">
        <div className="flex items-center gap-3">
          <img
            src="/icons/icon-jyli.png"
            alt="Logo"
            className="h-20 w-auto object-contain"
          />
        </div>

        {user ? (
          <div className="flex items-center gap-2">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="w-8 h-8 rounded-full border-2 border-fairway"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-fairway text-paper flex items-center justify-center text-sm font-semibold">
                {user.displayName?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <span className="text-sm font-medium truncate max-w-[120px]">
              {user.displayName}
            </span>
            <button
              onClick={onLogout}
              className="text-sm text-ink/60 underline underline-offset-2"
            >
              Kirjaudu ulos
            </button>
          </div>
        ) : (
          <div className="h-8" />
        )}
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-10">
        <div className="w-full max-w-[680px] mx-auto">
          <p className="font-display text-[#1b1d1b] text-xl leading-none mb-1">
            {TOTAL_PUTTS} puttia · {DISTANCES.length} etäisyyttä
          </p>
          <h1 className="font-display font-bold text-[64px] leading-[0.9] text-[#e51c2d] mb-4 text-left">
            Puttikoe
          </h1>
          <p className="text-[#2d3530] text-base max-w-[36ch] mb-8 text-left">
            {PUTTS_PER_DISTANCE} puttia jokaiselta etäisyydeltä {DISTANCES.join("m, ")}m.
            Järjestys on satunnainen, vastaat vain menikö kiekko koriin.
          </p>
        </div>

        {/* Etäisyyskaistat visuaalisena elementtinä */}
        <div className="flex gap-2 mb-10">
          {DISTANCES.map((d) => (
            <div key={d} className="flex-1">
              <div className="h-10 rounded-sm bg-fairway-light border border-fairway/30 flex items-end justify-center pb-1">
                <span className="font-display text-fairway-dark text-sm">{d}m</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {user ? (
            <>
              <button
                onClick={onStart}
                className="w-full py-4 rounded-md bg-[#e51c2d] text-white font-display text-2xl tracking-wide active:scale-[0.98] transition-transform hover:bg-[#ca1525]"
              >
                Aloita testi
              </button>
              <button
                onClick={onViewHistory}
                className="w-full py-3 rounded-md border-2 border-[#d9d7d2] text-[#1b2b1e] font-medium bg-white/40"
              >
                Omat suoritukset
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onGuestStart}
                className="w-full py-4 rounded-md bg-[#e51c2d] text-white font-display text-2xl tracking-wide active:scale-[0.98] transition-transform hover:bg-[#ca1525]"
              >
                Aloita vierailijana
              </button>
              <button
                onClick={onGoogleLogin}
                disabled={authLoading}
                className="w-full py-3.5 rounded-md border-2 border-[#d9d7d2] text-[#1b2b1e] font-medium flex items-center justify-center gap-2 disabled:opacity-50 bg-white/40"
              >
                <GoogleIcon />
                {authLoading ? "Kirjaudutaan…" : "Kirjaudu Googlella"}
              </button>
              <p className="text-xs text-ink/50 text-center pt-1">
                Vierastilassa tulokset näkyvät testin lopussa, mutta niitä ei tallenneta.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.9v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.9A9 9 0 0 0 0 9c0 1.45.35 2.83.9 4.03l3.05-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .9 4.97l3.05 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}
