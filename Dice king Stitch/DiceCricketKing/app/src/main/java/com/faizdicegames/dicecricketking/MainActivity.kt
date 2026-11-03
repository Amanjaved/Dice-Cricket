package com.faizdicegames.dicecricketking

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.faizdicegames.dicecricketking.data.GameRepository
import com.faizdicegames.dicecricketking.engine.DiceCricketEngine
import com.faizdicegames.dicecricketking.model.*
import com.faizdicegames.dicecricketking.ui.screens.HomeScreen
import com.faizdicegames.dicecricketking.ui.screens.LiveMatchScreen
import com.faizdicegames.dicecricketking.ui.theme.DiceCricketKingTheme
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val repository = GameRepository(applicationContext)

        setContent {
            DiceCricketKingTheme {
                val navController = rememberNavController()
                val coroutineScope = rememberCoroutineScope()
                var teams by remember { mutableStateOf<List<Team>>(emptyList()) }
                var sheets by remember { mutableStateOf<List<MasterSheet>>(emptyList()) }
                var cards by remember { mutableStateOf<List<GameCard>>(emptyList()) }
                var activeEngine by remember { mutableStateOf<DiceCricketEngine?>(null) }

                LaunchedEffect(Unit) {
                    coroutineScope.launch {
                        teams = repository.loadTeams()
                        sheets = repository.loadSheets()
                        cards = repository.loadCards()
                    }
                }

                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    NavHost(navController = navController, startDestination = "home") {
                        composable("home") {
                            HomeScreen(
                                onStartQuickMatch = {
                                    if (teams.size >= 2) {
                                        val teamA = teams[0]
                                        val teamB = teams[1]
                                        activeEngine = DiceCricketEngine(
                                            format = MatchFormat.FIVE_OVERS,
                                            ground = GroundType.NSG,
                                            battingTeam = teamA,
                                            bowlingTeam = teamB,
                                            masterSheets = sheets,
                                            cardsDeck = cards
                                        )
                                        navController.navigate("live")
                                    }
                                },
                                onOpenTournaments = { /* Navigate to tournaments */ },
                                onOpenDpl = { /* Navigate to DPL auction */ },
                                onOpenSheets = { /* Navigate to sheets */ }
                            )
                        }

                        composable("live") {
                            activeEngine?.let { engine ->
                                LiveMatchScreen(
                                    engine = engine,
                                    onMatchFinish = {
                                        navController.navigate("home") {
                                            popUpTo("home") { inclusive = false }
                                        }
                                    }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
