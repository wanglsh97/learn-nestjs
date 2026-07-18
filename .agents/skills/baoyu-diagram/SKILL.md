---
name: baoyu-diagram
description: Create clear, light, whiteboard-style SVG diagrams for architecture, flows, sequences, structures, mind maps, timelines, state machines, and data flows. Use whenever the user asks for a technical or conceptual diagram, visualization of a system or process, component relationships, topology, decision logic, or any visual representation of structure, logic, or flow. Output only a standalone editable SVG.
---

# Diagram Generator

Create self-contained SVG diagrams with a clean Excalidraw-inspired light style. Favor readable structure, soft pastel colors, handwritten typography, and precise layout. Do not force rough geometry or hachure when it reduces clarity.

## Supported diagram types

| Type | Use for |
| --- | --- |
| Architecture | System components, layers, and relationships |
| Flowchart | Processes, decisions, and branches |
| Sequence | Time-ordered interactions and messages |
| Structural | Classes, ER models, components, and org charts |
| Mind map | Topic hierarchies and exploration |
| Timeline | Chronological events and phases |
| Illustrative | Concepts, comparisons, and visual metaphors |
| State machine | States and labeled transitions |
| Data flow | Data movement, transformation, and storage |

## Visual style

Use an approachable light whiteboard aesthetic:

- Use `#ffffff` for the canvas.
- Use an optional subtle grid in `#e9ecef` when it helps alignment.
- Use `#1b1b1f` for primary text and `#495057` for descriptions and connectors.
- Use clean 1.5–2px strokes with round caps and joins.
- Use standard rounded rectangles, ellipses, diamonds, cylinders, and paths when they express meaning clearly.
- Use `rx="8"` to `rx="14"` for component boxes and pill shapes for start/end nodes.
- Prefer solid pastel fills with clear borders.
- Avoid gradients, glows, shadows, glass effects, neon colors, dark backgrounds, and dense textures.
- Use color to communicate roles rather than decorating every element.

### Pastel palette

| Role | Fill | Stroke | Typical use |
| --- | --- | --- | --- |
| Primary | `#d0ebff` | `#1971c2` | Inputs, frontend, controllers |
| Secondary | `#d3f9d8` | `#2b8a3e` | Services, processing, success path |
| Tertiary | `#e5dbff` | `#7048e8` | Storage and persistence |
| Accent | `#ffec99` | `#e67700` | Decisions and infrastructure |
| Alert | `#ffe3e3` | `#c92a2a` | Errors, security, and warnings |
| Connector | `#ffe8cc` | `#d9480f` | Queues, buses, and middleware |
| Neutral | `#f1f3f5` | `#495057` | External or generic components |
| Highlight | `#dbe4ff` | `#4c6ef5` | Start/end and current focus |

## Typography

Use an informal but readable font stack:

```svg
<style>
  @import url('https://fonts.googleapis.com/css2?family=LXGW+WenKai:wght@400;500;600&amp;family=Patrick+Hand&amp;display=swap');
  text { font-family: 'Patrick Hand', 'LXGW WenKai', 'Kaiti SC', 'KaiTi', sans-serif; fill: #1b1b1f; }
</style>
```

Baseline sizes:

- Title: 24px, weight 600
- Component: 17–19px, weight 600
- Description: 13–15px, `#495057`
- Annotation and arrow label: 11–13px

For Chinese text, widen boxes and prefer `LXGW WenKai`, `Kaiti SC`, and `KaiTi`. Wrap long labels with `<tspan>` or enlarge the component.

## Layering

Draw back to front:

1. White canvas and optional subtle grid
2. Light region fills and boundaries
3. Connectors, arrows, and lifelines
4. Solid pastel component shapes
5. Text labels and annotations
6. Legend only when needed
7. Title block

## Layout guidance

Read the matching reference before drawing:

- Architecture: `{baseDir}/references/architecture.md`
- Flowchart: `{baseDir}/references/flowchart.md`
- Sequence: `{baseDir}/references/sequence.md`
- Structural, class, or ER: `{baseDir}/references/structural.md`

For mind maps, timelines, state machines, and data flows, choose the simplest conventional layout that preserves the relationships.

## Spacing

- Standard component height: 64–80px; complex component: 90–130px
- Minimum gap: 50px vertical, 40px horizontal
- Arrow label clearance: at least 12px
- Region padding: at least 24px
- Title offset: at least 28px from the top-left
- Extend the `viewBox` by at least 30px around all content
- Prefer fewer, larger elements over dense collections of small boxes

## Output rules

1. Output exactly one editable `.svg` per diagram. Do not generate PNG, JPEG, PDF, or `.excalidraw` companions.
2. Include `xmlns="http://www.w3.org/2000/svg"` and a responsive `viewBox`; do not set fixed `width` or `height`.
3. Keep all styles, fonts, markers, patterns, and definitions inside the SVG.
4. Keep labels inside their intended components and away from connectors.
5. Save file-based diagrams to `{inputFileDir}/diagram/`; otherwise save to `{projectDir}/diagram/{topic-slug}/`.
6. Use meaningful kebab-case filenames.
7. Validate the SVG as XML and inspect it directly in a browser or SVG viewer.

## Process

1. Identify the smallest diagram type that expresses the relationship clearly.
2. Read the relevant layout reference.
3. List components, relationships, labels, and the primary flow direction.
4. Calculate positions and spacing before writing SVG.
5. Draw with the clean light design system and semantic palette.
6. Validate XML, viewBox, label fit, overlaps, arrow direction, and color meaning.
7. Inspect the SVG at full size and revise visual clutter or ambiguity.
8. Present only the SVG to the user.
