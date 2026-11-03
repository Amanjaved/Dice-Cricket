package com.faizdicegames.dicecricketking.engine

/**
 * Matchup Grid for Dice Cricket King (Rules §7 & Master Sheets).
 * Batsman Dots (0-5) vs Bowler Dots (0-5) determines Sheet Row (A-F).
 * Rows A-E: Standard batting/bowling encounters.
 * Row F: Wicket Card Trigger row (Purple Row F).
 */
object MatchupGrid {

    /**
     * Determines the active row (A through F) based on:
     * - Batting dots (0 to 5)
     * - Bowling dots (0 to 5)
     * - Bowling style (Fast vs Spin)
     */
    fun resolveRow(
        batsmanDots: Int,
        bowlerDots: Int,
        isSlogPhase: Boolean = false
    ): Char {
        val diff = batsmanDots - bowlerDots
        return when {
            diff >= 3 -> 'A'
            diff == 2 -> 'B'
            diff == 1 -> 'C'
            diff == 0 -> 'D'
            diff == -1 -> 'E'
            else -> 'F' // Bowler has large skill advantage -> purple wicket pressure row
        }
    }

    /**
     * Maps roll of 2 standard six-sided dice (white, black) to cell coordinate.
     * White die: Row sub-index or primary index (1..6)
     * Black die: Column index (1..6)
     */
    fun getCellCoordinate(whiteDie: Int, blackDie: Int): String {
        val col = ('A' + (blackDie - 1)).toString()
        return "$col$whiteDie"
    }
}
