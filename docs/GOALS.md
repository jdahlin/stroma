Below is a concise, high-level product summary you can put at the top of a README or design doc.
It focuses on what the app is, what it aims to become, and how it gets there in stages—no implementation detail.

⸻

Project Summary

What this app is

A desktop knowledge work environment optimized for deep reading, extraction, and long-term learning, built around:
• PDFs as first-class sources
• incremental, non-linear reading
• durable links between source material and notes
• an IDE-like, multi-pane workspace

The app prioritizes control, longevity, and cognitive efficiency over minimalism or casual note-taking.

⸻

Core features (end state)

1. Multi-pane workspace
   • Dockable, resizable panes (IDE-style)
   • Persistent layouts
   • Keyboard-first navigation
   • Workspace adapts to different tasks (reading, extracting, reviewing)

2. PDF-centric reading
   • PDFs as primary input (not HTML)
   • Stable anchors to exact locations in documents
   • Highlights, extracts, and figures remain linked to source pages
   • Figures and diagrams treated as first-class learning objects

3. Structured note editor
   • Block-based notes tied to PDF anchors
   • Progressive refinement: highlight → extract → question
   • Notes remain editable without breaking source links

4. Incremental learning workflow
   • Reading and learning blended into a single flow
   • Material resurfaced based on priority and time
   • No “finish reading”; sources are revisited until exhausted

5. Long-term retention support
   • Atomic knowledge units
   • Conversion to testable prompts (cloze, Q&A)
   • Scheduling based on review performance (spaced repetition)

6. Strong UX foundations
   • Consistent design system
   • Zoom and accessibility built-in
   • Responsive layout for different screen sizes
   • Predictable keyboard and mouse behavior

⸻

Project goals
• Replace ad-hoc PDF reading + note apps with a single, coherent system
• Maximize long-term retention, not short-term consumption
• Avoid fragile links between notes and sources
• Support years of accumulated material without degradation
• Remain extensible without architectural rewrites

Non-goals:
• Casual note-taking
• Cloud-first collaboration (initially)
• Web-only constraints
• Aesthetic minimalism at the cost of power

⸻

Path to reach the goals (phased)

Step 1 — Application shell
• Desktop app with docking layout
• Design system, zoom, themes
• Persistent workspaces
• Keyboard-first navigation
Purpose: create a stable container for everything else.

Step 2 — PDF workspace
• PDF rendering and navigation
• Anchors, highlights, figure capture
• Reliable linking from UI to source
Purpose: make PDFs a durable, addressable knowledge source.

Step 3 — Notes + extraction
• Block-based editor
• Extracts tied to PDF anchors
• Navigation between source and notes
Purpose: turn reading into structured knowledge.

Step 4 — Incremental reading
• Queues and priorities
• Progressive extraction
• Source material resurfaces over time
Purpose: prevent “read once, forget forever”.

Step 5 — Review and retention
• Conversion to questions
• Scheduled reviews
• Feedback-driven resurfacing
Purpose: ensure durable memory formation.

⸻

Guiding principles
• Structure beats polish
• Anchors over text copies
• Queues over sessions
• Keyboard over mouse
• Longevity over novelty

If you want, the next useful artifact would be a one-page “user flow” showing how a PDF moves through the system from import to long-term knowledge.
