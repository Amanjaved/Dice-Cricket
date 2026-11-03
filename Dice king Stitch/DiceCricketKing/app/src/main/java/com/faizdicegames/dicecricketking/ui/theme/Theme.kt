package com.faizdicegames.dicecricketking.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = PitchPrimary,
    onPrimary = PitchOnPrimary,
    primaryContainer = PitchPrimaryDim,
    background = PitchBackground,
    surface = PitchSurface,
    surfaceVariant = PitchSurfaceVariant,
    onBackground = PitchTextPrimary,
    onSurface = PitchTextPrimary,
    outline = PitchBorder
)

@Composable
fun DiceCricketKingTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}
