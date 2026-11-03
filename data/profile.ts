// All portfolio content lives here. Edit this file to update the site.
// Every project has a plain language line ("plain") written for readers
// who are not technical. The tech tags sit underneath for those who are.

export type Status = "Deployed" | "Live" | "In development" | "Completed";

export type WorkKind = "AI agents" | "Apps and automation" | "National systems";

export type Area = "ai" | "health";

export type Context = "Reserve Bank of Fiji" | "University research" | "Own venture";

export interface Work {
  code: string;
  name: string;
  kind?: WorkKind;
  context?: Context;
  areas?: Area[];
  role: string;
  status: Status;
  plain: string;
  helps: string;
  tech: string[];
  url?: string;
  featured?: boolean;
}

export const profile = {
  name: "Faizan Shah",
  fullName: "Mohammed Faizan Shah",
  firstName: "Faizan",
  lastName: "Shah",
  roles: ["Software Developer", "AI Engineer", "Automation Developer"],
  title: "Software Development · AI Engineering · Process Automation",
  shortTitle: "IT Project Officer",
  jobTitle: "IT Project Officer",
  role: "IT Project Officer, Innovation Team",
  employer: "Reserve Bank of Fiji",
  email: "faizan16ssa@gmail.com",
  phone: "+679 866 4698",
  phoneRaw: "+6798664698",
  linkedin: "linkedin.com/in/mohammed-shah",
  linkedinUrl: "https://www.linkedin.com/in/mohammed-shah",
  photo:
    "https://static.wixstatic.com/media/79b60f_e5eca536f1f1401a9df2ac560951d87e~mv2.jpg/v1/crop/x_1447,y_1802,w_1334,h_1333/fill/w_480,h_480,al_c,q_85/IMGA.jpg",
  intro:
    "I am an IT Project Officer on the Innovation Team at the Reserve Bank of Fiji. I develop software, build AI agents, and work with teams to identify where AI and automation can improve the way they work. Several of the systems I have helped build are used nationwide.",
};

// Metrics. The project total is calculated from the lists further down.
export const metrics = (projectCount: number) => [
  { value: String(projectCount), label: "Projects delivered and in progress" },
  { value: "2", label: "AI agents built for the Reserve Bank" },
  { value: "2", label: "Systems used nationwide" },
  { value: "4.0", unit: "/4.5", label: "Current GPA, Master of Computer Science" },
  { value: "1", label: "National AI policy consultation" },
];

// The three disciplines in the headline, explained plainly.
export const disciplines = [
  {
    code: "01",
    name: "Software Development",
    plain:
      "Designing and building complete systems, from the interfaces people use to the databases behind them. This includes contributing to two national systems used by commercial banks across Fiji.",
    tools: ["C#", "ASP.NET Core", "Next.js", "SQL", "Power Apps"],
  },
  {
    code: "02",
    name: "AI Engineering",
    plain:
      "Developing AI agents that answer questions from an organisation's own documents and data, and machine learning models that forecast outcomes and support decisions.",
    tools: ["Copilot Studio", "Python", "Machine learning", "Prediction models"],
  },
  {
    code: "03",
    name: "Process Automation",
    plain:
      "Reviewing how teams work, finding repetitive manual steps, and replacing them with automated workflows and apps that save time and reduce errors.",
    tools: ["Power Automate", "Power Apps", "SharePoint", "Web scraping"],
  },
];

// The "How I work" panel, which explains what the IT Project Officer role
// covers in practice.
export const approach = {
  title: "IT Project Officer, in practice",
  intro:
    "My title is IT Project Officer. In practice the role spans software development, AI engineering, process automation and advising teams, following the same four steps on every project.",
  steps: [
    {
      code: "01",
      name: "Understand",
      plain: "Meet the business unit, observe the current process and define the problem in their terms.",
    },
    {
      code: "02",
      name: "Advise",
      plain: "Assess where AI, automation or new software would add value, and recommend the most practical option.",
    },
    {
      code: "03",
      name: "Build",
      plain: "Develop the solution, whether an AI agent, an automated workflow or a full application.",
    },
    {
      code: "04",
      name: "Deploy and support",
      plain: "Test with users, roll it out and support the team once it is live.",
    },
  ],
};

// Spotlight shown as its own band on the page.
export const policy = {
  title: "Fiji's National AI Policy",
  role: "Stakeholder representative",
  plain:
    "I served as one of the stakeholder representatives in the national consultation on Fiji's AI policy. Together we reviewed the principles that will guide how AI is used across the country, and I contributed the perspective of a practitioner who builds and deploys AI systems.",
};

