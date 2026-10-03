/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { QUESTIONS_DATA } from './data';
import { QuestionCard } from './QuestionCard';
import { GrammarGuide } from './GrammarGuide';
import { GameMode } from './GameMode';
import { FlashcardMode } from './FlashcardMode';
import { soundController } from './sounds';
import {
  Search,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Trophy,
  Layers,
  Filter,
  Flame,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'list' | 'game' | 'grammar' | 'cards'>('list');
  const [filterTense, setFilterTense] = useState<'all' | 'presente' | 'indefinido'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [masterShowArmenian, setMasterShowArmenian] = useState(false);
  const [masterShowAnswers, setMasterShowAnswers] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Toggle sound globally
  const handleSoundToggle = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundController.enabled = newState;
    if (newState) {
      soundController.playKick();
    }
  };

  // Filtered questions for the main list
  const filteredQuestions = useMemo(() => {
    return QUESTIONS_DATA.filter((q) => {
      // Tense filter
      if (filterTense !== 'all' && q.tense !== filterTense) return false;

      // Search query (Spanish or Armenian)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const inEsQ = q.questionEs.toLowerCase().includes(query);
        const inHyQ = q.questionHy.toLowerCase().includes(query);
        const inEsA = q.answerEs.toLowerCase().includes(query);
        const inHyA = q.answerHy.toLowerCase().includes(query);
        const inVerb = q.verbInfinitive.toLowerCase().includes(query);
        const inCue = q.timeCue.toLowerCase().includes(query);
        return inEsQ || inHyQ || inEsA || inHyA || inVerb || inCue;
      }

      return true;
    });
  }, [filterTense, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Banner & Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('list')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 flex items-center justify-center text-xl shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
              ⚽
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Fútbol Español
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/30">
                  50 Հարց
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Իսպաներեն ֆուտբոլիստի համար 🇦🇲 🇪🇸
              </p>
            </div>
          </div>

          {/* Sound Mute & Quick Status */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSoundToggle}
              className={`p-2.5 rounded-xl border transition-all ${
                soundEnabled
                  ? 'bg-slate-900 text-emerald-400 border-emerald-500/30 hover:bg-slate-800'
                  : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
              }`}
              title={soundEnabled ? 'Ձայնը միացված է' : 'Ձայնն անջատված է'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-2.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>📋 50 Հարցեր & Պատասխաններ</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('game');
                soundController.playWhistle();
              }}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'game'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/50 font-black'
                  : 'bg-slate-900 text-amber-400 hover:text-amber-300 border border-amber-500/30'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>🎮 Ֆուտբոլային Խաղ (Juego)</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            </button>

            <button
              onClick={() => setActiveTab('grammar')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'grammar'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-950/50'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>⚡ Արագ հուշում (Endings)</span>
            </button>

            <button
              onClick={() => setActiveTab('cards')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'cards'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-950/50'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>🃏 Ֆլեշ-քարտեր (Flashcards)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* TAB 1: 50 QUESTIONS LIST */}
        {activeTab === 'list' && (
          <div className="space-y-6">
            {/* Hero Quick Advice */}
            <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <span>⚽ 50 Կենդանի Ֆուտբոլային Հարցեր</span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white">
                  Մարզի՛ր խոսքդ և վերջավորությունները ավտոմատ
                </h2>
                <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
                  Կտտացրեք ցանկացած իսպաներեն հարցի վրա՝ հայերեն թարգմանությունը տեսնելու համար։
                  Սեղմեք <strong className="text-emerald-400">«✅ Sí / Պատասխան»</strong> կոճակը՝ ճիշտ պատասխանն ու վերջավորությունը տեսնելու համար։
                </p>
              </div>

              {/* Quick shortcut to Cheat sheet */}
              <button
                onClick={() => setActiveTab('grammar')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs md:text-sm font-bold text-amber-300 border border-amber-500/30 flex items-center gap-2 self-start md:self-center transition-all cursor-pointer whitespace-nowrap"
              >
                <span>⚡ Բայերի աղյուսակ</span>
                <span className="text-xs">(-AR, -ER, -IR)</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Որոնել հարցեր, բայեր կամ բառեր (իսպաներեն կամ հայերեն)..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                    >
                      Մաքրել
                    </button>
                  )}
                </div>

                {/* Tense Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                  <button
                    onClick={() => setFilterTense('all')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      filterTense === 'all'
                        ? 'bg-slate-100 text-slate-950 font-black'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Բոլորը (50)
                  </button>

                  <button
                    onClick={() => setFilterTense('presente')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      filterTense === 'presente'
                        ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-950/50'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>1–25 Presente</span>
                  </button>

                  <button
                    onClick={() => setFilterTense('indefinido')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      filterTense === 'indefinido'
                        ? 'bg-sky-600 text-white font-black shadow-md shadow-sky-950/50'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                    <span>26–50 Indefinido</span>
                  </button>
                </div>
              </div>

              {/* Master Bulk Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
                <span className="text-slate-400 font-medium">
                  Ցուցադրված է՝ <strong className="text-white">{filteredQuestions.length}</strong> հարց
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMasterShowArmenian(!masterShowArmenian)}
                    className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      masterShowArmenian
                        ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {masterShowArmenian ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{masterShowArmenian ? 'Թաքցնել հայերենը' : 'Բացել բոլոր թարգմանությունները'}</span>
                  </button>

                  <button
                    onClick={() => setMasterShowAnswers(!masterShowAnswers)}
                    className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      masterShowAnswers
                        ? 'bg-amber-950/50 border-amber-500/40 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{masterShowAnswers ? 'Թաքցնել պատասխանները' : 'Բացել բոլոր պատասխանները'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredQuestions.map((item) => (
                <QuestionCard
                  key={item.id}
                  item={item}
                  defaultShowArmenian={masterShowArmenian}
                  defaultShowAnswer={masterShowAnswers}
                />
              ))}
            </div>

            {filteredQuestions.length === 0 && (
              <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-4xl">🔍</span>
                <h3 className="text-lg font-bold text-white">Հարցեր չգտնվեցին</h3>
                <p className="text-sm text-slate-400">
                  Փորձեք փոխել որոնման բառը կամ ֆիլտրը։
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterTense('all');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Վերականգնել որոնումը
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INTERACTIVE FOOTBALL MATCH GAME */}
        {activeTab === 'game' && <GameMode />}

        {/* TAB 3: GRAMMAR QUICK GUIDE & VERB ENDINGS */}
        {activeTab === 'grammar' && <GrammarGuide />}

        {/* TAB 4: FLASHCARDS */}
        {activeTab === 'cards' && <FlashcardMode />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90 py-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-semibold text-slate-300">Fútbol Español & Հայերեն</span> — 50 կենդանի հարցեր ֆուտբոլիստի համար:
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>🟢 Presente (1-25)</span>
            <span>•</span>
            <span>🔵 Indefinido (26-50)</span>
            <span>•</span>
            <span>⚽ 100% Ինտերակտիվ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
