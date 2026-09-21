// ─── Resume content — synchronized site representation ───────────────────
// Canonical text lives in D:\ColeOS\knowledge\josh-cole-resume.md. Sync this
// data from that approved Markdown; never treat this file as a second master.
// Layout, fonts, and spacing live in resume-shell.ts and resume-render.ts.
//
// The document is served at /resume by src/app/resume/route.ts, which renders
// both the visual HTML and the ATS-readable plaintext block from this data,
// so the two can never drift out of sync.

export interface ContactLink {
  /** Human-readable label shown in the document, e.g. "joshcolecreative.com" */
  label: string;
  /** Full URL for the anchor href, e.g. "https://joshcolecreative.com" */
  href: string;
}

export interface ResumeContact {
  location: string;
  site: ContactLink;
  linkedin: ContactLink;
  email: string;
  phone: string;
}

export interface ResumeSkill {
  /** Category label, rendered bold, e.g. "AI & Building" */
  label: string;
  /** The comma-separated list of skills for this category */
  items: string;
}

export interface ResumeRole {
  title: string;
  /** Organization, rendered after an em dash. Optional. */
  org?: string;
  /** Parenthetical qualifier after the title, e.g. "(design leadership role)" */
  qual?: string;
  /** Date range shown in the right-hand column, e.g. "2013 – Present" */
  date: string;
  /** Italic one-line role summary. Omit for earlier-career entries. */
  summary?: string;
  bullets: string[];
}

export interface ResumeData {
  resumeVersion: string;
  name: string;
  /** Display discipline for the masthead (uses "·" separators). */
  discipline: string;
  contact: ResumeContact;
  summary: string[];
  skills: ResumeSkill[];
  selectedWork: ResumeRole[];
  experience: ResumeRole[];
  earlier: ResumeRole[];
}

