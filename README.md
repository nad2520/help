# Lexora Documentation Hub

Lexora is a fantasy-themed reading platform focused on discovery, reading continuity, and social reading community behavior.

This repository currently contains a JS/HTML/SCSS implementation in `help/template` and behavior documentation for what is live now versus what is targeted next.

## Documentation Purpose

This documentation is product-behavior oriented.
It describes:
- What users can do now.
- What users should be able to do next.
- How UI/UX scenarios should behave across pages.

It intentionally avoids React project internals and focuses on software behavior.

## Current Implementation Snapshot (`help/template`)

Implemented baseline:
- Home catalog search/filter/recommendation and map-driven genre selection.
- Profile sections for library/list visual tracking.
- Book details rendering with dynamic CTA labels and community sort tabs.
- Shared Lumo/Lamp gamification behavior.
- Admin portal shell with section navigation, tables, charts, and moderation-oriented views.

Known gaps to complete:
- Full reading interface behavior with per-user per-book progress resume.
- Full Add/Delete logic from Book Details for Library and List.
- Full social feed behavior (create/edit/delete/comment/like ownership workflows).
- Admin conversion parity hardening (React intent to vanilla behavior accuracy).

## Primary Behavior Spec

- Main product behavior specification:
  - `plan.txt`

Inside `plan.txt` you will find:
- Current vs Target behavior by feature.
- UI/UX scenario rules (happy path, return-user path, empty-state path, error-safe path).
- Dedicated Admin React -> vanilla transformation plan and parity checklist.
- Acceptance criteria and non-regression gates.

## Priority Feature Areas

1. Book navigation continuity
   - Catalog, Library, and List must keep opening the correct Book Details page.

2. Book Details actions
   - Add/Delete to Library and List with intelligent button state handling.

3. Reading continuity
   - Start at page 1 for new readers.
   - Continue from last saved page for returning readers.
   - Progress must be scoped per user and per book.

4. Community social behavior
   - Post creation, commenting, likes, ownership-based edit/delete controls, and empty-state UX.

5. Admin parity
   - Keep all current admin interactions stable while improving conversion accuracy.

## Working Rule For Future Updates

Whenever behavior changes:
- Update `plan.txt` first.
- Keep descriptions user-facing and scenario-based.
- Add acceptance criteria for any new or modified interaction.

## Admin Compatibility Addendum

React-to-template parity updates have been applied to the admin experience in `help/template`.

Current compatibility status:
- Pass: sidebar collapse/expand, section switching, header title sync, notifications behavior.
- Pass: dashboard parity improved to include full KPI surface, insights cards, and complete quick-alert coverage.
- Pass: Users filters and actions (search, role filter, edit modal, delete, table rerender).
- Pass: Books filters and actions (search, genre/audience filters, add/edit modal, delete, table rerender).
- Pass: Community section now follows post-moderation semantics (search, tag/status filtering, status actions).
- Pass: Lumo section now has actionable moderation flow (type/severity filters, approve/reject actions, pending count, active toggle).
- Pass: Age Access and Rewards styling contract restored in compiled CSS; controls and layouts render correctly.
- Pass: Age Access, Rewards, and Site Settings controls are state-driven and update immediately.
- Pass: Chart lifecycle hardened (chart instances are destroyed before re-initialization to avoid duplicates).

Known intentional scope limits:
- State is in-memory only (reload resets), matching mock behavior expectations.
- Some `View` actions remain visual/no-op parity placeholders.

