// src/views/BallByBallView.tsx
import React, { useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, Filter } from 'lucide-react';
import type { MatchState, OverDelivery } from '../types';

interface BallByBallViewProps {
  match: MatchState;
  onBack: () => void;
}

export const BallByBallView: React.FC<BallByBallViewProps> = ({ match, onBack }) => {
  const [lang, setLang] = useState<'en' | 'hi'>('hi'); // Default Hindi feed per Stitch!
  const [activeFilter, setActiveFilter] = useState<'all' | 'boundaries' | 'wickets' | 'drs' | 'power'>('all');
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(false);

  const inn1 = match.innings1;
  const inn2 = match.innings2;

  // Combine deliveries in reverse chronological order
  const allDeliveries = [
    ...inn2.deliveries.map(d => ({ ...d, inningsNo: 2 })),
    ...inn1.deliveries.map(d => ({ ...d, inningsNo: 1 }))
  ].reverse();

  // Filter deliveries
  const filteredDeliveries = allDeliveries.filter(d => {
    if (activeFilter === 'boundaries') return d.runsScored === 4 || d.runsScored === 6;
    if (activeFilter === 'wickets') return d.isWicket;
    if (activeFilter === 'drs') return !!d.drsTaken;
    if (activeFilter === 'power') return !!d.powerCardPlayed;
    return true;
  });

  const speakText = (text: string) => {
    if (!isSpeakingEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-5 select-none animate-fadeIn pb-24">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#272b26] pb-3">
        <button
          onClick={onBack}
          className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Match</span>
        </button>

        {/* English / Hindi Toggle & TTS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const next = !isSpeakingEnabled;
              setIsSpeakingEnabled(next);
              if (next) speakText(lang === 'hi' ? "हिन्दी कमेंट्री चालू है" : "Audio commentary active");
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isSpeakingEnabled 
                ? "bg-[#c3f400] text-black border-[#c3f400] shadow-md shadow-[#c3f400]/25" 
                : "bg-[#1d211c] text-slate-400 border-white/10"
            }`}
          >
            {isSpeakingEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{lang === 'hi' ? 'हिन्दी कमेंट्री 🔊' : 'Audio 🔊'}</span>
          </button>

          <div className="flex bg-[#101410] border border-white/10 rounded-full p-0.5 text-xs font-bold">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full transition-all ${
                lang === 'en' ? 'bg-[#272b26] text-white shadow-xs' : 'text-slate-400'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-3 py-1 rounded-full transition-all ${
                lang === 'hi' ? 'bg-[#c3f400] text-black shadow-xs font-black' : 'text-slate-400'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs (Stitch: All Balls · Boundaries · Wickets · DRS & Reviews · Power Cards) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: 'all', label: 'All Deliveries' },
          { id: 'boundaries', label: 'Boundaries (4s & 6s)' },
          { id: 'wickets', label: 'Wickets' },
          { id: 'drs', label: 'DRS & Reviews' },
          { id: 'power', label: 'Power Cards' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id as typeof activeFilter)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === f.id
                ? 'bg-[#c3f400] text-[#101410] shadow-md shadow-[#c3f400]/20'
                : 'bg-[#141814] text-slate-400 hover:text-white border border-[#272b26]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Deliveries Timeline List */}
      <div className="space-y-3">
        {filteredDeliveries.map((d, index) => {
          const isSix = d.runsScored === 6;
          const isFour = d.runsScored === 4;
          const isWkt = d.isWicket;
          const text = lang === 'hi' ? d.commentaryHi : d.commentaryEn;

          return (
            <div
              key={index}
              onClick={() => speakText(text)}
              className={`p-4 rounded-3xl border transition-all cursor-pointer hover:border-[#c3f400]/50 ${
                isWkt
                  ? "bg-red-950/40 border-red-500/40"
                  : isSix
                  ? "bg-purple-950/40 border-purple-400/40"
                  : isFour
                  ? "bg-[#1c2417] border-[#c3f400]/40"
                  : "bg-[#141814] border-[#272b26]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    Ov {d.overNo}.{d.ballNo}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {d.bowler} to {d.striker}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    [Inn {d.inningsNo}]
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-black ${
                      isWkt ? "bg-red-600 text-white" :
                      isSix ? "bg-purple-600 text-white" :
                      isFour ? "bg-[#c3f400] text-black" :
                      d.extraType ? "bg-amber-500 text-black" :
                      d.runsScored === 0 ? "bg-[#272b26] text-slate-400" :
                      "bg-white/10 text-white"
                    }`}
                  >
                    {d.displayTag}
                  </span>
                </div>
              </div>

              {/* Commentary Text */}
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {text}
              </p>

              {/* Technical Dice Trace */}
              <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <div>
                  Bowl: {d.bowlingRedDie}{d.bowlingBlueDie} → {d.bowlingResult}
                  {d.battingRedDie && ` · Bat: ${d.battingRedDie}${d.battingBlueDie} → ${d.battingResult}`}
                </div>
                {isSpeakingEnabled && (
                  <span className="text-[#c3f400] text-[9px]">Tap to speak</span>
                )}
              </div>
            </div>
          );
        })}

        {filteredDeliveries.length === 0 && (
          <div className="p-8 text-center bg-[#141814] rounded-3xl border border-[#272b26] text-slate-500 text-xs">
            No deliveries match this filter yet.
          </div>
        )}
      </div>
    </div>
  );
};
