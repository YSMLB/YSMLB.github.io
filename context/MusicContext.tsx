"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { getMusicTracks } from "@/lib/portfolio/musicTracks";
import type { MusicTrack } from "@/lib/portfolio/userConfig";

export type IslandState = "idle" | "compact" | "expanded";

interface MusicContextValue {
  started: boolean;
  isPlaying: boolean;
  startMusic: () => void;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (ratio: number) => void;
  playTrackAt: (index: number) => void;
  islandState: IslandState;
  setIslandState: (state: IslandState) => void;
  toggleIsland: () => void;
  currentTrackIndex: number;
  currentTrack: MusicTrack;
  tracks: readonly MusicTrack[];
  progress: number;
  currentTime: number;
  duration: number;
  loadError: boolean;
}

const MusicContext = createContext<MusicContextValue | null>(null);

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export { formatTime };

export function MusicProvider({ children }: { children: ReactNode }) {
  const tracks = getMusicTracks();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wantsPlayRef = useRef(false);

  const [started, setStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [islandState, setIslandState] = useState<IslandState>("idle");
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadError, setLoadError] = useState(false);

  const currentTrack = tracks[currentTrackIndex] ?? tracks[0];

  const playAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.src) return;
    wantsPlayRef.current = true;

    if (!audio.src || !audio.src.includes(currentTrack.src)) {
      audio.src = currentTrack.src;
      audio.load();
    }

    try {
      await audio.play();
      setIsPlaying(true);
      setLoadError(false);
    } catch {
      setIsPlaying(false);
    }
  }, [currentTrack?.src]);

  const pause = useCallback(() => {
    wantsPlayRef.current = false;
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    void playAudio();
  }, [playAudio]);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else void playAudio();
  }, [isPlaying, pause, playAudio]);

  const next = useCallback(() => {
    wantsPlayRef.current = true;
    setCurrentTrackIndex((i) => (i + 1) % tracks.length);
  }, [tracks.length]);

  const prev = useCallback(() => {
    wantsPlayRef.current = true;
    setCurrentTrackIndex((i) => (i - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);

  const playTrackAt = useCallback((index: number) => {
    if (index < 0 || index >= tracks.length) return;
    wantsPlayRef.current = true;
    setCurrentTrackIndex(index);
  }, [tracks.length]);

  const seek = useCallback((ratio: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration;
  }, []);

  const startMusic = useCallback(() => {
    wantsPlayRef.current = true;
    setStarted(true);
    setIslandState("compact");
    setCurrentTrackIndex(0);
  }, []);

  const toggleIsland = useCallback(() => {
    setIslandState((prev) => {
      const base = prev === "idle" ? "compact" : prev;
      return base === "expanded" ? "compact" : "expanded";
    });
  }, []);

  useEffect(() => {
    if (!started) {
      setIslandState("idle");
      wantsPlayRef.current = false;
      setIsPlaying(false);
    }
  }, [started]);

  useEffect(() => {
    if (!started || !audioRef.current || !currentTrack?.src) return;

    const audio = audioRef.current;
    setLoadError(false);
    setProgress(0);
    setCurrentTime(0);

    const tryPlay = () => {
      if (!wantsPlayRef.current) return;
      void audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setLoadError(false);
        })
        .catch(() => setIsPlaying(false));
    };

    const onCanPlay = () => tryPlay();
    const onError = () => setLoadError(true);

    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("error", onError);
    audio.src = currentTrack.src;
    audio.load();

    return () => {
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("error", onError);
    };
  }, [started, currentTrackIndex, currentTrack?.src]);

  return (
    <MusicContext.Provider
      value={{
        started,
        isPlaying,
        startMusic,
        togglePlay,
        play,
        pause,
        next,
        prev,
        seek,
        playTrackAt,
        islandState,
        setIslandState,
        toggleIsland,
        currentTrackIndex,
        currentTrack,
        tracks,
        progress,
        currentTime,
        duration,
        loadError,
      }}
    >
      <audio
        ref={audioRef}
        preload="auto"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={next}
        onError={() => setLoadError(true)}
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (Number.isFinite(d)) setDuration(d);
        }}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          setCurrentTime(el.currentTime);
          const d = el.duration || 0;
          setDuration(Number.isFinite(d) ? d : 0);
          setProgress(d ? el.currentTime / d : 0);
        }}
      />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must use MusicProvider");
  return ctx;
}