// Reserve Bank work is described briefly and at a high level on purpose.
export const rbfWork: Work[] = [
  {
    code: "PA",
    context: "Reserve Bank of Fiji",
    areas: ["ai"],
    name: "Policy Agent",
    kind: "AI agents",
    role: "Lead developer",
    status: "Deployed",
    featured: true,
    plain: "An AI assistant that helps staff find answers to questions about internal policies.",
    helps: "Staff across the bank.",
    tech: ["Copilot Studio", "AI agent"],
  },
  {
    code: "EA",
    context: "Reserve Bank of Fiji",
    areas: ["ai"],
    name: "Economics Analyst Agent",
    kind: "AI agents",
    role: "Developer",
    status: "In development",
    plain: "An AI assistant that supports economic analysis and forecasting.",
    helps: "The bank's economists.",
    tech: ["Copilot Studio", "AI agent"],
  },
  {
    code: "MG",
    context: "Reserve Bank of Fiji",
    areas: ["ai"],
    name: "AI Interactive Museum Guide",
    kind: "AI agents",
    role: "Developer",
    status: "In development",
    plain: "An interactive AI guide that answers visitors' questions about the museum and its collection.",
    helps: "Museum visitors and school groups.",
    tech: ["Python", "Conversational AI"],
  },
  {
    code: "ND",
    context: "Reserve Bank of Fiji",
    areas: [],
    name: "Souvenir Note Designer",
    kind: "Apps and automation",
    role: "Developer",
    status: "Completed",
    plain: "A museum experience that lets visitors design their own souvenir banknote.",
    helps: "Museum visitors.",
    tech: ["Python"],
  },
  {
    code: "WS",
    context: "Reserve Bank of Fiji",
    areas: [],
    name: "Web Data Extraction",
    kind: "Apps and automation",
    role: "Developer",
    status: "Deployed",
    plain: "Automated collection of publicly available data for research.",
    helps: "Research teams.",
    tech: ["Web scraping", "Power Automate"],
  },
  {
    code: "VIRC",
    context: "Reserve Bank of Fiji",
    areas: [],
    name: "Virtual Information Resource Centre",
    kind: "Apps and automation",
    role: "Lead developer",
    status: "Deployed",
    plain: "A digital library that gives staff one place to find the bank's resources.",
    helps: "Staff across the bank.",
    tech: ["Power Apps", "SharePoint"],
  },
  {
    code: "LIB",
    context: "Reserve Bank of Fiji",
    areas: [],
    name: "Life Insurance Beneficiary App",
    kind: "Apps and automation",
    role: "Lead developer",
    status: "Deployed",
    plain: "Replaced a paper based process with a simple digital app.",
    helps: "Staff and Human Resources.",
    tech: ["Power Apps", "Power Automate"],
  },
  {
    code: "MM",
    context: "Reserve Bank of Fiji",
    areas: [],
    name: "Mail Merge Automation",
    kind: "Apps and automation",
    role: "Lead developer",
    status: "Deployed",
    plain: "Turned a manual letter process into a fully automated workflow.",
    helps: "Internal business teams.",
    tech: ["Power Automate"],
  },
  {
    code: "OET",
    context: "Reserve Bank of Fiji",
    areas: [],
    name: "Transactions Reporting System",
    kind: "National systems",
    role: "One of the developers",
    status: "Live",
    plain: "A reporting system used by financial institutions across Fiji.",
    helps: "Financial institutions nationwide.",
    tech: ["C#", "ASP.NET Core", "SQL"],
  },
  {
    code: "DLI",
    context: "Reserve Bank of Fiji",
    areas: [],
    name: "Debit Limit Increase System",
    kind: "National systems",
    role: "One of the developers",
    status: "Live",
    plain: "A system used nationwide to manage debit limit increase requests.",
    helps: "Financial institutions nationwide.",
    tech: ["C#", "ASP.NET Core", "SQL"],
  },
];

export const ventures: Work[] = [
  {
    code: "LWF",
    context: "Own venture",
    areas: ["health"],
    name: "Live Well Fiji",
    role: "Founder and developer · Nonprofit",
    status: "Live",
    url: "https://livewellfiji.com",
    plain:
      "A free health information website for the people of Fiji, in English, Fijian and Hindi. It has health blogs, a personal health tracker, suggestions, and clear information on living with conditions such as HIV and its medicines, and NCDs like diabetes and high blood pressure.",
    helps: "Anyone in Fiji looking for trusted, easy to read health information.",
    tech: ["Web", "Multilingual", "Health tracker"],
  },
  {
    code: "SFT",
    context: "Own venture",
    areas: [],
    name: "Soulful Ties",
    role: "Founder and developer",
    status: "Live",
    url: "https://soulfulties.com",
    plain:
      "Beautiful digital wedding invitations. Guests open their invitation online and reply in a few taps, and couples see every RSVP in one place.",
    helps: "Couples planning their wedding and their guests.",
    tech: ["Web", "RSVP system", "Digital invitations"],
  },
];

