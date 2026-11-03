"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

function vcard(site: string) {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${profile.lastName};Mohammed ${profile.firstName};;;`,
    `FN:${profile.fullName}`,
    `ORG:${profile.employer}`,
    `TITLE:${profile.role}`,
    `TEL;TYPE=CELL:${profile.phoneRaw}`,
    `EMAIL;TYPE=INTERNET:${profile.email}`,
    `URL:${profile.linkedinUrl}`,
    site ? `URL:${site}` : "",
    `NOTE:${profile.title}`,
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\r\n");
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

async function drawCard(): Promise<Blob | null> {
  try {
    await document.fonts?.ready;
  } catch {}
  const W = 2100;
  const H = 1200;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  if (!ctx) return null;

  const cyan = "#6fd3e6";
  const display = '"Chakra Petch", "Segoe UI", sans-serif';
  const mono = '"IBM Plex Mono", Menlo, monospace';

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0a0e13");
  bg.addColorStop(1, "#111c27");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(255,255,255,0.045)";
  ctx.lineWidth = 2;
  for (let x = 0; x <= W; x += 70) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 70) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  const glow = ctx.createRadialGradient(W * 0.85, 0, 0, W * 0.85, 0, W * 0.6);
  glow.addColorStop(0, "rgba(111,211,230,0.28)");
  glow.addColorStop(1, "rgba(111,211,230,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // corner brackets
  ctx.strokeStyle = cyan;
  ctx.lineWidth = 6;
  const m = 60;
  const L = 90;
  const corners: [number, number, number, number][] = [
    [m, m, 1, 1],
    [W - m, m, -1, 1],
    [m, H - m, 1, -1],
    [W - m, H - m, -1, -1],
  ];
  for (const [x, y, dx, dy] of corners) {
    ctx.beginPath();
    ctx.moveTo(x, y + L * dy);
    ctx.lineTo(x, y);
    ctx.lineTo(x + L * dx, y);
    ctx.stroke();
  }

  // mark
  ctx.strokeStyle = cyan;
  ctx.lineWidth = 4;
  ctx.strokeRect(140, 140, 150, 96);
  ctx.fillStyle = cyan;
  ctx.font = `700 64px ${display}`;
  ctx.textBaseline = "middle";
  ctx.fillText("FS", 172, 190);

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(228,232,238,0.55)";
  ctx.font = `500 34px ${mono}`;
  ctx.fillText("DIGITAL ID  ·  FS/2026", W - 140, 190);
  ctx.textAlign = "left";

  ctx.fillStyle = "#e4e8ee";
  ctx.font = `700 190px ${display}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(profile.name.toUpperCase(), 136, 520);

  ctx.fillStyle = cyan;
  ctx.font = `500 34px ${mono}`;
  ctx.fillText(profile.title.toUpperCase(), 142, 610);

  ctx.fillStyle = "rgba(228,232,238,0.75)";
  ctx.font = `400 44px ${display}`;
  ctx.fillText(`${profile.role} · ${profile.employer}`, 142, 690);

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(142, 770);
  ctx.lineTo(W - 142, 770);
  ctx.stroke();

  const rows = [
    ["EMAIL", profile.email],
    ["PHONE", profile.phone],
    ["LINKEDIN", profile.linkedin],
  ];
  rows.forEach(([k, v], i) => {
    const y = 860 + i * 84;
    ctx.fillStyle = "rgba(228,232,238,0.45)";
    ctx.font = `500 32px ${mono}`;
    ctx.fillText(k, 142, y);
    ctx.fillStyle = "#e4e8ee";
    ctx.font = `500 46px ${display}`;
    ctx.fillText(v, 420, y);
  });

  // decorative barcode
  let x = W - 560;
  let seed = 7;
  while (x < W - 142) {
    seed = (seed * 9301 + 49297) % 233280;
    const w = 4 + (seed % 14);
    ctx.fillStyle = seed % 3 === 0 ? cyan : "rgba(228,232,238,0.6)";
    ctx.fillRect(x, 900, w, 150);
    x += w + 6;
  }

  return new Promise((res) => c.toBlob((b) => res(b), "image/png"));
}

export default function DigitalCard({ variant = "primary" }: { variant?: "primary" | "ghost" }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - py) * 14}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 18}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  }

  function onLeave() {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }

  function saveContact() {
    const blob = new Blob([vcard(window.location.origin)], { type: "text/vcard;charset=utf-8" });
    saveBlob(blob, "Faizan-Shah.vcf");
    setStatus("Contact file ready. Open it to add Faizan to your contacts.");
  }

  async function saveImage() {
    setStatus("Rendering card…");
    const blob = await drawCard();
    if (!blob) {
      setStatus("Your browser could not render the card image.");
      return;
    }
    const file = new File([blob], "Faizan-Shah-card.png", { type: "image/png" });
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Faizan Shah · Digital card" });
        setStatus("Card shared. Choose Save Image to keep it in your photos.");
        return;
      }
    } catch {
      // user cancelled share or share unsupported; fall back to download
    }
    saveBlob(blob, "Faizan-Shah-card.png");
    setStatus("Card image downloaded.");
  }

  return (
    <>
      <button
        type="button"
        className={`btn ${variant === "primary" ? "btn--holo" : ""}`}
        onClick={() => {
          setStatus("");
          setOpen(true);
        }}
      >
        <span className="btn__chip" aria-hidden="true" />
        Get my digital card
      </button>

      {open && (
        <div className="dcard" role="dialog" aria-modal="true" aria-label="Digital business card">
          <div className="dcard__backdrop" onClick={close} />
          <div className="dcard__panel">
            <div className="dcard__head">
              <span className="label">// digital id · tap to save</span>
              <button type="button" className="dcard__close" onClick={close} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="dcard__stage" onPointerMove={onMove} onPointerLeave={onLeave}>
              <div className="idc" ref={cardRef}>
                <div className="idc__sheen" aria-hidden="true" />
                <div className="idc__top">
                  <span className="idc__mark">FS</span>
                  <span className="idc__ref">DIGITAL ID · FS/2026</span>
                </div>
                <div className="idc__name">{profile.name}</div>
                <div className="idc__title">{profile.title}</div>
                <div className="idc__role">
                  {profile.role} · {profile.employer}
                </div>
                <dl className="idc__rows">
                  <div>
                    <dt>Email</dt>
                    <dd>{profile.email}</dd>
                  </div>
                  <div>
                    <dt>Phone</dt>
                    <dd>{profile.phone}</dd>
                  </div>
                  <div>
                    <dt>LinkedIn</dt>
                    <dd>{profile.linkedin}</dd>
                  </div>
                </dl>
                <div className="idc__chip" aria-hidden="true" />
              </div>
            </div>

            <div className="dcard__actions">
              <button type="button" className="btn btn--primary" onClick={saveContact}>
                Save to contacts
              </button>
              <button type="button" className="btn" onClick={saveImage}>
                Save card image
              </button>
            </div>
            <p className="dcard__status" aria-live="polite">
              {status || "Save to contacts adds my details to your phone. Save card image keeps the card in your photos."}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
