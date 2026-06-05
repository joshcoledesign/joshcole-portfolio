---
title: "UST RFP Triage Agent"
volume: "ai-systems"
slug: "ust-rfp-agent"
role: "Built end to end — flow, scraping, scoring, agent"
year: "2024"
summary: "An AI system that does the first pass on six-figure pursuit decisions, so the team can decide."
---

# UST RFP Triage Agent

The public sector team at UST had a volume problem. Every morning, requests for proposals and quotes landed in the inbox — from request systems, scraping, sometimes direct. Roughly twenty a day. Each one was potentially worth half a million dollars or more. And each one needed a decision: is this worth pursuing, or not?

That decision wasn't simple. It depended on what the team does and doesn't do, the type of project, which level of government it came from, conflicts of interest, whether UST actually had the skills the work required. A real rubric lived in the team's heads and in a checklist. Applying it to twenty requests a day, fast enough to matter, was more than anyone could keep up with.

I built a system that does the first pass.

---

## How it works

The team's decision criteria became a rules table — a structured, editable rubric the team owns. They add to it, trim it, and the agent always scores against the current version. The judgment stays theirs. The system just applies it at volume.

Each morning's requests flow through Power Automate, which simplifies every email into a text file and hands it to a CoPilot agent. When an email doesn't contain the full RFP — which happens often — Power Automate scrapes the rest.

Sometimes scraping hits a wall: a request gated behind a login, a system that blocks automated access. The system doesn't pretend that case away. It hands it to a person, who logs in, copies or downloads the full RFP, and pushes it back into the flow. A designed fallback, not a failure.

Once the agent has the complete request, it scores it against every rule in the table. A couple of rules are hard stops — if one of them trips, the request is an instant no-go and nothing else needs checking. For everything else, the agent writes a per-request spreadsheet with each rule scored, stores it, and generates a summary document: a synopsis of the request, the results, a final score, and the flags behind it. Go, maybe, or no-go, with the reasons attached.

The summary lands in a Teams channel. The whole team scans it over coffee. A morning of senior-people judgment becomes a digest they can read in minutes — and the handful of requests actually worth pursuing get pulled out and scrubbed by humans before anyone commits real time.

---

## The hard part

The hard part wasn't the plumbing. It was trust.

These are six-figure pursuit decisions. For a team to rely on an agent's read of an RFP, the agent has to be right in a way that holds up — not in a demo, in production, every morning, on messy inputs. That takes real work. When I left UST the system was a working pilot, still in testing, still being tuned. That wasn't unfinished business. That was the business. You don't ship an AI system that influences where a team spends half a million dollars and call it done after the first good output. You calibrate it until the people using it would stake a decision on it.

The other thing I took away was about the tools themselves. Working in Power Automate, the logic was sound but the experience of assembling it fought me the whole way — the machine sits at the center of these builders, not the person, which makes the build far more complicated than it needs to be.

---

## What I built

I built the automation and the CoPilot agent end to end — the ingestion flow, the scraping and human-fetch fallback, the scoring logic, the spreadsheet and summary generation, the Teams delivery. The rules, the spreadsheets, and the final decisions stayed with the public sector team, where they belong. The system applies the team's judgment; it doesn't replace it.

That split is the point. Automation handles the volume and the messy inputs. People handle the judgment and the edge cases. A human path in when ingestion hits a wall, a human decision out when the digest lands. The agent triages so the team can decide — which is the only responsible way to put AI near a decision this expensive.
