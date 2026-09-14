export const site = {
  name: "Ali Slaimia",
  brand: "Ali.slaimia",
  title: "Software Engineer",
  subtitle: "Full-Stack & AI Integration",
  tagline:
    "Software Engineering graduate with hands-on experience in full-stack development and AI-powered products. Seeking a junior or mid-level role in Europe or Tunisia.",
  email: "Alislimia01@gmail.com",
  phone: "+216 28 488 443",
  phoneHref: "tel:+21628488443",
  location: "Bizerte, Tunisia",
  availability: "Open to junior & mid-level roles · Europe & Tunisia",
  social: {
    /** Update with your profile URLs */
    github: "https://github.com/Ali-Slaimia",
    linkedin: "https://www.linkedin.com/in/ali-slaimia",
  },
  resumeUrl: null as string | null,
} as const;

export const about = {
  heading: "Professional summary",
  description: "Fluent in English and French.",
  paragraphs: [
    "Results-driven Software Engineering graduate with hands-on experience in full-stack development and AI-powered product building. I design scalable architectures, integrate machine learning features, and focus on impactful user experiences.",
    "Recently I shipped Looply (Duolingo-style coding drills), RoleRadar (Tunisia → Europe job radar with CV scan and AI apply packs) and SkyPulse (live ADS-B aviation intelligence with delay boards and AI sky briefs). I've also led product research in Paris, shipped mobile features in Tunis, and built full-stack platforms from data governance to healthcare management. I'm looking to join innovative teams in Europe or Tunisia where I can grow and contribute from day one.",
  ],
  highlights: [
    { label: "Recommendation accuracy", value: "+25%" },
    { label: "Internships completed", value: "3" },
    { label: "Degree", value: "ESPRIT '25" },
  ],
} as const;

export const projects = [
  {
    title: "Looply — Duolingo for code",
    description:
      "Daily coding drills with streaks, hearts, XP, leagues, and a winding skill path across JavaScript, TypeScript, Python, React, and SQL. Interview-shaped questions, a mistake review queue, and progress that follows your network (hashed IP) plus a save code.",
    impact: "Live on GitHub Pages · ali-slaimia.github.io/Ali-Slaimia",
    tech: ["Next.js", "TypeScript", "React", "Tailwind", "Vitest"],
    liveUrl: "https://ali-slaimia.github.io/Ali-Slaimia/",
    repoUrl: "https://github.com/Ali-Slaimia/Ali-Slaimia/tree/main/looply",
    featured: true,
  },
  {
    title: "ForgePipe — AWS Serverless Event Pipeline",
    description:
      "Multi-tenant ingest pipeline on AWS CDK: Cognito JWT API Gateway, idempotent Lambda ingest, DynamoDB single-table + status GSI, SQS/DLQ workers, EventBridge fan-out, Step Functions approval for high-priority events, S3 artifacts, CloudWatch alarms, and GitHub OIDC deploy — plus a Next.js ops console with offline mock mode.",
    impact: "Open source · github.com/Ali-Slaimia/forgepipe",
    tech: ["AWS CDK", "Lambda", "DynamoDB", "SQS", "Step Functions", "EventBridge", "Cognito", "Next.js"],
    liveUrl: null,
    repoUrl: "https://github.com/Ali-Slaimia/forgepipe",
    featured: true,
  },
  {
    title: "InterviewArena — AI Mock Interviews",
    description:
      "Practice interviews for RoleRadar (or any) job descriptions: AI generates 5 questions, scores your answers, and drafts stronger responses. Local fallback works without an API key.",
    impact: "Open source · github.com/Ali-Slaimia/interviewarena",
    tech: ["Next.js", "TypeScript", "Zod", "AI", "Interview coaching"],
    liveUrl: null,
    repoUrl: "https://github.com/Ali-Slaimia/interviewarena",
    featured: true,
  },
  {
    title: "RoleRadar — Tunisia → Europe Job Intel",
    description:
      "Live multi-source job radar (Remotive, RemoteOK, Arbeitnow, Jobicy) with CV upload/AI profile extraction, skill match scores, AI cover letters, and interview prep — built for a Tunisia → Europe job search.",
    impact: "Open source · github.com/Ali-Slaimia/roleradar",
    tech: ["Next.js", "TypeScript", "Zod", "AI", "Job APIs"],
    liveUrl: null,
    repoUrl: "https://github.com/Ali-Slaimia/roleradar",
    featured: true,
  },
  {
    title: "SkyPulse — Live Aviation Intelligence",
    description:
      "Real-time aviation dashboard: live ADS-B aircraft map, Tunisia & global hold/taxi delay leaderboards, multi-hub airport boards, curated safety incidents, and AI sky briefs. Built with Next.js, TypeScript, Leaflet, and secured API proxies.",
    impact: "Live at sky-pulse-ali.netlify.app · Open source on GitHub",
    tech: ["Next.js", "TypeScript", "ADS-B", "Leaflet", "Zod", "AI"],
    liveUrl: "https://sky-pulse-ali.netlify.app",
    repoUrl: "https://github.com/Ali-Slaimia/skypulse",
    featured: true,
  },
  {
    title: "GOLRI — Live Comedy Platform",
    description:
      "France's humor ecosystem app — connecting spectators, clubs, and artists. I helped shape product flows, data models, and AI-powered show discovery during my internship at Visolus in Paris.",
    impact: "Live at golri.app · 25% improvement in event recommendation accuracy",
    tech: ["Product design", "AI / ML", "Stripe", "TypeScript", "Agile"],
    liveUrl: "https://golri.app",
    repoUrl: null,
    featured: true,
  },
  {
    title: "WAFA BATIMENT — Société El Wafa de Bâtiment",
    description:
      "One-page marketing site for a family construction and residential real-estate company in Bizerte, Tunisia. Built with Next.js, React, and TypeScript; responsive, SEO-ready, with a branded hero, company story, services, and a contact form wired to business email.",
    impact: "Live at el-wafa.netlify.app · Deployed on Netlify",
    tech: ["Next.js", "React", "TypeScript", "Netlify"],
    liveUrl: "https://el-wafa.netlify.app",
    repoUrl: null,
    featured: true,
  },
  {
    title: "DATS — Data Governance Platform",
    description:
      "Full-stack web application for secure data storage, analysis, extraction, and full traceability with compliance reporting.",
    impact: "Nov 2024 · End-to-end data governance & ML-driven insights",
    tech: ["Spring Boot", "Angular", "Python", "MongoDB", "Machine Learning"],
    liveUrl: null,
    repoUrl: null,
    featured: true,
  },
  {
    title: "Addiction Center Management System",
    description:
      "Platform for patient registration, therapist matching, and community support at addiction treatment centers.",
    impact: "Nov 2024 · Full patient & therapist workflow",
    tech: ["MySQL", "Symfony", "JavaFX"],
    liveUrl: null,
    repoUrl: null,
    featured: true,
  },
] as const;

