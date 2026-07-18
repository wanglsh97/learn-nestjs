# Flowchart Layout

Use the light pastel design system from `SKILL.md` for all visible elements.

## Shape vocabulary

| Meaning | Shape |
| --- | --- |
| Start or end | Ellipse or pill |
| Process | Rounded rectangle |
| Decision | Diamond |
| Input or output | Parallelogram |
| Data store | Cylinder |

## Flow direction

- Run the primary path from top to bottom.
- Send false, error, and optional branches left or right.
- Keep the common path visually centered.

## Layout algorithm

1. List the main path before drawing branches.
2. Place consecutive nodes with 60–85px vertical gaps.
3. Put decision branches about 210px from the center line.
4. Route branches back with gentle curves and at least 24px clearance.
5. Route loop-backs along the far outside edge.

## Branch labels

- Put “是 / 否”, “Yes / No”, or equivalent labels directly beside the outgoing connector.
- Use green text for the success branch and red text for the failure branch only when color adds meaning.
- Keep labels level even if the connector is curved.

## Complex flows

- For more than ten steps, group phases in loose swimlanes.
- For more than two major branches, create a high-level flow plus focused subflows.
- Avoid squeezing text or reducing node size to keep everything in one canvas.
