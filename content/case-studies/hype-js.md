---
title: "HYPE"
volume: "creative-immersive"
slug: "hype-js"
role: "Illustration, code, and print — personal work"
year: "c. 2018"
summary: "Hand-drawn vector shapes, pulled at random and colored at random, once to animate and once to print. Processing with the HYPE framework, later hype.js."
descriptor: "hand-drawn shapes, laid out by code"
thumbnail: "/case-studies/hype-js/signal-root.jpg"
# heroImage: ""
# TODO(josh): Replace the literal "Alt text" image descriptions.
kind: "study"
display: "single"
featured: false
weight: 2
order: 7
shape: "portrait"
sortYear: 2018
displayDate: "c. 2018"
tags:
  - "Creative Direction"
  - "Generative"
  - "Illustration"
published: true
---

# HYPE

Generative art has a look, and most of the time the look belongs to the tool. These experiments were an attempt to make the output belong to the hand instead.

The method is the same across all of them. I draw a pool of vector shapes by hand. The code pulls shapes from the pool at random, places them by a rule, and colors each one at random from a palette I chose. The system decides where and which; I decided what and what colors. Change the seed and you get a new piece that is unmistakably from the same hand.

---

## The tools

Processing, with the HYPE framework: `HDrawablePool` to hold the shapes, `HColorPool` for the palette, `HShapeLayout` and callbacks to place and transform each instance. Later, the same ideas in hype.js for the browser. `saveVector()` writes to PDF, which is what makes the print series possible: the output is real vectors, not a screenshot.

![Alt text](/case-studies/hype-js/code-and-print.jpg)

---

## Two experiments

**The animated rings.** A study in seeding color across motion. Three canvases, one pool of drawn shapes, each canvas rotating and layering its own random draw from the pool. The colors come from a small fixed list; the composition comes from chance inside constraints I set.

![Alt text](/case-studies/hype-js/rings-triptych.jpg)

**The 13/13 print.** A hand-drawn crest at the center, surrounded by a field generated from a second pool of drawn ornaments, colored from a list, rendered to vector for print. The center is fully authored. The field is fully generated. The piece is both, and you can't see the seam.

![Alt text](/case-studies/hype-js/thirteen-print.jpg)

---

## Why it's here

This is the same idea as the AI systems I build now, ten years earlier and in a different medium: a person supplies the taste and the raw material, a system supplies the scale and the variation, and the result is only good if the boundary between the two was drawn on purpose.

Random inside a pool I drew is different from random. That's the whole point.