export const skills = [
  {
    category: "Languages & Frameworks",
    items: [
      "Angular",
      "React",
      "React Native",
      "TypeScript",
      "Spring Boot",
      "PHP / Symfony",
      "JavaFX",
    ],
  },
  {
    category: "Databases & DevOps",
    items: ["MongoDB", "MySQL", "Git", "DevOps", "Supabase", "Stripe", "Agile / Scrum"],
  },
  {
    category: "AI & Data",
    items: [
      "Python",
      "Machine Learning",
      "NLP",
      "AI integration",
      "Recommendation systems",
      "Unit testing",
      "Documentation",
    ],
  },
] as const;

export const experience = [
  {
    role: "AI & Product Development Intern",
    company: "Visolus SAS",
    location: "Paris, France (On-site)",
    period: "Mar 2025 — Sep 2025",
    bullets: [
      "Led field research across Paris to identify user pain points in the live comedy ecosystem, shaping core product decisions.",
      "Architected the platform's end-to-end user flow and logical data model, improving show discovery and booking efficiency.",
      "Built and integrated AI-powered recommendation and talent visibility modules for GOLRI (golri.app), achieving a 25% increase in event recommendation accuracy.",
      "Collaborated cross-functionally in an Agile environment, delivering iterative releases aligned with business goals.",
    ],
  },
  {
    role: "Front-End Engineering Intern",
    company: "Coral-IO",
    location: "Tunis, Tunisia",
    period: "Jun 2024 — Aug 2024",
    bullets: [
      "Developed user-facing mobile features for the UWAS app using React Native over a 9-week sprint.",
      "Collaborated within a structured team to deliver a performant, user-friendly mobile interface on schedule.",
    ],
  },
  {
    role: "Software Development Intern",
    company: "Helios IT",
    location: "Bizerte, Tunisia",
    period: "Jun 2023 — Aug 2023",
    bullets: [
      "Engineered a full task management web application using PHP during a 6-week internship, practicing end-to-end delivery.",
    ],
  },
] as const;

export const education = [
  {
    degree: "Software Architecture Engineering Degree (5-year)",
    school: "ESPRIT — Private Higher School of Engineering & Technology",
    location: "Tunisia",
    period: "2020 — 2025",
    details: null,
  },
  {
    degree: "Exchange Semester — Freemover Program",
    school: "Philipps-Universität Marburg",
    location: "Germany",
    period: "Apr — Oct 2025",
    details: "Focus areas: Natural Language Processing (NLP), Artificial Intelligence in Business.",
  },
] as const;

export const certifications = [
  {
    name: "Programming with JavaScript",
    issuer: "Meta / Coursera",
    credentialId: "XGU8XVXB7DDD",
  },
  {
    name: "React Basics",
    issuer: "Meta / Coursera",
    credentialId: "2WWTZ6STYG3J",
  },
] as const;

export const languages = [
  { name: "Arabic", level: "Native" },
  { name: "French", level: "Fluent" },
  { name: "English", level: "Professional (B2+)" },
  { name: "German", level: "Basic (A2, actively learning)" },
] as const;

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
] as const;
