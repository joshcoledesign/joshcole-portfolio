// ─── Resume content — single source of truth ──────────────────────────────
// Edit resume text HERE. Nothing in this file controls layout, fonts, or
// spacing — that lives in the presentation shell (resume-shell.ts) and the
// renderer (resume-render.ts). Editing content here cannot break formatting.
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
  name: "Josh Cole",
  discipline: "Creative Technologist · AI",

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
    "Over 25 years I've worked across brand, UX, creative direction, generative and immersive work, and now AI. I grew from hands-on designer into creative and UX leadership, working closer to the technology as the problems grew in scale and complexity. I led and mentored teams the whole way, without ever putting the work down.",
    "Thinking, exploring, and testing an idea until it becomes something real is where I do my best work.",
  ],

  skills: [
    {
      label: "AI & Building",
      items:
        "Agentic Workflow Design, LLM Orchestration, Multi-Model Pipelines, Prompt Engineering, RAG (in development), Claude, GPT, Copilot Studio, Power Automate, Claude Code (agentic CLI development), AI-Assisted Prototyping",
    },
    {
      label: "Applied AI Engineering",
      items:
        "Full-stack LLM pipelines (Node / Next.js / TypeScript / Supabase / Vercel), schema-enforced JSON outputs, prompt templating as configuration, multi-model review loops",
    },
    {
      label: "Design Leadership",
      items:
        "UX Strategy & Vision, Human-Centered AI Design, Design Systems, Information Architecture, Design Practice Building, Cross-functional & Multidisciplinary Team Leadership",
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
      title: "Voice & Content Engine — within a brand operating system",
      org: "Independent",
      date: "2025 – Present",
      summary:
        "Closed beta. A production-grade agentic AI system that learns a brand's writing voice from samples, develops content strategy, generates drafts, and quality-checks output through a multi-model review loop — designed, architected, and shipped end to end.",
      bullets: [
        "Designed and built a four-stage AI pipeline (voice analysis, content strategy, generation, quality control) on Claude Opus, with schema-enforced JSON outputs and temperature calibration per stage",
        "Built a multi-model quality-control loop where a separate model scores each draft against the voice profile and brief and flags where it drifts — one model checking another's work, the core differentiator",
        "Full-stack build: Next.js 14, TypeScript, Supabase, Vercel, and a Node CLI sharing one engine library across web and command line",
      ],
    },
  ],

  experience: [
    {
      title: "Founder & Creative Technologist",
      org: "Josh Cole Creative",
      date: "2013 – Present",
      summary:
        "Independent studio practice spanning branding, immersive experiences, digital product design, and emerging technology — now pointed at AI systems and the interfaces built around them.",
      bullets: [
        "Led end-to-end design and production of a healthcare mobile application managing nurse-staffing workflows, delivering a regulated-industry product from strategy through launch",
        "Applied ComfyUI and Stable Diffusion extensively across personal and freelance work — producing finished visual assets and generative art through node-based workflows; extensive image-compositing and scripted-compositing experience in Photoshop",
        "Directed VR production using Unreal Engine and Maya, and developed generative art installations using Processing and TouchDesigner — applying computational design thinking to experiential contexts",
        "Built and led remote teams of creative technologists across diverse project types, managing design vision, client relationships, and production quality simultaneously",
      ],
    },
    {
      title: "Enterprise Solutions Architect, UX",
      qual: "(design leadership role)",
      org: "UST",
      date: "2024 – May 2026",
      summary:
        "Defined AI-integrated solution strategies for global clients across UX, technology, and business — bridging design leadership and hands-on AI practice.",
      bullets: [
        "Designed and built a Microsoft Copilot AI agent to automate RFP Go/No-Go decision-making for an internal public-sector team — defining the use case, designing the flow, and building the agent hands-on",
        "Designed enterprise AI solutions spanning LLM integration, agentic workflow design, and process automation — turning complex business requirements into clear, human-centered design strategies",
        "Led client-facing discovery and solution design sessions, aligning engineering, UX, and business stakeholders around AI approaches built on foundation models including Claude and GPT",
        "Led a multi-year, multi-product UX and AI engagement for a healthcare technology client — directing a design team, managing client relationships, and delivering across four simultaneous software products in a regulated environment",
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
        "Designed repeatable workflows for distributed and offshore teams, holding consistency and design cohesion across complex multi-team delivery",
        "Coached and upskilled team members and client stakeholders on design tools, workflows, and UX methodology — making complex concepts accessible and actionable",
      ],
    },
    {
      title: "UX Director",
      org: "GS&F",
      date: "2017 – 2019",
      summary:
        "Led a team of eight designers and researchers across UX strategy, UI design, and immersive experience development.",
      bullets: [
        "Directed the full design lifecycle across multiple simultaneous client engagements — research and strategy through wireframes, prototypes, and production",
        "Led cross-functional VR projects including a multi-sensory 3D motion ride, overseeing scriptwriting, environment design, and hardware integration",
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
      title: "Design Director",
      org: "Andculture",
      date: "2013 – 2015",
      bullets: [
        "Led user-centered digital experiences across healthcare and gaming verticals; drove an agency rebrand and integrated UX research into the design process.",
      ],
    },
    {
      title: "Adjunct Instructor, Visual Arts",
      org: "Messiah College",
      date: "2014 – 2015",
      bullets: [
        "Taught design principles, branding, and portfolio development to final-year visual arts students, including hands-on Adobe Creative Suite instruction.",
      ],
    },
    {
      title: "Creative Director",
      org: "Redpepper",
      date: "2010 – 2013",
      bullets: [
        "Led design strategy and creative direction for digital projects across agency clients, from concept through implementation.",
      ],
    },
    {
      title: "Interface & UX Designer",
      org: "Compaq Computer Corporation",
      date: "Early Career",
      bullets: [
        "Began in interface design at one of the world's leading PC manufacturers, working on user-facing software experiences.",
      ],
    },
  ],
};
