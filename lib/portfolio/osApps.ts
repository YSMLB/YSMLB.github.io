import { USER_CONFIG, type CustomApp } from "./userConfig";

export type BuiltInAppId =
  | "finder"
  | "safari"
  | "projects"
  | "about"
  | "contact"
  | "music"
  | "settings"
  | "notes"
  | "telegram"
  | "instagram"
  | "github"
  | "mail";

export type OSAppId = BuiltInAppId | string;

export type OSAppType = "folder" | "window" | "external";

export type IconId = BuiltInAppId | CustomApp["icon"];

export interface OSApp {
  id: OSAppId;
  name: string;
  type: OSAppType;
  url?: string;
  icon: IconId;
  color: string;
  subtitle?: string;
}

export interface OSWindowState {
  id: OSAppId;
  title: string;
  zIndex: number;
  minimized?: boolean;
}

const { contacts, music, customApps } = USER_CONFIG;

function customToOSApp(app: CustomApp): OSApp {
  return {
    id: app.id,
    name: app.name,
    type: "external",
    url: app.url,
    icon: app.icon,
    color: app.color,
  };
}

export const BUILTIN_WINDOW_APPS: OSApp[] = [
  {
    id: "finder",
    name: "Finder",
    type: "window",
    icon: "finder",
    color: "#007AFF",
  },
  {
    id: "safari",
    name: "Safari",
    type: "window",
    icon: "safari",
    color: "#0A84FF",
  },
  {
    id: "projects",
    name: "Projects",
    type: "folder",
    icon: "projects",
    color: "#007AFF",
    subtitle: "Кейсы",
  },
  {
    id: "about",
    name: "About Me",
    type: "window",
    icon: "about",
    color: "#5856D6",
  },
  {
    id: "contact",
    name: "Contact",
    type: "window",
    icon: "contact",
    color: "#34C759",
  },
  ...(music.enabled
    ? [
        {
          id: "music" as const,
          name: music.appName,
          type: "window" as const,
          icon: "music" as const,
          color: music.accentColor,
        },
      ]
    : []),
  {
    id: "settings",
    name: "Settings",
    type: "window",
    icon: "settings",
    color: "#8E8E93",
  },
  {
    id: "notes",
    name: "Notes",
    type: "window",
    icon: "notes",
    color: "#FFCC00",
  },
];

export const SOCIAL_APPS: OSApp[] = [
  {
    id: "telegram",
    name: "Telegram",
    type: "external",
    url: contacts.telegram,
    icon: "telegram",
    color: "#229ED9",
  },
  {
    id: "instagram",
    name: "Instagram",
    type: "external",
    url: contacts.instagram,
    icon: "instagram",
    color: "#E4405F",
  },
  {
    id: "github",
    name: "GitHub",
    type: "external",
    url: contacts.github,
    icon: "github",
    color: "#24292F",
  },
  {
    id: "mail",
    name: "Mail",
    type: "external",
    url: `mailto:${contacts.email}?subject=Portfolio Contact`,
    icon: "mail",
    color: "#007AFF",
  },
];

export const CUSTOM_OS_APPS: OSApp[] = customApps.map(customToOSApp);

export const DESKTOP_APPS: OSApp[] = [
  BUILTIN_WINDOW_APPS.find((a) => a.id === "projects")!,
  BUILTIN_WINDOW_APPS.find((a) => a.id === "about")!,
  BUILTIN_WINDOW_APPS.find((a) => a.id === "contact")!,
  ...(music.enabled
    ? [BUILTIN_WINDOW_APPS.find((a) => a.id === "music")!]
    : []),
  ...CUSTOM_OS_APPS.filter((a) =>
    customApps.find((c) => c.id === a.id)?.showOn.includes("desktop")
  ),
];

export const DOCK_APPS: OSApp[] = [
  BUILTIN_WINDOW_APPS.find((a) => a.id === "finder")!,
  BUILTIN_WINDOW_APPS.find((a) => a.id === "safari")!,
  BUILTIN_WINDOW_APPS.find((a) => a.id === "projects")!,
  ...(music.enabled
    ? [BUILTIN_WINDOW_APPS.find((a) => a.id === "music")!]
    : []),
  ...SOCIAL_APPS.filter((a) => ["telegram", "instagram"].includes(a.id)),
  ...CUSTOM_OS_APPS.filter((a) =>
    customApps.find((c) => c.id === a.id)?.showOn.includes("dock")
  ),
  BUILTIN_WINDOW_APPS.find((a) => a.id === "settings")!,
];

export function getIOSAppsForPage(page: 1 | 2): OSApp[] {
  const page1: OSApp[] = [
    BUILTIN_WINDOW_APPS.find((a) => a.id === "projects")!,
    BUILTIN_WINDOW_APPS.find((a) => a.id === "about")!,
    BUILTIN_WINDOW_APPS.find((a) => a.id === "contact")!,
    BUILTIN_WINDOW_APPS.find((a) => a.id === "safari")!,
    ...(music.enabled
      ? [BUILTIN_WINDOW_APPS.find((a) => a.id === "music")!]
      : []),
    BUILTIN_WINDOW_APPS.find((a) => a.id === "notes")!,
    BUILTIN_WINDOW_APPS.find((a) => a.id === "settings")!,
  ];

  const page2: OSApp[] = [
    ...SOCIAL_APPS,
    ...CUSTOM_OS_APPS.filter(
      (a) => customApps.find((c) => c.id === a.id)?.iosPage === 2
    ),
  ];

  return page === 1 ? page1 : page2;
}

export const IOS_DOCK_APPS: OSApp[] = [
  BUILTIN_WINDOW_APPS.find((a) => a.id === "safari")!,
  ...(music.enabled
    ? [BUILTIN_WINDOW_APPS.find((a) => a.id === "music")!]
    : []),
  SOCIAL_APPS.find((a) => a.id === "telegram")!,
  SOCIAL_APPS.find((a) => a.id === "instagram")!,
  SOCIAL_APPS.find((a) => a.id === "github")!,
];

export function getAllApps(): OSApp[] {
  const map = new Map<string, OSApp>();
  [
    ...BUILTIN_WINDOW_APPS,
    ...SOCIAL_APPS,
    ...CUSTOM_OS_APPS,
  ].forEach((a) => map.set(a.id, a));
  return Array.from(map.values());
}

export function getAppById(id: OSAppId): OSApp | undefined {
  return getAllApps().find((a) => a.id === id);
}

export function isWindowApp(app: OSApp): boolean {
  return app.type === "window" || app.type === "folder";
}
