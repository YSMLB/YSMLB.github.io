import { USER_CONFIG } from "./userConfig";

/**
 * Преобразует ссылку Яндекс Музыки в URL для iframe-плеера.
 */
export function buildYandexEmbedUrl(
  shareUrl: string,
  embedUrl?: string
): string | null {
  if (embedUrl?.trim()) {
    return embedUrl.trim();
  }

  if (!shareUrl?.trim()) return null;

  try {
    const url = new URL(shareUrl.trim());

    if (url.pathname.includes("/iframe/")) {
      return shareUrl.trim();
    }

    const hash = url.hash.replace("#", "");

    const trackMatch = url.pathname.match(/\/album\/(\d+)\/track\/(\d+)/);
    if (trackMatch) {
      return `https://music.yandex.ru/iframe/#track/${trackMatch[2]}`;
    }

    const albumMatch = url.pathname.match(/\/album\/(\d+)/);
    if (albumMatch) {
      return `https://music.yandex.ru/iframe/#album/${albumMatch[1]}`;
    }

    // music.yandex.ru/playlists/{uuid}
    const uuidPlaylistMatch = url.pathname.match(
      /\/playlists\/([a-f0-9-]{36})/i
    );
    if (uuidPlaylistMatch) {
      return `https://music.yandex.ru/iframe/#playlist/${uuidPlaylistMatch[1]}`;
    }

    // music.yandex.ru/users/USER/playlists/ID
    const playlistMatch = url.pathname.match(
      /\/users\/([^/]+)\/playlists\/(\d+)/
    );
    if (playlistMatch) {
      return `https://music.yandex.ru/iframe/#playlist/${playlistMatch[1]}/${playlistMatch[2]}`;
    }

    if (hash.startsWith("playlist/") || hash.startsWith("album/")) {
      return `https://music.yandex.ru/iframe/#${hash}`;
    }

    return null;
  } catch {
    return null;
  }
}

export function getMusicEmbedUrl(): string | null {
  const { yandexShareUrl, yandexEmbedUrl } = USER_CONFIG.music;
  return buildYandexEmbedUrl(yandexShareUrl, yandexEmbedUrl);
}
