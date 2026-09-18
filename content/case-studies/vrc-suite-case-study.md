---
title: "VRC Suite"
volume: "ux-enterprise"
slug: "vrc-suite"
role: "UX Lead — four products"
year: "Four-year engagement"
summary: "Four products, one connected suite, 80,000–100,000+ requests a month in regulated industries."
descriptor: "a four-product records suite"
thumbnail: "/case-studies/vrc/grid.jpg"
heroImage: "/case-studies/vrc/pre-story-flow.png"
kind: "study"
display: "single"
featured: false
weight: 2
order: 6
sortYear: 2021  # TODO(josh): provisional — confirm most-recent year
displayDate: "Four-year engagement"
tags:
  - "UX Leadership"
  - "Enterprise"
  - "Design Systems"
  - "Healthcare"
---

# VRC Suite

Vital Records Control is one of the largest records and information management companies in the U.S., handling the full information lifecycle for regulated industries from healthcare to banking to government. I led UX for four of their products over four years: VitalChart, Payer Audit, Pricing Tables, and Vital Retain. Four products, one connected suite, 80,000 to 100,000-plus requests moving through the systems each month.

The question underneath all four: when a regulator asks "prove it," can the system answer?

---

## The four products

**VitalChart** is VRC's healthcare information management product: medical records request, retrieval, and release. It's the spine of the healthcare arm of the business and the surface most healthcare clients touch daily.

**Payer Audit** is a high-volume workflow inside VitalChart for the bulk record requests that come from insurance payers for HEDIS audits and similar compliance reviews. A payer sends a CSV of the records they need and a PDF of the request letter. The system ingests the batch, validates each request against a layered set of rejection rules, creates a container per request, and breaks it into individual release-of-information records, each with its own lifecycle from logged through QA through processing to completed.

![Payer Audit ingestion flow, from CSV to individual ROI records](/case-studies/vrc/pre-story-flow.png)

**Pricing Tables** is the rate engine under VitalChart's billing. Every U.S. state has its own rules for what a records custodian can charge, by requestor type and record format, tied to specific statutes, and the rules change when laws change. Pricing Tables is the editable, auditable rule store that bills every release at the right rate for the right state for the right requestor at the right time, and can prove which rates were in effect when.

![Pricing Tables admin: state-by-state rate rules with effective dates and legal references](/case-studies/vrc/pricing-admin.png)

**Vital Retain** is the retention product, the keep-or-destroy side of the business. Multi-tenant. Subscriber organizations track physical and digital records against retention policies tied to real legal references and CFR citations, with full audit logs on every action. Policy updates queue and require explicit confirmation before they apply, because silently changing the retention period on 89 boxes when the law shifts is the kind of thing that ends a business.

![Vital Retain retention policies list](/case-studies/vrc/retention-policies-1.png)

Three of the four share branding under VitalChart. Vital Retain is its own product with its own identity, designed to plug into the wider VRC ecosystem.

---

## The engagement

Four years. I led a team of four UX/UI designers and stayed hands-on every day: directing the work, doing the work, and holding the suite together as one product experience across four stacks and three years of organizational change on the client side.

I authored the information architecture, user flows, and system maps across all four products. On the broader IA I co-authored with another architect who brought depth on specific pieces, like the AWS-based address normalization service Payer Audit depends on. Everything else was mine to design and direct. The team delivered IA, flows, design systems, screen designs, and product strategy support across the four products, and we documented as we built.

---

## What it took

This was more of an uphill build than the deliverables suggest.

The four products ran on four tech stacks. The databases had grown organically for years. There was no appetite to fix all of it at once, and that was the right call: consolidating onto one stack and rebuilding the data layer would have meant re-platforming the company, multi-year and multi-million, the kind of project that puts a business on hold. So the work was designing solutions that could scale into the infrastructure as it stabilized, rather than waiting for stability that wasn't coming.

The first year was turbulent. Product managers cycled through. The development team was replaced mid-engagement. There was no business analyst until year three, so the design team carried more of the discovery, requirements, and cross-team translation than is typical.

Documentation became the discipline that held it together. Whoever came in next deserved a clear handoff, and design needed a stable reference across products that shared little underneath. We documented the IA, the flows, the design system, the rationale behind product decisions, the rejection rule logic, the rate engine, the multi-tenant access model. By the end, the design documentation was the reference point the whole program relied on. The screens are the visible output. That discipline is what made the program survive.

---

## How the products think

Four principles ran through all four products.

**Audit logs everywhere.** Every meaningful action in Vital Retain, every status change in Payer Audit, every rate adjustment in Pricing Tables writes an audit event. The system assumes someone will need to reconstruct what happened.

![Asset detail view with its audit history](/case-studies/vrc/asset-details.png)

**Bulk operations, calm interfaces.** Payer Audit processes tens of thousands of requests a month. Vital Retain assigns policies across thousands of assets. High-volume operations had to feel calm: a filterable list, a side panel, and an explicit confirmation when an action touches a lot of things. The "89 Assets Will Be Affected" modal exists because silent bulk changes are how regulated-industry products lose trust.

![Confirmation dialog: 89 assets will be affected by this policy update](/case-studies/vrc/confirmation-dialog.png)

**Status as visual rhythm.** Someone processing 200 records a day shouldn't have to read every word to know where they are. Logged is purple. QA is pink. Processing is blue. Finished is green. Completed is checked. The colors carry the work.

![Container detail with color-coded record status pipeline](/case-studies/vrc/container-details.png)

**A person on every judgment call.** Pricing Tables doesn't auto-update rates when statutes change. Vital Retain doesn't auto-apply policy updates. Payer Audit doesn't auto-process records that fail rejection rules. In each case the system surfaces the decision for a human to confirm, because the cost of being wrong is too high to delegate.

![Pending updates queue awaiting human confirmation](/case-studies/vrc/updates-pending.png)

---

## What I built, in screens

Dashboards, record and asset detail pages, multi-step ingestion flows, rule administration, bulk action panels, audit logs, multi-tenant customer management, status pipelines, and a state-by-state pricing editor with hundreds of rule cards tied to legal references and effective dates. These are a representative slice, not the inventory.

![Rule edit view](/case-studies/vrc/edit-view.png)

![ROI record detail after upload](/case-studies/vrc/roi-detail-uploaded.png)

![Suite dashboard](/case-studies/vrc/dashboard-1.png)

---

## What I take from it

Coherence across a product suite is mostly a documentation discipline, not a design-system discipline. A design system gets you consistent buttons. The feeling that four products on four stacks belong to the same company comes from someone deciding, over and over, what the suite's point of view is on each new question, and writing it down so the next person doesn't re-decide it.

![Pricing Tables history and audit trail](/case-studies/vrc/pt-history-audit.png)

And in long engagements with rotating leadership on the client side, the design team becomes the keeper of institutional memory. It's not in the contract. It's the work that makes the rest of the work possible.