export const resume: ResumeData = {
  resumeVersion: "2026-08-27.1",
  name: "Josh Cole",
  discipline: "Creative Technologist · AI Systems Designer",

  contact: {
    location: "Hendersonville, TN",
    site: { label: "joshcolecreative.com", href: "https://joshcolecreative.com" },
    linkedin: {
      label: "linkedin.com/in/joshcolecreative",
      href: "https://linkedin.com/in/joshcolecreative",
    },
    email: "colethirteen@pm.me",
    phone: "(615) 945-3302",
  },

  summary: [
    "Creative technologist and problem solver. I think in design and code, finding creative uses for technology by connecting ideas across disciplines, exploring what's possible, and shaping them into something useful for a person, business, or brand.",
    "My background spans brand, UX, creative direction, generative and immersive work, and now AI. I grew from hands-on designer into creative and UX leadership, working closer to the technology as the problems grew in scale and complexity. I led and mentored teams the whole way, without ever putting the work down.",
    "Thinking, exploring, and testing an idea until it becomes something real is where I do my best work.",
    "I build AI systems that magnify the person using them. Human judgment stays in the loop by design, not as a caveat.",
  ],

  skills: [
    {
      label: "AI & Building",
      items:
        "Agentic Workflow Design, LLM Orchestration, Multi-Model Pipelines, Human-in-the-Loop System Design, Prompt Engineering, RAG (in development), Claude, GPT, Copilot Studio, Power Automate, Claude Code (agentic CLI development), AI-Assisted Prototyping",
    },
    {
      label: "Applied AI Engineering",
      items:
        "Full-stack LLM pipelines (Node / Next.js / TypeScript / Supabase / Vercel), schema-enforced JSON outputs, prompt templating as configuration, multi-model review loops",
    },
    {
      label: "Design & Systems Leadership",
      items:
        "UX Strategy & Vision, Human-Centered AI Design, Design Systems, Information Architecture, Making Complex Systems Legible, Design Practice Building, Cross-functional & Multidisciplinary Team Leadership",
    },
    {
      label: "Generative & Visual AI",
      items:
        "ComfyUI, Stable Diffusion, node-based generative workflows, AI-assisted image and video pipelines; explores the wider ecosystem (Hugging Face, NotebookLM)",
    },
    {
      label: "Creative Technology",
      items:
        "Adobe Creative Suite (Photoshop, Illustrator, InDesign, Premiere, After Effects), Figma, Unreal Engine, Processing, TouchDesigner, Generative Design, VR / Immersive Production, Maya, Blender",
    },
  ],

  selectedWork: [
    {
      title: "Novensia",
      org: "brand operating system",
      date: "2025 – Present",
      summary:
        "Owner-only alpha. A brand operating system with a four-stage voice and content engine that learns from a brand's writing samples, develops content strategy, generates drafts, and checks quality through a separate-model review loop — designed and built end to end.",
      bullets: [
        "Designed and built a four-stage AI pipeline (voice analysis, content strategy, generation, quality control) on Claude Opus, with schema-enforced JSON outputs and temperature calibration per stage",
        "Built a multi-model quality-control loop where a separate model scores each draft against the voice profile and brief and flags where it drifts, making every stage inspectable rather than a single opaque answer — one model checking another's work, the core differentiator",
        "Full-stack build: Next.js 14, TypeScript, Supabase, Vercel, and a Node CLI sharing one engine library across web and command line",
      ],
    },
    {
      title: "RFP Triage Agent",
      org: "UST public sector team",
      date: "2024",
      summary:
        "An AI system that does the first pass on six-figure pursuit decisions, so the team can decide. Working pilot in testing at departure.",
      bullets: [
        "Designed and built a Microsoft Copilot agent and Power Automate pipeline that triages roughly twenty six-figure RFPs a day against a team-owned, editable rules table — ingestion, scraping, scoring, and Teams delivery, built end to end",
        "Kept the judgment with the team by design: the agent scores and flags, people decide, and a human-fetch path handles inputs automated scraping can't reach",
      ],
    },
  ],

  experience: [
    {
      title: "Founder & Creative Technologist",
      org: "Josh Cole Creative",
      date: "2013 – Present",
      summary:
        "Independent studio practice spanning branding, immersive experiences, digital product design, and emerging technology — now pointed at AI systems and the interfaces built around them. Run continuously alongside agency and consultancy roles.",
      bullets: [
        "Design and build AI systems end to end — defining the problem, architecting the pipeline, and building the result, with output quality and system design handled as one problem",
        "Led end-to-end design and production of a healthcare mobile application managing nurse-staffing workflows, delivering a regulated-industry client product from strategy through launch",
        "Applied ComfyUI and Stable Diffusion extensively across personal and client work — producing finished visual assets and generative art through node-based workflows; extensive image-compositing and scripted-compositing experience in Photoshop",
        "Directed VR production using Unreal Engine and Maya, and developed generative art installations using Processing and TouchDesigner — applying computational design thinking to experiential contexts",
        "Built and led remote teams of creative technologists across diverse project types, managing design vision, client relationships, and production quality simultaneously",
      ],
    },
    {
      title: "Enterprise Solutions Architect, UX",
      org: "UST",
      date: "2024 – May 2026",
      summary:
        "Design leadership and hands-on AI practice. Defined AI-integrated solution strategies for global clients across UX, technology, and business.",
      bullets: [
        "Designed and built a Microsoft Copilot agent automating first-pass triage of six-figure RFP pursuit decisions for UST's public sector team — defining the use case, designing the flow, and building the agent hands-on",
        "Designed enterprise AI solutions spanning LLM integration, agentic workflow design, and process automation — turning complex business requirements into clear, human-centered design strategies",
        "Led UX strategy and hands-on UI design across client engagements, staying in the work rather than directing from above",
        "Led client-facing discovery and solution design sessions, aligning engineering, UX, and business stakeholders around AI approaches built on foundation models including Claude and GPT",
        "Led a four-year, four-product UX engagement for a records and information management client in regulated healthcare, banking, and government markets — directing a team of four designers while designing daily, across systems handling 80,000–100,000+ requests a month",
        "Built hands-on AI workflows using Power Automate, Copilot Studio, and prompt-engineered integrations alongside foundation models, across healthcare and enterprise software clients",
      ],
    },
    {
      title: "UX/UI Practice Lead",
      org: "Xpanxion / UST",
      date: "2021 – 2024",
      summary:
        "Founded and scaled a UX practice from scratch within a global technology consultancy — building the team, methodology, and operating model that embedded design quality into enterprise delivery.",
      bullets: [
        "Built and mentored a multidisciplinary design team — managing senior designers and design leads, not only individual contributors — and defined the process frameworks and quality standards that integrated UX into technical delivery at scale",
        "Established design as a strategic differentiator in client engagements, leading discovery that shaped how UX was positioned in proposals and solution approaches",
      ],
    },
    {
      title: "UX Director",
      org: "GS&F",
      date: "2017 – 2019",
      summary:
        "Led a team of eight designers and researchers across UX strategy, UI design, and immersive experience development.",
      bullets: [
        "Design Director on a 7D experiential VR ride for LP Building Solutions at the International Builders' Show — script through delivery in under 90 days, coordinating animation, motion-chair, and programming vendors into one synchronized experience",
        "That ride produced 485+ leads, a 195% year-over-year increase in booth traffic, 17 media outlets engaged, and 2.2M+ earned media impressions",
        "Directed the full design lifecycle across multiple simultaneous client engagements — research and strategy through wireframes, prototypes, and production",
        "Managed stakeholder relationships and led strategic design presentations to executive-level clients",
      ],
    },
    {
      title: "Creative Director",
      org: "ST8MNT Brand Agency",
      date: "2015 – 2017",
      summary:
        "Co-led agency creative direction across branding and digital, owning team development and design quality.",
      bullets: [
        "Co-led a full agency rebrand that repositioned the creative offering",
        "Mentored and developed design team members, building a culture of strategic creative thinking alongside strong craft",
      ],
    },
  ],

  earlier: [
    {
      title: "Adjunct Instructor, Visual Arts",
      org: "Messiah College",
      date: "2014 – 2015",
      bullets: [
        "Taught design principles, branding, and portfolio development to final-year visual arts students, including hands-on Adobe Creative Suite instruction",
      ],
    },
    {
      title: "Design Director",
      org: "Andculture",
      date: "2013 – 2015",
      bullets: [
        "Led user-centered digital experiences across healthcare and gaming verticals; drove an agency rebrand and integrated UX research into the design process",
      ],
    },
    {
      title: "Creative Director",
      org: "Redpepper",
      date: "2010 – 2013",
      bullets: [
        "Led design strategy and creative direction for digital projects across agency clients, from concept through implementation",
      ],
    },
    {
      title: "Interface & UX Designer",
      org: "Compaq Computer Corporation",
      date: "Early Career",
      bullets: [
        "Began in interface design at Compaq, working on user-facing software experiences",
      ],
    },
  ],
};
