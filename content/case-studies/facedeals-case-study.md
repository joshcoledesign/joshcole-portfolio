---
title: "Facedeals"
volume: "creative-immersive"
slug: "facedeals"
role: "Concept team and UI design — Redpepper"
year: "2012"
summary: "A facial-recognition check-in that pushed deals to your phone. It got national press. We shut it down."
descriptor: "the one we shut down"
thumbnail: "/case-studies/facedeals/grid.jpg"
# heroImage: ""
kind: "study"
display: "single"
featured: false
weight: 2
order: 4
shape: "square"
sortYear: 2012
displayDate: "2012"
tags:
  - "Creative Technology"
  - "AI Systems"
  - "Privacy"
published: true
---

# Facedeals

A camera at the door of a bar recognizes your face, checks you in, and sends a deal to your phone before you've sat down. In 2012 that was a working prototype in Nashville, and for about three weeks it was the talked-about widely.

Then we turned it off.

---

## What it was

Redpepper's lab built Facedeals as an experiment in the space between physical presence and the phone in your pocket. Five of us. Raspberry Pi boards, cameras, open-source facial recognition, and an app.

The flow was opt-in from the first screen. You authorized the app through your Facebook account. It used your recent tagged photos to build a model of your face. Our cameras, mounted at the entrance of a participating venue, matched you against that model when you walked in and delivered an offer based on what you'd liked. No sign-up, no face, no deal.

I was on the concept team and designed the interface: the authorization flow, the deal cards, the venue view. Everyone on the team was working outside their lane, wiring cameras one day and drawing screens the next, which is the part of the job I've never stopped loving.

![Facedeals app screens: venue list, deal detail, and profile/settings](/case-studies/facedeals/app-flow.jpg)

---

## What happened

We ran it at a bar across the street from the agency, after hours, on our own faces. Only people who had explicitly opted in were ever matched. Then we built a working setup inside the agency and published a demo video.

TechCrunch ran it under the headline "Creepy or Awesome?" CBS, Gizmodo, Computerworld, Adweek, and the Daily Mail followed. We read all of it, and we read the comments, because the comments were the point. The reaction split almost exactly down the middle: half the room wanted it in every bar they went to, half the room felt watched.

![Press coverage of Facedeals, including TechCrunch article](/case-studies/facedeals/press.jpg)

## The decision

The split told us something, but the thing that ended the project was a design problem we couldn't get around.

To decide whether a face had opted in, the system had to scan every face first. There was no way to check consent without processing the people who hadn't given it. The person walking in behind you, the couple at the window table, the bartender: all scanned, then discarded, on the promise that "discarded" meant what we said it meant. That promise depended on our security, our storage, and our judgment, on 2012 hardware, in a bar.

We could design a better opt-in screen. We couldn't design our way out of scanning strangers. And a system that has to do the thing people fear in order to protect them from it is a bad tool in the wrong hands, no matter how good the hands are today.

So we stopped. No pilot, no funding round, no pivot.

---

## What I take from it

Facedeals is the first time I asked the question I now ask before every AI system: what is this allowed to do without a person's consent, and can the architecture actually enforce the answer? In 2012 the answer was no, and the right move was to say so out loud.

I'd rather show this than a project that shipped. Anyone can ship. Knowing when not to is the harder skill, and it's the one that matters more every year.
