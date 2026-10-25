"use client";

import { useState } from "react";
import type { Work } from "@/data/profile";

const STATUS_CLASS: Record<Work["status"], string> = {
  Deployed: "status--live",
  Live: "status--live",
  "In development": "status--build",
  Completed: "status--done",
};

function WorkCard({ w, showContext }: { w: Work; showContext?: boolean }) {
  const host = w.url ? w.url.replace(/^https?:\/\//, "") : "";
  return (
    <article className={`work frame reveal${w.featured ? " work--featured" : ""}`}>
      <div className="work__head">
        <span className="work__code">
          {w.code}
          {showContext && w.context && <span className="work__context"> · {w.context}</span>}
        </span>
        <span className={`status ${STATUS_CLASS[w.status]}`}>
          <span className="status__dot" aria-hidden="true" />
          {w.status}
        </span>
      </div>
      <h3 className="work__name">{w.name}</h3>
      <p className="work__role">{w.role}</p>
      <p className="work__plain">{w.plain}</p>
      <div className="work__helps">
        <span className="label">Who it helps</span>
        <span>{w.helps}</span>
      </div>
      <div className="work__foot">
        <div className="work__tech">
          {w.tech.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        {w.url && (
          <a className="link" href={w.url} target="_blank" rel="noopener noreferrer">
            Visit {host} <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  );
}

export default function WorkGrid({
  items,
  filterBy,
  showContext,
  id,
}: {
  items: Work[];
  filterBy?: "kind" | "context";
  showContext?: boolean;
  id?: string;
}) {
  const keyOf = (w: Work) => (filterBy ? (w[filterBy] as string | undefined) : undefined);
  const groups = Array.from(new Set(items.map(keyOf).filter(Boolean))) as string[];
  const [filter, setFilter] = useState<string>("All");
  const list = filter === "All" ? items : items.filter((i) => keyOf(i) === filter);
  const ordered = [...list.filter((i) => i.featured), ...list.filter((i) => !i.featured)];

  return (
    <>
      {filterBy && groups.length > 1 && (
        <div className="filters" role="tablist" aria-label="Filter projects">
          {["All", ...groups].map((f) => {
            const count = f === "All" ? items.length : items.filter((i) => keyOf(i) === f).length;
            return (
              <button
                key={f}
                id={`filter-${id ?? "x"}-${f.replace(/\s+/g, "-")}`}
                role="tab"
                aria-selected={filter === f}
                className={`chip${filter === f ? " chip--on" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
                <span className="chip__count">{String(count).padStart(2, "0")}</span>
              </button>
            );
          })}
        </div>
      )}
      <div className={`works works--${Math.min(ordered.filter((o) => !o.featured).length, 3)}`}>
        {ordered.map((w) => (
          <WorkCard key={w.code} w={w} showContext={showContext} />
        ))}
      </div>
    </>
  );
}
