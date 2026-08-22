/**
 * ═══════════════════════════════════════════════════════════════════
 *  НАСТРОЙКИ ПОРТФОЛИО — редактируй только этот файл
 * ═══════════════════════════════════════════════════════════════════
 *
 *  После изменений сохрани файл и перезагрузи сайт (npm run dev).
 *  Подробная инструкция: см. CONFIG.md в корне проекта.
 */

export const USER_CONFIG = {
  profile: {
    name: "Amir",
    lastName: "",
    title: "Backend & Full-Stack Developer",
    bio: "Я создаю продукты, которые решают задачи через чистый код и глубокую логику. Full-stack — это проектирование систем, которые работают безупречно под нагрузкой.",
    initials: "AB",
    /** Фото в «Обо мне» — положи файл в public/ (например public/my_photo.jpg) */
    photo: "/my_photo.jpg",
    /** Мемы в «Обо мне» — картинки в public/memes/ */
    memes: [
      "/memes/drake-dark-mode.png",
      "/memes/seoul-vibes.jpg",
      "/memes/hacking-movies.png",
    ],
    machineName: "Amir's MacBook",
    status: "Open for work",
  },

  contacts: {
    email: "amirsaga4@gmail.com",
    telegram: "https://t.me/JAPYSM_vey",
    telegramHandle: "@JAPYSM_vey",
    instagram: "https://www.instagram.com/japysm_vey",
    instagramHandle: "@japysm_vey",
    github: "https://github.com/YSMLB",
    githubHandle: "github.com/YSMLB",
  },

  /**
   * Музыка — два полных трека на повтор (локальные MP3 в public/music/)
   */
  music: {
    enabled: true,
    appName: "Music",
    queueTitle: "On Repeat",
    queueSubtitle: "2 tracks · loop",
    accentColor: "#1DB954",
    tracks: [
      {
        id: "best-life",
        title: "Best Life",
        artist: "SHNTI",
        src: "/music/best-life.mp3",
        coverGradient: "linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)",
      },
      {
        id: "dilemma",
        title: "Dilemma",
        artist: "Nelly, Kelly Rowland",
        src: "/music/dilemma.mp3",
        coverGradient: "linear-gradient(135deg, #0f2027 0%, #2c5364 100%)",
      },
    ],
  },

  /** Доп. приложения — свои ссылки (icon см. CustomAppIcon) */
  customApps: [
    {
      id: "youtube",
      name: "YouTube",
      url: "https://youtube.com",
      icon: "youtube" as const,
      color: "#FF0000",
      showOn: ["dock", "ios"] as const,
      iosPage: 2,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      url: "https://linkedin.com",
      icon: "linkedin" as const,
      color: "#0A66C2",
      showOn: ["ios"] as const,
      iosPage: 2,
    },
    {
      id: "twitter",
      name: "X",
      url: "https://x.com",
      icon: "twitter" as const,
      color: "#000000",
      showOn: ["ios"] as const,
      iosPage: 2,
    },
    {
      id: "discord",
      name: "Discord",
      url: "https://discord.com",
      icon: "discord" as const,
      color: "#5865F2",
      showOn: ["ios"] as const,
      iosPage: 2,
    },
  ],

  wallpapers: {
    mac: "sequoia" as const,
    ios: "sequoia" as const,
  },

  autoOpenSafari: true,
} as const;

export type MusicTrack = {
  id: string;
  title: string;
  artist: string;
  src: string;
  coverGradient: string;
};

export type CustomAppIcon =
  | "youtube"
  | "linkedin"
  | "twitter"
  | "discord"
  | "vk"
  | "whatsapp"
  | "link"
  | "notes"
  | "settings";

export type CustomApp = {
  id: string;
  name: string;
  url: string;
  icon: CustomAppIcon;
  color: string;
  showOn: readonly ("desktop" | "dock" | "ios")[];
  iosPage?: 1 | 2;
};
