# bilingual-course-content Specification

## Purpose
TBD - created by archiving change complete-nestjs-course-content. Update Purpose after archive.
## Requirements
### Requirement: Fifteen outline-aligned lessons
The course SHALL provide exactly fifteen numbered lessons whose primary subject, scope, and ordering match `lessons/README.md`, and each lesson SHALL explain the problem, mental model, minimal implementation, observable behavior, engineering choices, and relevant mistakes without expanding into later lessons unnecessarily.

#### Scenario: Reader opens a lesson
- **WHEN** a reader follows any lesson link from `lessons/README.md`
- **THEN** the lesson presents complete content for that outline topic that can be read and run in 60–90 minutes

### Requirement: Developer-oriented writing
Every lesson SHALL address an experienced TypeScript/frontend engineer as a developer solving a backend problem and MUST NOT contain teacher-style assignments, self-tests, grading criteria, or repetitive generic summaries.

#### Scenario: Course language is reviewed
- **WHEN** a reviewer inspects a lesson document
- **THEN** every section contributes to understanding or running the Demo and uses problem-solving language rather than classroom assessment language

### Requirement: Synchronized bilingual documents
Each lesson SHALL contain `index.md` and `index.en.md` with equivalent titles, section structure, technical meaning, code examples, commands, paths, ports, requests, and expected responses.

#### Scenario: A Chinese lesson changes
- **WHEN** content or Demo behavior described in `index.md` is added or corrected
- **THEN** the corresponding English document contains the same information in natural English before the lesson can pass review

### Requirement: Document and Demo consistency
All code snippets, API contracts, configuration examples, commands, paths, and observable outputs in a lesson SHALL be verified against that lesson's actual Demo.

#### Scenario: Reader follows a documented verification step
- **WHEN** the reader runs the documented command or request against the lesson Demo
- **THEN** the observed behavior matches the document without undocumented setup
