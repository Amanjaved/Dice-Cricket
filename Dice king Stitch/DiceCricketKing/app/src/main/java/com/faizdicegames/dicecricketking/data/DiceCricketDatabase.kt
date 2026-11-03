package com.faizdicegames.dicecricketking.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters

@Database(
    entities = [MatchEntity::class, TeamEntity::class, TournamentEntity::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class DiceCricketDatabase : RoomDatabase() {
    abstract fun matchDao(): MatchDao
    abstract fun teamDao(): TeamDao
    abstract fun tournamentDao(): TournamentDao

    companion object {
        @Volatile
        private var INSTANCE: DiceCricketDatabase? = null

        fun getDatabase(context: Context): DiceCricketDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    DiceCricketDatabase::class.java,
                    "dice_cricket_king.db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
