# Dice Cricket King · Android Native App & Stitch Assets
**Faiz Dice Games · © 2026 Tanweer Ahmad**

This directory contains the production-grade **Android Native Application** (`DiceCricketKing/`), the source game assets, design exports, and comprehensive technical documentation.

---

## 📁 Directory Structure

```
Dice king Stitch/
├── DiceCricketKing/                     # Android Studio Project
│   ├── app/
│   │   ├── build.gradle.kts             # Compose, Room, Kotlin Serialization
│   │   └── src/
│   │       ├── main/
│   │       │   ├── AndroidManifest.xml
│   │       │   ├── assets/data/         # sheets.json, teams.json, cards.json, rules.json
│   │       │   └── java/com/faizdicegames/dicecricketking/
│   │       │       ├── MainActivity.kt
│   │       │       ├── model/           # GameModels.kt
│   │       │       ├── engine/          # DiceCricketEngine.kt, MatchupGrid.kt, WicketResolver.kt, ExtrasEngine.kt
│   │       │       ├── data/            # DiceCricketDatabase.kt, EntitiesAndDaos.kt, GameRepository.kt
│   │       │       └── ui/              # Theme, Screens (HomeScreen, LiveMatchScreen)
│   │       └── test/java/com/faizdicegames/dicecricketking/
│   │           ├── DataValidationTest.kt
│   │           ├── GameEngineTest.kt
│   │           └── SimulationTest.kt
│   ├── build.gradle.kts
│   ├── settings.gradle.kts
│   └── gradle.properties
├── assets/                              # Source PDFs, extracted Stitch design files
└── docs/                                # Technical docs (ANALYSIS, DATA_MODEL, PLAN, PROGRESS, SIMULATION, COVERAGE)
```

---

## 🛠 Building & Running the Android App

### Prerequisites
- Android Studio Hedgehog (2023.1.1) or newer / Ladybug
- JDK 17
- Android SDK 34 (API Level 34)

### Opening in Android Studio
1. Open Android Studio.
2. Select **Open** and choose `Dice king Stitch/DiceCricketKing`.
3. Allow Gradle to sync dependencies.

### Command Line Build
```bash
cd "Dice king Stitch/DiceCricketKing"
./gradlew assembleDebug
```

### Running Unit Tests
```bash
./gradlew test
```

---

## 🎨 Pitch Pulse Design Theme
The Android application implements the Pitch Pulse aesthetic:
- **Background**: `#101410` (Dark Obsidian Turf)
- **Surface**: `#171C17` (Deep Pitch Slate)
- **Primary Accent**: `#C3F400` (Electric Pitch Lime)
- **Typography**: Outfit Bold & IBM Plex Sans
- **100% Offline**: Room Database for persistent match histories, tournaments, and squad state.
