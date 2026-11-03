package com.faizdicegames.dicecricketking

import com.faizdicegames.dicecricketking.model.GroundType
import org.junit.Assert.*
import org.junit.Test

class SimulationTest {

    @Test
    fun testExpectedAveragesWithinConfidenceIntervals() {
        // Test that expected published averages are correctly registered
        val hsg = GroundType.HSG
        val nsg = GroundType.NSG
        val lsg = GroundType.LSG

        assertEquals(104, hsg.avgRuns5Ov)
        assertEquals(203, hsg.avgRuns10Ov)

        assertEquals(89, nsg.avgRuns5Ov)
        assertEquals(164, nsg.avgRuns10Ov)

        assertEquals(64, lsg.avgRuns5Ov)
        assertEquals(113, lsg.avgRuns10Ov)

        // Monotonicity test: HSG > NSG > LSG
        assertTrue(hsg.avgRuns5Ov > nsg.avgRuns5Ov)
        assertTrue(nsg.avgRuns5Ov > lsg.avgRuns5Ov)
        assertTrue(hsg.avgRuns10Ov > nsg.avgRuns10Ov)
        assertTrue(nsg.avgRuns10Ov > lsg.avgRuns10Ov)
    }
}
