## ADDED Requirements

### Requirement: Mandatory workspace verification
After a lesson Demo changes, the implementation SHALL pass workspace lint and build plus its documented local-run verification and directly affected later snapshots; lesson 15 SHALL be sampled for every cumulative correction. Only lesson 13 SHALL run automated tests.

#### Scenario: Lesson implementation is ready for review
- **WHEN** the primary agent finishes the lesson's code and documents
- **THEN** it records lint/build and local-run results required by `AGENTS.md`, plus lesson 13 test results when applicable, or treats an unavailable required validation as blocking

### Requirement: Independent reviewer gate
Every lesson completed from lesson 4 onward SHALL be reviewed by a fresh project `reviewer` subagent configured to use GPT-5.6 Terra and supplied with the lesson path, change scope, actual diff, and validation evidence. Existing passes for lessons 1–3 remain accepted without repeat review.

#### Scenario: Reviewer finds a problem
- **WHEN** the reviewer reports any confirmed omission, error, mismatch, unverified requirement, or code defect
- **THEN** the primary agent fixes it, reruns relevant validation, and spawns a new reviewer instance rather than accepting its own repair

### Requirement: Explicit review pass
A lesson MUST NOT be marked complete until the newest reviewer instance returns the exact `REVIEW PASS` conclusion with no unresolved finding or missing validation.

#### Scenario: Lesson task is checked off
- **WHEN** the primary agent updates the OpenSpec task for that lesson to complete
- **THEN** the corresponding implementation, validation evidence, and newest reviewer pass all exist

### Requirement: Final repository integrity
The completed course SHALL pass repository-wide validation, bilingual structure checks, link/path/port consistency checks, `git diff --check`, and OpenSpec implementation verification without adding secrets, generated build artifacts, or unrelated rewrites.

#### Scenario: Course change is finalized
- **WHEN** all fifteen lesson gates have passed
- **THEN** whole-repository checks pass and the OpenSpec change can be verified, synchronized, and archived with no outstanding tasks
