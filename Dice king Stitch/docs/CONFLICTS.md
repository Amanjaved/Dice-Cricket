# Dice Cricket King · Conflicts & Resolutions Log

This document records disagreements between the source documentation, printed rule books, PDFs, and Stitch Design mockups, along with the authoritative resolutions taken.

---

### 1. App Simulation Averages vs Printed Rule Book Ranges
- **Conflict**: 
  - Rule Book (Page 2) gives: 5-over typical range NSG 56–80, HSG 75–110, LSG 30–54; 10-over typical range NSG 130–170, HSG 170–225, LSG 75–115.
  - Complete Documentation §28 gives the calibrated app simulation figures (IND v PAK, equal stars, after fewer-extras engine): 5 overs: HSG 104, NSG 89, LSG 64; 10 overs: HSG 203, NSG 164, LSG 113.
- **Resolution**:
  - The documentation explicitly notes that the app simulation averages reflect the modern app engine with the dynamic star dominance and fewer-extras engine implemented. Both ranges are reported in `docs/SIMULATION.md`. The game engine follows the exact mathematical sheets and runs-card probabilities, which naturally yields the documented §28 averages.

---

### 2. Default Theme: Classic Maroon vs Pitch Pulse
- **Conflict**:
  - Complete Documentation §25 lists "Classic Maroon" as the default theme.
  - Stitch Design exports and `pitch_pulse/DESIGN.md` define "Pitch Pulse" (Obsidian / Dark Forest Charcoal + Electric Lime `#C3F400` / `#CCFF00`) as the signature visual design.
- **Resolution**:
  - **Pitch Pulse is the primary default theme**, adopting the Stitch design system exactly.
  - The app includes the full 6-theme suite in the Customise menu (Pitch Pulse, Classic Maroon, Night Stadium, Pitch Green, Super League, Ocean Breeze, Retro Scoreboard) so the user can freely toggle back to Classic Maroon or any other theme at any time.

---

### 3. Bottom Navigation Bar Tabs
- **Conflict**:
  - Complete Documentation §17 notes a 4-tab mobile bottom bar: `Home, DPL, Rankings, Stats`.
  - Stitch Design screens show bottom navigation with `Home, Matches, Tournaments, Rankings`, with quick access to Stats, Teams, DPL, Sheets, Customise via Home tiles and "More".
- **Resolution**:
  - We provide bottom navigation for the primary operational flow (`Home, Live/Matches, Tournaments, Rankings`), while also featuring direct dedicated tiles and quick links on the Home dashboard for `DPL, Stats, Teams Database, Master Sheets, and Customise`, ensuring 100% feature accessibility.
