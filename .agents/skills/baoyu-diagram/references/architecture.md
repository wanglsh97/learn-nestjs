# Architecture Diagram Layout

Use the light pastel design system from `SKILL.md` for all visible elements.

## Flow direction

- Use left-to-right for request paths and data pipelines.
- Use top-to-bottom for layered architectures.
- Choose one primary direction and make secondary relationships visually quieter.

## Layout algorithm

1. Identify layers such as clients, adapters, services, data, and infrastructure.
2. Assign one row or column to each layer.
3. Place related components with at least 45px horizontal and 55px vertical gaps.
4. Draw rounded dashed regions only when they communicate a real boundary.
5. Route the main relationship through the visual center.
6. Route optional or native escape paths around the outside edge.

## Regions

- Use a rounded rectangle with a light dashed outline.
- Put the region label just inside its top-left edge.
- Use no region fill or a very light neutral fill.
- Nest no more than three region levels.

## Connectors

- Prefer direct paths with no crossings.
- Use straight lines, gentle curves, or clear right-angle routing as appropriate.
- Use a shared connector bus only when three or more components connect through it.
- Place labels near the middle of the related path with at least 14px clearance.

## Complex systems

- Keep a high-level diagram to 6–10 main components.
- Split subsystems into separate diagrams when labels become smaller than the style baseline.
- Put databases and external infrastructure at the bottom or right.
