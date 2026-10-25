"use client";

import { profile, console_ } from "@/data/profile";
import DigitalCard from "@/components/DigitalCard";
import NeuralField from "@/components/NeuralField";
import RoleCycler from "@/components/RoleCycler";

export default function Hero() {
  return (
    <header className="hero" id="top">
      <NeuralField />
      <div className="hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">
            <span className="pulse" aria-hidden="true" />
            Innovation Team · Reserve Bank of Fiji
          </p>
          <h1 className="hero__name">
            <span className="hero__glitch" data-text={profile.firstName}>
              {profile.firstName}
            </span>
            <span className="hero__name--outline">{profile.lastName}</span>
          </h1>
          <p className="hero__roles">
            <span className="hero__job">{profile.jobTitle}</span>
            <span className="hero__sep" aria-hidden="true">/</span>
            working as a <RoleCycler roles={profile.roles} />
          </p>
          <p className="hero__intro">{profile.intro}</p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#rbf">
              See my work <span aria-hidden="true">→</span>
            </a>
            <DigitalCard />
            <a className="btn" href="#play">
              Play Space Defender
            </a>
          </div>
        </div>

        <div className="hero__side">
          <div className="portrait">
            <div className="portrait__ring" aria-hidden="true" />
            <div className="portrait__ring portrait__ring--2" aria-hidden="true" />
            <div className="portrait__img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.photo} alt={`Portrait of ${profile.name}`} width={240} height={240} />
              <span className="idcard__scan" aria-hidden="true" />
            </div>
            <span className="portrait__tag portrait__tag--a">AI</span>
            <span className="portrait__tag portrait__tag--b">DEV</span>
            <span className="portrait__tag portrait__tag--c">AUTO</span>
          </div>

          <div className="console frame" aria-label="What I am working on">
            <div className="console__head">
              <span className="label">// status console</span>
              <span className="label console__live">
                <span className="pulse" aria-hidden="true" /> Live
              </span>
            </div>
            <ul className="console__rows">
              {console_.map((r, i) => (
                <li key={r.label} style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
                  <span className={`console__dot console__dot--${r.state}`} aria-hidden="true" />
                  <span className="console__label">{r.label}</span>
                  <span className="console__value">{r.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
