import React, { useState, useEffect } from 'react';
import { QUESTIONS_DATA, QuestionItem } from './data';
import { soundController, speakSpanish } from './sounds';
import {
  Trophy,
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Award,
  Flame,
  ArrowRight,
  Eye,
  HelpCircle,
  UserCheck,
  Zap,
} from 'lucide-react';

export const GameMode: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuestionItem[]>([]);
  const [matchMinutes, setMatchMinutes] = useState<number>(1);
  const [goals, setGoals] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);

  // Per-question state
  const [step, setStep] = useState<'tense' | 'ending' | 'full' | 'summary'>('tense');
  const [selectedTense, setSelectedTense] = useState<'presente' | 'indefinido' | null>(null);
  const [tenseIsCorrect, setTenseIsCorrect] = useState<boolean | null>(null);

  const [selectedEnding, setSelectedEnding] = useState<string | null>(null);
  const [endingIsCorrect, setEndingIsCorrect] = useState<boolean | null>(null);

  const [fullAnswerScore, setFullAnswerScore] = useState<number>(0); // 0 or 1
  const [showArmenianHint, setShowArmenianHint] = useState<boolean>(false);
  const [coachMode, setCoachMode] = useState<boolean>(false);
  const [goalCelebration, setGoalCelebration] = useState<boolean>(false);

  // Initialize questions
  useEffect(() => {
    restartMatch();
  }, []);

  const restartMatch = () => {
    // Shuffle all 50 questions
    const shuffled = [...QUESTIONS_DATA].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentIndex(0);
    setMatchMinutes(1);
    setGoals(0);
    setStreak(0);
    setMaxStreak(0);
    resetQuestionState();
  };

  const resetQuestionState = () => {
    setStep('tense');
    setSelectedTense(null);
    setTenseIsCorrect(null);
    setSelectedEnding(null);
    setEndingIsCorrect(null);
    setFullAnswerScore(0);
    setShowArmenianHint(false);
  };

  const currentQ = shuffledQuestions[currentIndex] || QUESTIONS_DATA[0];

  // Primary ending expected in answer (usually 1st person 'yo' or specific form)
  const targetEnding = currentQ.answerVerbs[0]?.ending || '';

  // Options for ending step
  const generateEndingOptions = () => {
    const isPres = currentQ.tense === 'presente';
    const isAr = currentQ.verbGroup === '-ar';
    if (isPres) {
      return isAr
        ? ['-o', '-as', '-a', '-amos']
        : ['-o', '-es', '-e', '-emos'];
    } else {
      return isAr
        ? ['-é', '-aste', '-ó', '-aron']
        : ['-í', '-iste', '-ió', '-ieron'];
    }
  };

  const triggerGoal = () => {
    setGoals((prev) => prev + 1);
    const newStreak = streak + 1;
    setStreak(newStreak);
    if (newStreak > maxStreak) setMaxStreak(newStreak);
    soundController.playGoal();
    setGoalCelebration(true);
    setTimeout(() => setGoalCelebration(false), 900);
  };

  const handleTenseAnswer = (tense: 'presente' | 'indefinido') => {
    setSelectedTense(tense);
    const isCorrect = tense === currentQ.tense;
    setTenseIsCorrect(isCorrect);

    if (isCorrect) {
      triggerGoal();
    } else {
      setStreak(0);
      soundController.playKick();
    }

    // Advance to ending step after short delay
    setTimeout(() => {
      setStep('ending');
    }, 700);
  };

  const handleEndingAnswer = (endingChoice: string) => {
    setSelectedEnding(endingChoice);
    const cleanChoice = endingChoice.replace('-', '');
    const cleanTarget = targetEnding.replace('-', '');
    const isCorrect = cleanChoice === cleanTarget || (cleanTarget === 'ué' && cleanChoice === 'é');
    setEndingIsCorrect(isCorrect);

    if (isCorrect) {
      triggerGoal();
    } else {
      setStreak(0);
      soundController.playKick();
    }

    setTimeout(() => {
      setStep('full');
    }, 700);
  };

  const handleFullAnswerConfirm = (scoredFull: boolean) => {
    if (scoredFull) {
      setFullAnswerScore(1);
      triggerGoal();
    }
    setStep('summary');
  };

  const handleNextQuestion = () => {
    soundController.playWhistle();
    setMatchMinutes((prev) => Math.min(90, Math.round(((currentIndex + 1) / 30) * 90)));

    if (currentIndex + 1 < shuffledQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      resetQuestionState();
    } else {
      // Completed all 50 questions!
      setStep('summary');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stadium Scoreboard */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Pitch Lines background decoration */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-64 border-4 border-white rounded-full"></div>
          <div className="absolute w-full h-0.5 bg-white"></div>
        </div>

        {/* Goal celebration banner overlay */}
        {goalCelebration && (
          <div className="absolute inset-0 bg-emerald-600/80 backdrop-blur-sm z-30 flex items-center justify-center animate-bounce">
            <div className="text-center text-white">
              <span className="text-6xl md:text-8xl block">⚽ GOOOOL!</span>
              <span className="text-xl md:text-2xl font-black uppercase tracking-widest text-amber-300">
                +1 ԳՈԼ Հաշվին
              </span>
            </div>
          </div>
        )}

        {/* Scoreboard Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-inner">
              ⚽
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                  Մարզումային Խաղադաշտ
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-mono font-bold animate-pulse">
                  LIVE {matchMinutes}'
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                50 Հարցերի Ֆուտբոլային Խաղ
              </h2>
            </div>
          </div>

          {/* Quick Score Badges */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Գոլեր (Score)</span>
              <span className="text-2xl md:text-3xl font-black text-amber-400 flex items-center justify-center gap-1">
                ⚽ {goals}
              </span>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-2 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Սերիա (Streak)</span>
              <span className="text-xl md:text-2xl font-black text-emerald-400 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-orange-500" />
                {streak}
              </span>
            </div>

            {/* Coach Mode Toggle */}
            <button
              onClick={() => setCoachMode(!coachMode)}
              className={`p-2.5 rounded-2xl border transition-all text-xs font-bold flex items-center gap-1.5 ${
                coachMode
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Մարզչի ռեժիմ (Ուսուցչի համար)"
            >
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Մարզիչ / Ուսուցիչ</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / Math.max(shuffledQuestions.length, 1)) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            Հարց {currentIndex + 1} / {shuffledQuestions.length}
          </span>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        {/* Question Header & Voice */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
            <span>Մարզիչը հարցնում է.</span>
            {currentQ.timeCue && (
              <span className="text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded">
                Հուշում՝ {currentQ.timeCue}
              </span>
            )}
          </div>

          <div className="flex items-center justify-center gap-3 max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-snug">
              {currentQ.questionEs}
            </h3>
            <button
              onClick={() => speakSpanish(currentQ.questionEs)}
              className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-700/30 transition-all shrink-0 active:scale-95"
              title="Լսել իսպաներեն"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Toggle Armenian Translation */}
          <div className="pt-1">
            {showArmenianHint ? (
              <div
                onClick={() => setShowArmenianHint(false)}
                className="inline-flex items-center gap-2 p-2.5 px-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-medium text-sm cursor-pointer hover:bg-emerald-950/60 transition-colors"
              >
                <span>🇦🇲 {currentQ.questionHy}</span>
                <span className="text-xs text-emerald-400/70">(սեղմեք փակելու համար)</span>
              </div>
            ) : (
              <button
                onClick={() => setShowArmenianHint(true)}
                className="text-xs text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Սեղմեք հայերեն թարգմանությունը տեսնելու համար</span>
              </button>
            )}
          </div>
        </div>

        {/* Game Rules Scoring Guide Mini */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-950/60 p-3 rounded-2xl border border-slate-800 max-w-xl mx-auto">
          <div className={`p-2 rounded-xl border ${step === 'tense' ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300' : 'border-transparent text-slate-400'}`}>
            <span className="font-bold block">1. Ժամանակ</span>
            <span>⚽ +1 Գոլ</span>
          </div>
          <div className={`p-2 rounded-xl border ${step === 'ending' ? 'border-amber-500 bg-amber-950/40 text-amber-300' : 'border-transparent text-slate-400'}`}>
            <span className="font-bold block">2. Վերջավորություն</span>
            <span>⚽ +1 Գոլ</span>
          </div>
          <div className={`p-2 rounded-xl border ${step === 'full' ? 'border-sky-500 bg-sky-950/40 text-sky-300' : 'border-transparent text-slate-400'}`}>
            <span className="font-bold block">3. Լրիվ պատասխան</span>
            <span>🏆 +1 Գոլ</span>
          </div>
        </div>

        {/* STEP 1: CHOOSE TENSE */}
        {step === 'tense' && (
          <div className="space-y-4 max-w-xl mx-auto pt-2 animate-fadeIn">
            <div className="text-center font-bold text-slate-300 text-sm">
              Քայլ 1: Ո՞ր ժամանակով պետք է պատասխանի աշակերտը:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleTenseAnswer('presente')}
                className="p-5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 hover:from-emerald-950 hover:to-slate-900 border-2 border-emerald-500/40 hover:border-emerald-400 text-white font-extrabold text-base md:text-lg transition-all shadow-lg text-left group cursor-pointer active:scale-98"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                  <span className="text-xs text-emerald-400 uppercase font-mono">Ներկա</span>
                </div>
                <div className="text-white group-hover:text-emerald-300">🟢 Presente</div>
                <div className="text-xs text-slate-400 mt-1">
                  (todos los días / normalmente / siempre)
                </div>
              </button>

              <button
                onClick={() => handleTenseAnswer('indefinido')}
                className="p-5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 hover:from-sky-950 hover:to-slate-900 border-2 border-sky-500/40 hover:border-sky-400 text-white font-extrabold text-base md:text-lg transition-all shadow-lg text-left group cursor-pointer active:scale-98"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-3 h-3 rounded-full bg-sky-400"></span>
                  <span className="text-xs text-sky-400 uppercase font-mono">Անցյալ</span>
                </div>
                <div className="text-white group-hover:text-sky-300">🔵 Indefinido</div>
                <div className="text-xs text-slate-400 mt-1">
                  (ayer / anoche / el sábado pasado)
                </div>
              </button>
            </div>

            {selectedTense && (
              <div
                className={`p-3 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 ${
                  tenseIsCorrect
                    ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
                    : 'bg-red-950/60 border border-red-500/50 text-red-300'
                }`}
              >
                {tenseIsCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>ՃԻՇՏ Է։ ⚽ +1 Գոլ ժամանակի համար։</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>
                      Սխալ ժամանակ։ Ճիշտը {currentQ.tense === 'presente' ? 'Presente' : 'Indefinido'} է։
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: CHOOSE ENDING */}
        {step === 'ending' && (
          <div className="space-y-4 max-w-xl mx-auto pt-2 animate-fadeIn">
            <div className="text-center font-bold text-slate-300 text-sm">
              Քայլ 2: Ի՞նչ վերջավորություն պետք է ունենա բայը պատասխանում:
              <div className="text-xs text-slate-400 font-normal mt-0.5">
                Բայ՝ <strong className="text-white">{currentQ.verbInfinitive}</strong> ({currentQ.verbGroup})
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {generateEndingOptions().map((endingOpt) => (
                <button
                  key={endingOpt}
                  onClick={() => handleEndingAnswer(endingOpt)}
                  className={`p-4 rounded-xl border-2 font-black text-xl transition-all cursor-pointer ${
                    selectedEnding === endingOpt
                      ? endingIsCorrect
                        ? 'bg-emerald-900/60 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-900/40'
                        : 'bg-red-900/60 border-red-400 text-red-300'
                      : 'bg-slate-950 hover:bg-slate-800 border-slate-700 text-white'
                  }`}
                >
                  {endingOpt}
                </button>
              ))}
            </div>

            {selectedEnding && (
              <div
                className={`p-3 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 ${
                  endingIsCorrect
                    ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
                    : 'bg-red-950/60 border border-red-500/50 text-red-300'
                }`}
              >
                {endingIsCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>ՀԻԱՆԱԼԻ Է։ ⚽ +1 Գոլ ճիշտ վերջավորության համար:</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>Ճիշտ վերջավորությունը՝ -{targetEnding}</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: SPEAK & REVEAL FULL ANSWER */}
        {step === 'full' && (
          <div className="space-y-5 max-w-xl mx-auto pt-2 animate-fadeIn text-center">
            <div className="font-bold text-slate-300 text-sm">
              Քայլ 3: Աշակերտը բարձրաձայն ասում է լրիվ պատասխանը.
            </div>

            {/* Answer Display */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 shadow-inner text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider">
                  ✅ Ճիշտ իսպաներեն պատասխան
                </span>
                <button
                  onClick={() => speakSpanish(currentQ.answerEs)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white transition-colors"
                  title="Լսել պատասխանը"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xl md:text-2xl font-black text-white">
                {currentQ.answerEs}
              </div>

              <div className="text-sm font-medium text-emerald-300 pt-1 border-t border-slate-800">
                🇦🇲 {currentQ.answerHy}
              </div>
            </div>

            {/* Confirmation buttons */}
            <div className="space-y-2">
              <div className="text-xs text-slate-400 font-medium">
                Աշակերտը կարողացա՞վ ասել ամբողջական նախադասությունը։
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleFullAnswerConfirm(true)}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 cursor-pointer active:scale-98"
                >
                  <Trophy className="w-4 h-4 text-amber-300" />
                  <span>Այո, լրիվ պատասխանեց! 🏆 (+1 Գոլ)</span>
                </button>
                <button
                  onClick={() => handleFullAnswerConfirm(false)}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm cursor-pointer"
                >
                  Մասամբ / Դժվարացավ (0 Գոլ)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SUMMARY & NEXT QUESTION */}
        {step === 'summary' && (
          <div className="space-y-5 max-w-xl mx-auto pt-2 animate-fadeIn text-center">
            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-extrabold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Հարցի Ամփոփում
                </span>
                <span className="text-xs text-slate-400">
                  {currentQ.tense === 'presente' ? '🟢 Presente' : '🔵 Indefinido'}
                </span>
              </div>

              <div className="text-slate-200 text-sm">
                <strong>Բացատրություն:</strong> {currentQ.explanation.hy}
              </div>

              <div className="text-xs text-slate-400">
                {currentQ.explanation.ru}
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-white font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/30 cursor-pointer transform active:scale-98"
            >
              <span>Հաջորդ Հարցը ⚽</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Coach Quick Scoring Bar (if Coach Mode is ON) */}
      {coachMode && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-amber-300 font-bold flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            <span>Մարզչի Արագ Գնահատման Վահանակ.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setGoals((prev) => prev + 1);
                soundController.playGoal();
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 cursor-pointer"
            >
              ⚽ +1 Գոլ (Ժամանակ)
            </button>
            <button
              onClick={() => {
                setGoals((prev) => prev + 2);
                soundController.playGoal();
              }}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold flex items-center gap-1 cursor-pointer"
            >
              ⚽⚽ +2 Գոլ (Ժամանակ + Վերջավորություն)
            </button>
            <button
              onClick={() => {
                setGoals((prev) => prev + 3);
                soundController.playGoal();
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1 cursor-pointer"
            >
              🏆 +3 Գոլ (Հեթ-տրիկ / Լրիվ պատասխան)
            </button>
            <button
              onClick={restartMatch}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white font-bold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Վերսկսել
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
