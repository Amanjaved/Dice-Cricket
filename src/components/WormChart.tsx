// src/components/WormChart.tsx
import React from 'react';
import type { InningsState } from '../types';

interface WormChartProps {
  innings1: InningsState;
  innings2?: InningsState;
  totalOvers: number;
}

export const WormChart: React.FC<WormChartProps> = ({ innings1, innings2, totalOvers }) => {
  // Build cumulative score progression at each over end
  const getProgression = (innings: InningsState) => {
    const points: { over: number; score: number; wickets: number }[] = [{ over: 0, score: 0, wickets: 0 }];
    let runningScore = 0;
    let runningWickets = 0;

    for (let ov = 1; ov <= totalOvers; ov++) {
      const overDeliveries = innings.deliveries.filter(d => d.overNo === ov);
      for (const d of overDeliveries) {
        runningScore += d.runsScored + d.extraRuns;
        if (d.isWicket) runningWickets++;
      }
      points.push({ over: ov, score: runningScore, wickets: runningWickets });
      if (ov > innings.completedOvers && (!innings.isCompleted || overDeliveries.length === 0)) break;
    }
    return points;
  };

  const p1 = getProgression(innings1);
  const p2 = innings2 ? getProgression(innings2) : [];

  const maxScore = Math.max(
    10,
    innings1.score,
    innings2 ? innings2.score : 0,
    ...p1.map(p => p.score),
    ...p2.map(p => p.score)
  );

  const svgWidth = 420;
  const svgHeight = 180;
  const padLeft = 35;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  const getX = (ov: number) => padLeft + (ov / totalOvers) * chartW;
  const getY = (score: number) => padTop + chartH - (score / (maxScore * 1.1)) * chartH;

  const makePath = (points: { over: number; score: number }[]) => {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.over)} ${getY(p.score)}`).join(' ');
  };

  return (
    <div className="w-full bg-[#141814] border border-[#272b26] rounded-3xl p-4 shadow-xl select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
        <div className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <span>📈 Match Worm Progression Chart</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: innings1.team.color }} />
            <span className="text-white">{innings1.team.code}</span>
          </div>
          {innings2 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: innings2.team.color }} />
              <span className="text-white">{innings2.team.code}</span>
            </div>
          )}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
          {/* Horizontal gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = padTop + chartH * (1 - ratio);
            const val = Math.round(maxScore * ratio);
            return (
              <g key={idx}>
                <line x1={padLeft} y1={y} x2={svgWidth - padRight} y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <text x={padLeft - 6} y={y + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Vertical over dividers */}
          {Array.from({ length: totalOvers + 1 }).map((_, ov) => {
            const x = getX(ov);
            return (
              <g key={ov}>
                <line x1={x} y1={padTop} x2={x} y2={padTop + chartH} stroke="rgba(255,255,255,0.05)" />
                <text x={x} y={svgHeight - 12} fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">
                  {ov}
                </text>
              </g>
            );
          })}

          {/* Innings 1 Line */}
          {p1.length > 1 && (
            <path
              d={makePath(p1)}
              fill="none"
              stroke={innings1.team.color || "#ff8c4a"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Innings 1 Wicket Markers */}
          {innings1.fallOfWickets.map((fow, i) => {
            const ovNum = parseFloat(fow.overs) || 0;
            return (
              <circle
                key={`fow1-${i}`}
                cx={getX(ovNum)}
                cy={getY(fow.score)}
                r="3.5"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Innings 2 Line */}
          {p2.length > 1 && (
            <path
              d={makePath(p2)}
              fill="none"
              stroke={innings2?.team.color || "#14b8a6"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="4 2"
            />
          )}

          {/* Innings 2 Wicket Markers */}
          {innings2?.fallOfWickets.map((fow, i) => {
            const ovNum = parseFloat(fow.overs) || 0;
            return (
              <circle
                key={`fow2-${i}`}
                cx={getX(ovNum)}
                cy={getY(fow.score)}
                r="3.5"
                fill="#ef4444"
                stroke="#101410"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>
      </div>
      <div className="text-[10px] text-center text-slate-500 font-mono mt-1">
        Overs (X-axis) vs Cumulative Runs (Y-axis) · Red Dots denote Wickets
      </div>
    </div>
  );
};
