# Structural Diagram Layout

Use the light pastel design system from `SKILL.md` for all visible elements. This reference covers class, ER, component, package, and organization diagrams.

## Class diagrams

- Use one rounded outer box with light internal divider lines.
- Keep class name, attributes, and methods in three readable compartments.
- Left-align attributes and methods; center only the class name.
- Italicize abstract class names and add `«interface»` above interfaces.

## Relationships

| Relationship | Rough line | End shape |
| --- | --- | --- |
| Inheritance | Solid | Open triangle |
| Implementation | Dashed | Open triangle |
| Composition | Solid | Filled diamond |
| Aggregation | Solid | Open diamond |
| Dependency | Dashed | Open arrowhead |
| Association | Solid | Open arrowhead or no end |

- Reuse consistent SVG markers for relationship end shapes.
- Put multiplicity labels 8–12px from their related endpoint.
- Route lines around boxes with gentle bends and no crossings where possible.

## ER diagrams

- Use two compartments: entity name and fields.
- Mark primary keys with `PK` and foreign keys with `FK`.
- Draw clear crow’s-foot markers with consistent geometry.
- Introduce a junction entity for many-to-many relationships.

## Organization charts

- Use a top-down tree with 110–140px between levels.
- Space siblings evenly and connect them through a shared branch.
- Use pastel color to indicate departments or hierarchy levels.

## Layout limits

- Count the widest level before choosing the viewBox.
- Switch to a horizontal tree for more than five levels.
- Split structural diagrams that require more than twelve primary boxes.
