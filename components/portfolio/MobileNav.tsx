"use client";

import { NAV_ITEMS, type SectionId } from "@/lib/portfolio/constants";

interface MobileNavProps {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
  onContactClick: () => void;
}

export default function MobileNav({
  activeSection,
  onNavigate,
  onContactClick,
}: MobileNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-xl border-t border-[var(--border)] safe-area-pb">
      <div className="flex justify-around items-center py-3 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() =>
                item.id === "contact"
                  ? onContactClick()
                  : onNavigate(item.id)
              }
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                isActive
                  ? "text-[var(--accent)]"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              <span className="font-mono text-[9px] uppercase tracking-wider">
                {item.mobileLabel}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
