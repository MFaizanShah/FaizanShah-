import Hero from "@/components/Hero";
import WorkGrid from "@/components/WorkGrid";
import CopyField from "@/components/CopyField";
import ThemeToggle from "@/components/ThemeToggle";
import DigitalCard from "@/components/DigitalCard";
import SpaceDefender from "@/components/SpaceDefender";
import Reveal from "@/components/Reveal";
import {
  profile,
  metrics,
  disciplines,
  approach,
  rbfWork,
  ventures,
  aiWork,
  healthWork,
  projectCount,
  experience,
  otherExperience,
  education,
  certifications,
} from "@/data/profile";

const NAV = [
  { href: "#what", label: "Expertise" },
  { href: "#rbf", label: "Reserve Bank" },
  { href: "#ai", label: "AI & ML" },
  { href: "#health", label: "Health Projects" },
  { href: "#ventures", label: "Ventures" },
  { href: "#journey", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

function SectionHead({ tag, title, note }: { tag: string; title: string; note?: string }) {
  return (
    <div className="section__head reveal">
      <p className="label">// {tag}</p>
      <h2>{title}</h2>
      {note && <p className="section__note">{note}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Reveal />
      <nav className="nav">
        <div className="nav__inner">
          <a href="#top" className="nav__logo" aria-label="Back to top">
            <span className="nav__mark">FS</span>
            <span className="nav__path">faizan.shah</span>
          </a>
          <ul className="nav__links">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>

      <main className="wrap">
        <Hero />

        <section className="telemetry reveal" aria-label="Key figures">
          {metrics(projectCount).map((m) => (
            <div key={m.label} className="telemetry__cell">
              <span className="telemetry__value">
                {m.value}
                {m.unit && <span className="telemetry__unit">{m.unit}</span>}
              </span>
              <span className="telemetry__label">{m.label}</span>
            </div>
          ))}
        </section>

        <section className="section" id="what">
          <SectionHead
            tag="expertise"
            title="Areas of expertise"
            note="Three disciplines brought together in one role, each focused on solving real problems for the people who use the result."
          />
          <div className="disciplines">
            {disciplines.map((d) => (
              <article key={d.code} className="discipline frame reveal">
                <span className="discipline__code">{d.code}</span>
                <h3>{d.name}</h3>
                <p>{d.plain}</p>
                <div className="work__tech">
                  {d.tools.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="approach frame reveal">
            <div className="approach__intro">
              <p className="label approach__eyebrow">// how i work</p>
              <h3>{approach.title}</h3>
              <p>{approach.intro}</p>
            </div>
            <ol className="approach__steps">
              {approach.steps.map((st) => (
                <li key={st.code}>
                  <span className="approach__code">{st.code}</span>
                  <span className="approach__name">{st.name}</span>
                  <span className="approach__text">{st.plain}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section" id="rbf">
          <SectionHead
            tag="reserve bank of fiji"
            title="Work at the Reserve Bank"
            note="A brief overview of projects I have led or developed as an IT Project Officer on the Innovation Team."
          />
          <WorkGrid items={rbfWork} filterBy="kind" id="rbf" />
        </section>

        <section className="section" id="ai">
          <SectionHead
            tag="ai and machine learning"
            title="AI and machine learning"
            note="AI agents deployed at the Reserve Bank and prediction models from my university research, in one place."
          />
          <WorkGrid items={aiWork} filterBy="context" showContext id="ai" />
        </section>

        <section className="section" id="health">
          <SectionHead
            tag="health projects"
            title="Health projects"
            note="Technology aimed at better health outcomes in Fiji, from public health information to models that support earlier diagnosis."
          />
          <WorkGrid items={healthWork} showContext />
        </section>

        <section className="section" id="ventures">
          <SectionHead
            tag="ventures"
            title="Ventures"
            note="Products I founded, built and continue to run independently."
          />
          <WorkGrid items={ventures} />
        </section>

        <section className="section" id="journey">
          <SectionHead tag="experience" title="Experience and education" />
          <div className="journey">
            <ol className="timeline">
              {experience.map((e) => (
                <li key={e.org} className="timeline__item reveal">
                  <span className="timeline__node" aria-hidden="true" />
                  <div className="timeline__body frame">
                    <div className="timeline__when">
                      <span className="mono-num">{e.period}</span>
                      {e.current && <span className="tag tag--signal">Current</span>}
                    </div>
                    <h3>{e.role}</h3>
                    <p className="timeline__org">{e.org}</p>
                    <p>{e.summary}</p>
                  </div>
                </li>
              ))}
              <li className="timeline__divider reveal">
                <span className="label">Other experience</span>
              </li>
              {otherExperience.map((e) => (
                <li key={e.role} className="timeline__item reveal">
                  <span className="timeline__node timeline__node--other" aria-hidden="true" />
                  <div className="timeline__body frame">
                    <div className="timeline__when">
                      <span className="mono-num">{e.period}</span>
                    </div>
                    <h3>{e.role}</h3>
                    <p className="timeline__org">{e.org}</p>
                    <p>{e.summary}</p>
                  </div>
                </li>
              ))}
              <li className="timeline__divider reveal">
                <span className="label">Education</span>
              </li>
              {education.map((ed) => (
                <li key={ed.award} className="timeline__item reveal">
                  <span className="timeline__node timeline__node--edu" aria-hidden="true" />
                  <div className="timeline__body frame">
                    <div className="timeline__when">
                      <span className="mono-num">{ed.period}</span>
                      {ed.current && <span className="tag tag--signal">In progress</span>}
                    </div>
                    <h3>{ed.award}</h3>
                    <p className="timeline__org">{ed.school}</p>
                    <p>{ed.note}</p>
                  </div>
                </li>
              ))}
            </ol>

            <aside className="certs reveal">
              <p className="label certs__label">Certifications</p>
              {certifications.map((c) => (
                <a
                  key={c.name}
                  className="cert frame"
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="cert__issuer">{c.issuer}</span>
                  <span className="cert__name">{c.name}</span>
                  <span className="cert__go" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ))}
            </aside>
          </div>
        </section>

        <section className="section" id="play">
          <SectionHead
            tag="play"
            title="Space Defender"
            note="Defend Faizan's server from bugs and phishing emails. Every wave you clear decrypts a fact about my work."
          />
          <div className="reveal">
            <SpaceDefender />
          </div>
        </section>

        <section className="section contact" id="contact">
          <SectionHead
            tag="contact"
            title="Get in touch"
            note="I welcome conversations about AI engineering, software development and automation opportunities."
          />
          <div className="contact__grid reveal">
            <CopyField label="Email" value={profile.email} />
            <CopyField label="Phone" value={profile.phone} />
            <div className="copyfield frame">
              <span className="label">LinkedIn</span>
              <span className="copyfield__value">{profile.linkedin}</span>
              <a className="btn btn--small" href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                Open profile ↗
              </a>
            </div>
          </div>
          <div className="contact__ctas reveal">
            <DigitalCard variant="ghost" />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span className="mono-num">Software · AI · Automation</span>
          <span>All systems nominal</span>
        </div>
      </footer>
    </>
  );
}
