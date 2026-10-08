# YSM Portfolio & Showcase Applications

> Личный веб-сайт разработчика Amir ([@YSMLB](https://github.com/YSMLB)) с интерактивным интерфейсом операционных систем (macOS Desktop / iOS Home) и четырьмя встроенными showcase-приложениями.

---

## 1. Overview (Обзор)

Проект представляет собой интерактивное портфолио full-stack разработчика, спроектированное не как традиционный статичный лендинг, а как симуляция операционной системы:

- **Desktop (десктопный режим):** интерфейс в стиле macOS Sonoma/Sequoia с панелью меню, настраиваемым доком, многооконной средой (свободное перемещение, минимизация, переключение z-index), виджетами и мини-плеером.
- **Mobile (мобильный режим):** адаптивный интерфейс домашнего экрана iOS с пагинацией иконок (свайп между страницами), статус-баром, Dynamic Island и полноэкранными модальными окнами приложений.
- **Showcase-проекты:** внутри приложения реализованы четыре самостоятельных веб-продукта (e-commerce с 3D WebGL, трекер инфраструктуры и метрик бэкенда, сервис доставки еды и игровая платформа).

Централизованная конфигурация профиля, контактов, музыки и системных обоев вынесена в `lib/portfolio/userConfig.ts`, что позволяет модифицировать контент без изменения логики компонентов.

---

## 2. Features (Подтверждённые возможности)

### Оконная среда и взаимодействие (OS Simulation)
- **Boot Screen:** анимированный экран загрузки с логотипом Apple, индикатором прогресса и активацией фонового аудиопотока по клику (обход автоплей-политики браузеров).
- **Оконный менеджер (`useWindowManager`):**
  - Поддержка открытия, закрытия, минимизации и фокусировки окон.
  - Динамическое управление `z-index` активного окна.
  - Преднастроенные начальные координаты и размеры для каждого типа приложений (`safari`, `about`, `projects`, `contact`, `music`, `notes`, `settings`, `finder`).
- **Dynamic Island:** интерактивный остров в мобильном представлении с тремя состояниями (`idle`, `compact`, `expanded`), анимированным эквалайзером и контролом аудиоплеера.
- **Фоновый аудиоплеер (`MusicContext`):**
  - Воспроизведение локальных треков через HTML5 Audio API.
  - Постоянный статус текущего трека в Menu Bar, Dock, Dynamic Island и окне Music.
  - Зацикливание очереди и переключение треков.
- **Персонализация и настройки (`SettingsContext`):**
  - Выбор системных обоев: macOS (`sequoia`, `aurora`, `monterey`) и iOS (`sequoia`, `ios18`, `ios17`, `gradient`).
  - Переключатель фоновой музыки и автооткрытия Safari.
  - Двуязычная локализация (`ru` / `en`) через `LocaleContext`.
- **Встроенные приложения ОС:**
  - **Safari:** приветственный питч разработчика и специализация.
  - **About Me:** профиль разработчика, фото (`/my_photo.jpg`), биография и галерея мемов (`/memes/`).
  - **Projects:** интерактивный каталог кейсов с тегами и переходом к showcase-страницам.
  - **Notes:** каталогизированные заметки с фильтрацией по папкам («Личное», «Работа», «Учёба»), поиском и закреплёнными записями.
  - **Contact:** быстрый переход к Telegram, Instagram, GitHub и почте.
  - **Settings:** панель управления внешним видом и звуком.

---

## 3. Screenshots / Preview (Превью и медиа-ресурсы)

В репозитории содержатся оригинальные графические и мультимедийные ассеты:

- **Фото профиля:** [`public/my_photo.jpg`](file:///public/my_photo.jpg)
- **Иконки приложений ОС:** [`public/icons/apps/`](file:///public/icons/apps/) (`finder.png`, `safari.png`, `projects.png`, `music.png`, `notes.png`, `settings.png`, `telegram.png`, `github.png`, `instagram.png` и др.)
- **3D-модели кроссовок (GLB):** [`public/models/`](file:///public/models/) (`1.glb` – `15.glb`)
- **Медиатека аудио:** [`public/music/`](file:///public/music/) (`best-life.mp3`, `dilemma.mp3`)
- **Мемы приложения Notes/About:** [`public/memes/`](file:///public/memes/) (`drake-dark-mode.png`, `seoul-vibes.jpg`, `hacking-movies.png`)

> Скриншоты развёрнутого интерфейса можно разместить в каталоге `public/preview/` после развёртывания проекта.

---

## 4. Tech Stack (Технологический стек)

| Направление | Технология | Версия | Описание |
|---|---|---|---|
| **Фреймворк** | [Next.js](https://nextjs.org/) | `16.2.10` | App Router, статический пререндеринг страниц, Turbopack |
| **Библиотека UI** | [React](https://react.dev/) | `19.2.4` | React 19, Server & Client Components, хуки состояния |
| **Язык** | [TypeScript](https://www.typescriptlang.org/) | `^5` | Строгая типизация компонентов, конфигураций и моделей |
| **Стилизация** | [Tailwind CSS](https://tailwindcss.com/) | `^4` | Tailwind v4 via `@tailwindcss/postcss`, утилитарные стили |
| **Шрифты** | `next/font` | Geist & Geist Mono | Автоматическая оптимизация веб-шрифтов от Vercel |
| **Анимации** | [Framer Motion](https://www.framer.com/motion/) | `^12.42.2` | Оконные переходы, Dynamic Island, Drag & Drop, физика spring |
| **3D & WebGL** | [Three.js](https://threejs.org/) | `^0.185.1` | 3D-сцены, освещение, шейдеры |
| **React 3D** | [@react-three/fiber](https://r3f.docs.pmnd.rs/) | `^9.6.1` | Декларативный Three.js рендерер для React |
| **3D Helpers** | [@react-three/drei](https://github.com/pmndrs/drei) | `^10.7.7` | `OrbitControls`, `useGLTF`, `ScrollControls`, `Environment` |
| **Постобработка** | `@react-three/postprocessing` | `^3.0.4` | Эффекты шейдеров и размытия |
| **Иконки** | [Lucide React](https://lucide.dev/) | `^1.25.0` | Векторные иконки интерфейса |
| **Линтер** | [ESLint](https://eslint.org/) | `^9` | Flat config (`eslint.config.mjs`) c `eslint-config-next` |

---

## 5. Architecture / Project Structure (Архитектура и структура)

```
YSMLB.github.io/
├── app/                           # Next.js App Router (маршруты и макеты)
│   ├── layout.tsx                 # Корневой макет (шрифты Geist, HTML lang, метаданные)
│   ├── page.tsx                   # Корневая страница: BootScreen -> (MacDesktop | IOSHome)
│   ├── globals.css                # Глобальные стили Tailwind CSS v4
│   ├── cart/                      # Корзина для магазина кроссовок
│   │   └── page.tsx
│   ├── megawin/                   # Showcase: игровая платформа MegaWin
│   │   └── page.tsx
│   ├── poesh/                     # Showcase: сервис доставки «ПОЕШЬ»
│   │   └── page.tsx
│   ├── proxypulse/                # Showcase: бэкенд-мониторинг ProxyPulse (3D + терминал)
│   │   └── page.tsx
│   └── sneakers/                  # Showcase: 3D E-Commerce Sneaker Store (Three.js/Fiber)
│       └── page.tsx
├── components/                    # React-компоненты
│   ├── os/                        # Компоненты эмуляции ОС
│   │   ├── BootScreen.tsx         # Экран загрузки с логотипом Apple
│   │   ├── MacDesktop.tsx         # Рабочий стол macOS
│   │   ├── MacDock.tsx            # macOS Dock с анимацией увеличения и бейджами
│   │   ├── MacMenuBar.tsx         # Верхнее меню со статусом и часами
│   │   ├── MacWindow.tsx          # Окно macOS с кнопками закрытия/минимизации
│   │   ├── MacNowPlayingBar.tsx   # Мини-плеер внизу экрана
│   │   ├── IOSHome.tsx            # Домашний экран iOS со свайп-пагинацией
│   │   ├── DynamicIsland.tsx      # Виджет Dynamic Island (compact / expanded)
│   │   ├── AppIcon.tsx            # Рендер иконок приложений
│   │   ├── WindowContent.tsx      # Содержимое окон (Safari, About, Projects, Contact)
│   │   ├── MusicAppContent.tsx    # Внутренний интерфейс плеера
│   │   ├── NotesAppContent.tsx    # Внутренний интерфейс заметок
│   │   ├── SettingsAppContent.tsx # Внутренний интерфейс настроек
│   │   └── wallpapers/            # Обои macOS и iOS
│   └── portfolio/                 # UI-компоненты предыдущей ревизии (Hero, Scene3D, etc.)
├── context/                       # React Context провайдеры
│   ├── LocaleContext.tsx          # Локализация (ru/en)
│   ├── MusicContext.tsx           # Состояние аудиоплеера и Dynamic Island
│   └── SettingsContext.tsx        # Состояние темы, обоев и системных флагов
├── hooks/                         # Пользовательские хуки
│   ├── useIsMobile.ts             # Определение мобильного экрана (breakpoint: 768px)
│   └── useWindowManager.ts        # Стейт-машина оконного менеджера (z-index, focus, open/close)
├── lib/
│   └── portfolio/
│       ├── userConfig.ts          # Единая конфигурация пользователя, ссылок и медиа
│       ├── osApps.ts              # Реестр приложений ОС и их сопоставление с окнами
│       ├── notes.ts               # База данных заметок
│       ├── i18n.ts                # Словари интернационализации
│       └── constants.ts           # Системные константы
├── data/
│   └── projects.ts                # Список кейсов портфолио
├── public/                        # Статические файлы (3D GLB-модели, MP3, иконки, фото)
├── AGENTS.md                      # Инструкции и ограничения для AI-ассистентов
├── CLAUDE.md                      # Ссылка на AGENTS.md для Claude Code
├── next.config.ts                 # Конфигурация Next.js
├── tsconfig.json                  # Конфигурация TypeScript
└── package.json                   # Зависимости и скрипты проекта
```

---

## 6. Pages & Routing (Маршрутизация и страницы)

Все маршруты реализованы в рамках App Router и статически генерируются при сборке (`Static SSG`):

| Маршрут | Название | Описание и технические детали |
|---|---|---|
| `/` | **OS Portfolio** | Главная страница. В зависимости от ширины экрана запускает `MacDesktop` или `IOSHome`. Оконная система, музыка, заметки, визитка. |
| `/sneakers` | **Sneaker Store** | 3D-каталог обуви на Three.js (`@react-three/fiber`, `@react-three/drei`). Загрузка `.glb` моделей, интерактивный просмотр (вращение, зум), фильтрация по категориям. |
| `/cart` | **Cart** | Страница корзины магазина кроссовок с навигацией возврата в каталог. |
| `/proxypulse` | **ProxyPulse** | Демонстрация бэкенд-инфраструктуры: интерактивная 3D Canvas-сцена + терминал реального времени с симуляцией логов gRPC, HTTP и WebSocket на Go / C#. |
| `/poesh` | **ПОЕШЬ** | Веб-интерфейс сервиса быстрой доставки еды (г. Оренбург): каталог блюд по категориям, интерактивная корзина, модальное окно оформления заказа. |
| `/megawin` | **MegaWin** | Комплексный интерфейс онлайн-казино: каталог слотов, настольных и live-игр, интерактивные мини-игры (слоты, рулетка, кости), баланс, модальные окна акций и VIP-статусов. |

---

## 7. Subdomains (Статус поддоменов)

В техническом задании упомянуты 4 дополнительных сайта на поддоменах. 

**Фактическое состояние репозитория:**
- Все 4 дополнительных проекта (`sneakers`, `proxypulse`, `poesh`, `megawin`) находятся **внутри текущего монолитного репозитория** как маршруты App Router (`/sneakers`, `/proxypulse`, `/poesh`, `/megawin`).
- В проекте **отсутствует** конфигурация поддоменов:
  - Нет `middleware.ts` для анализа `hostname` и перезаписи путей (`rewrites`).
  - В `next.config.ts` не настроены правила `rewrites()` для внешних доменов.
  - Файлы `CNAME` или конфигурации DNS в репозитории отсутствуют.

> **Примечание:** Если планируется запуск проектов на отдельных поддоменах (например, `sneakers.domain.com`), потребуется добавить Next.js Middleware (`middleware.ts`) с маршрутизацией по `request.nextUrl.hostname` либо настроить алиасы доменов в панели Vercel / Cloudflare.

---

## 8. AI-Assisted Development (Разработка с поддержкой AI)

В проекте заложены правила и контекстные файлы для эффективного взаимодействия с современными AI-ассистентами (Cursor, Claude Code, Gemini CLI, Copilot):

### Роль `AGENTS.md` и `CLAUDE.md`
В корне репозитория размещены файлы:
- **`AGENTS.md`**:
  ```markdown
  <!-- BEGIN:nextjs-agent-rules -->
  # This is NOT the Next.js you know

  This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
  <!-- END:nextjs-agent-rules -->
  ```
- **`CLAUDE.md`**: содержит ссылку `@AGENTS.md` для автоматического подтягивания правил при инициализации контекста в Claude Code.

### Зачем нужны эти инструкции
1. **Предотвращение устаревших генераций:** В проекте используется новейший стек (Next.js 16, React 19, Tailwind CSS v4). Большинство базовых обучающих выборок AI содержат паттерны для Next.js 13/14 (Pages Router, `next/router` вместо `next/navigation`, старый синтаксис Tailwind v3 с `tailwind.config.js`). Директива прямо указывает агенту сверяться с документацией из `node_modules/next/dist/docs/`.
2. **Контроль архитектурной чистоты:**
   - Компоненты верхнего уровня в `app/page.tsx` используют директиву `"use client"` из-за интерактивных анимаций Framer Motion и контекстов.
   - Разделение ответственности: состояние изолировано в `context/` и `hooks/`, данные профиля — в `lib/portfolio/userConfig.ts`, а визуальные компоненты — в `components/os/`.
3. **Стабильность стилизации:** Tailwind CSS v4 использует декларацию `@import "tailwindcss";` в `app/globals.css` без громоздкого файла `tailwind.config.js`. Инструкции предохраняют от ошибочной генерации устаревших конфигурационных файлов.

> *Важно:* Файлы `AGENTS.md` и `CLAUDE.md` представляют собой практические guardrails для кодогенерации, а не автономную мультиагентную систему.

---

## 9. Getting Started (Локальный запуск)

### Требования
- Node.js: `v20.x` или выше
- Менеджер пакетов: `npm`, `pnpm` или `yarn`

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```
Откройте [http://localhost:3000](http://localhost:3000) в браузере для просмотра результата.

### Сборка production-бандла
```bash
npm run build
```

### Локальный запуск production-сборки
```bash
npm run start
```

### Проверка линтером
```bash
npm run lint
```

---

## 10. Deployment (Развёртывание)

Проект представляет собой стандартное Next.js App Router приложение и готов к развёртыванию следующими способами:

### 1. Vercel (Рекомендуемый и подтверждённый)
Так как проект построен на Next.js 16, оптимальной платформой является **Vercel**:
1. Импортируйте репозиторий в [панели Vercel](https://vercel.com/new).
2. Настройки сборки определяются автоматически (`Framework Preset: Next.js`).
3. Команда сборки: `npm run build`.
4. Директория вывода: `.next`.

### 2. GitHub Pages (`YSMLB.github.io`)
Репозиторий имеет имя `YSMLB.github.io`, предназначенное для GitHub Pages. Для развёртывания на GitHub Pages в качестве чистого статического сайта потребуется:
1. Включить статический экспорт в [`next.config.ts`](file:///next.config.ts):
   ```ts
   const nextConfig: NextConfig = {
     output: "export",
     images: { unoptimized: true },
     // ...
   };
   ```
2. Настроить GitHub Actions workflow (`.github/workflows/deploy.yml`) для сборки и выгрузки артефактов из каталога `out/`.

---

## 11. Настройка контента под себя

Все персональные данные, ссылки на социальные сети, плейлисты и обои собраны в одном месте:

👉 [`lib/portfolio/userConfig.ts`](file:///lib/portfolio/userConfig.ts)

```ts
export const USER_CONFIG = {
  profile: {
    name: "Amir",
    title: "Backend & Full-Stack Developer",
    bio: "...",
    photo: "/my_photo.jpg",
    memes: [...],
  },
  contacts: {
    email: "amirsaga4@gmail.com",
    telegram: "https://t.me/JAPYSM_vey",
    github: "https://github.com/YSMLB",
    instagram: "https://www.instagram.com/japysm_vey",
  },
  // Настройки треков, кастомных приложений и обоев
};
```

---

## 12. Roadmap / Future Improvements (Планы по развитию)

- [ ] Реализовать настоящий роутинг поддоменов через Next.js `middleware.ts` (`sneakers.*`, `proxypulse.*`, `poesh.*`, `megawin.*`).
- [ ] Оптимизировать загрузку тяжелых 3D-моделей кроссовок (`.glb`) с использованием компрессии Draco и прогрессивной загрузки.
- [ ] Настроить автоматический CI/CD pipeline в GitHub Actions для сборки и проверки типов.
- [ ] Добавить поддержку темной/светлой темы интерфейса окон и расширить набор виджетов.
- [ ] Добавить полноэкранные превью-скриншоты каждого приложения в документацию.

---

## Полезные ресурсы

- [Документация Next.js](https://nextjs.org/docs) — справочник по возможностям и API Next.js.
- [Обучающий курс Next.js](https://nextjs.org/learn) — интерактивное руководство.
- [Репозиторий Next.js на GitHub](https://github.com/vercel/next.js) — исходный код и обсуждения сообщества.
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) — оптимизация шрифтов Geist.
