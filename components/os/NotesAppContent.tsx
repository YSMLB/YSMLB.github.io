"use client";

import { useState } from "react";
import { PORTFOLIO_NOTES, type PortfolioNote } from "@/lib/portfolio/notes";

function NoteListItem({
  note,
  active,
  onClick,
}: {
  note: PortfolioNote;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-black/[0.06] outline-none transition-colors ${
        active ? "bg-[#007AFF]/10" : "hover:bg-black/[0.03] active:bg-black/[0.05]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-[16px] text-[#1d1d1f] truncate flex-1">
          {note.pinned && <span className="mr-1">📌</span>}
          {note.title}
        </p>
        <span className="text-[13px] text-[#86868b] shrink-0">{note.date.split(" ")[0]}</span>
      </div>
      <p className="text-[14px] text-[#86868b] truncate mt-0.5">{note.preview}</p>
      <p className="text-[11px] text-[#007AFF] mt-1">{note.folder}</p>
    </button>
  );
}

function NoteEditor({ note }: { note: PortfolioNote }) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#FFFCED] min-h-0">
      <div className="px-5 pt-4 pb-8 max-w-2xl">
        <p className="text-[13px] text-[#86868b] mb-1">{note.date}</p>
        <h1 className="text-[28px] font-bold text-[#1d1d1f] leading-tight mb-4">{note.title}</h1>
        <div className="text-[17px] text-[#1d1d1f] leading-[1.55] whitespace-pre-wrap">
          {note.body}
        </div>
      </div>
    </div>
  );
}

export function NotesContent() {
  const sorted = [...PORTFOLIO_NOTES].sort((a, b) => Number(b.pinned) - Number(a.pinned));
  const [selectedId, setSelectedId] = useState(sorted[0]?.id ?? "");
  const [mobileShowNote, setMobileShowNote] = useState(false);

  const selected = sorted.find((n) => n.id === selectedId) ?? sorted[0];

  const pickNote = (id: string) => {
    setSelectedId(id);
    setMobileShowNote(true);
  };

  return (
    <div className="flex h-full min-h-[420px] bg-white">
      {/* Sidebar / list */}
      <div
        className={`${
          mobileShowNote ? "hidden md:flex" : "flex"
        } flex-col w-full md:w-[280px] shrink-0 border-r border-black/[0.08] bg-[#f2f2f7]`}
      >
        <div className="px-4 py-3 border-b border-black/[0.06] bg-[#f2f2f7]">
          <p className="text-[22px] font-bold text-[#1d1d1f]">Notes</p>
          <p className="text-[13px] text-[#86868b]">{sorted.length} notes</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sorted.map((note) => (
            <NoteListItem
              key={note.id}
              note={note}
              active={note.id === selectedId}
              onClick={() => pickNote(note.id)}
            />
          ))}
        </div>
      </div>

      {/* Detail */}
      <div className={`${mobileShowNote ? "flex" : "hidden md:flex"} flex-col flex-1 min-w-0`}>
        {mobileShowNote && (
          <button
            type="button"
            onClick={() => setMobileShowNote(false)}
            className="md:hidden flex items-center gap-1 px-4 py-2 text-[#007AFF] text-[17px] border-b border-black/[0.06] bg-[#f2f2f7] outline-none"
          >
            ‹ Notes
          </button>
        )}
        {selected ? <NoteEditor note={selected} /> : null}
      </div>
    </div>
  );
}
