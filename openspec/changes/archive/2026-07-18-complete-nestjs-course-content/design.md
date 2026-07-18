## Context

The course outline already defines fifteen lessons over five days, and every lesson directory contains a cumulative NestJS Demo draft. Lesson 1 has substantial bilingual content and diagrams; lessons 2–15 currently contain short topic placeholders. The snapshots implement progressively more behavior, but most do not have enough documentation and local-run observations to prove that the behavior, examples, and learning scope agree.

The audience is experienced with TypeScript and frontend architecture, so the course must spend its limited 60–90 minute lesson budget on backend mental models, request boundaries, runtime observations, and engineering decisions. `lessons/README.md` defines the sequence, while `README.md` and `AGENTS.md` define global constraints. Existing unrelated worktree changes are user-owned and remain untouched.

## Goals / Non-Goals

**Goals:**

- Produce a coherent bilingual learning path for all fifteen outline entries.
- Make every cumulative Demo independently runnable and observable; keep automated test cases isolated to lesson 13, whose topic is testing.
- Use verified diagrams where structure or flow is materially clearer visually.
- Keep documents, implementation, ports, and commands synchronized; synchronize tests only within lesson 13.
- Enforce independent, blocking review after each lesson instead of deferring quality checks to the end.

**Non-Goals:**

- Cover every NestJS API or turn the knowledge-management Demo into a production SaaS.
- Replace the cumulative-snapshot teaching structure with shared packages or symlinks.
- Introduce infrastructure that makes the documented fallback path unusable without Docker.
- Rewrite unrelated repository history or user changes.

## Decisions

### 1. Treat each lesson as a vertical learning slice

For each lesson, implementation proceeds in the order: inspect outline and current snapshot; identify the single observable addition; correct source code; write the Chinese document; produce the semantically matching English document; create required SVG diagrams; update the Demo README; run lint/build and the documented local flow; then pass a fresh reviewer gate. Lesson 13 additionally implements and runs automated tests.

This is preferred over writing all documents first because examples would otherwise stabilize before the Demo behavior is verified. It is also preferred over finishing all code first because lesson boundaries and explanatory scope would drift.

### 2. Propagate fixes forward from the earliest affected snapshot

When a defect exists in lesson N and later snapshots copied it, repair the earliest affected lesson and apply the same semantic correction to every later snapshot that retains the capability. Validate the current lesson and directly affected successors, always sampling lesson 15.

Shared packages were considered but rejected because each Demo must remain independently understandable and runnable. Mechanical comparison and carefully scoped repeated patches preserve the teaching snapshots without hidden coupling.

### 3. Budget each lesson around one request or operational story

Each document follows problem → mental model → minimal code → observation → engineering decisions and mistakes. A lesson may mention later topics only at the boundary. Long API catalogs, elementary TypeScript explanations, repeated reference lists, homework, and generic summaries are excluded. This keeps the material executable within 60–90 minutes.

### 4. Local execution is the default observation model

Lessons 1–12, 14, and 15 contain source code only. Their README gives concrete startup commands, requests, logs, state transitions, or infrastructure observations that a reader can reproduce locally. They do not contain unit, integration, or E2E files.

Lesson 13 owns the course's automated-testing examples and contains representative unit, integration, and E2E coverage. Later cumulative snapshots retain business capabilities but do not copy those test files. Validation otherwise uses lint and build scripts from `AGENTS.md`; the read-only reviewer checks the documented manual flow against source.

### 5. Diagrams are selected by structural load

Use `baoyu-diagram` SVGs for dependency graphs, lifecycle order, security decisions, transactions, cache flows, queues, test layers, observability, and deployment. Simple commands or single-class APIs remain prose/code. Chinese and English variants share topology but localize labels.

### 6. Reviewer approval is intentionally non-reusable

The project reviewer is an independent read-only GPT-5.6 Terra agent. Any finding blocks the lesson. After a fix, a new instance re-reads the actual files and validation evidence and must return `REVIEW PASS`. Lessons 1–3 retain their existing completed gates and are not reviewed again; fresh gates continue from lesson 4.

## Risks / Trade-offs

- [The existing Demo draft may encode incorrect behavior across many snapshots] → Compare snapshots from the earliest introduction, patch all affected successors, and sample lesson 15 after every cumulative repair.
- [Fifteen bilingual lessons can become repetitive] → Keep theory owned by its first lesson, use short linked reminders later, and make every section serve a Demo observation or engineering choice.
- [Per-lesson independent review is expensive] → Keep reviewer scope to the current lesson plus directly affected snapshots, but never weaken the blocking pass requirement.
- [External services make local verification nondeterministic] → Preserve in-memory fallback paths and document live Redis/queue verification as an additional path.
- [Generated diagrams can be technically valid but visually broken] → Follow the skill's type-specific reference and render/check viewBox, labels, overlaps, and arrows before review.
- [Existing untracked course files make Git history less informative] → Use explicit file inventories, semantic comparisons, and OpenSpec task evidence without deleting or normalizing unrelated work.

## Migration Plan

1. Complete and gate lessons in numeric order so cumulative behavior has a single forward direction.
2. For each lesson, preserve its default port and standalone configuration while applying necessary corrections to later snapshots.
3. Run full workspace validation after all lesson gates pass.
4. Verify the implementation against these specs, synchronize the capability specs into `openspec/specs/`, and archive the change.

Rollback is file-scoped: because the repository is a learning knowledge base rather than a deployed service, a defective lesson change can be reverted within its documents, Demo source, and propagated successor patches without a data migration. User-owned pre-existing changes must never be included in rollback operations.

## Open Questions

None are blocking. Details such as exact code snippets and diagram composition are resolved lesson-by-lesson from the current Demo and reviewer evidence while preserving the capability requirements above.
