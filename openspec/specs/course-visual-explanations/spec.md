# course-visual-explanations Specification

## Purpose
TBD - created by archiving change complete-nestjs-course-content. Update Purpose after archive.
## Requirements
### Requirement: Diagrams for complex course logic
Every lesson SHALL evaluate its core topic for visual complexity and SHALL include a diagram when the topic contains at least three related components, multiple ordered stages, branches, state transitions, architecture boundaries, or cross-component flows.

#### Scenario: Complex flow is taught
- **WHEN** a lesson explains a request lifecycle, dependency graph, security flow, transaction, cache, background job, observability pipeline, or deployment path
- **THEN** an SVG diagram carries the primary structural explanation and the prose supplies conclusions and trade-offs without duplicating every label

### Requirement: Repository-native baoyu diagrams
Technical diagrams SHALL be created with the repository `baoyu-diagram` skill as self-contained editable SVG files under the lesson's `diagram/` directory; Mermaid, Excalidraw, screenshots, and companion raster or PDF files MUST NOT be used as substitutes.

#### Scenario: Diagram assets are inspected
- **WHEN** a reviewer lists a lesson's visual assets
- **THEN** only the required SVG source assets remain and they follow the repository naming convention

### Requirement: Bilingual visual parity
Diagrams with natural-language labels SHALL have Chinese and English SVG versions with equivalent logic, while language-neutral diagrams MAY be shared.

#### Scenario: A bilingual diagram is embedded
- **WHEN** `index.md` and `index.en.md` reference a labeled diagram
- **THEN** each document references the matching language version and both show the same components, edges, states, and outcomes

### Requirement: Visually valid SVG output
Every diagram SHALL have a valid viewBox and SHALL be checked for clipped text, overflow, overlap, unreadable labels, and incorrect arrow direction before lesson completion.

#### Scenario: Diagram verification runs
- **WHEN** the generated SVG is rendered or inspected
- **THEN** all labels and relationships are legible and match the lesson document and Demo behavior
