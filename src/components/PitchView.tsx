// src/components/PitchView.tsx
import React, { useEffect, useState, useRef } from 'react';
import type { BatsmanInnings, BowlerFigures } from '../types';

interface PitchViewProps {
  striker: BatsmanInnings;
  nonStriker: BatsmanInnings;
  bowler: BowlerFigures;
  lastBallResult: string | null;
  lastBallType?: 'dot' | 'runs' | 'four' | 'six' | 'wicket' | 'extra';
  isAnimationsEnabled: boolean;
  onTriggerDrsReview?: () => void;
}

export const PitchView: React.FC<PitchViewProps> = ({
  striker,
  nonStriker,
  bowler,
  lastBallResult,
  lastBallType,
  isAnimationsEnabled,
  onTriggerDrsReview
}) => {
  // Current active animation state
  const [activeTelemetry, setActiveTelemetry] = useState<'six' | 'four' | 'wicket' | 'drs' | null>(null);
  const [speed] = useState<number>(142);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with ball result
  useEffect(() => {
    if (!lastBallResult || !isAnimationsEnabled) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    if (lastBallType === 'six') {
      setActiveTelemetry('six');
      timerRef.current = setTimeout(() => setActiveTelemetry(null), 3800);
    } else if (lastBallType === 'four') {
      setActiveTelemetry('four');
      timerRef.current = setTimeout(() => setActiveTelemetry(null), 3800);
    } else if (lastBallType === 'wicket') {
      setActiveTelemetry('wicket');
      timerRef.current = setTimeout(() => setActiveTelemetry(null), 4000);
    }
  }, [lastBallResult, lastBallType, isAnimationsEnabled]);

  const starTarget = striker.player.starRuns || 20;
  const starProgressPercent = Math.min(100, Math.round((striker.runs / starTarget) * 100));

  return (
    <section className="w-full relative rounded-3xl overflow-hidden bg-[#0b0f0b] shadow-2xl flex flex-col border border-[#2e3629] select-none">
      {/* Top Header Bar inside Arena Card: Telemetry Mode Selector Pills & Celebration HUD */}
      <div className="w-full p-3 bg-[#151914]/90 backdrop-blur-md flex flex-col gap-2 z-20 border-b border-[#232821]">
        <div className="flex items-center justify-between gap-2">
          {/* Telemetry Mode Selector Pills */}
          <div className="flex items-center gap-1 bg-[#191d18] p-1 rounded-full border border-[#2e342c] overflow-x-auto">
            <button
              onClick={() => setActiveTelemetry('six')}
              type="button"
              className={`px-3 py-1 rounded-full font-sans text-[11px] font-bold uppercase transition-all shrink-0 ${
                activeTelemetry === 'six'
                  ? 'bg-amber-400 text-[#0b0f0b] shadow-md'
                  : 'text-[#9ba394] hover:text-white'
              }`}
            >
              SIX (Lofted 98m)
            </button>
            <button
              onClick={() => setActiveTelemetry('four')}
              type="button"
              className={`px-3 py-1 rounded-full font-sans text-[11px] font-bold uppercase transition-all shrink-0 ${
                activeTelemetry === 'four'
                  ? 'bg-[#c3f400] text-[#0b0f0b] shadow-md'
                  : 'text-[#9ba394] hover:text-white'
              }`}
            >
              FOUR (Cover Drive)
            </button>
            <button
              onClick={() => setActiveTelemetry('wicket')}
              type="button"
              className={`px-3 py-1 rounded-full font-sans text-[11px] font-bold uppercase transition-all shrink-0 ${
                activeTelemetry === 'wicket'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'text-[#9ba394] hover:text-white'
              }`}
            >
              WICKET
            </button>
            <button
              onClick={() => {
                setActiveTelemetry('drs');
                if (onTriggerDrsReview) onTriggerDrsReview();
              }}
              type="button"
              data-testid="pitch-drs-safe-btn"
              className={`px-3 py-1 rounded-full font-sans text-[11px] font-bold uppercase transition-all shrink-0 border ${
                activeTelemetry === 'drs'
                  ? 'bg-[#c3f400] text-[#0b0f0b] border-[#c3f400] shadow-[0_0_12px_rgba(195,244,0,0.6)]'
                  : 'bg-[#c3f400]/15 text-[#c3f400] border-[#c3f400]/30 hover:bg-[#c3f400]/30'
              }`}
            >
              DRS OVERTURN
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold shrink-0">
            <span className="material-symbols-outlined text-[14px]">speed</span>
            <span>{speed} km/h</span>
          </div>
        </div>

        {/* Celebration Floating HUD Banner */}
        {activeTelemetry === 'six' && (
          <div className="w-full px-4 py-2 bg-[#191d18]/90 border border-amber-400/30 rounded-2xl flex flex-col items-center gap-1 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-xl">💥</span>
              <span className="text-[17px] font-black text-amber-300 uppercase tracking-wider drop-shadow-[0_0_12px_rgba(255,215,0,0.7)]">
                MAXIMUM SIX!
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-[#0b0f0b] text-[10px] font-black uppercase">
                98 METRES
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#9ba394] flex-wrap justify-center">
              <span className="text-[#c3f400] font-bold">Exit Velo: 142 km/h</span>
              <span>•</span>
              <span className="text-white">Launch: 32°</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">Zone: Long-On Stand</span>
            </div>
          </div>
        )}

        {activeTelemetry === 'four' && (
          <div className="w-full px-4 py-2 bg-[#191d18]/90 border border-[#c3f400]/30 rounded-2xl flex flex-col items-center gap-1 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span className="text-[17px] font-black text-[#c3f400] uppercase tracking-wider drop-shadow-[0_0_12px_rgba(195,244,0,0.7)]">
                CRACKING FOUR!
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#c3f400] text-[#0b0f0b] text-[10px] font-black uppercase">
                ROPE STRIKE
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#9ba394] flex-wrap justify-center">
              <span className="text-[#c3f400] font-bold">Exit Velo: 136 km/h</span>
              <span>•</span>
              <span className="text-white">Grass Skimmer</span>
              <span>•</span>
              <span className="text-[#c3f400] font-bold">Zone: Deep Extra Cover</span>
            </div>
          </div>
        )}

        {activeTelemetry === 'wicket' && (
          <div className="w-full px-4 py-2 bg-[#251010]/90 border border-red-500/40 rounded-2xl flex flex-col items-center gap-1 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-xl">🚨</span>
              <span className="text-[17px] font-black text-red-400 uppercase tracking-wider drop-shadow-[0_0_12px_rgba(255,82,82,0.8)]">
                WICKET! TIMBER IMPACT
              </span>
              <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase">
                DISMISSAL
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-red-200/80 flex-wrap justify-center">
              <span className="text-white font-bold">Pitched: Middle</span>
              <span>•</span>
              <span className="text-red-300 font-bold">Impact: Stumps Shattered</span>
              <span>•</span>
              <span className="text-white">DRS Codex Sec 11 Eligible</span>
            </div>
          </div>
        )}

        {activeTelemetry === 'drs' && (
          <div className="w-full px-4 py-2 bg-[#151d14]/90 border border-[#c3f400]/40 rounded-2xl flex flex-col items-center gap-1 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span className="text-[17px] font-black text-[#c3f400] uppercase tracking-wider drs-text-neon animate-neon-pulse">
                REVIEW SUCCESSFUL! NOT OUT
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#c3f400] text-[#0b0f0b] text-[10px] font-black uppercase">
                OVERTURNED
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#c3f400] flex-wrap justify-center">
              <span className="text-white font-bold">UltraEdge: Spike Inside Edge</span>
              <span>•</span>
              <span className="text-[#c3f400] font-bold">Decision: Dot Ball</span>
              <span>•</span>
              <span className="text-white">Hawk-Eye: Verified</span>
            </div>
          </div>
        )}
      </div>

      {/* Ground Pitch Simulation Canvas Area with contained dimensions & relative position */}
      <div className="relative w-full h-[300px] overflow-hidden flex items-center justify-center select-none bg-[#0b0f0b]">
        {/* Isometric Stadium Turf SVG */}
        <svg
          className="absolute inset-0 w-full h-full"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 400 390"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient cx="50%" cy="50%" id="fieldGrass" r="50%">
              <stop offset="0%" stopColor="#19281a" />
              <stop offset="60%" stopColor="#121b13" />
              <stop offset="100%" stopColor="#0b100c" />
            </radialGradient>
            <radialGradient cx="50%" cy="50%" id="boundaryGlow" r="48%">
              <stop offset="92%" stopColor="transparent" />
              <stop offset="96%" stopColor="#ccff00" stopOpacity="0.3" />
              <stop offset="99%" stopColor="#ccff00" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffd700" stopOpacity="0.95" />
            </radialGradient>
            <linearGradient id="pitchStrip" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2c281e" />
              <stop offset="50%" stopColor="#3c372a" />
              <stop offset="100%" stopColor="#2c281e" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="loftSixTrail" x1="200" x2="330" y1="280" y2="45">
              <stop offset="0%" stopColor="#c3f400" stopOpacity="0.1" />
              <stop offset="40%" stopColor="#c3f400" stopOpacity="0.9" />
              <stop offset="85%" stopColor="#ffd700" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <filter height="140%" id="neonGlow" width="140%" x="-20%" y="-20%">
              <feGaussianBlur result="blur" stdDeviation="3" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outfield Grass Base */}
          <rect fill="url(#fieldGrass)" height="390" width="400" />

          {/* Mowing Stripe Rings */}
          <ellipse cx="200" cy="195" fill="none" rx="180" ry="170" stroke="#223323" strokeOpacity="0.25" strokeWidth="14" />
          <ellipse cx="200" cy="195" fill="none" rx="145" ry="135" stroke="#2a3e2b" strokeOpacity="0.25" strokeWidth="14" />
          <ellipse cx="200" cy="195" fill="none" rx="105" ry="98" stroke="#223323" strokeOpacity="0.2" strokeWidth="14" />

          {/* 30-Yard Circle (Inner Ring) */}
          <ellipse cx="200" cy="195" fill="none" rx="120" ry="110" stroke="#444933" strokeDasharray="4 4" strokeOpacity="0.6" strokeWidth="1.5" />

          {/* Glowing Boundary Rope with Active Laser Surge */}
          <ellipse cx="200" cy="195" fill="url(#boundaryGlow)" rx="188" ry="175" />
          <ellipse cx="200" cy="195" filter="url(#neonGlow)" rx="188" ry="175" stroke="#ccff00" strokeOpacity="0.8" strokeWidth="2" />

          {/* 22-Yard Central Pitch Strip */}
          <rect fill="url(#pitchStrip)" height="170" rx="3" width="28" x="186" y="110" />

          {/* Bowling Crease & Stumps (Top - Bowler end) */}
          <line stroke="#e0e4dc" strokeOpacity="0.8" strokeWidth="1.5" x1="181" x2="219" y1="126" y2="126" />
          <line stroke="#e0e4dc" strokeOpacity="0.6" strokeWidth="1" x1="184" x2="184" y1="126" y2="114" />
          <line stroke="#e0e4dc" strokeOpacity="0.6" strokeWidth="1" x1="216" x2="216" y1="126" y2="114" />
          <circle cx="197" cy="122" fill="#ffd700" r="1.5" />
          <circle cx="200" cy="122" fill="#ffd700" r="1.5" />
          <circle cx="203" cy="122" fill="#ffd700" r="1.5" />

          {/* Batting Crease & Popping Crease (Bottom - Striker end) */}
          <line stroke="#e0e4dc" strokeOpacity="0.8" strokeWidth="1.5" x1="181" x2="219" y1="264" y2="264" />
          <line stroke="#e0e4dc" strokeOpacity="0.6" strokeWidth="1" x1="184" x2="184" y1="264" y2="276" />
          <line stroke="#e0e4dc" strokeOpacity="0.6" strokeWidth="1" x1="216" x2="216" y1="264" y2="276" />
          <circle cx="197" cy="268" fill="#ffd700" r="1.5" />
          <circle cx="200" cy="268" fill="#ffd700" r="1.5" />
          <circle cx="203" cy="268" fill="#ffd700" r="1.5" />

          {/* Pitch Batting Arc Direction Markers */}
          <path d="M200 264 L340 40" stroke="#ccff00" strokeDasharray="3 3" strokeOpacity="0.2" strokeWidth="1" />

          {/* Trajectory: SIX (Lofted High-Arc to Long-On Stand) */}
          {activeTelemetry === 'six' && (
            <g className="transition-opacity duration-300">
              <path d="M200 264 Q 240 180 332 54" fill="none" stroke="#000000" strokeLinecap="round" strokeOpacity="0.35" strokeWidth="4" />
              <path d="M200 264 Q 255 120 338 42" fill="none" filter="url(#neonGlow)" stroke="url(#loftSixTrail)" strokeLinecap="round" strokeWidth="4.5" />
              <path d="M200 264 Q 255 120 338 42" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="1.8" />
              <circle cx="200" cy="264" fill="#c3f400" fillOpacity="0.7" r="6" />
              <circle cx="200" cy="264" r="12" stroke="#ccff00" strokeOpacity="0.5" strokeWidth="1.5" />
              <circle cx="255" cy="138" fill="#ffd700" filter="url(#neonGlow)" r="4" />
              <text fill="#ffd700" fontFamily="Outfit" fontSize="10" fontWeight="700" x="264" y="142">APEX 26m</text>
              <circle className="animate-ping" cx="338" cy="42" fill="#ffd700" fillOpacity="0.25" r="18" />
              <circle cx="338" cy="42" fill="#ffd700" fillOpacity="0.8" filter="url(#neonGlow)" r="10" />
              <circle cx="338" cy="42" fill="#ffffff" r="4" />
              <line stroke="#ffd700" strokeWidth="2" x1="338" x2="338" y1="28" y2="20" />
              <line stroke="#ffd700" strokeWidth="2" x1="352" x2="360" y1="42" y2="42" />
              <line stroke="#ffd700" strokeWidth="2" x1="348" x2="355" y1="32" y2="25" />
              <line stroke="#ffd700" strokeWidth="2" x1="328" x2="321" y1="32" y2="25" />
            </g>
          )}

          {/* Trajectory: FOUR (Grass Skimmer to Deep Cover) */}
          {activeTelemetry === 'four' && (
            <g className="transition-opacity duration-300">
              <path d="M200 264 Q 130 230 85 190 T 22 145" fill="none" filter="url(#neonGlow)" stroke="#c3f400" strokeDasharray="6 3" strokeWidth="3.5" />
              <circle cx="140" cy="235" fill="#c3f400" r="4" />
              <circle cx="85" cy="190" fill="#c3f400" r="4.5" />
              <circle className="animate-ping" cx="22" cy="145" fill="#c3f400" fillOpacity="0.4" r="14" />
              <circle cx="22" cy="145" fill="#c3f400" r="6" />
            </g>
          )}

          {/* Trajectory: WICKET (Middle Stump Impact) */}
          {activeTelemetry === 'wicket' && (
            <g className="transition-opacity duration-300">
              <line stroke="#ff5252" strokeWidth="3" x1="200" x2="200" y1="126" y2="264" filter="url(#neonGlow)" />
              <circle className="animate-ping" cx="200" cy="268" fill="#ff5252" fillOpacity="0.5" r="16" />
              <circle cx="200" cy="268" fill="#ff5252" r="7" />
              <text fill="#ff5252" fontFamily="Outfit" fontSize="11" fontWeight="900" x="215" y="272">LBW / BOWLED</text>
            </g>
          )}
        </svg>

        {/* Corner Ground HUD: Bowler (Top-Left) */}
        <div className="absolute top-2 left-2 z-10 bg-[#191d18]/90 backdrop-blur-md border border-[#2e342c] rounded-2xl p-2 flex items-center gap-2 shadow-lg max-w-[155px]">
          <div className="w-7 h-7 rounded-full bg-[#232821] text-[#c3f400] flex items-center justify-center font-bold text-[11px] shrink-0">
            {bowler.player.role.includes('Spin') ? 'SP' : 'RF'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] text-white font-bold truncate leading-tight">{bowler.player.name}</span>
            <span className="text-[10px] text-[#9ba394] font-mono leading-none mt-0.5">
              {bowler.overs} ov · {bowler.wickets}/{bowler.runsConceded}
            </span>
          </div>
        </div>

        {/* Corner Ground HUD: Non-Striker (Top-Right) */}
        <div className="absolute top-2 right-2 z-10 bg-[#191d18]/90 backdrop-blur-md border border-[#2e342c] rounded-2xl p-2 flex items-center gap-2 shadow-lg max-w-[145px]">
          <div className="flex flex-col min-w-0 text-right">
            <span className="text-[12px] text-white font-bold truncate leading-tight">{nonStriker.player.name}</span>
            <span className="text-[10px] text-[#9ba394] font-mono leading-none mt-0.5">
              {nonStriker.runs}* ({nonStriker.balls}b)
            </span>
          </div>
          <div className="w-7 h-7 rounded-full bg-[#232821] text-[#9ba394] flex items-center justify-center font-bold text-[10px] shrink-0">
            NS
          </div>
        </div>
      </div>

      {/* Striker HUD: Docked in card base matching Stitch */}
      <div className="w-full z-20 bg-[#191d18]/95 backdrop-blur-md p-3 border-t border-[#232821] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#c3f400] text-[#101410] font-bold text-base flex items-center justify-center shadow-md">
              {striker.player.name.charAt(0)}
            </div>
            {striker.player.marks.includes('★') && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-[#0b0f0b] text-[9px] flex items-center justify-center font-black">
                ★
              </span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[14px] text-white font-black truncate">{striker.player.name}</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold animate-subtle-pulse border border-amber-400/30">
                STRIKE
              </span>
            </div>
            <div className="text-[11px] text-[#9ba394] font-mono">
              <strong className="text-[#c3f400]">{striker.runs}*</strong> ({striker.balls}b) ·{' '}
              <span className="text-white">{striker.fours}×4, {striker.sixes}×6</span> · SR {striker.strikeRate.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Star Runs Quest Progression Tracker */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-[10px] font-semibold text-[#9ba394]">
            Star Quest: {striker.runs} / {starTarget}r
          </span>
          <div className="w-24 h-2 bg-[#0b0f0b] rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-[#c3f400] to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${starProgressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default PitchView;
