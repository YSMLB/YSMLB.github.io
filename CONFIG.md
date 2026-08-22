# Как настроить своё портфолио

Все персональные данные лежат в одном файле:

**`lib/portfolio/userConfig.ts`**

После правок перезагрузи страницу (`npm run dev`).

---

## Профиль

```ts
profile: {
  name: "Amir",           // имя на экране
  title: "...",           // должность
  bio: "...",             // текст в «Обо мне»
  initials: "AB",         // аватар-заглушка (если нет photo)
  photo: "/my_photo.jpg", // положи файл в public/my_photo.jpg
  memes: [                // картинки в public/memes/
    "/memes/meme1.jpg",
    "/memes/meme2.jpg",
  ],
  machineName: "Amir's MacBook",  // подпись на рабочем столе macOS
}
```

---

## Контакты и соцсети

```ts
contacts: {
  email: "you@mail.com",
  telegram: "https://t.me/username",
  telegramHandle: "@username",
  instagram: "https://www.instagram.com/username",
  instagramHandle: "@username",
  github: "https://github.com/username",
  githubHandle: "github.com/username",
}
```

Приложения Telegram, Instagram, GitHub, Mail берут ссылки отсюда автоматически.

---

## Яндекс Музыка (фоновый плеер)

Музыка играет **в фоне** после клика «Нажмите, чтобы продолжить» на boot screen.  
Приложение Music показывает обложку и статус — **без iframe** (чтобы не было 404).

1. Открой [music.yandex.ru](https://music.yandex.ru)
2. Выбери **свой плейлист** или **альбом**
3. Нажми **Поделиться** → скопируй ссылку
4. Вставь в `userConfig.ts`:

```ts
music: {
  enabled: true,
  appName: "Music",
  playlistTitle: "Название плейлиста",   // отображается в UI
  playlistSubtitle: "Яндекс Музыка",
  yandexShareUrl: "https://music.yandex.ru/playlists/UUID-или-users/.../playlists/123",
  yandexEmbedUrl: "",  // оставь пустым — embed соберётся сам
}
```

**Если фон не играет:** открой Music → «Поделиться» → **HTML-код** → скопируй `src="..."` в `yandexEmbedUrl`.

**Не используй** `/play` в конце embed-URL для UUID-плейлистов — это даёт 404 «тупик».

Примеры ссылок:
- Плейлист: `https://music.yandex.ru/users/username/playlists/123`
- Альбом: `https://music.yandex.ru/album/456`
- Трек: `https://music.yandex.ru/album/456/track/789`

---

## Свои приложения (YouTube, LinkedIn и т.д.)

Добавь объект в массив `customApps`:

```ts
{
  id: "behance",              // уникальный id (латиница)
  name: "Behance",            // название под иконкой
  url: "https://behance.net/you",
  icon: "link",               // youtube | linkedin | twitter | discord | vk | whatsapp | link | notes | settings
  color: "#1769FF",
  showOn: ["dock", "ios"],    // desktop | dock | ios
  iosPage: 2,                 // 1 или 2 — страница домашнего экрана iOS
}
```

---

## Обои

```ts
wallpapers: {
  mac: "sequoia",   // sequoia | aurora | monterey
  ios: "ios18",     // ios18 | ios17 | gradient
}
```

---

## Проекты (кейсы)

Список работ: **`data/projects.ts`** — заголовок, ссылка на case study, теги.

---

## Структура интерфейса

| Платформа | Что видишь |
|-----------|------------|
| **Desktop** | macOS: menu bar, рабочий стол, dock, окна |
| **Mobile** | iOS: 2 экрана приложений, dock, full-screen окна |

Boot-анимация: Apple logo → загрузка → рабочий стол.
