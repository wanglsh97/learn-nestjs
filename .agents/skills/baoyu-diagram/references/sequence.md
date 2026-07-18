# Sequence Diagram Layout

Use the light pastel design system from `SKILL.md` for all visible elements.

## Core elements

| Element | Rough construction |
| --- | --- |
| Participant | Pastel rounded box |
| Lifeline | Light dashed line |
| Synchronous message | Solid arrow |
| Async message | Open arrow |
| Return | Dashed arrow |
| Activation | Narrow rounded box |
| Self-message | Curved loop arrow |
| Alt or loop frame | Dashed rounded region |

## Layout algorithm

1. Arrange participants horizontally with 170–220px between centers.
2. Start lifelines below participant boxes and extend them to the last message.
3. Place messages from top to bottom with 50–65px vertical gaps.
4. Center activation shapes on their lifelines.
5. Put message labels 12–16px above their paths.

## Message rules

- Keep time moving downward.
- Use solid connectors for calls and dashed connectors for returns.
- Use consistent SVG markers for arrowheads.
- Use curves only when avoiding overlaps or drawing self-messages.
- Number messages only when there are eight or more.

## Frames

- Use a light dashed region for `alt`, `opt`, and `loop`.
- Add a small neutral tab at the top-left.
- Place conditions beside the tab and keep divider lines visually lighter.

## Complexity

- Keep one diagram to 3–6 participants.
- Split interactions when message labels begin to overlap.
- Prefer one important interaction over an exhaustive trace of internal calls.
