package com.faizdicegames.dicecricketking.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.faizdicegames.dicecricketking.ui.theme.*

@Composable
fun HomeScreen(
    onStartQuickMatch: () -> Unit,
    onOpenTournaments: () -> Unit,
    onOpenDpl: () -> Unit,
    onOpenSheets: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(PitchBackground)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "DICE CRICKET KING",
                        style = MaterialTheme.typography.headlineMedium.copy(
                            color = PitchPrimary,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 1.sp
                        )
                    )
                    Text(
                        text = "Faiz Dice Games · Official Digital Edition",
                        style = MaterialTheme.typography.bodyMedium.copy(color = PitchTextSecondary)
                    )
                }
            }
        }

        item {
            // Quick Play Hero Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = PitchSurface)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "NEW MATCH",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Bold,
                            color = PitchTextPrimary
                        )
                    )
                    Text(
                        text = "Select 5 or 10 overs, pick pitch conditions (HSG, NSG, LSG), and toss the coin to start playing.",
                        style = MaterialTheme.typography.bodyMedium.copy(color = PitchTextSecondary)
                    )
                    Button(
                        onClick = onStartQuickMatch,
                        colors = ButtonDefaults.buttonColors(containerColor = PitchPrimary),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "START QUICK MATCH",
                            style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold)
                        )
                    }
                }
            }
        }

        item {
            // Modes Grid
            Text(
                text = "GAME MODES",
                style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold)
            )
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Card(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = PitchSurfaceVariant),
                    onClick = onOpenTournaments
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(text = "🏆 Tournament", fontWeight = FontWeight.Bold, color = PitchTextPrimary)
                        Text(text = "10 Teams · 23 Fixtures", fontSize = 12.sp, color = PitchTextSecondary)
                    }
                }

                Card(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = PitchSurfaceVariant),
                    onClick = onOpenDpl
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(text = "⚡ DPL Auction", fontWeight = FontWeight.Bold, color = PitchTextPrimary)
                        Text(text = "50,000 Points Purse", fontSize = 12.sp, color = PitchTextSecondary)
                    }
                }
            }
        }

        item {
            // Master Sheets & Reference
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = PitchSurfaceVariant),
                onClick = onOpenSheets
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(text = "🎲 Master Sheets & 87 Cards", fontWeight = FontWeight.Bold, color = PitchTextPrimary)
                        Text(text = "Browse all 12 sheets and full physical deck", fontSize = 12.sp, color = PitchTextSecondary)
                    }
                    Text(text = "VIEW", color = PitchPrimary, fontWeight = FontWeight.Bold)
                }
            }
        }

        item {
            // Footer & Copyright
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "© 2026 Tanweer Ahmad · Faiz Dice Games. All rights reserved.",
                style = MaterialTheme.typography.bodyMedium.copy(fontSize = 11.sp, color = PitchTextSecondary)
            )
        }
    }
}
