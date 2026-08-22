"use client";

import { motion } from "framer-motion";
import { CONTACT } from "@/lib/portfolio/constants";
import { useCursorHandlers } from "./CustomCursor";

interface ContactSectionProps {
  onContactClick: () => void;
  setIsCursorHovered: (v: boolean) => void;
}

export default function ContactSection({
  onContactClick,
  setIsCursorHovered,
}: ContactSectionProps) {
  const cursor = useCursorHandlers(setIsCursorHovered);

  const links = [
    {
      label: "Email",
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}?subject=Contact Request`,
    },
    {
      label: "Telegram",
      value: CONTACT.telegramHandle,
      href: CONTACT.telegram,
      external: true,
    },
    {
      label: "GitHub",
      value: CONTACT.githubHandle,
      href: CONTACT.github,
      external: true,
    },
  ];

  return (
    <section
      id="contact"
      className="relative py-24 md:py-32 pb-32 md:pb-32 px-4 md:px-8 bg-[var(--bg-surface)] border-t border-[var(--border)]"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">
            03 / Contact
          </p>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4">
            Есть проект?
          </h2>
          <p className="text-gray-400 text-sm md:text-lg mb-10 max-w-lg mx-auto">
            Давайте обсудим — от MVP до production-ready системы
          </p>

          <button
            onClick={onContactClick}
            {...cursor}
            className="mb-12 px-8 py-4 bg-[var(--accent)] text-black font-medium rounded-full hover:bg-white transition-colors duration-300 cursor-auto md:cursor-none text-sm md:text-base"
          >
            Написать мне
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                {...cursor}
                className="group p-6 rounded-2xl border border-white/10 bg-[var(--bg-primary)]/50 hover:border-[var(--accent)]/50 transition-colors cursor-auto md:cursor-none"
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-[var(--accent)] transition-colors mb-2">
                  {link.label}
                </p>
                <p className="text-white text-sm break-words group-hover:text-gray-300 transition-colors">
                  {link.value}
                </p>
              </a>
            ))}
          </div>

          <p className="mt-16 font-mono text-[10px] text-gray-600 uppercase tracking-widest">
            © {new Date().getFullYear()} Amir · YSM.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
