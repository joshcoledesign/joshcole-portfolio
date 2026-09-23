// ─── Resume content — synchronized site representation ───────────────────
// Canonical text lives in D:\ColeOS\knowledge\josh-cole-resume.md. Sync this
// data from that approved Markdown; never treat this file as a second master.
// Site and canonical content are synchronized at the version declared below.
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

/** Public contact only. Email and phone appear solely in the downloadable PDF. */
export interface ResumeContact {
  location: string;
  site: ContactLink;
  linkedin: ContactLink;
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

export interface ResumeRoleGroup {
  kind: "group";
  title: string;
  date: string;
  summary: string;
  roles: ResumeRole[];
}

export type ResumeExperienceEntry = ResumeRole | ResumeRoleGroup;

export interface ResumeData {
  resumeVersion: string;
  name: string;
  /** Display discipline for the masthead (uses "·" separators). */
  discipline: string;
  contact: ResumeContact;
  summary: string[];
  skills: ResumeSkill[];
  selectedWork: ResumeRole[];
  experience: ResumeExperienceEntry[];
  independent: ResumeRole[];
  earlier: ResumeRole[];
}

export const resume: ResumeData = {
  resumeVersion: "2026-09-22.1",
  name: "Josh Cole",
  discipline: "Creative Technologist · AI Systems Designer",

  contact: {
    location: "Hendersonville, TN",
    site: { label: "joshcolecreative.com", href: "https://joshcolecreative.com" },
    linkedin: {
      label: "linkedin.com/in/joshcolecreative",
      href: "https://linkedin.com/in/joshcolecreative",
    },
  },

  summary: [
    "Creative technologist and problem solver working across design, code, and AI. I connect ideas across disciplines, explore what technology makes possible, and shape those ideas into useful systems for people, businesses, and brands.",
    "My background spans creative and art direction, brand strategy, UX/UI, generative and immersive work, and AI. I've grown from hands-on designer into creative and UX leadership as the scope and complexity increased—without ever putting the work down.",
    "Thinking, exploring, and testing an idea until it becomes real is where I do my best work. When AI is part of the solution, I build human-centered systems that amplify human craft and keep judgment in the loop by design.",
  ],

  skills: [
    {
      label: "AI Systems & Workflow Design",
      items:
        "Agentic Workflow Design, LLM Orchestration, Multi-Model Pipelines & Review Loops, Human-in-the-Loop Systems, Prompt Engineering, MCP Integration, AI-Assisted Prototyping, Claude, GPT, Codex, Claude Code, Copilot Studio, Power Automate",
    },
    {
      label: "Applied AI Product Development",
      items:
        "AI-Assisted Full-Stack Development, LLM Application Architecture, Schema-Constrained Outputs, Prompt-as-Configuration, Local-First Systems, Deterministic Data Pipelines, Privacy & Auditability; Working Knowledge: TypeScript, Node.js, Next.js, Supabase, SQLite, Zod, Vercel",
    },
    {
      label: "Creative, Design & Systems Leadership",
      items:
        "Creative Direction, Art Direction, Brand Strategy, UX Strategy, UI Design, Environmental & Experiential Design, Human-Centered AI Design, Enterprise Solution Design, Design Systems, Information Architecture, Design Practice Building, Cross-Functional Team Leadership & Mentorship",
    },
    {
      label: "Generative & Visual AI",
      items:
        "Generative AI, ComfyUI, Stable Diffusion, Node-Based AI Workflows, Generative Art Direction, AI-Assisted Image & Video Production",
    },
    {
      label: "Design Tools & Creative Technology",
      items:
        "Figma, Adobe Photoshop, Adobe Illustrator, Adobe InDesign, Adobe After Effects, Adobe Premiere Pro, TouchDesigner, Processing, Creative Coding, Node-Based Creative Workflows, Interactive & Procedural Design, VR & Immersive Production, Image Compositing; Working Knowledge: Unreal Engine, Maya, Blender",
    },
  ],

  selectedWork: [
    {
      title: "Novensia",
      org: "brand operating system",
      date: "2025 – Present",
      summary:
        "Private alpha. A brand operating system with a four-stage voice and content engine that learns from writing samples, develops content strategy, generates drafts, and checks quality through a separate-model review loop.",
      bullets: [
        "Designed a four-stage AI pipeline—voice analysis, content strategy, generation, and quality control—using Claude Opus, schema-enforced JSON outputs, and stage-specific temperature calibration",
        "Built an evaluator-editor loop in which a separate model scores each draft against the voice profile and brief, flags drift, and returns inspectable feedback before human review",
        "Directed and built an AI-assisted full-stack product across web and command-line interfaces using Next.js, TypeScript, Supabase, Vercel, and a Node CLI",
      ],
    },
    {
      title: "RFP Triage Agent",
      org: "UST public sector team",
      date: "2024",
      summary:
        "Working pilot that performed first-pass triage on six-figure RFP pursuits, helping the team decide where to invest review time. In testing at departure.",
      bullets: [
        "Designed and built a Microsoft Copilot agent and Power Automate pipeline that triaged roughly 20 six-figure RFPs per day against a team-owned rules table, covering ingestion, scraping, scoring, and Teams delivery",
        "Kept final decisions with the team: the agent scored and flagged opportunities, editable rules remained team-owned, and a manual path handled sources automated scraping couldn't reach",
      ],
    },
  ],

  experience: [
    {
      kind: "group",
      title: "UST / Xpanxion",
      date: "2021 – May 2026",
      summary:
        "Joined Xpanxion as UX/UI Practice Lead and continued with UST without interruption following its acquisition of the company. Named Enterprise Solutions Architect in 2024 while continuing to lead UX strategy and design on selected client engagements.",
      roles: [
        {
          title: "Enterprise Solutions Architect, UX",
          date: "2024 – May 2026",
          summary:
            "Defined and delivered enterprise solutions across user experience, technology, and business strategy, expanding into AI-integrated workflows during the final eighteen months.",
          bullets: [
            "Led client discovery and solution-design sessions, aligning engineering, UX, and business stakeholders around practical approaches to complex enterprise needs",
            "Directed a four-year, four-product UX engagement for a records and information management client serving regulated healthcare, banking, and government markets, leading four designers while contributing directly to systems processing 80,000–100,000+ monthly requests",
            "Designed selected agentic and automation workflows with Power Automate, Copilot Studio, and prompt engineering while continuing hands-on UX/UI design across client engagements",
          ],
        },
        {
          title: "UX/UI Practice Lead",
          date: "2021 – 2024",
          summary:
            "Founded and scaled a UX practice within a global technology consultancy, establishing the team, methodology, and operating model needed to embed design quality into enterprise delivery.",
          bullets: [
            "Built and mentored a multidisciplinary team of senior designers and design leads, establishing the processes and quality standards used to integrate UX into technical delivery",
            "Positioned UX as a strategic differentiator in client pursuits, leading discovery and shaping its role in proposals, solution strategies, and delivery plans",
          ],
        },
      ],
    },
    {
      title: "Design Director",
      org: "GS&F",
      date: "2017 – 2019",
      summary:
        "Led a six-person team of designers and researchers across UX strategy, UI design, creative direction, and immersive experience development.",
      bullets: [
        "Led creative direction and end-to-end experience design for a 7D VR ride for LP Building Solutions at the International Builders' Show, directing an eight-person project team from script to launch in under 90 days; the resulting experience generated 485+ leads, increased year-over-year booth traffic by 195%, engaged 17 media outlets, and earned 2,279,519 media impressions",
        "Served as creative director and UX lead across web and application engagements, directing research, strategy, UX/UI design, prototyping, and production while presenting recommendations to executive clients and maintaining stakeholder alignment through delivery",
      ],
    },
    {
      title: "Creative Director",
      org: "ST8MNT Brand Agency",
      date: "2015 – 2017",
      summary:
        "Co-led creative direction across branding, digital, entertainment, and experiential work, guiding concept development, design quality, technical execution, and team growth.",
      bullets: [
        "Served as creative director for the 2017 Bonnaroo Music & Arts Festival across its website, lineup poster, tickets, and on-site displays, personally illustrating the artwork used throughout the campaign and festival",
        "Co-produced two experiential environments built inside shipping containers for Bonnaroo, helping shape their concepts, visual design, and delivery",
        "Created brand and digital work for artists including Tim McGraw, Faith Hill, Reba McEntire, Taylor Swift, and Alison Krauss",
        "Co-directed the agency's rebrand, shaping its positioning and creative direction while managing technical execution across its identity, website, and rollout",
      ],
    },
  ],

  independent: [
    {
      title: "Founder & Creative Technologist",
      org: "Josh Cole Creative",
      date: "2013 – Present",
      summary:
        "Project-based independent practice spanning brand strategy, creative direction, immersive experiences, digital product design, and emerging technology, including recent AI systems work. Conducted primarily between, and selectively alongside, full-time roles.",
      bullets: [
        "Design and build AI systems end to end, from problem definition and pipeline architecture through implementation and quality control",
        "Led strategy, UX/UI design, and production for a healthcare mobile application managing nurse-staffing workflows, taking a regulated-industry product from initial concept through launch",
        "Created finished visual assets and generative art for personal and client work using ComfyUI, Stable Diffusion, node-based workflows, and advanced Photoshop compositing",
        "Directed VR productions using Unreal Engine and Maya and developed generative art installations with Processing and TouchDesigner",
        "Built and led remote creative-technology teams, managing design vision, client relationships, and production quality across multidisciplinary projects",
      ],
    },
  ],

  earlier: [
    {
      title: "Adjunct Instructor, Visual Arts",
      org: "Messiah College",
      date: "2014 – 2015",
      bullets: [],
    },
    {
      title: "Design Director",
      org: "Andculture",
      date: "2013 – 2015",
      bullets: [],
    },
    {
      title: "Creative Director",
      org: "Redpepper",
      date: "2010 – 2013",
      bullets: [],
    },
    {
      title: "Interface & UX Designer",
      org: "Compaq Computer Corporation",
      date: "Early Career",
      bullets: [],
    },
  ],
};
