package com.faizdicegames.dicecricketking.data

import android.content.Context
import com.faizdicegames.dicecricketking.model.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json

class GameRepository(private val context: Context) {
    private val json = Json { ignoreUnknownKeys = true }
    private val db = DiceCricketDatabase.getDatabase(context)

    suspend fun loadTeams(): List<Team> = withContext(Dispatchers.IO) {
        val jsonString = context.assets.open("data/teams.json").bufferedReader().use { it.readText() }
        json.decodeFromString(jsonString)
    }

    suspend fun loadSheets(): List<MasterSheet> = withContext(Dispatchers.IO) {
        val jsonString = context.assets.open("data/sheets.json").bufferedReader().use { it.readText() }
        json.decodeFromString(jsonString)
    }

    suspend fun loadCards(): List<GameCard> = withContext(Dispatchers.IO) {
        val jsonString = context.assets.open("data/cards.json").bufferedReader().use { it.readText() }
        json.decodeFromString(jsonString)
    }

    suspend fun saveMatch(match: MatchEntity) = withContext(Dispatchers.IO) {
        db.matchDao().insertMatch(match)
    }

    fun getAllMatches() = db.matchDao().getAllMatches()
}
