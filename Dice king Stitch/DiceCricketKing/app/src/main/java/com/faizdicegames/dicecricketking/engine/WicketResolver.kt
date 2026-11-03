package com.faizdicegames.dicecricketking.engine

import com.faizdicegames.dicecricketking.model.GameCard

/**
 * Wicket Resolver for Dice Cricket King (Rules §9, §10, §11, §14 & Rule Book pp. 8-10).
 * Handles:
 * - Direct sheet wickets ("OUT", "WKT")
 * - Purple Row F Wicket Card draws (25 cards deck)
 * - 1-Die resolution (Odd = Out, Even = Saved / Not Out)
 * - 2-Dice resolution (Card specific target sums or doubles)
 * - Free Hit protection (Bowled, LBW, Caught are not out on Free Hit; Run Out is allowed)
 * - DRS (Decision Review System): 1 review per team per innings, 1-die roll (1-3 Uphold, 4-6 Overturn)
 */
object WicketResolver {

    data class WicketOutcome(
        val isOut: Boolean,
        val dismissalType: String,
        val description: String,
        val drsAvailable: Boolean
    )

    fun resolveDirectWicket(cellCode: String, isFreeHit: Boolean): WicketOutcome {
        if (isFreeHit) {
            return WicketOutcome(
                isOut = false,
                dismissalType = "NOT_OUT",
                description = "Ball struck wicket/pads but Batsman is protected by FREE HIT!",
                drsAvailable = false
            )
        }
        val type = when (cellCode.trim().uppercase()) {
            "BWD" -> "Bowled"
            "LBW" -> "LBW"
            "CT" -> "Caught"
            "RO" -> "Run Out"
            "ST" -> "Stumped"
            else -> "Dismissed"
        }
        return WicketOutcome(
            isOut = true,
            dismissalType = type,
            description = "OUT! $type as determined by the master sheet.",
            drsAvailable = true
        )
    }

    /**
     * Resolves Purple Row F Wicket Card
     */
    fun resolveWicketCard(
        card: GameCard,
        resolutionDie1: Int,
        resolutionDie2: Int? = null,
        isFreeHit: Boolean = false
    ): WicketOutcome {
        val dismissal = card.outcomeType ?: card.name
        
        // Free hit check: only Run Out can happen on Free Hit
        if (isFreeHit && dismissal.uppercase() != "RUN OUT" && !card.name.contains("Run Out", ignoreCase = true)) {
            return WicketOutcome(
                isOut = false,
                dismissalType = "NOT_OUT",
                description = "${card.name} triggered, but Batsman protected by FREE HIT!",
                drsAvailable = false
            )
        }

        // Rule: 1-Die Resolution: Odd = OUT, Even = NOT OUT
        // Or specific dice requirements in card description
        val isOut = when (card.diceResolution) {
            "ODD_OUT" -> (resolutionDie1 % 2 != 0)
            "EVEN_OUT" -> (resolutionDie1 % 2 == 0)
            "HIGH_OUT" -> (resolutionDie1 >= 4)
            "LOW_OUT" -> (resolutionDie1 <= 3)
            "SUM_7_OR_11" -> {
                val sum = resolutionDie1 + (resolutionDie2 ?: 0)
                sum == 7 || sum == 11
            }
            "DOUBLES" -> resolutionDie1 == (resolutionDie2 ?: 0)
            else -> {
                // Default rule §10: 1-die test: 1, 3, 5 = Out; 2, 4, 6 = Saved
                (resolutionDie1 % 2 != 0)
            }
        }

        return if (isOut) {
            WicketOutcome(
                isOut = true,
                dismissalType = dismissal,
                description = "WICKET! Card '${card.name}' resolved as OUT (Rolled: $resolutionDie1).",
                drsAvailable = true
            )
        } else {
            WicketOutcome(
                isOut = false,
                dismissalType = "NOT_OUT",
                description = "SURVIVED! Card '${card.name}' resolved as NOT OUT (Rolled: $resolutionDie1).",
                drsAvailable = false
            )
        }
    }

    /**
     * DRS Appeal Resolution (Rule §14):
     * 1-die roll: 4, 5, 6 = Decision Overturned (NOT OUT); 1, 2, 3 = Umpire's Call / OUT stands.
     */
    fun resolveDrsAppeal(reviewDie: Int): Boolean {
        // Returns true if overturned (NOT OUT)
        return reviewDie >= 4
    }
}
