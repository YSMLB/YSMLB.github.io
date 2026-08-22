export type PortfolioNote = {
  id: string;
  title: string;
  folder: string;
  preview: string;
  date: string;
  pinned?: boolean;
  body: string;
};

export const PORTFOLIO_NOTES: PortfolioNote[] = [
  {
    id: "life-plan",
    title: "План на жизнь 🎯",
    folder: "Личное",
    preview: "поступить в SNU, найти кореяночку, b2b saas на ассемблере…",
    date: "22 авг. 2026",
    pinned: true,
    body: `☐ поступить в SNU
☐ найти себе кореяночку (must have: любит рамён)
☐ во время учебы разработать b2b saas ultra max docker compose на языке ассемблеров
☐ переехать со своей женой-кореянкой в румынию, разбиться на красном феррари
☐ выучить корейский до уровня «понимаю мемы в TikTok»
☐ CTO к 25 — или хотя бы senior который всех любит

P.S. если что-то из этого не сойдётся — blame lag`,
  },
  {
    id: "shopping",
    title: "Список покупок",
    folder: "Личное",
    preview: "кофе, энергетик, ещё кофе, VPN…",
    date: "21 авг. 2026",
    body: `• кофе (x3 запас)
• энергетик «для продуктивности»
• ещё один энергетик «на всякий»
• VPN на год (или на вечность)
• корейский словарь
• новый ноут когда текущий перестанет терпеть меня
• ramen premium pack из Costco`,
  },
  {
    id: "startup-ideas",
    title: "Идеи стартапов (unicorn tier)",
    folder: "Работа",
    preview: "Uber для бабушек, Tinder для дебага…",
    date: "20 авг. 2026",
    pinned: true,
    body: `1. Uber, но только для бабушек с сумками
2. Tinder, но свайпаешь баги — match = fix merged
3. ChatGPT на Arduino Uno (latency 4 business days)
4. Notion, но всё в одной ячейке Excel 2003
5. B2B SaaS где единственная фича — кнопка «deploy prod» без confirm

valuation: $999M pre-revenue`,
  },
  {
    id: "bugs-i-love",
    title: "Баги которые я обожаю",
    folder: "Работа",
    preview: "works on my machine, fixed only in prod…",
    date: "19 авг. 2026",
    body: `✓ works on my machine™
✓ fixed in prod accidentally at 3am
✓ «это не баг, это фича» (official)
✓ race condition который появляется только когда клиент смотрит
✓ CORS — мой духовный наставник

todo: написать unit test который всегда green независимо от кода`,
  },
  {
    id: "productivity",
    title: "Рецепт продуктивности",
    folder: "Личное",
    preview: "sleep(3h), coffee++, push to main on Friday…",
    date: "18 авг. 2026",
    body: `ингредиенты:
— сон 3–4 часа (optional)
— кофе x5
— один commit message «fix»
— деплой в пятницу в 18:00

инструкция:
1. открыть IDE
2. panic
3. stackoverflow
4. copy paste
5. «я архитектор btw»

выход: burnout deluxe, зато shipped 🚀`,
  },
  {
    id: "learn-2026",
    title: "Выучить до конца года",
    folder: "Учёба",
    preview: "корейский, Go, почему фронт ломается в полночь…",
    date: "17 авг. 2026",
    body: `• корейский — хотя бы «안녕하세요» без google translate
• Go — generics без слёз
• Docker — compose который не орёт ERROR
• почему React re-render'ится 47 раз на hover
• как объяснить маме что я не чиню принтеры и ноутбуки

bonus: понять свой же код через 2 недели`,
  },
  {
    id: "passwords",
    title: "Пароли (секретно!!!)",
    folder: "Личное",
    preview: "я их не помню и ты тоже не узнаешь",
    date: "16 авг. 2026",
    body: `github: ●●●●●●●●●●
telegram: ●●●●●●●●
bank: ●●●●●●●●●●●●
wifi: admin123 (шутка, не admin123)

если ты это читаешь — ты либо я, либо хакер из кино`,
  },
];

export function getNoteById(id: string): PortfolioNote | undefined {
  return PORTFOLIO_NOTES.find((n) => n.id === id);
}
