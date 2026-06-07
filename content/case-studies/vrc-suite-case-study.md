---
title: "VRC Suite"
volume: "ux-enterprise"
slug: "vrc-suite"
role: "UX Lead — four products"
year: "Four-year engagement"
summary: "Four products, one connected suite, 80,000–100,000+ requests a month in regulated industries."
# heroImage: ""
---

# VRC Suite

Vital Records Control is one of the largest records and information management companies in the U.S. — three-plus decades, nationwide, handling the full information lifecycle for regulated industries from healthcare to banking to government. I led UX for four of their products over four years: VitalChart, Payer Audit, Pricing Tables, and Vital Retain. Four products, one connected suite, 80,000 to 100,000+ requests moving through the systems each month.

---

## The four products

**VitalChart** is VRC's healthcare information management product — medical records request, retrieval, and release. It's the spine of the healthcare arm of the business and the surface most of VRC's healthcare clients interact with daily.

**Payer Audit** is a high-volume workflow inside VitalChart, built for the bulk medical record requests that come in from insurance payers — Optum, Blue Cross, and others — for HEDIS audits and similar compliance reviews. A payer sends a CSV listing the records they need and a PDF of the request letter. The system ingests the batch, validates each request against a layered set of rejection rules, creates a container per request, and breaks it down into individual ROI records with their own lifecycle from logged through QA through processing to completed.

**Pricing Tables** is the rate engine underneath VitalChart's billing. Every U.S. state has its own legal framework for what a records custodian can charge for releasing medical records, broken down by requestor type and record format, tied to specific statutes. The rules change when laws change. Pricing Tables is the editable, auditable rule store that makes sure every ROI gets billed at the right rate for the right state for the right requestor at the right time — and that VRC can prove which rates were in effect when, when a regulator asks.

**Vital Retain** is the records retention product — the keep/destroy side of the business. Multi-tenant. Subscriber organizations track their physical and digital records assets against retention policies tied to real legal references and CFR citations, with full audit logs on every action. Updates to policies queue and require explicit confirmation before they apply to affected assets, because silently changing the retention period on 89 boxes when the underlying law shifts is the kind of thing that ends a business.

Three of the four share branding under the VitalChart umbrella. Vital Retain is its own product with its own identity, designed to plug into the broader VRC ecosystem.

---

## The engagement

A four-year UX leadership engagement. I led a team of four UX/UI designers and stayed hands-on every day — directing the work, doing the work, and holding the suite together as one coherent product experience across four different stacks and three years of organizational change on the client side.

I authored the information architecture, user flows, and system maps across all four products, and on the broader IA I co-authored with another architect on the project — they brought specialized expertise on specific pieces, like the AWS-based address normalization service that Payer Audit relies on, where their depth covered ground outside my own. Everything else was mine to design and direct.

The team and I delivered the IA, user flows, design systems, screen designs, and product strategy support across the four products. We documented as we built, because design needed a stable reference point across products that didn't share much else underneath.

---

## What it took

To be straight about it: this engagement was more of an uphill build than the deliverables make it look, with more nuance and more complexity than anyone on either side anticipated at the start.

The client didn't have a clear picture of their own infrastructure when we started. The four products were built on four different tech stacks. The databases had grown organically over years and weren't easy to reason about. There was no appetite for solving all of it at once — which was the right call, because consolidating four products onto a single stack and rebuilding the underlying data layer would have effectively meant re-platforming the company's software at once: multi-year, multi-million-dollar, the kind of project that puts a business on hold. So from day one, the work was about architecting design solutions that could _scale into_ the infrastructure as it stabilized, rather than waiting for stability that wasn't coming.

The first year was particularly turbulent. Multiple product managers cycled through. The original development team was replaced mid-engagement. There was no business analyst on the program until year three — a client budget choice — which meant the design team carried more of the discovery, requirements gathering, and cross-team translation work than is typical. Each transition meant onboarding new people into systems that had been built without the documentation those people needed to be effective quickly.

Documentation became a discipline we brought to the engagement. Whoever came in next deserved a clear handoff, and design needed a stable reference point across products that didn't share much else underneath. We documented the IA, the flows, the design system, the rationale behind product decisions, the rejection rule logic, the rate engine architecture, the multi-tenant access model — everything. By the end of the engagement, the design documentation was a stable reference point the program could rely on.

That's the part of the job that doesn't show up in screens. Holding a multi-year, multi-product engagement together through stack inconsistencies, team transitions, shifting product leadership, and the absence of a BA for the first two years — and keeping the design coherent across all of it — was the actual work. The screens are the visible output. The discipline that produced them is what made the program survive.

---

## How the products think

A few principles ran through all four.

**Audit logs everywhere.** VRC's customers operate in regulated industries where "prove it" is a real question a regulator may eventually ask. Every meaningful action in Vital Retain, every status change in Payer Audit, every rate adjustment in Pricing Tables generates an audit event. The system assumes someone will need to reconstruct what happened.

**Bulk operations, calm interfaces.** Payer Audit processes tens of thousands of requests a month. Vital Retain handles bulk policy assignment across thousands of assets. The challenge was making high-volume operations feel calm rather than overwhelming — a filterable list, a side panel, an explicit confirmation when the action affects a lot of things. The "89 Assets Will be Affected — Confirm Policy Update" modal in Vital Retain exists because silent bulk changes are how regulated-industry products lose trust.

**Status as visual rhythm.** A user processing 200 patient records a day shouldn't have to read every word to know where they are. Logged is purple. QA is pink. Processing is blue. Finished Processing is green. Completed is checked. The colors carry the work.

**Explicit human-in-the-loop on judgment calls.** Pricing Tables doesn't auto-update rates when statutes change. Vital Retain doesn't auto-apply policy updates to assets. Payer Audit doesn't auto-process records that fail rejection rules. In each case, the system surfaces the decision for a human to confirm, because the cost of being wrong is too high to delegate.

---

## What I built (in screens)

Across the four products, the work spanned dashboards, asset and record detail pages, multi-step ingestion flows, rule administration surfaces, bulk action panels, audit logs, multi-tenant customer management, status pipelines, and a state-by-state pricing rule editor with hundreds of cards each tied to legal references and effective dates. The screens here are a representative slice — not the full inventory.

---

## What I take from it

Four years on one engagement teaches things that shorter ones can't.

The biggest one: design coherence across a product suite is mostly a documentation discipline, not a design system discipline. A design system gets you consistent buttons. Coherence — the feeling that four products built on four stacks belong to the same company — comes from someone deciding, over and over, what the suite's point of view is on every new question, and writing it down so the next person doesn't have to re-decide.

The second: in long engagements with rotating leadership on the client side, the design team often becomes the keeper of institutional memory. That's not in the contract. But it's the work that makes the rest of the work possible.
