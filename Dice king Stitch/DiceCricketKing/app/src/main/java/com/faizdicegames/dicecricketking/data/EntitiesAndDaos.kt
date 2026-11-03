package com.faizdicegames.dicecricketking.data

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "matches")
data class MatchEntity(
    @PrimaryKey val id: String,
    val format: String, // "5_OVERS" or "10_OVERS"
    val ground: String, // "HSG", "NSG", "LSG"
    val teamAId: String,
    val teamBId: String,
    val teamAName: String,
    val teamBName: String,
    val teamAScore: Int,
    val teamAWickets: Int,
    val teamAOvers: Double,
    val teamBScore: Int,
    val teamBWickets: Int,
    val teamBOvers: Double,
    val resultText: String,
    val timestamp: Long = System.currentTimeMillis()
)

@Dao
interface MatchDao {
    @Query("SELECT * FROM matches ORDER BY timestamp DESC")
    fun getAllMatches(): Flow<List<MatchEntity>>

    @Query("SELECT * FROM matches WHERE id = :id LIMIT 1")
    suspend fun getMatchById(id: String): MatchEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMatch(match: MatchEntity)

    @Delete
    suspend fun deleteMatch(match: MatchEntity)
}

@Entity(tableName = "teams")
data class TeamEntity(
    @PrimaryKey val id: String,
    val name: String,
    val shortName: String,
    val primaryColor: String,
    val secondaryColor: String,
    val isCustom: Boolean = false
)

@Dao
interface TeamDao {
    @Query("SELECT * FROM teams")
    fun getAllTeams(): Flow<List<TeamEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTeam(team: TeamEntity)
}

@Entity(tableName = "tournaments")
data class TournamentEntity(
    @PrimaryKey val id: String,
    val name: String,
    val format: String,
    val ground: String,
    val currentFixtureIndex: Int = 0,
    val isCompleted: Boolean = false,
    val pointsTableJson: String
)

@Dao
interface TournamentDao {
    @Query("SELECT * FROM tournaments")
    fun getAllTournaments(): Flow<List<TournamentEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTournament(tournament: TournamentEntity)
}
