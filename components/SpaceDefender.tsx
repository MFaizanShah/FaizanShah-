"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gameFacts } from "@/data/profile";

/*
  Space Defender
  Defend Faizan's server from bugs and phishing emails.
  Controls: arrow keys or A/D to move (the ship fires automatically),
  or drag on the screen with a finger or mouse.
  Every wave cleared and every power up collected decrypts a fact.
*/

const W = 480;
const H = 600;
const SERVER_Y = H - 34;

type Phase = "idle" | "running" | "over";
type EnemyType = "bug" | "phish";
type PowerType = "shield" | "triple" | "repair";

interface Enemy { x: number; y: number; vx: number; vy: number; hp: number; type: EnemyType; t: number; }
interface Shot { x: number; y: number; vx: number; vy: number; enemy?: boolean; }
interface Power { x: number; y: number; type: PowerType; t: number; }
interface Spark { x: number; y: number; vx: number; vy: number; life: number; color: string; }

const POWERS: Record<PowerType, { name: string; color: string; letter: string }> = {
  shield: { name: "Copilot Shield", color: "#6fd3e6", letter: "S" },
  triple: { name: "Power Automate", color: "#b18cff", letter: "P" },
  repair: { name: "Python Patch", color: "#5fd49a", letter: "+" },
};

const C = {
  bg: "#05080c",
  grid: "rgba(111,211,230,0.06)",
  ship: "#6fd3e6",
  shot: "#e6eaf0",
  bug: "#e9b44c",
  phish: "#ff6b7a",
  server: "#6fd3e6",
  text: "#e6eaf0",
  muted: "#8995a3",
};

