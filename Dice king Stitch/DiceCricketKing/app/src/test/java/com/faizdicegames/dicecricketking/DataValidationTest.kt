package com.faizdicegames.dicecricketking

import org.junit.Assert.*
import org.junit.Test

class DataValidationTest {

    @Test
    fun testGroundDefinitions() {
        assertEquals("HSG", com.faizdicegames.dicecricketking.model.GroundType.HSG.code)
        assertEquals("NSG", com.faizdicegames.dicecricketking.model.GroundType.NSG.code)
        assertEquals("LSG", com.faizdicegames.dicecricketking.model.GroundType.LSG.code)
        
        assertEquals(104, com.faizdicegames.dicecricketking.model.GroundType.HSG.avgRuns5Ov)
        assertEquals(89, com.faizdicegames.dicecricketking.model.GroundType.NSG.avgRuns5Ov)
        assertEquals(64, com.faizdicegames.dicecricketking.model.GroundType.LSG.avgRuns5Ov)
    }

    @Test
    fun testMatchFormats() {
        assertEquals(5, com.faizdicegames.dicecricketking.model.MatchFormat.FIVE_OVERS.overs)
        assertEquals(1, com.faizdicegames.dicecricketking.model.MatchFormat.FIVE_OVERS.maxOversPerBowler)
        assertEquals(1, com.faizdicegames.dicecricketking.model.MatchFormat.FIVE_OVERS.powerplayOvers)
        
        assertEquals(10, com.faizdicegames.dicecricketking.model.MatchFormat.TEN_OVERS.overs)
        assertEquals(2, com.faizdicegames.dicecricketking.model.MatchFormat.TEN_OVERS.maxOversPerBowler)
        assertEquals(2, com.faizdicegames.dicecricketking.model.MatchFormat.TEN_OVERS.powerplayOvers)
    }
}
