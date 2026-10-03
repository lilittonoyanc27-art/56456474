import React, { useState } from 'react';
import { QUESTIONS_DATA } from './data';
import { speakSpanish, soundController } from './sounds';
import {
  Volume2,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Eye,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

export const FlashcardMode: React.FC = () => {
  const [questions, setQuestions] = useState(QUESTIONS_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterTense, setFilterTense] = useState<'all' | 'presente' | 'indefinido'>('all');

  const filtered = questions.filter((q) => {
    if (filterTense === 'all') return true;
    return q.tense === filterTense;
  });

  const activeQuestion = filtered[currentIndex % Math.max(1, filtered.length)] || QUESTIONS_DATA[0];

  const handleShuffle = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    soundController.playKick();
  };

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filtered.length);
    soundController.playKick();
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    soundController.playKick();
  };

  const isPresente = activeQuestion.tense === 'presente';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setFilterTense('all');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTense === 'all'
                ? 'bg-slate-100 text-slate-900'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Բոլորը (50)
          </button>
          <button
            onClick={() => {
              setFilterTense('presente');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTense === 'presente'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🟢 Presente (25)
          </button>
          <button
            onClick={() => {
              setFilterTense('indefinido');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTense === 'indefinido'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🔵 Indefinido (25)
          </button>
        </div>

        <button
          onClick={handleShuffle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
          title="Խառնել քարտերը"
        >
          <Shuffle className="w-3.5 h-3.5" />
          Խառնել
        </button>
      </div>

      {/* Main Flashcard with Flip Animation */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        role="button"
        tabIndex={0}
        className={`relative min-h-[380px] p-8 rounded-3xl border-2 cursor-pointer transition-all duration-300 transform select-none shadow-2xl flex flex-col justify-between ${
          isPresente
            ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/70 border-emerald-500/50 hover:border-emerald-400'
            : 'bg-gradient-to-b from-slate-900 via-slate-900 to-sky-950/70 border-sky-500/50 hover:border-sky-400'
        }`}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center font-black text-amber-400 text-sm">
              #{activeQuestion.id}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isPresente
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              }`}
            >
              {isPresente ? '🟢 Presente' : '🔵 Indefinido'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                speakSpanish(isFlipped ? activeQuestion.answerEs : activeQuestion.questionEs);
              }}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white transition-all shadow-md"
              title="Լսել արտասանությունը"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <div className="p-2.5 rounded-xl bg-slate-800/80 text-slate-400">
              <RotateCw className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="py-6 text-center space-y-4">
          {!isFlipped ? (
            // FRONT: Spanish Question
            <div className="space-y-4 animate-fadeIn">
              <div className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                🇪🇸 ՀԱՐՑ (Սեղմեք քարտին՝ պատասխանը շրջելու համար)
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-relaxed">
                {activeQuestion.questionEs}
              </h3>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-emerald-300 font-medium text-base inline-block">
                🇦🇲 {activeQuestion.questionHy}
              </div>
              {activeQuestion.timeCue && (
                <div className="text-xs text-amber-400 font-medium">
                  🔑 Բանալի բառ: <span className="underline font-bold">{activeQuestion.timeCue}</span>
                </div>
              )}
            </div>
          ) : (
            // BACK: Spanish Answer + Armenian
            <div className="space-y-4 animate-fadeIn">
              <div className="text-xs uppercase font-extrabold text-amber-400 tracking-wider flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                ✅ ՊԱՏԱՍԽԱՆ (RESPUESTA)
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-relaxed">
                {activeQuestion.answerEs}
              </h3>
              <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 font-medium text-base inline-block">
                🇦🇲 {activeQuestion.answerHy}
              </div>
              <div className="text-xs text-slate-400 pt-2 border-t border-slate-800">
                💡 {activeQuestion.explanation.hy}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-4">
          <span>
            {currentIndex + 1} / {filtered.length} քարտ
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <RotateCw className="w-3.5 h-3.5" />
            Սեղմեք ցանկացած տեղ՝ շրջելու համար
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={prevCard}
          className="flex-1 py-3 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
          Նախորդը
        </button>

        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer"
        >
          <RotateCw className="w-4 h-4" />
          Շրջել քարտը
        </button>

        <button
          onClick={nextCard}
          className="flex-1 py-3 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          Հաջորդը
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
