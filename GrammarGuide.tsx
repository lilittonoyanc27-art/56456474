import React, { useState } from 'react';
import { GRAMMAR_RULES } from './data';
import { speakSpanish } from './sounds';
import { Volume2, Sparkles, BookOpen, Clock, CheckCircle2 } from 'lucide-react';

export const GrammarGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'presente' | 'indefinido'>('presente');
  const [selectedVerbGroup, setSelectedVerbGroup] = useState<number>(0);

  const currentTense = GRAMMAR_RULES[activeTab];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-sky-950/60 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-emerald-500/10 text-9xl font-black pointer-events-none select-none">
          ⚽
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Արագ հուշում ֆուտբոլիստի համար
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Բայերի վերջավորությունները (Presente vs Indefinido)
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Հիմնական կանոնները խաղադաշտում և մարզումներում արագ կողմնորոշվելու համար։ 
              Կտտացրեք ցանկացած օրինակի վրա՝ լսելու ճիշտ իսպաներեն արտասանությունը։
            </p>
          </div>

          {/* Tense Toggle */}
          <div className="flex bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 self-start md:self-center">
            <button
              onClick={() => {
                setActiveTab('presente');
                setSelectedVerbGroup(0);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'presente'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              Presente (Ներկա)
            </button>
            <button
              onClick={() => {
                setActiveTab('indefinido');
                setSelectedVerbGroup(0);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'indefinido'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
              Indefinido (Անցյալ)
            </button>
          </div>
        </div>
      </div>

      {/* Secret Trigger Words (Հուշող բառեր) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-3">
            <Clock className="w-4 h-4" />
            Ինչպե՞ս անմիջապես ճանաչել ժամանակը խոսքում
          </div>
          <div className="space-y-2 text-sm">
            <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40">
              <span className="text-emerald-400 font-bold">🟢 Presente (Սովորական / Ներկա):</span>
              <p className="text-slate-300 text-xs mt-1">
                Եթե հարցում կա՝ <strong className="text-white">todos los días</strong> (ամեն օր), <strong className="text-white">normalmente</strong> (սովորաբար), <strong className="text-white">siempre</strong> (միշտ)
                👉 Պատասխանում ենք <strong>Presente</strong>-ով (<span className="text-emerald-300 font-semibold">entreno</span>):
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-sky-950/30 border border-sky-800/40">
              <span className="text-sky-400 font-bold">🔵 Indefinido (Ավարտված անցյալ):</span>
              <p className="text-slate-300 text-xs mt-1">
                Եթե հարցում կա՝ <strong className="text-white">ayer</strong> (երեկ), <strong className="text-white">anoche</strong> (երեկ գիշեր), <strong className="text-white">el sábado pasado</strong> (անցած շաբաթ օրը), <strong className="text-white">la semana pasada</strong> (անցած շաբաթ)
                👉 Պատասխանում ենք <strong>Indefinido</strong>-ով (<span className="text-sky-300 font-semibold">entrené</span>):
              </p>
            </div>
          </div>
        </div>

        {/* Quick Football Comparison */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
              <BookOpen className="w-4 h-4" />
              Ֆուտբոլային արագ համեմատություն
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-emerald-900/20 border border-emerald-700/30 p-3 rounded-xl">
                <span className="text-xs uppercase text-emerald-400 font-bold block mb-1">Ներկա (Այժմ)</span>
                <span className="text-lg font-black text-white block">entren<span className="text-emerald-400">o</span></span>
                <span className="text-xs text-slate-300 mt-1 block">Ես մարզվում եմ հիմա / սովորաբար</span>
              </div>
              <div className="bg-sky-900/20 border border-sky-700/30 p-3 rounded-xl">
                <span className="text-xs uppercase text-sky-400 font-bold block mb-1">Անցյալ (Երեկ)</span>
                <span className="text-lg font-black text-white block">entren<span className="text-sky-400">é</span></span>
                <span className="text-xs text-slate-300 mt-1 block">Ես մարզվեցի երեկ</span>
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            💡 <strong>Հուշում:</strong> -AR բայերի համար <span className="text-amber-300 font-semibold">«nosotros» (մենք)</span> ձևը և՛ ներկայում, և՛ անցյալում նույնն է՝ <strong className="text-white">entrenamos</strong> (մենք մարզվում ենք / մենք մարզվեցինք)։ Ժամանակը հասկացվում է համատեքստից (օր.՝ ayer = անցյալ)։
          </div>
        </div>
      </div>

      {/* Main Endings Grid for selected Tense */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${activeTab === 'presente' ? 'bg-emerald-500' : 'bg-sky-500'}`}></span>
              {currentTense.titleEs}
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">{currentTense.descHy}</p>
          </div>

          {/* Verb Group Selector */}
          <div className="flex gap-2">
            {currentTense.groups.map((group, idx) => (
              <button
                key={group.name}
                onClick={() => setSelectedVerbGroup(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedVerbGroup === idx
                    ? activeTab === 'presente'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-sky-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {group.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Group Table */}
        <div className="mt-5">
          <div className="text-sm font-semibold text-slate-300 mb-3 flex items-center justify-between">
            <span>Խմբավորում՝ <strong className="text-white">{currentTense.groups[selectedVerbGroup].name}</strong></span>
            <span className="text-xs text-slate-400">Սեղմեք բառի վրա՝ լսելու համար 🔊</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentTense.groups[selectedVerbGroup].endings.map((item) => (
              <div
                key={item.person}
                onClick={() => {
                  const word = item.example.split(' ')[0].replace('-', '');
                  speakSpanish(word);
                }}
                role="button"
                tabIndex={0}
                className="group p-3.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.person}
                    </span>
                    <span className={`text-base font-extrabold ${activeTab === 'presente' ? 'text-emerald-400' : 'text-sky-400'}`}>
                      {item.ending}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-white mt-1.5">
                    {item.example}
                  </div>
                </div>
                <button
                  type="button"
                  className="opacity-40 group-hover:opacity-100 p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-opacity"
                  title="Լսել"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
