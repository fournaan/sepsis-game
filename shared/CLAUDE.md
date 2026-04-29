# CLAUDE.md — Root Project

## Project Overview
A mobile game built in **React Native (Expo Go)**, targeting **Android and iOS**.
The player controls a **Killer T Cell** fighting infections across 6 levels of increasing difficulty.
Each level is set in a different physiological system of the body.

**Design priorities (in order):**
1. Fun to play
2. Educational — antibiotic choices, infection physiology, and sepsis awareness

---

## Tech Stack
- **Framework:** React Native via Expo Go
- **Language:** JavaScript (React JS)
- **Target platforms:** Android, iOS

---

## Game Structure
- 6 worlds, each representing a body system
- Each world has multiple sub-levels of increasing difficulty
- Single playable character: **Killer T Cell**
- Platformer / side-scrolling genre with system-specific mechanics per level

### Level Order
| # | System | Boss |
|---|--------|------|
| 1 | Skin | MRSA Cellulitis |
| 2 | Respiratory | TB |
| 3 | Gastrointestinal | C. diff |
| 4 | Urinary | Pseudomonas |
| 5 | Musculoskeletal | Staph A / MRSA |
| 6 | Cardiovascular | Kingella, Strep Viridans, Staph A (IE) |

---

## Shared Game Systems

### Currency
- **Antibodies** — collected by defeating enemies; spent in the shop

### Health Bar
- Default: **WBC count**
- Immunodeficiency Mode: WBC locked to **1** for all levels (bonus difficulty)

### Power-Ups (available across all levels)
| Power-Up | Effect |
|----------|--------|
| Macrophage | Player grows large |
| Filgrastim (G-CSF) | Spawns multiple soldier T cells |
| Steroid | Weakens all on-screen enemies |

### Shop
- Unlock antibiotics using collected antibodies
- Antibiotics serve as collectible weapons
- Antibiotic coverage chart unlocked progressively (displayed as a map)
- Probenecid available as a special item (beta-lactam sparer)

### Collectables
- **Antibiotic Coverage Chart** — fills in piece by piece across levels, displayed in map form
- **Enemy Cards** — bacteria info cards (gram stain, morphology, first-line treatment)
- **MCS Reports** — Microscopy, Culture & Sensitivity results; teach antibiotic selection

### Immunodeficiency Mode
- Bonus difficulty; WBC health = 1 for entire run
- Unlocked after first full playthrough or from settings

---

## Educational Systems

### Hints
- Unlocked progressively as the player advances through each level
- Cover: microbiology terminology, antibiotic coverage, system physiology
- Delivered as collectible hint cards or brief in-game pop-ups

### Antibiotic Unlock System
- Each level unlocks at least one antibiotic from a relevant drug class
- Aim for coverage of one representative per major class across the 6 levels
- Unlocked antibiotics fill in the collectible coverage chart

---

## Code Conventions
- Component files: `PascalCase.jsx`
- Utility/helper files: `camelCase.js`
- Level-specific logic lives in `levels/level-N-name/`
- Shared systems live in `shared/`
- Educational content should be data-driven (JSON/config) so it can be updated without touching game logic
- Each level has its own `CLAUDE.md` — always read it when working inside that level's directory

---

## File Structure
```
/
├── CLAUDE.md                          ← this file
├── shared/
│   ├── CLAUDE.md                      ← shop, collectables, power-ups, antibiotic chart
│   └── ...
└── levels/
    ├── level-1-skin/CLAUDE.md
    ├── level-2-respiratory/CLAUDE.md
    ├── level-3-gastrointestinal/CLAUDE.md
    ├── level-4-urinary/CLAUDE.md
    ├── level-5-musculoskeletal/CLAUDE.md
    └── level-6-cardiovascular/CLAUDE.md
```
