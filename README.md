# Dice Cricket King · Digital Edition & Companion App
**Faiz Dice Games · © 2026 Tanweer Ahmad**

A complete, high-fidelity digital implementation and companion suite for **Dice Cricket King**, the physical dice-and-card cricket board game.

---

## 🌟 Highlights

- **Dual Ecosystem Deliverables**:
  1. **Interactive Web Application (React 19 + TypeScript + Vite + Tailwind CSS)**: Live playable preview on port 3000 replicating all 40 Stitch screens with audio synthesis, 2D pitch animations, real-time worm charts, tournament schedule, and live DPL auction.
  2. **Native Android Application (`Dice king Stitch/DiceCricketKing/`)**: Production Jetpack Compose + Kotlin + Room offline architecture ready to build with Gradle.
- **100% Mathematical Fidelity**:
  - 12 Master Sheets across High (HSG), Normal (NSG), and Low (LSG) Scoring Grounds.
  - 200 Players across 10 International Teams with exact roles, bowling crafts, skill dots, and markers (`C`, `F`, `O`, `★`, `D`).
  - 87 Physical Game Cards (25 Wicket, 16 Runs, 20 Fielding, 20 Skills, 6 Power).
- **Extensive Validation & Simulation**:
  - 60,000-innings automated Monte Carlo simulation suite (`scripts/simulate.js` & `docs/SIMULATION.md`).
  - Unit tests passing for both Kotlin Android (`DiceCricketKing/app/src/test/`) and Node.js (`src/engine/engine.test.ts`).

---

## 🚀 Running the Web Application

The interactive web application runs on port 3000:
```bash
npm run dev
```
To run the automated TypeScript engine unit tests:
```bash
npx --yes tsx --test src/engine/engine.test.ts
```
To run the 60,000-innings Monte Carlo validation suite:
```bash
node scripts/simulate.js
```

---

## 📱 Native Android Project

Located in `Dice king Stitch/DiceCricketKing/`:
- Compile SDK: `34`
- Min SDK: `26`
- Java / Kotlin Target: `Java 17`
- UI Framework: `Jetpack Compose Material 3`
- Database: `AndroidX Room 2.6.1`

---

## 📚 Technical Documentation

- [`docs/ANALYSIS.md`](docs/ANALYSIS.md): Comprehensive analysis of game data and source documentation.
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md): Complete JSON schema and data structures.
- [`docs/CONFLICTS.md`](docs/CONFLICTS.md): Identified documentation conflicts and resolutions.
- [`docs/AMBIGUITIES.md`](docs/AMBIGUITIES.md): Formal interpretations of edge case rules.
- [`docs/DESIGN_MAP.md`](docs/DESIGN_MAP.md): Mapping of all 40 Stitch screens.
- [`docs/PLAN.md`](docs/PLAN.md): Architecture, milestones, and testing plan.
- [`docs/SIMULATION.md`](docs/SIMULATION.md): Statistical analysis of 60,000 innings.
- [`docs/COVERAGE.md`](docs/COVERAGE.md): 100% verification matrix against rules §1–27 and all 40 screens.

---
© 2026 Tanweer Ahmad · Faiz Dice Games. All rights reserved.
