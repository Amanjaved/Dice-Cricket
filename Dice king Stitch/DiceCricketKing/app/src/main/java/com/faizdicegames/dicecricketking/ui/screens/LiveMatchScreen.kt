package com.faizdicegames.dicecricketking.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.faizdicegames.dicecricketking.engine.DiceCricketEngine
import com.faizdicegames.dicecricketking.model.DeliveryResult
import com.faizdicegames.dicecricketking.ui.theme.*
import kotlin.random.Random

@Composable
fun LiveMatchScreen(
    engine: DiceCricketEngine,
    onMatchFinish: () -> Unit
) {
    var whiteDie by remember { mutableStateOf(4) }
    var blackDie by remember { mutableStateOf(2) }
    var lastDelivery by remember { mutableStateOf<DeliveryResult?>(null) }
    var isRolling by remember { mutableStateOf(false) }

    val currentInn = engine.innings.lastOrNull()
    val battingTeam = if (engine.currentInningsIndex == 0) engine.battingTeam else engine.bowlingTeam
    val bowlingTeam = if (engine.currentInningsIndex == 0) engine.bowlingTeam else engine.battingTeam

    val striker = battingTeam.players.firstOrNull() ?: return
    val bowler = bowlingTeam.players.lastOrNull() ?: return

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(PitchBackground)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Scoreboard Header Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = PitchSurface)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = battingTeam.name.uppercase(),
                            style = MaterialTheme.typography.titleLarge.copy(
                                fontWeight = FontWeight.Black,
                                color = PitchPrimary
                            )
                        )
                        Text(
                            text = "Phase: ${engine.getCurrentPhase()} · ${engine.ground.displayName}",
                            fontSize = 12.sp,
                            color = PitchTextSecondary
                        )
                    }

                    // Score Big display
                    Row(verticalAlignment = Alignment.Bottom) {
                        Text(
                            text = "${currentInn?.totalRuns ?: 0}",
                            style = MaterialTheme.typography.headlineLarge.copy(
                                fontWeight = FontWeight.Black,
                                fontSize = 36.sp,
                                color = PitchTextPrimary
                            )
                        )
                        Text(
                            text = " / ${currentInn?.wickets ?: 0}",
                            style = MaterialTheme.typography.headlineMedium.copy(
                                color = AccentWicket,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Overs: ${engine.currentOver}.${engine.currentBallInOver} / ${engine.format.overs}.0",
                        fontWeight = FontWeight.SemiBold,
                        color = PitchTextPrimary
                    )
                    if (currentInn?.target != null) {
                        Text(
                            text = "Target: ${currentInn.target} (Need ${currentInn.target - currentInn.totalRuns} runs)",
                            color = PitchPrimaryDim,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        // Active Matchup Strip (Batsman vs Bowler)
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = PitchSurfaceVariant)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(text = "STRIKER", fontSize = 10.sp, color = PitchTextSecondary, fontWeight = FontWeight.Bold)
                    Text(text = striker.name, fontWeight = FontWeight.Bold, color = PitchTextPrimary)
                    Text(text = "Skill: ${"●".repeat(striker.battingDots)}${"○".repeat(5 - striker.battingDots)}", fontSize = 11.sp, color = PitchPrimary)
                }
                Text(text = "VS", fontWeight = FontWeight.Black, color = PitchTextSecondary)
                Column(horizontalAlignment = Alignment.End) {
                    Text(text = "BOWLER", fontSize = 10.sp, color = PitchTextSecondary, fontWeight = FontWeight.Bold)
                    Text(text = bowler.name, fontWeight = FontWeight.Bold, color = PitchTextPrimary)
                    Text(text = "Craft: ${bowler.bowlingCraft} (${bowler.bowlingDots} dots)", fontSize = 11.sp, color = PitchTextSecondary)
                }
            }
        }

        // Dice Roll Area
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = PitchSurface)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(24.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // White Die
                    Box(
                        modifier = Modifier
                            .size(64.dp)
                            .background(Color.White, RoundedCornerShape(12.dp))
                            .border(2.dp, Color(0xFFCBD5E1), RoundedCornerShape(12.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "$whiteDie",
                            fontSize = 32.sp,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFF0F172A)
                        )
                    }

                    // Black Die
                    Box(
                        modifier = Modifier
                            .size(64.dp)
                            .background(Color(0xFF1E293B), RoundedCornerShape(12.dp))
                            .border(2.dp, PitchPrimary, RoundedCornerShape(12.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "$blackDie",
                            fontSize = 32.sp,
                            fontWeight = FontWeight.Black,
                            color = PitchPrimary
                        )
                    }
                }

                Button(
                    onClick = {
                        val w = Random.nextInt(1, 7)
                        val b = Random.nextInt(1, 7)
                        whiteDie = w
                        blackDie = b
                        val result = engine.processDelivery(
                            striker = striker,
                            bowler = bowler,
                            whiteDie = w,
                            blackDie = b,
                            cardDie1 = Random.nextInt(1, 7),
                            cardDie2 = Random.nextInt(1, 7)
                        )
                        lastDelivery = result
                        if (engine.isMatchFinished) {
                            onMatchFinish()
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PitchPrimary),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "ROLL DICE & BOWL",
                        style = MaterialTheme.typography.labelLarge.copy(
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp
                        )
                    )
                }

                // Commentary Callout
                if (lastDelivery != null) {
                    Text(
                        text = lastDelivery!!.commentary,
                        style = MaterialTheme.typography.bodyMedium.copy(
                            fontWeight = FontWeight.Medium,
                            color = if (lastDelivery!!.isWicket) AccentWicket else PitchPrimaryDim
                        )
                    )
                }
            }
        }
    }
}
