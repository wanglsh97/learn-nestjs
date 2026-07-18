# cumulative-lesson-demos Specification

## Purpose
TBD - created by archiving change complete-nestjs-course-content. Update Purpose after archive.
## Requirements
### Requirement: Independently runnable Demo snapshot
Every lesson SHALL contain a complete NestJS project under `demo/` that can be understood, installed, built, and started independently without symlinks or hidden source dependencies on another lesson.

#### Scenario: A reader starts an arbitrary lesson
- **WHEN** the reader enters any lesson Demo after installing workspace dependencies
- **THEN** the Demo builds and starts on port `3000 + lesson number` using its documented environment and commands

### Requirement: Monotonic cumulative capability
The Demo for lesson N SHALL retain the applicable capabilities of lessons 1 through N-1 and add the observable behavior introduced by lesson N; corrections to prior behavior SHALL be propagated to every directly affected later Demo and checked in lesson 15.

#### Scenario: An earlier capability is corrected
- **WHEN** implementation behavior shared by later snapshots changes
- **THEN** affected later Demos preserve the correction and lesson 15 still demonstrates the complete course behavior

### Requirement: Correct NestJS boundaries
Demo code SHALL use TypeScript strict mode, DTOs for external input, Controllers for protocol adaptation, Services or Providers for business rules, explicit module imports/providers/exports, injected configuration, and platform-independent NestJS APIs unless a lesson explicitly demonstrates a platform-specific concern.

#### Scenario: Demo implementation is reviewed
- **WHEN** a reviewer traces a request through the lesson Demo
- **THEN** input validation, protocol handling, business logic, persistence, and configuration reside in their documented architectural boundaries

### Requirement: Observable lesson behavior
Every lesson SHALL expose at least one local-run result for its new capability. Lessons other than lesson 13 MUST NOT contain unit, integration, or E2E test cases or test directories; lesson 13 SHALL contain automated test examples because testing is its subject.

#### Scenario: A lesson introduces core behavior
- **WHEN** the new behavior is implemented outside lesson 13
- **THEN** the Demo README explains commands and expected output that let a reader observe it locally without test files

#### Scenario: Lesson 13 teaches testing
- **WHEN** lesson 13 demonstrates automated testing
- **THEN** its Demo contains and runs representative unit, integration, or E2E tests

### Requirement: Resilient external-service lessons
Lessons involving Redis, queues, or other external infrastructure SHALL document startup and SHALL retain a functional in-memory learning path whenever the course declares such a fallback.

#### Scenario: External infrastructure is unavailable
- **WHEN** the reader runs a fallback-enabled Demo without Docker, Redis, or a queue service
- **THEN** the documented core learning flow remains observable and clearly identifies the degraded behavior
