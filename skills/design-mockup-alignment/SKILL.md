---
name: design-mockup-alignment
description: Use when implementing UI from an existing design mockup, screenshot, generated design draft, or visual reference, especially when the user expects close visual matching without adding unapproved product behavior.
---

# Design Mockup Alignment

Use this skill when the task is to make an existing screen match a design draft. The goal is visual fidelity plus business fidelity: the result should look like the mockup while preserving the app's current logic.

## Core Rule

Do not treat a design mockup as permission to invent features. Match layout, scale, color, typography, imagery, and controls, but only implement behavior that already exists or that the user explicitly approves.

## Workflow

1. **Read the real screen first**
   - Locate the current screen/component, styles, assets, navigation route, and tests.
   - List the actual business states and actions already present.
   - Keep existing API calls, state transitions, validation, and navigation unless the user asks otherwise.

2. **Inspect the mockup as a visual contract**
   - Identify proportions: screen occupancy, card width, vertical rhythm, button height, whitespace.
   - Identify typography: display size, body size, weight, font family or closest project-available substitute.
   - Identify visual assets: background images, stamps, textures, icons, illustrations, photos.
   - Identify UI hierarchy: what is inside the card, outside the card, fixed, modal, or overlay.

3. **Build a gap list before editing**
   - `Keep`: existing logic and fields that must remain.
   - `Match`: concrete visual differences to fix.
   - `Missing assets`: icons/backgrounds/images/fonts needed to match.
   - `Conflict/unclear`: anything in the mockup that does not exist in current business.

4. **Handle missing assets**
   - Prefer existing repo assets if they match.
   - For simple icons, create project-local SVG assets.
   - For decorative UI backgrounds, create SVG or code-native assets when deterministic.
   - For bitmap/photo-like assets, use `imagegen`, then save final assets into the workspace.
   - Do not leave project-used assets only under Codex generated image folders.

5. **Ask before changing behavior**
   Ask the user before implementing any mockup element that implies:
   - new login methods, tabs, filters, menus, settings, sync controls, sharing, social features, or analytics
   - extra fields not present in the current screen
   - changed validation, API calls, navigation, persistence, permissions, or data model
   - hiding/removing existing required business paths

6. **Implement in tight passes**
   - First align structure: element placement, card boundaries, overlays, outside-card links.
   - Then align scale: max width, heights, font sizes, margins, paddings.
   - Then align assets: icons, background artwork, texture/stamp/illustration placement.
   - Then align states: loading, disabled, selected, error, modal, alternate modes.
   - Keep edits scoped to the screen, its styles, and required local assets.

7. **Compare against the mockup**
   Check for these common misses:
   - Screen feels too full compared with mockup.
   - Middle form text is too large.
   - Card or button spacing is too loose.
   - Links are inside the card when mockup shows them outside, or vice versa.
   - Background art is a placeholder instead of matching the reference.
   - Icons are missing, wrong size, or placed outside input fields.
   - Font weight/family feels unlike the mockup.
   - Generated design features slipped in despite not existing in the app.

8. **Verify**
   - Run typecheck and relevant tests.
   - For frontend/mobile visual work, run or inspect the app when feasible.
   - Report any remaining visual differences honestly.

## React Native Notes

- Reuse existing theme tokens first, then add one-off colors only when the mockup requires them.
- Use SVG assets for deterministic decorative line art and icons.
- Keep text inside buttons and inputs from overflowing on smaller devices.
- Use `maxWidth` and restrained heights to avoid screens feeling oversized.
- If a registered custom font is not available, use the closest project font and say so.

## Prompt To Self

Before finalizing, answer:

- Did I add any feature that is not in the current app?
- Did I replace a mockup asset with a vague placeholder?
- Are the proportions close, or merely the colors?
- Did I ask about every design-vs-business conflict?
- Did I verify the code still compiles/tests?
