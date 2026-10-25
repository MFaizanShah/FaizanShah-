"use client";

import { useEffect, useState } from "react";

const GLYPHS = "▓▒░<>/\\_|=+#*01";

// Cycles through the roles with a short decode effect between them.
export default function RoleCycler({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(roles[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % roles.length), 3200);
    return () => window.clearInterval(id);
  }, [roles.length]);

  useEffect(() => {
    const target = roles[index];
    let frame = 0;
    const total = 18;
    const id = window.setInterval(() => {
      frame += 1;
      const revealed = Math.floor((frame / total) * target.length);
      setText(
        target
          .split("")
          .map((ch, i) =>
            i < revealed || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          )
          .join("")
      );
      if (frame >= total) {
        setText(target);
        window.clearInterval(id);
      }
    }, 34);
    return () => window.clearInterval(id);
  }, [index, roles]);

  return (
    <span className="cycler" aria-live="polite">
      <span className="cycler__bracket" aria-hidden="true">[</span>
      <span className="cycler__text">{text}</span>
      <span className="cycler__bracket" aria-hidden="true">]</span>
    </span>
  );
}
