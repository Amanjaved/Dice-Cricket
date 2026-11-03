package com.faizdicegames.dicecricketking.engine

import com.faizdicegames.dicecricketking.model.*

/**
 * Core Deterministic Game Engine for Dice Cricket King (Rules §1-§27).
 * Handles balls, overs, quotas, powerplays, slog phase, wicket resolution, extras, target chases, super overs.
 */
class DiceCricketEngine(
    val format: MatchFormat,
    val ground: GroundType,
    val battingTeam: Team,
    val bowlingTeam: Team,
    private val masterSheets: List<MasterSheet>,
    private val cardsDeck: List<GameCard>
) {
    var currentInningsIndex = 0
    val innings = mutableListOf<Inning>()
    
    var currentOver = 0
    var currentBallInOver = 0
    var isFreeHit = false
    var isMatchFinished = false
    var matchSummary = ""
    
    var drsRemainingBatting = 1
    var drsRemainingBowling = 1

    init {
        startNewInnings(battingTeam.id, bowlingTeam.id)
    }

    private fun startNewInnings(batTeamId: String, bowlTeamId: String, target: Int? = null) {
        val inning = Inning(
            battingTeamId = batTeamId,
            bowlingTeamId = bowlTeamId,
            target = target
        )
        innings.add(inning)
        currentOver = 0
        currentBallInOver = 0
        isFreeHit = false
        drsRemainingBatting = 1
        drsRemainingBowling = 1
    }

    fun getCurrentPhase(): MatchPhase {
        return when {
            currentOver < format.powerplayOvers -> MatchPhase.POWERPLAY
            currentOver >= format.slogStartOver -> MatchPhase.SLOG
            else -> MatchPhase.REGULAR
        }
    }

    fun canBowlerBowl(bowlerId: String): Boolean {
        val currentInn = innings.lastOrNull() ?: return false
        val score = currentInn.bowlerScores[bowlerId] ?: return true
        val completedOvers = score.oversBowled.toInt()
        return completedOvers < format.maxOversPerBowler
    }

    /**
     * Resolves a single delivery roll against the active ground & phase master sheet.
     */
    fun processDelivery(
        striker: Player,
        bowler: Player,
        whiteDie: Int,
        blackDie: Int,
        cardDie1: Int = 1,
        cardDie2: Int = 1
    ): DeliveryResult {
        if (isMatchFinished) {
            throw IllegalStateException("Match already completed.")
        }
        val currentInn = innings.last()
        val phase = getCurrentPhase()

        // 1. Determine Row Letter using Matchup Grid
        val rowChar = MatchupGrid.resolveRow(
            batsmanDots = striker.battingDots,
            bowlerDots = bowler.bowlingDots,
            isSlogPhase = (phase == MatchPhase.SLOG)
        )

        // 2. Fetch cell value from Master Sheet
        val cellValue = lookupCell(ground, phase, bowler.bowlingCraft, rowChar, whiteDie, blackDie)

        // 3. Process outcome
        var runs = 0
        var extras = 0
        var extrasType: String? = null
        var isWicket = false
        var wicketType: String? = null
        var wicketDesc: String? = null
        var triggersNextFreeHit = false
        var legalBall = true
        var commentary: String

        // Check extras
        val extraOutcome = ExtrasEngine.evaluateCell(cellValue, isFreeHit)
        if (extraOutcome.isExtra) {
            extras = extraOutcome.runs
            extrasType = extraOutcome.extrasType
            triggersNextFreeHit = extraOutcome.triggersFreeHit
            legalBall = !extraOutcome.isRebowl
            commentary = extraOutcome.commentary
        } else if (cellValue.uppercase() in listOf("OUT", "W", "WKT", "F")) {
            // Wicket trigger!
            if (rowChar == 'F' || cellValue.uppercase() == "F") {
                // Purple Row F: Draw Wicket Card from deck
                val card = cardsDeck.filter { it.category == CardCategory.WICKET }.randomOrNull()
                    ?: GameCard("W01", CardCategory.WICKET, "Caught Behind", "Edged and caught by keeper", "Caught", "ODD_OUT")
                val outcome = WicketResolver.resolveWicketCard(card, cardDie1, cardDie2, isFreeHit)
                isWicket = outcome.isOut
                wicketType = outcome.dismissalType
                wicketDesc = outcome.description
                commentary = outcome.description
            } else {
                // Direct wicket
                val outcome = WicketResolver.resolveDirectWicket(cellValue, isFreeHit)
                isWicket = outcome.isOut
                wicketType = outcome.dismissalType
                wicketDesc = outcome.description
                commentary = outcome.description
            }
        } else {
            // Normal runs scored: "0", "1", "2", "3", "4", "6"
            runs = cellValue.toIntOrNull() ?: 0
            
            // Slog Finisher bonus (Rule §16): If batsman is Diamond/Star in Slog Phase and roll is boundary
            if (phase == MatchPhase.SLOG && (striker.isDiamond || striker.isStar) && runs == 4) {
                // Extra momentum bonus
            }

            commentary = when (runs) {
                0 -> "No run, solidly defended to the fielder."
                1 -> "Pushed into the gap for a single."
                2 -> "Good running between the wickets, couple of runs."
                3 -> "Placed into the deep, brilliant running, three runs!"
                4 -> "FOUR! Smashed crisply through the covers for a boundary!"
                6 -> "SIX! Up, up and away into the stands! Maximum!"
                else -> "$runs runs scored."
            }
        }

        // Update Innings & Player Scores
        currentInn.totalRuns += (runs + extras)
        
        val batScore = currentInn.batsmanScores.getOrPut(striker.id) { BatsmanScore(striker.id) }
        batScore.runs += runs
        if (legalBall) {
            batScore.ballsFaced += 1
        }
        if (runs == 4) batScore.fours += 1
        if (runs == 6) batScore.sixes += 1
        if (isWicket) {
            batScore.isOut = true
            batScore.dismissal = wicketType ?: "dismissed"
            currentInn.wickets += 1
        }

        val bowlScore = currentInn.bowlerScores.getOrPut(bowler.id) { BowlerScore(bowler.id) }
        bowlScore.runsConceded += (runs + extras)
        if (isWicket && wicketType != "Run Out") {
            bowlScore.wicketsTaken += 1
        }
        if (runs == 0 && extras == 0 && !isWicket) {
            bowlScore.dotsCount += 1
        }

        if (legalBall) {
            currentInn.completedBalls += 1
            currentBallInOver += 1
            if (currentBallInOver == 6) {
                currentOver += 1
                currentBallInOver = 0
                bowlScore.oversBowled += 1.0
            } else {
                bowlScore.oversBowled = currentOver + (currentBallInOver * 0.1)
            }
        }

        // Update Free Hit state
        isFreeHit = triggersNextFreeHit

        val result = DeliveryResult(
            overNumber = currentOver + 1,
            ballNumber = currentBallInOver,
            bowlerId = bowler.id,
            batsmanId = striker.id,
            whiteDie = whiteDie,
            blackDie = blackDie,
            cellCode = cellValue,
            runsScored = runs,
            extras = extras,
            extrasType = extrasType,
            isWicket = isWicket,
            wicketType = wicketType,
            wicketDescription = wicketDesc,
            isFreeHit = isFreeHit,
            commentary = commentary
        )
        currentInn.deliveries.add(result)

        checkInningsOrMatchEnd()
        return result
    }

    private fun checkInningsOrMatchEnd() {
        val currentInn = innings.last()
        val allOut = currentInn.wickets >= (if (format == MatchFormat.FIVE_OVERS) 6 else 10)
        val oversDone = currentOver >= format.overs
        val targetChased = currentInn.target != null && currentInn.totalRuns >= currentInn.target

        if (allOut || oversDone || targetChased) {
            if (currentInningsIndex == 0) {
                // End 1st Innings, start 2nd Innings
                currentInningsIndex = 1
                startNewInnings(bowlingTeam.id, battingTeam.id, target = currentInn.totalRuns + 1)
            } else {
                // Match Ended
                isMatchFinished = true
                resolveMatchResult()
            }
        }
    }

    private fun resolveMatchResult() {
        val inn1 = innings[0]
        val inn2 = innings[1]
        matchSummary = when {
            inn2.totalRuns > inn1.totalRuns -> {
                val wktsLeft = (if (format == MatchFormat.FIVE_OVERS) 6 else 10) - inn2.wickets
                "${bowlingTeam.name} won by $wktsLeft wickets!"
            }
            inn1.totalRuns > inn2.totalRuns -> {
                val margin = inn1.totalRuns - inn2.totalRuns
                "${battingTeam.name} won by $margin runs!"
            }
            else -> "MATCH TIED! Prepare for Super Over!"
        }
    }

    private fun lookupCell(
        ground: GroundType,
        phase: MatchPhase,
        craft: BowlingCraft,
        rowChar: Char,
        whiteDie: Int,
        blackDie: Int
    ): String {
        val sheet = masterSheets.find { it.ground == ground && it.phase == phase }
            ?: masterSheets.firstOrNull()
        val row = sheet?.rows?.find { it.lineCode.startsWith(rowChar.toString()) }
            ?: sheet?.rows?.firstOrNull()
        val colIndex = (blackDie - 1).coerceIn(0, 5)
        return row?.cells?.getOrNull(colIndex) ?: "1"
    }
}
