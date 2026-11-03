package com.faizdicegames.dicecricketking.model

import kotlinx.serialization.Serializable

@Serializable
enum class GroundType(val code: String, val displayName: String, val avgRuns5Ov: Int, val avgRuns10Ov: Int) {
    HSG("HSG", "High Scoring Ground", 104, 203),
    NSG("NSG", "Normal Scoring Ground", 89, 164),
    LSG("LSG", "Low Scoring Ground", 64, 113)
}

@Serializable
enum class MatchFormat(val overs: Int, val maxOversPerBowler: Int, val powerplayOvers: Int, val slogStartOver: Int) {
    FIVE_OVERS(5, 1, 1, 4),
    TEN_OVERS(10, 2, 2, 8)
}

@Serializable
enum class MatchPhase {
    POWERPLAY,
    REGULAR,
    SLOG
}

@Serializable
enum class PlayerRole {
    BATSMAN,
    BOWLER,
    ALL_ROUNDER,
    WICKET_KEEPER
}

@Serializable
enum class BattingHand {
    RHB,
    LHB
}

@Serializable
enum class BowlingCraft {
    FAST,
    SPIN,
    NONE
}

@Serializable
data class Player(
    val id: String,
    val name: String,
    val teamId: String,
    val role: PlayerRole,
    val battingHand: BattingHand,
    val bowlingCraft: BowlingCraft,
    val battingDots: Int,
    val bowlingDots: Int,
    val isCaptain: Boolean = false,
    val isWicketKeeper: Boolean = false,
    val isForeign: Boolean = false,
    val isOverseas: Boolean = false,
    val isStar: Boolean = false,
    val isDiamond: Boolean = false,
    val isSuggestedXI: Boolean = true,
    val isSuggested7: Boolean = true
)

@Serializable
data class Team(
    val id: String,
    val name: String,
    val shortName: String,
    val primaryColor: String,
    val secondaryColor: String,
    val players: List<Player> = emptyList()
)

@Serializable
data class SheetRow(
    val lineCode: String,
    val lineName: String,
    val cells: List<String>
)

@Serializable
data class MasterSheet(
    val id: String,
    val ground: GroundType,
    val type: String, // "BATTING" or "BOWLING"
    val phase: MatchPhase,
    val rows: List<SheetRow>
)

@Serializable
enum class CardCategory {
    WICKET,
    RUNS,
    FIELDING,
    SKILLS,
    POWER
}

@Serializable
data class GameCard(
    val id: String,
    val category: CardCategory,
    val name: String,
    val description: String,
    val outcomeType: String? = null, // "BOWLED", "CAUGHT", "LBW", "RUN_OUT", etc.
    val diceResolution: String? = null
)

@Serializable
data class DeliveryResult(
    val overNumber: Int,
    val ballNumber: Int,
    val bowlerId: String,
    val batsmanId: String,
    val whiteDie: Int,
    val blackDie: Int,
    val cellCode: String,
    val runsScored: Int,
    val extras: Int = 0,
    val extrasType: String? = null, // "WIDE", "NO_BALL", "BYE", "LEG_BYE", "PENALTY_5"
    val isWicket: Boolean = false,
    val wicketType: String? = null,
    val wicketDescription: String? = null,
    val isFreeHit: Boolean = false,
    val isDrsUsed: Boolean = false,
    val wasOverturned: Boolean = false,
    val commentary: String
)

@Serializable
data class BatsmanScore(
    val playerId: String,
    var runs: Int = 0,
    var ballsFaced: Int = 0,
    var fours: Int = 0,
    var sixes: Int = 0,
    var isOut: Boolean = false,
    var dismissal: String = "not out"
)

@Serializable
data class BowlerScore(
    val playerId: String,
    var oversBowled: Double = 0.0,
    var maidenOvers: Int = 0,
    var runsConceded: Int = 0,
    var wicketsTaken: Int = 0,
    var dotsCount: Int = 0
)

@Serializable
data class Inning(
    val battingTeamId: String,
    val bowlingTeamId: String,
    var totalRuns: Int = 0,
    var wickets: Int = 0,
    var completedBalls: Int = 0,
    val target: Int? = null,
    val deliveries: MutableList<DeliveryResult> = mutableListOf(),
    val batsmanScores: MutableMap<String, BatsmanScore> = mutableMapOf(),
    val bowlerScores: MutableMap<String, BowlerScore> = mutableMapOf()
)