export default function SpaceDefender() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const keys = useRef<Record<string, boolean>>({});
  const pointerX = useRef<number | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [hud, setHud] = useState({ score: 0, wave: 1, integrity: 100, shield: 0, triple: false });
  const [best, setBest] = useState(0);
  const [facts, setFacts] = useState(0);
  const [toast, setToast] = useState("");
  const factsRef = useRef(0);

  const unlock = useCallback((label: string) => {
    if (factsRef.current >= gameFacts.length) return;
    factsRef.current += 1;
    setFacts(factsRef.current);
    setToast(label);
    window.setTimeout(() => setToast(""), 1800);
  }, []);

  useEffect(() => {
    try {
      const b = Number(localStorage.getItem("fs-defender-best") || 0);
      if (b) setBest(b);
    } catch {}
  }, []);

  // Static attract screen so the board never looks empty.
  useEffect(() => {
    if (phase !== "idle") return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawBackdrop(ctx, 0);
    drawServer(ctx, 100, 0);
    drawShip(ctx, W / 2, H - 80, false);
    [[120, 140, "bug"], [240, 110, "phish"], [360, 150, "bug"], [180, 220, "phish"], [310, 240, "bug"]].forEach(
      ([x, y, t]) => drawEnemy(ctx, { x: x as number, y: y as number, vx: 0, vy: 0, hp: 1, type: t as EnemyType, t: 0 })
    );
  }, [phase]);

  const start = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    cancelAnimationFrame(rafRef.current);

    factsRef.current = 0;
    setFacts(0);
    setPhase("running");
    wrapRef.current?.focus({ preventScroll: true });

    const s = {
      ship: { x: W / 2, y: H - 80 },
      shots: [] as Shot[],
      enemies: [] as Enemy[],
      powers: [] as Power[],
      sparks: [] as Spark[],
      score: 0,
      wave: 1,
      kills: 0,
      integrity: 100,
      shield: 0,
      tripleUntil: 0,
      lastShot: 0,
      lastSpawn: 0,
      waveBanner: 120,
      shake: 0,
      time: 0,
    };

    const killsPerWave = () => 6 + s.wave * 4;

    const spawn = () => {
      const phish = Math.random() < Math.min(0.15 + s.wave * 0.07, 0.55);
      const speed = 0.7 + s.wave * 0.18 + Math.random() * 0.5;
      s.enemies.push({
        x: 30 + Math.random() * (W - 60),
        y: -20,
        vx: phish ? (Math.random() < 0.5 ? -1 : 1) * (0.8 + Math.random()) : 0,
        vy: phish ? speed * 0.8 : speed,
        hp: phish ? 2 : 1,
        type: phish ? "phish" : "bug",
        t: Math.random() * 6,
      });
    };

    const burst = (x: number, y: number, color: string, n = 14) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = 1 + Math.random() * 3;
        s.sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 30 + Math.random() * 20, color });
      }
    };

    const hitServer = (dmg: number) => {
      if (s.shield > 0) {
        s.shield -= 1;
        return;
      }
      s.integrity = Math.max(0, s.integrity - dmg);
      s.shake = 10;
    };

    const end = () => {
      cancelAnimationFrame(rafRef.current);
      setPhase("over");
      setHud((h) => ({ ...h, score: s.score, wave: s.wave, integrity: 0 }));
      try {
        const prev = Number(localStorage.getItem("fs-defender-best") || 0);
        if (s.score > prev) localStorage.setItem("fs-defender-best", String(s.score));
      } catch {}
      setBest((b) => Math.max(b, s.score));
    };

    let hudTick = 0;

    const loop = () => {
      s.time += 1;
      const now = s.time;

      // Movement
      const speed = 6;
      if (keys.current.ArrowLeft || keys.current.a) s.ship.x -= speed;
      if (keys.current.ArrowRight || keys.current.d) s.ship.x += speed;
      if (pointerX.current !== null) s.ship.x += (pointerX.current - s.ship.x) * 0.25;
      s.ship.x = Math.max(22, Math.min(W - 22, s.ship.x));

      // Auto fire
      const triple = now < s.tripleUntil;
      if (now - s.lastShot > (triple ? 9 : 11)) {
        s.lastShot = now;
        s.shots.push({ x: s.ship.x, y: s.ship.y - 18, vx: 0, vy: -9 });
        if (triple) {
          s.shots.push({ x: s.ship.x - 8, y: s.ship.y - 12, vx: -2, vy: -8.5 });
          s.shots.push({ x: s.ship.x + 8, y: s.ship.y - 12, vx: 2, vy: -8.5 });
        }
      }

      // Spawning
      const gap = Math.max(16, 52 - s.wave * 5);
      if (s.waveBanner <= 0 && now - s.lastSpawn > gap) {
        s.lastSpawn = now;
        spawn();
      }
      if (s.waveBanner > 0) s.waveBanner -= 1;

      // Update shots
      s.shots.forEach((sh) => {
        sh.x += sh.vx;
        sh.y += sh.vy;
      });
      s.shots = s.shots.filter((sh) => sh.y > -20 && sh.y < H + 20 && sh.x > -20 && sh.x < W + 20);

      // Update enemies
      for (const e of s.enemies) {
        e.t += 0.05;
        e.y += e.vy;
        e.x += e.type === "phish" ? Math.sin(e.t * 2) * e.vx : Math.sin(e.t) * 0.4;
        if (e.x < 16 || e.x > W - 16) e.vx *= -1;
        if (e.type === "phish" && Math.random() < 0.004 + s.wave * 0.0012 && e.y > 20 && e.y < H - 200) {
          s.shots.push({ x: e.x, y: e.y + 12, vx: 0, vy: 4.2, enemy: true });
        }
      }

      // Collisions: player shots vs enemies
      for (const sh of s.shots) {
        if (sh.enemy) continue;
        for (const e of s.enemies) {
          if (e.hp > 0 && Math.abs(sh.x - e.x) < 16 && Math.abs(sh.y - e.y) < 14) {
            e.hp -= 1;
            sh.y = -100;
            if (e.hp <= 0) {
              s.score += e.type === "phish" ? 25 : 10;
              s.kills += 1;
              burst(e.x, e.y, e.type === "phish" ? C.phish : C.bug);
              if (Math.random() < 0.11) {
                const r = Math.random();
                const type: PowerType = s.integrity < 70 && r < 0.4 ? "repair" : r < 0.6 ? "shield" : "triple";
                s.powers.push({ x: e.x, y: e.y, type, t: 0 });
              }
            } else {
              burst(e.x, e.y, C.text, 4);
            }
            break;
          }
        }
      }

      // Enemy shots vs ship or server
      for (const sh of s.shots) {
        if (!sh.enemy) continue;
        if (Math.abs(sh.x - s.ship.x) < 16 && Math.abs(sh.y - s.ship.y) < 14) {
          sh.y = H + 100;
          burst(s.ship.x, s.ship.y, C.phish, 10);
          hitServer(10);
        } else if (sh.y >= SERVER_Y) {
          sh.y = H + 100;
          hitServer(5);
        }
      }

      // Enemies reaching the server or ramming the ship
      for (const e of s.enemies) {
        if (e.hp <= 0) continue;
        if (Math.abs(e.x - s.ship.x) < 22 && Math.abs(e.y - s.ship.y) < 20) {
          e.hp = 0;
          burst(e.x, e.y, C.phish);
          hitServer(15);
        } else if (e.y >= SERVER_Y - 8) {
          e.hp = 0;
          burst(e.x, SERVER_Y, C.phish, 18);
          hitServer(e.type === "phish" ? 15 : 8);
        }
      }
      s.enemies = s.enemies.filter((e) => e.hp > 0);

      // Power ups
      for (const p of s.powers) {
        p.y += 2;
        p.t += 0.1;
        if (Math.abs(p.x - s.ship.x) < 24 && Math.abs(p.y - s.ship.y) < 22) {
          p.y = H + 100;
          burst(p.x, p.y, POWERS[p.type].color, 16);
          if (p.type === "shield") s.shield = 3;
          if (p.type === "triple") s.tripleUntil = now + 60 * 7;
          if (p.type === "repair") s.integrity = Math.min(100, s.integrity + 25);
          s.score += 15;
          unlock(`${POWERS[p.type].name} · +1 fact`);
        }
      }
      s.powers = s.powers.filter((p) => p.y < H + 20);

      // Waves
      if (s.kills >= killsPerWave()) {
        s.kills = 0;
        s.wave += 1;
        s.waveBanner = 110;
        s.integrity = Math.min(100, s.integrity + 10);
        unlock(`Wave ${s.wave - 1} cleared · +1 fact`);
      }

      // Sparks
      s.sparks.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.life -= 1;
      });
      s.sparks = s.sparks.filter((p) => p.life > 0);

      // Draw
      ctx.save();
      if (s.shake > 0) {
        ctx.translate((Math.random() - 0.5) * s.shake, (Math.random() - 0.5) * s.shake);
        s.shake *= 0.85;
        if (s.shake < 0.5) s.shake = 0;
      }
      drawBackdrop(ctx, now);
      drawServer(ctx, s.integrity, now);
      s.powers.forEach((p) => drawPower(ctx, p));
      s.enemies.forEach((e) => drawEnemy(ctx, e));
      s.shots.forEach((sh) => {
        ctx.fillStyle = sh.enemy ? C.phish : triple ? "#b18cff" : C.shot;
        ctx.shadowColor = ctx.fillStyle as string;
        ctx.shadowBlur = 8;
        ctx.fillRect(sh.x - 1.5, sh.y - 6, 3, 12);
        ctx.shadowBlur = 0;
      });
      s.sparks.forEach((p) => {
        ctx.globalAlpha = Math.max(0, p.life / 50);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 2.5, 2.5);
      });
      ctx.globalAlpha = 1;
      drawShip(ctx, s.ship.x, s.ship.y, s.shield > 0, now);

      if (s.waveBanner > 0) {
        ctx.globalAlpha = Math.min(1, s.waveBanner / 30);
        ctx.fillStyle = C.ship;
        ctx.font = '700 40px "Chakra Petch", sans-serif';
        ctx.textAlign = "center";
        ctx.fillText(`WAVE ${s.wave}`, W / 2, H / 2 - 20);
        ctx.font = '500 13px "IBM Plex Mono", monospace';
        ctx.fillStyle = C.muted;
        ctx.fillText(s.wave === 1 ? "BUGS AND PHISHING INBOUND" : "THREAT LEVEL RISING", W / 2, H / 2 + 10);
        ctx.globalAlpha = 1;
        ctx.textAlign = "left";
      }
      ctx.restore();

      hudTick += 1;
      if (hudTick % 6 === 0) {
        setHud({
          score: s.score,
          wave: s.wave,
          integrity: s.integrity,
          shield: s.shield,
          triple: now < s.tripleUntil,
        });
      }

      if (s.integrity <= 0) {
        end();
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  }, [unlock]);

  // Keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (phase !== "running") return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (["ArrowLeft", "ArrowRight", "a", "d", " "].includes(k)) {
        keys.current[k] = true;
        pointerX.current = null;
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      keys.current[k] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [phase]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // Pause if the visitor scrolls the game fully out of view.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) keys.current = {};
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function toCanvasX(clientX: number) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * W;
  }

  return (
    <div className="game">
      <div className="game__board frame">
        <div className="game__hud game__hud--4">
          <div>
            <span className="label">Score</span>
            <span className="game__num">{String(hud.score).padStart(4, "0")}</span>
          </div>
          <div>
            <span className="label">Wave</span>
            <span className="game__num">{String(hud.wave).padStart(2, "0")}</span>
          </div>
          <div>
            <span className="label">Best</span>
            <span className="game__num">{String(best).padStart(4, "0")}</span>
          </div>
          <div>
            <span className="label">Server</span>
            <span className="game__num" style={{ color: hud.integrity < 35 ? "var(--amber)" : undefined }}>
              {hud.integrity}%
            </span>
          </div>
        </div>
        <div className="game__bar" aria-hidden="true">
          <span style={{ width: `${hud.integrity}%` }} />
        </div>
        <div className="game__powers" aria-live="polite">
          <span className={`pwr${hud.shield > 0 ? " pwr--on" : ""}`} style={{ "--pc": POWERS.shield.color } as React.CSSProperties}>
            Copilot Shield {hud.shield > 0 ? `×${hud.shield}` : ""}
          </span>
          <span className={`pwr${hud.triple ? " pwr--on" : ""}`} style={{ "--pc": POWERS.triple.color } as React.CSSProperties}>
            Power Automate
          </span>
          <span className="pwr" style={{ "--pc": POWERS.repair.color } as React.CSSProperties}>
            Python Patch
          </span>
        </div>

        <div
          className="arcade"
          ref={wrapRef}
          tabIndex={0}
          aria-label="Space Defender game screen"
          onPointerDown={(e) => {
            if (phase !== "running") return;
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            pointerX.current = toCanvasX(e.clientX);
          }}
          onPointerMove={(e) => {
            if (phase !== "running") return;
            if (e.pointerType === "mouse" || e.buttons > 0) pointerX.current = toCanvasX(e.clientX);
          }}
          onPointerUp={(e) => {
            if (e.pointerType !== "mouse") pointerX.current = null;
          }}
        >
          <canvas ref={canvasRef} width={W} height={H} className="arcade__canvas" />
          <div className="arcade__scanlines" aria-hidden="true" />
          {toast && <div className="arcade__toast">{toast}</div>}

          {phase !== "running" && (
            <div className="game__overlay arcade__overlay">
              {phase === "over" ? (
                <>
                  <p className="label">Server offline</p>
                  <p className="game__result">Score {hud.score}</p>
                  <p className="game__hint">
                    You reached wave {hud.wave} and decrypted {facts} of {gameFacts.length} facts about me.
                  </p>
                </>
              ) : (
                <>
                  <p className="label">Defend Faizan's server</p>
                  <p className="game__result">Space Defender</p>
                  <p className="game__hint">
                    Your ship fires on its own. Move with the arrow keys, or drag on a phone. Stop the bugs and
                    phishing emails before they reach the server.
                  </p>
                  <ul className="arcade__legend">
                    <li><span style={{ color: C.bug }}>●</span> Bug · 10 pts</li>
                    <li><span style={{ color: C.phish }}>●</span> Phishing email · 25 pts, shoots back</li>
                    <li><span style={{ color: POWERS.shield.color }}>S</span> Copilot Shield blocks 3 hits</li>
                    <li><span style={{ color: POWERS.triple.color }}>P</span> Power Automate triple shot</li>
                    <li><span style={{ color: POWERS.repair.color }}>+</span> Python Patch repairs the server</li>
                  </ul>
                </>
              )}
              <button type="button" className="btn btn--primary" onClick={start} id="game-start">
                {phase === "over" ? "Play again" : "Launch"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="game__log frame">
        <div className="game__loghead">
          <span className="label">// decrypted.log</span>
          <span className="label">
            {String(facts).padStart(2, "0")}/{String(gameFacts.length).padStart(2, "0")}
          </span>
        </div>
        <p className="game__logtip">Clear a wave or catch a power up to decrypt the next fact.</p>
        <ol className="game__facts">
          {gameFacts.map((f, i) => {
            const open = i < facts;
            return (
              <li key={i} className={open ? "is-open" : ""}>
                <span className="game__idx">{String(i + 1).padStart(2, "0")}</span>
                <span>{open ? f : "▓▓▓▓▓▓ ▓▓▓▓ ▓▓▓▓▓▓▓▓ ▓▓▓"}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

/* ---------- Drawing helpers ---------- */

const stars = Array.from({ length: 70 }, () => ({
  x: Math.random() * W,
  y: Math.random() * H,
  s: Math.random() * 1.6 + 0.3,
  v: Math.random() * 0.6 + 0.2,
}));

function drawBackdrop(ctx: CanvasRenderingContext2D, t: number) {
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = C.grid;
  ctx.lineWidth = 1;
  const off = (t * 0.6) % 40;
  for (let y = off; y < H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  for (let x = 0; x <= W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (const st of stars) {
    const y = (st.y + t * st.v) % H;
    ctx.fillStyle = `rgba(230,234,240,${0.25 + st.s * 0.25})`;
    ctx.fillRect(st.x, y, st.s, st.s);
  }
}

function drawServer(ctx: CanvasRenderingContext2D, integrity: number, t: number) {
  const ok = integrity >= 35;
  const col = ok ? C.server : C.bug;
  ctx.fillStyle = "rgba(111,211,230,0.06)";
  ctx.fillRect(0, SERVER_Y, W, H - SERVER_Y);
  ctx.strokeStyle = col;
  ctx.shadowColor = col;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(0, SERVER_Y);
  ctx.lineTo(W, SERVER_Y);
  ctx.stroke();
  ctx.shadowBlur = 0;
  for (let i = 0; i < 12; i++) {
    const on = Math.sin(t * 0.08 + i * 1.7) > 0;
    ctx.fillStyle = on ? col : "rgba(137,149,163,0.4)";
    ctx.fillRect(20 + i * 10, SERVER_Y + 14, 4, 4);
  }
  ctx.fillStyle = C.muted;
  ctx.font = '500 11px "IBM Plex Mono", monospace';
  ctx.textAlign = "right";
  ctx.fillText(`FAIZAN'S SERVER · ${Math.round(integrity)}%`, W - 16, SERVER_Y + 20);
  ctx.textAlign = "left";
}

function drawShip(ctx: CanvasRenderingContext2D, x: number, y: number, shield: boolean, t = 0) {
  ctx.save();
  ctx.translate(x, y);
  // thruster
  ctx.fillStyle = `rgba(233,180,76,${0.5 + Math.sin(t * 0.5) * 0.3})`;
  ctx.beginPath();
  ctx.moveTo(-5, 12);
  ctx.lineTo(0, 22 + Math.sin(t * 0.7) * 3);
  ctx.lineTo(5, 12);
  ctx.fill();
  // body
  ctx.shadowColor = C.ship;
  ctx.shadowBlur = 14;
  ctx.fillStyle = C.ship;
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(16, 12);
  ctx.lineTo(6, 8);
  ctx.lineTo(0, 12);
  ctx.lineTo(-6, 8);
  ctx.lineTo(-16, 12);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = C.bg;
  ctx.fillRect(-2, -6, 4, 8);
  if (shield) {
    ctx.strokeStyle = POWERS.shield.color;
    ctx.globalAlpha = 0.7 + Math.sin(t * 0.2) * 0.2;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy) {
  ctx.save();
  ctx.translate(e.x, e.y);
  if (e.type === "bug") {
    ctx.strokeStyle = C.bug;
    ctx.fillStyle = C.bug;
    ctx.lineWidth = 1.6;
    const wig = Math.sin(e.t * 8) * 2;
    for (const side of [-1, 1]) {
      for (const k of [-5, 0, 5]) {
        ctx.beginPath();
        ctx.moveTo(side * 5, k);
        ctx.lineTo(side * 12, k + wig * side);
        ctx.stroke();
      }
    }
    ctx.shadowColor = C.bug;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.ellipse(0, 1, 6, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -9, 4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.shadowColor = C.phish;
    ctx.shadowBlur = 10;
    ctx.fillStyle = e.hp > 1 ? C.phish : "#ff9aa5";
    ctx.fillRect(-14, -10, 28, 20);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = C.bg;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-14, -10);
    ctx.lineTo(0, 2);
    ctx.lineTo(14, -10);
    ctx.stroke();
    ctx.fillStyle = C.bg;
    ctx.font = '700 9px "IBM Plex Mono", monospace';
    ctx.textAlign = "center";
    ctx.fillText("!", 0, 9);
  }
  ctx.restore();
}

function drawPower(ctx: CanvasRenderingContext2D, p: Power) {
  const meta = POWERS[p.type];
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(Math.sin(p.t) * 0.3);
  ctx.strokeStyle = meta.color;
  ctx.shadowColor = meta.color;
  ctx.shadowBlur = 12;
  ctx.lineWidth = 2;
  ctx.strokeRect(-11, -11, 22, 22);
  ctx.shadowBlur = 0;
  ctx.fillStyle = meta.color;
  ctx.font = '700 13px "IBM Plex Mono", monospace';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(meta.letter, 0, 1);
  ctx.restore();
}
