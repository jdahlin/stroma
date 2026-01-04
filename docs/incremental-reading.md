# Incremental Reading (Distilled UX Requirements)

This document distills the core ideas from:
https://supermemo.guru/wiki/Incremental_reading

It translates those ideas into concrete UX requirements for this app.

## Core Ideas (From SuperMemo)

- Incremental reading blends reading, extraction, and review into one loop.
- Knowledge flows through a "funnel": source -> selection -> extract -> question.
- Spaced repetition is used to resurface material and stabilize memory.
- There is no "finish reading"; sources are revisited until exhausted.

## UX Features Required

These are the minimum UX features needed to support the incremental workflow.

### 1) Source Intake and Prioritized Reading Queue

- Ability to add sources (PDF, web, image, video).
- A reading queue with priorities (or due dates).
- Postpone/advance actions to control when an item returns.

### 2) Incremental Extraction Workflow

- Highlight and extract within the source view.
- Create extracts incrementally without leaving the source.
- Extracts remain linked to their source anchors.

### 3) Progressive Refinement

- Ability to turn extracts into smaller extracts or questions.
- Clear visual distinction between highlight, extract, and question.
- History or traceability back to the original source.

### 4) Review Loop with Spaced Repetition

- A review queue that resurfaces extracts or questions.
- Simple rating actions (Again/Hard/Good/Easy) mapped to scheduling.
- "Due now" and "due soon" indicators to shape sessions.

### 5) Minimal Friction and Speed

- Keyboard-first flow for reading and review.
- Jump from note to source and back with one action.
- Fast UI feedback; no modal-heavy workflow.

## Implications for MVP

- Extracts must be persistent and linkable.
- Scheduling must exist early (FSRS preferred).
- The UI must show "what to read next" and "what to review next."

## UX Screens and Required Actions

These screens describe a minimal set of UI surfaces and the actions users must
be able to perform in each.

### 1) Home / Today

Purpose: show "what to do next" across reading and review.

Required actions:
- Start reading the next due source.
- Start reviewing the next due extract/question.
- Postpone items (snooze).
- Jump back to the last active item.

### 2) Library / Sources

Purpose: manage input sources and their metadata.

Required actions:
- Add a new source (PDF, web, image, YouTube).
- Open a source for reading.
- Set or adjust source priority.
- Archive or remove a source (soft delete).

### 3) Reader (PDF / Web / Media)

Purpose: read and create anchors.

Required actions:
- Navigate within the source (scroll, page, jump).
- Highlight a selection.
- Create an extract from a selection.
- Open the linked extract in the editor.
- Add to queue / postpone reading.

### 4) Extract Editor

Purpose: refine knowledge into notes or questions.

Required actions:
- Edit extract text.
- Create a child extract or question from a selection.
- Jump to the source anchor.
- Set review rating when prompted.

### 5) Review Queue

Purpose: resurface extracts/questions on schedule.

Required actions:
- Review due items with rating actions (Again/Hard/Good/Easy).
- See context (source snippet or anchor preview).
- Postpone or skip an item.
- Jump to source for clarification.

### 6) Note Tree / Outline

Purpose: visualize hierarchy of highlights, extracts, and questions.

Required actions:
- Expand/collapse branches.
- Select a node and jump to its source or note.
- See icons by type (highlight/extract/question).
- Reorder items (optional for MVP).

## Notes

The SuperMemo definition emphasizes the funnel of knowledge and spaced
repetition as the backbone of incremental reading. The app should prioritize
those two mechanics above all other UI polish or advanced features.
