"use client";

import { USER_CONFIG } from "@/lib/portfolio/userConfig";
import { useMusic, formatTime } from "@/context/MusicContext";
import { useLocale } from "@/context/LocaleContext";

function ProgressBar() {
  const { progress, seek, currentTime, duration } = useMusic();

  return (
    <div className="w-full px-1">
      <input
        type="range"
        min={0}
        max={1}
        step={0.001}
        value={progress}
        onChange={(e) => seek(Number(e.target.value))}
        className="w-full h-1 accent-[#1DB954] cursor-pointer"
        aria-label="Seek"
      />
      <div className="flex justify-between text-[11px] text-white/45 mt-1 tabular-nums">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

export function MusicContent() {
  const { music } = USER_CONFIG;
  const {
    started,
    isPlaying,
    togglePlay,
    next,
    prev,
    currentTrack,
    tracks,
    currentTrackIndex,
    loadError,
    playTrackAt,
  } = useMusic();
  const { t } = useLocale();

  return (
    <div className="flex flex-col h-full bg-[#121212] text-white overflow-hidden">
      {!started ? (
        <div className="flex-1 flex items-center justify-center px-6">
          <p className="text-[14px] text-white/45 text-center">{t("musicTapBoot")}</p>
        </div>
      ) : (
        <>
          <div className="flex-1 flex flex-col items-center justify-center px-6 pt-4 pb-2 min-h-0">
            <div
              className="w-[min(220px,70vw)] aspect-square rounded-lg shadow-[0_16px_48px_rgba(0,0,0,0.6)] mb-6"
              style={{ background: currentTrack.coverGradient }}
            />

            <div className="w-full max-w-[320px] text-center mb-5">
              <h2 className="text-[22px] font-bold truncate">{currentTrack.title}</h2>
              <p className="text-[15px] text-white/55 truncate mt-1">{currentTrack.artist}</p>
            </div>

            {loadError && (
              <p className="text-[12px] text-[#1DB954]/80 text-center mb-3 px-2">
                {t("musicFileMissing")}
              </p>
            )}

            <div className="w-full max-w-[320px] mb-4">
              <ProgressBar />
            </div>

            <div className="flex items-center justify-center gap-8">
              <button
                type="button"
                onClick={prev}
                className="text-white/80 hover:text-white p-2 outline-none"
                aria-label="Previous"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6V6zm3.5 6 8.5 6V6l-8.5 6z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-[#1DB954] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform outline-none"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="black">
                    <rect x="6" y="5" width="4" height="14" rx="1" />
                    <rect x="14" y="5" width="4" height="14" rx="1" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="black" className="ml-1">
                    <path d="M8 5v14l11-7-11-7z" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={next}
                className="text-white/80 hover:text-white p-2 outline-none"
                aria-label="Next"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 18h2V6h-2v12zM6 18l8.5-6L6 6v12z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="shrink-0 px-4 pb-4 border-t border-white/[0.06] pt-3">
            <p className="text-[11px] text-white/40 uppercase tracking-wider mb-2 px-1">
              {music.queueSubtitle}
            </p>
            <div className="space-y-0.5">
              {tracks.map((track, i) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => playTrackAt(i)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md w-full text-left outline-none ${
                    i === currentTrackIndex ? "bg-white/10" : "hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="w-4 text-[12px] text-white/40 tabular-nums">{i + 1}</span>
                  <div
                    className="w-10 h-10 rounded shrink-0"
                    style={{ background: track.coverGradient }}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[14px] truncate ${
                        i === currentTrackIndex ? "text-[#1DB954]" : "text-white"
                      }`}
                    >
                      {track.title}
                    </p>
                    <p className="text-[12px] text-white/45 truncate">{track.artist}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


export function FinderContent() {
  return (
    <div className="flex min-h-[380px] text-[13px]">
      <div className="w-[140px] bg-[#f6f6f6] border-r border-black/[0.06] py-2 shrink-0">
        {["Favorites", "Projects", "Music", "About"].map((item, i) => (
          <div
            key={item}
            className={`mx-2 px-3 py-1.5 rounded-md ${
              i === 0 ? "bg-[#007AFF]/12 text-[#007AFF] font-medium" : "text-[#515154]"
            }`}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="flex-1 p-5 grid grid-cols-4 gap-4 content-start">
        {(["projects", "music", "safari", "about"] as const).map((id) => (
          <div
            key={id}
            className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-black/[0.04] cursor-default"
          >
            <span className="text-[11px] text-[#515154] text-center capitalize">
              {id === "about" ? "About Me" : id}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
