package com.faizdicegames.dicecricketking.engine

/**
 * Extras Engine for Dice Cricket King (Rules §12, §15 & Master Sheets).
 * Handles:
 * - W (Wide): 1 extra run + re-bowl
 * - NB (No Ball): 1 extra run + re-bowl + Next ball FREE HIT
 * - B (Bye) / LB (Leg Bye): extras added to team total, not batsman
 * - Double Red 6 Penalty: 5 penalty runs to batting team
 */
object ExtrasEngine {

    data class ExtraOutcome(
        val isExtra: Boolean,
        val runs: Int,
        val isRebowl: Boolean,
        val triggersFreeHit: Boolean,
        val extrasType: String?,
        val commentary: String
    )

    fun evaluateCell(cellCode: String, isFreeHit: Boolean): ExtraOutcome {
        val clean = cellCode.trim().uppercase()
        return when {
            clean == "W" || clean.startsWith("WD") -> {
                ExtraOutcome(
                    isExtra = true,
                    runs = 1,
                    isRebowl = true,
                    triggersFreeHit = isFreeHit, // carries over if already free hit
                    extrasType = "WIDE",
                    commentary = "Wide ball! 1 extra run conceded, bowler must re-bowl."
                )
            }
            clean == "NB" || clean.startsWith("NO") -> {
                ExtraOutcome(
                    isExtra = true,
                    runs = 1,
                    isRebowl = true,
                    triggersFreeHit = true, // Free hit on next delivery!
                    extrasType = "NO_BALL",
                    commentary = "No Ball! 1 extra run, re-bowl with FREE HIT coming up!"
                )
            }
            clean == "LB" || clean == "1LB" -> {
                ExtraOutcome(
                    isExtra = true,
                    runs = 1,
                    isRebowl = false,
                    triggersFreeHit = false,
                    extrasType = "LEG_BYE",
                    commentary = "1 leg bye off the pads."
                )
            }
            clean == "B" || clean == "1B" -> {
                ExtraOutcome(
                    isExtra = true,
                    runs = 1,
                    isRebowl = false,
                    triggersFreeHit = false,
                    extrasType = "BYE",
                    commentary = "1 bye taken by the batsmen."
                )
            }
            else -> {
                ExtraOutcome(
                    isExtra = false,
                    runs = 0,
                    isRebowl = false,
                    triggersFreeHit = false,
                    extrasType = null,
                    commentary = ""
                )
            }
        }
    }

    /**
     * Double Red 6 Penalty (Rules §15)
     */
    fun checkDoubleSixPenalty(redDie1: Int, redDie2: Int): Boolean {
        return redDie1 == 6 && redDie2 == 6
    }
}