export const research: Work[] = [
  {
    code: "ATR",
    context: "University research",
    areas: ["ai"],
    name: "AtRisk Tracker",
    role: "Machine learning developer",
    status: "Completed",
    plain:
      "Predicts student grades so a university can spot students who may be failing early and offer help before it is too late.",
    helps: "Students who are struggling, and the staff who support them.",
    tech: ["Machine learning", "Prediction models", "Python"],
  },
  {
    code: "DNG",
    context: "University research",
    areas: ["ai", "health"],
    name: "Dengue Fever Prediction",
    role: "Developer",
    status: "Completed",
    plain:
      "Predicts dengue fever outbreaks from weather patterns and location, so health teams can prepare before cases rise.",
    helps: "Public health teams and communities at risk.",
    tech: ["Machine learning", "Prediction models", "Weather data"],
  },
  {
    code: "BCA",
    context: "University research",
    areas: ["ai", "health"],
    name: "Breast Cancer Analysis",
    role: "Developer",
    status: "Completed",
    plain:
      "An AI model that studies microscope images of tissue and guides doctors to the areas that may contain cancer cells.",
    helps: "Doctors and pathologists diagnosing breast cancer.",
    tech: ["Deep learning", "Image analysis", "Python"],
  },
];

export const experience = [
  {
    period: "2024 → Present",
    role: "IT Project Officer, Innovation Team",
    org: "Reserve Bank of Fiji",
    current: true,
    summary:
      "Develop software and AI agents, contribute to systems used nationwide, and lead automation projects for internal teams.",
  },
  {
    period: "Jul 2024 → Dec 2024",
    role: "Project Manager and Lead Developer (Industrial Experience Project, USP)",
    org: "Digital Fiji",
    current: false,
    summary:
      "Delivered a monitoring platform that tracks government websites, servers and services around the clock, and alerts the responsible teams by email and SMS when an issue arises.",
  },
];

export const otherExperience = [
  {
    period: "2024 → Present",
    role: "AI Consultant (Internal)",
    org: "Reserve Bank of Fiji",
    summary:
      "Advise teams on where AI and automation could improve their work, and recommend practical solutions.",
  },
  {
    period: "National consultation",
    role: "Stakeholder Representative, National AI Policy",
    org: "Government of Fiji consultation",
    summary:
      "Reviewed the guiding principles of Fiji's National AI Policy with other stakeholders and contributed a practitioner's perspective on how AI should be adopted responsibly.",
  },
];

// Cross cutting views. A project appears in every area it belongs to.
const all = (): Work[] => [...rbfWork, ...research, ...ventures];
export const projectCount = all().length;
export const aiWork: Work[] = all().filter((w) => w.areas?.includes("ai"));
export const healthWork: Work[] = all()
  .filter((w) => w.areas?.includes("health"))
  .map((w) => ({ ...w, featured: false }));

export const education = [
  {
    award: "Master of Computer Science",
    school: "University of the South Pacific",
    period: "2025 → Present",
    note: "Current GPA 4.0 out of 4.5. Focus on machine learning and AI.",
    current: true,
  },
  {
    award: "Postgraduate Certificate in Computer Science",
    school: "University of the South Pacific",
    period: "2025",
    note: "Completed with a GPA of 3.8.",
    current: false,
  },
  {
    award: "Bachelor of Software Engineering",
    school: "University of the South Pacific",
    period: "2021 → 2024",
    note: "Funded by the National Toppers Award scholarship.",
    current: false,
  },
];

export const certifications = [
  {
    issuer: "University of London",
    name: "Machine Learning for All",
    url: "https://static.wixstatic.com/media/79b60f_2f463af475a34abbb5e6b75edafe737a~mv2.jpeg",
  },
  {
    issuer: "IBM",
    name: "Generative AI: Introduction and Applications",
    url: "https://static.wixstatic.com/media/79b60f_bfb795dc612c4acabfdd9233bdd4d0d0~mv2.jpeg",
  },
  {
    issuer: "IBM",
    name: "Python for Data Science, AI & Development",
    url: "https://static.wixstatic.com/media/79b60f_ae1bfe1bb74e46358dd9638a37ae5f0d~mv2.jpeg",
  },
];

// Shown in the hero console.
export const console_ = [
  { state: "live", label: "Recently deployed", value: "Policy Agent" },
  { state: "build", label: "Now building", value: "Economics Analyst Agent" },
  { state: "build", label: "Also building", value: "AI Museum Guide" },
  { state: "live", label: "Running", value: "Live Well Fiji" },
  { state: "study", label: "Studying", value: "Master of CS · GPA 4.0/4.5" },
];

// Facts unlocked one by one in the Bug Hunt game.
export const gameFacts = [
  "Works as an IT Project Officer on the Reserve Bank of Fiji's Innovation Team.",
  "Led, built and deployed the Reserve Bank of Fiji's Policy Agent.",
  "Is building an AI agent that supports economic analysis.",
  "Is building an interactive AI guide for a museum.",
  "Built a tool that lets museum visitors design their own banknote.",
  "Was a stakeholder representative on Fiji's National AI Policy.",
  "Helped build two systems used nationwide.",
  "Has led several automation projects.",
  "Runs Live Well Fiji, a free health website in three languages.",
  "Owns Soulful Ties, a digital wedding invitation website.",
  "Built AI that predicts dengue outbreaks from the weather.",
  "Has a current GPA of 4.0 out of 4.5 in his Master's.",
];
