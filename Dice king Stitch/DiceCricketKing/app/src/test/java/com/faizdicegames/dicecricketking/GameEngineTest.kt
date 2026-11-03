package com.faizdicegames.dicecricketking

import com.faizdicegames.dicecricketking.engine.ExtrasEngine
import com.faizdicegames.dicecricketking.engine.MatchupGrid
import com.faizdicegames.dicecricketking.engine.WicketResolver
import org.junit.Assert.*
import org.junit.Test

class GameEngineTest {

    @Test
    fun testMatchupGridDifferential() {
        // diff >= 3 -> A
        assertEquals('A', MatchupGrid.resolveRow(5, 1))
        assertEquals('A', MatchupGrid.resolveRow(4, 1))
        
        // diff == 2 -> B
        assertEquals('B', MatchupGrid.resolveRow(4, 2))
        
        // diff == 1 -> C
        assertEquals('C', MatchupGrid.resolveRow(3, 2))
        
        // diff == 0 -> D
        assertEquals('D', MatchupGrid.resolveRow(2, 2))
        
        // diff == -1 -> E
        assertEquals('E', MatchupGrid.resolveRow(1, 2))
        
        // diff <= -2 -> F (Purple row)
        assertEquals('F', MatchupGrid.resolveRow(1, 4))
        assertEquals('F', MatchupGrid.resolveRow(0, 3))
    }

    @Test
    fun testExtrasEvaluation() {
        val wide = ExtrasEngine.evaluateCell("W", false)
        assertTrue(wide.isExtra)
        assertEquals(1, wide.runs)
        assertTrue(wide.isRebowl)
        assertEquals("WIDE", wide.extrasType)

        val noBall = ExtrasEngine.evaluateCell("NB", false)
        assertTrue(noBall.isExtra)
        assertEquals(1, noBall.runs)
        assertTrue(noBall.isRebowl)
        assertTrue(noBall.triggersFreeHit)
        assertEquals("NO_BALL", noBall.extrasType)

        val bye = ExtrasEngine.evaluateCell("1B", false)
        assertTrue(bye.isExtra)
        assertEquals(1, bye.runs)
        assertFalse(bye.isRebowl)
        assertEquals("BYE", bye.extrasType)
    }

    @Test
    fun testDoubleSixPenalty() {
        assertTrue(ExtrasEngine.checkDoubleSixPenalty(6, 6))
        assertFalse(ExtrasEngine.checkDoubleSixPenalty(6, 5))
        assertFalse(ExtrasEngine.checkDoubleSixPenalty(1, 6))
    }

    @Test
    fun testDrsAppealResolution() {
        // 4, 5, 6 overturns
        assertTrue(WicketResolver.resolveDrsAppeal(4))
        assertTrue(WicketResolver.resolveDrsAppeal(5))
        assertTrue(WicketResolver.resolveDrsAppeal(6))

        // 1, 2, 3 upholds
        assertFalse(WicketResolver.resolveDrsAppeal(1))
        assertFalse(WicketResolver.resolveDrsAppeal(2))
        assertFalse(WicketResolver.resolveDrsAppeal(3))
    }
}
