# Dice Cricket King · Stitch Design Mapping (All 40 Screens)

This document maps all 40 Stitch UI designs to their corresponding application features, data bindings, and screen states.

| # | Stitch Screen Folder | Application Screen / Component | Functional State / Bindings |
|---|---|---|---|
| 1 | `home_dice_cricket_king_pitch_pulse` | Home Screen | Hero section, Quick Play (5ov / 10ov), Ground chips (HSG/NSG/LSG), Resume Live Match card, Recent Matches, Vault & Tools tiles |
| 2 | `new_match_setup_toss_pitch_pulse` | Match Setup (10 Overs) | Overs selection, Ground selection, Team A & B pick with snapshot form stars, Batting order, Captain, Toss coin animation & decision |
| 3 | `5_over_match_setup_dld_vs_aus` | Match Setup (5 Overs / 7s) | 7-a-side roster validation, Star Dominance unlock indicator, Suggested 7 lineup initialization |
| 4 | `head_to_head_11_playing_11_squad_comparison_ind_vs_aus` | Squad Head-to-Head & XI Selection | Comparison of Playing XI players with role badges, markers C, F, O, ★, D, and skill dot badges |
| 5 | `grand_final_preview_toss_ind_vs_aus` | Grand Final / Match Preview & Toss | Pre-match team comparison, Star Dominance summary banner, Toss coin flip result reveal |
| 6 | `live_scoring_arena_ind_vs_pak_pitch_pulse` | Live Scoring Arena (Split Layout) | Side-by-side bowling and batting blocks, dice rolling controls, current bowler/batter cards, over ball progression chips |
| 7 | `live_scoring_arena_pitch_view_pitch_pulse` | Live Scoring Arena (Pitch View) | Top 2D stadium pitch graphic, batsman crease card, bowler end card, centered delivery outcome |
| 8 | `ball_1.5_imran_to_declan_live_scoring_arena` | Live Scoring (Mid-Over State) | Ball 1.5 state: target, required run rate, CRR, over chips (Sgl, DRS, ★, POW, W), strike rotation status line |
| 9 | `ball_2.1_imran_to_malcolm_live_scoring_arena` | Live Scoring (New Over State) | Over 2 Ball 1 state: updated bowler figures, striker readiness indicator |
| 10 | `over_1_complete_australia_16_2_aus_vs_dld` | Over Summary Card | End-of-over transition card (~0.75s after 6th delivery), runs in over, wickets, "Start Next Over" trigger |
| 11 | `over_2_choose_bowler_tactical_matchup_modal` | Choose Bowler Tactical Modal | Quota check (max 2 overs), consecutive over lock, matchup preview (bowling & batting lines for striker and non-striker) |
| 12 | `wicket_new_batsman_walking_in_section_19.7` | Wicket & New Batsman Confirmation | Dismissal display, ~1s delayed new batsman card, Finisher selection prompt if in Slog, confirmation unlock |
| 13 | `boundary_animation_four_six_pitch_view` | Pitch View Boundary Animations | 12-zone randomized boundary trajectories with jitter, FOUR grass trail and SIX high arc glow |
| 14 | `four_rope_bounce_animation_pitch_view_ball_1.3` | FOUR Rope Bounce Detail | Ball contacts boundary cushion, bounces back slightly, glowing boundary ring effect |
| 15 | `out_animation_drs_1_die_review_modal_pitch_pulse` | OUT Animation & DRS Trigger | Stump shake animation, RED OUT banner, batting captain "Review with DRS" trigger button |
| 16 | `ball_2.2_drs_1_die_review_appeal_aus_vs_dld` | DRS 1-Die Review Appeal Modal | 1-die roll interactive modal (5–6 = Not Out / Dot Ball; 1–4 = Decision Upheld / Out) |
| 17 | `ball_2.2_decision_overturned_haden_not_out_aus_vs_dld` | DRS Decision Overturned | Green NOT OUT result, ball converted to dot ball, striker reinstated |
| 18 | `wonderful_shot_power_card_australia_aus_vs_dld` | Wonderful Shot Activation | Batting captain on strike, 36-cell boundary matrix (30/36 boundaries 4 or 6, no wicket), rolls the card grid |
| 19 | `great_delivery_bowling_power_card` | Great Delivery Activation | Bowling captain bowling, 36-cell wicket delivery matrix (22/36 wickets, X D B +) |
| 20 | `free_hit_extras_engine_aus_vs_dld` | Free Hit & Extras Engine | No-Ball penalty, Free Hit activated banner, 16-card runs card matrix, dismissal exemption rules |
| 21 | `ball_by_ball_commentary_hindi_feed_aus_vs_dld` | Ball-by-Ball Feed & Hindi Audio | Complete commentary timeline, filtering (All, Boundaries, Wickets, DRS, Power Cards), English/Hindi toggle & TTS |
| 22 | `match_scorecard_pitch_pulse` | Match Scorecard Tab | Innings 1 & 2 batting scorecards, bowling figures, extras breakdown, Fall of Wickets (FOW) timeline |
| 23 | `match_scorecard_summary_ind_vs_pak` | Match Summary Tab | Match result banner, player of the match, inning milestones, phase run summaries |
| 24 | `match_summary_worm_chart_ind_vs_pak` | Match Worm / Run Rate Chart | Comparative cumulative score line chart and comparative over-by-over run rate bars |
| 25 | `12_master_sheets_viewer_pitch_pulse` | Master Sheets Browser | Complete 12-sheet interactive viewer (3 grounds × 4 sheets), purple row F, "Roll This Sheet" test utility |
| 26 | `87_cards_deck_inspection_dice_cricket_king` | 87 Cards Deck Inspector | Tabbed browser for Wicket (25), Runs (16), Fielding (20), Skills (20), Power (6) cards with card details |
| 27 | `teams_players_database_pitch_pulset` | Teams & Players Database | 10 international teams, squad rosters, player attributes, skill dots, Star thresholds, Form Stars table |
| 28 | `stats_official_rankings_pitch_pulse` | Stats & Official ICC-Style Rankings | Top 10 Batsmen, Bowlers, All-rounders, Teams; format & ground filters; MVP points |
| 29 | `tournaments_matches_hub_pitch_pulse` | Tournaments & Matches Hub | Active tournament dashboard, Quick Play history, ongoing match resume cards |
| 30 | `tournament_fixtures_schedule_world_cup_2026` | Tournament Schedule View | 23-fixture schedule (Group stage, Semi-finals, Final) with match timings, assigned grounds, status badges |
| 31 | `tournament_fixtures_results_world_cup_2026` | Tournament Fixtures & Results | Chronological tournament match cards, completed scorelines, upcoming fixtures |
| 32 | `tournament_group_draw_by_slips` | Group Draw Ceremony (In Progress) | Animated "Crystal Chamber" bowl, slip reveal, Group A / Group B assignment (progress counter 7/10) |
| 33 | `tournament_groups_complete_draw_concluded` | Group Draw Concluded | Concluded 2 groups of 5 with Star Sync Balance check, "Proceed to Tournament" trigger |
| 34 | `tournament_points_table_cap_standings_world_cup_2026` | Points Table & Standings | Group A and B tables: Played, Won, Lost, Pts, NRR, qualification cutoff line, knockout brackets |
| 35 | `tournament_points_table_caps_orange_purple` | Caps & Awards Dashboard | Orange Cap (Top Run Scorer), Purple Cap (Top Wicket Taker), Tournament MVP |
| 36 | `dpl_auction_franchise_hub_pitch_pulse` | DPL Franchise Hub & Auction Arena | 50,000 points purse, live lot bidding, squad needs radar, retention management, role balance checks |
| 37 | `custom_team_player_builder_section_23` | Add Custom Team Screen | Team name, 3-letter code, star rating (3/4/5), color picker (14 presets), emblem/crest selection |
| 38 | `add_player_granular_form_section_23` | Add Player Granular Form | Player name, role, hand, bowling style, fielding/keeping skill dots, star runs, special role flags |
| 39 | `roster_7_20_custom_team_builder` | Custom Squad Roster Builder | 7 to 20 player squad roster list, squad composition validation, captain assignment |
| 40 | `print_ready_rule_book_hub` | Print-Ready Hub & Rule Book | In-app 11-page Rule Book reader, source PDF download & share options (A4, print-shop CMYK) |
