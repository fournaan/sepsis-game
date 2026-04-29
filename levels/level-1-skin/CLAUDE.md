# CLAUDE.md — Level 1: Skin

## Setting
Outside the skin barrier. Sub-levels progress from epidermis → dermis → subcutaneous tissue.
Dark red/brown environment. Biofilm structures appear as sticky terrain.

## Unique Mechanic
Biofilm zones — sticky ground that slows the player. Jumping removes the stick.

## Enemies
- **Henchmen:** Staph aureus (MSSA) — orange/yellow circles
- **Boss:** MRSA Cellulitis — large red circle, 3x health

## Obstacles
| Obstacle | Effect |
|----------|--------|
| Biofilm | Sticky ground patch — slows horizontal movement |
| Pus pockets | Explosive debris on contact |
| Abscess wall | Requires specific antibiotic weapon to burst |
| Lymph nodes | Bounce pads at screen edge |

## Antibiotic Unlocks (boss rewards)
- Flucloxacillin (free — MSSA first-line)
- Vancomycin (50 antibodies — MRSA)
- Clindamycin (30 antibodies)

## Hints (unlocked on level completion)
- h1: Gram Stain Basics
- h2: MRSA vs MSSA
- h3: Skin Infection Signs

## Implementation Notes
- Implemented via the shared GameScreen.jsx + buildLevel() function
- Level-specific environment colour: bgColor #1a0a0a
- Level 1 is always unlocked (tutorial level)
- Boss spawns after all 3 henchmen defeated
