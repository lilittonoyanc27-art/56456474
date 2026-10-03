import React, { useState } from 'react';
import { QuestionItem } from './data';
import { speakSpanish } from './sounds';
import { Volume2, ChevronDown, Check, Sparkles, HelpCircle, Eye, EyeOff } from 'lucide-react';

interface QuestionCardProps {
  item: QuestionItem;
  defaultShowArmenian?: boolean;
  defaultShowAnswer?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  item,
  defaultShowArmenian = false,
  defaultShowAnswer = false,
}) => {
  const [showQuestionHy, setShowQuestionHy] = useState(defaultShowArmenian);
  const [showAnswer, setShowAnswer] = useState(defaultShowAnswer);
  const [showAnswerHy, setShowAnswerHy] = useState(defaultShowArmenian);
  const [showExplanation, setShowExplanation] = useState(false);

  // Sync when master toggles change
  React.useEffect(() => {
    setShowQuestionHy(defaultShowArmenian);
    setShowAnswerHy(defaultShowArmenian);
  }, [defaultShowArmenian]);

  React.useEffect(() => {
    setShowAnswer(defaultShowAnswer);
  }, [defaultShowAnswer]);

  const isPresente = item.tense === 'presente';

  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-md ${
      isPresente
        ? 'bg-slate-900/90 border-emerald-900/40 hover:border-emerald-600/50 hover:shadow-emerald-950/20'
        : 'bg-slate-900/90 border-sky-900/40 hover:border-sky-600/50 hover:shadow-sky-950/20'
    }`}>
      {/* Top Header Bar */}
      <div className="px-5 py-3 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-black text-slate-200 text-xs">
            {item.id}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[11px] ${
              isPresente
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
            }`}
          >
            {isPresente ? '🟢 Presente (Ներկա)' : '🔵 Indefinido (Անցյալ)'}
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono text-[11px]">
            {item.verbInfinitive} ({item.verbGroup})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {item.timeCue && (
            <span className="text-amber-400/90 font-medium text-[11px] bg-amber-950/30 px-2 py-0.5 rounded border border-amber-800/30">
              🔑 {item.timeCue}
            </span>
          )}
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
            title="Քերականական բացատրություն"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Question Block */}
      <div className="p-5 space-y-4">
        {/* Spanish Question (Interactive Click) */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div
              onClick={() => setShowQuestionHy(!showQuestionHy)}
              role="button"
              tabIndex={0}
              title="Կտտացրեք՝ հայերեն թարգմանությունը տեսնելու համար"
              className="flex-1 cursor-pointer group rounded-xl p-2 -m-2 hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  🇪🇸 Իսպաներեն հարց (սեղմեք թարգմանության համար)
                </span>
                <span className="text-[11px] text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {showQuestionHy ? 'Փակել' : 'Բացել հայերենը 🇦🇲'}
                </span>
              </div>
              <p className="text-lg md:text-xl font-bold text-white tracking-tight mt-1 leading-snug group-hover:text-amber-300 transition-colors">
                {item.questionEs}
              </p>
            </div>

            <button
              onClick={() => speakSpanish(item.questionEs)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-all shadow-sm shrink-0"
              title="Լսել իսպաներեն արտասանությունը"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Armenian Translation of Question */}
          {showQuestionHy ? (
            <div
              onClick={() => setShowQuestionHy(false)}
              className="mt-2.5 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-200 text-sm md:text-base font-medium flex items-center justify-between gap-2 cursor-pointer hover:bg-emerald-950/30 transition-colors animate-fadeIn"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🇦🇲</span>
                <span>{item.questionHy}</span>
              </div>
              <EyeOff className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </div>
          ) : (
            <button
              onClick={() => setShowQuestionHy(true)}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors py-1"
            >
              <Eye className="w-3 h-3" />
              <span>Տեսնել թարգմանությունը հայերենով (Արմ)</span>
            </button>
          )}
        </div>

        {/* Answer Button ("Да / Պատասխան") */}
        <div className="pt-2 border-t border-slate-800/80">
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 hover:shadow-emerald-700/40 transition-all cursor-pointer transform active:scale-[0.99]"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>✅ Sí / Պատասխան (Да)</span>
            </button>
          ) : (
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-400" />
                  Պատասխան (Respuesta)
                </span>
                <button
                  onClick={() => setShowAnswer(false)}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Թաքցնել
                </button>
              </div>

              {/* Spanish Answer with highlighted verb ending */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-3">
                <div
                  onClick={() => setShowAnswerHy(!showAnswerHy)}
                  role="button"
                  tabIndex={0}
                  className="flex-1 cursor-pointer group"
                  title="Կտտացրեք՝ պատասխանի հայերեն թարգմանությունը տեսնելու համար"
                >
                  <div className="text-xs text-slate-400 mb-1 flex items-center gap-2">
                    <span>🇪🇸 Իսպաներեն պատասխան:</span>
                    <span className="text-[11px] text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {showAnswerHy ? 'Փակել' : 'Տեսնել հայերենը 🇦🇲'}
                    </span>
                  </div>
                  <div className="text-base md:text-lg font-bold text-white tracking-tight leading-snug">
                    <AnswerFormatted answerEs={item.answerEs} answerVerbs={item.answerVerbs} isPresente={isPresente} />
                  </div>
                </div>

                <button
                  onClick={() => speakSpanish(item.answerEs)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-all shrink-0"
                  title="Լսել պատասխանի արտասանությունը"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Armenian Answer */}
              {showAnswerHy ? (
                <div
                  onClick={() => setShowAnswerHy(false)}
                  className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-200 text-sm md:text-base font-medium flex items-center justify-between gap-2 cursor-pointer hover:bg-amber-950/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>🇦🇲</span>
                    <span>{item.answerHy}</span>
                  </div>
                  <EyeOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                </div>
              ) : (
                <button
                  onClick={() => setShowAnswerHy(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  <span>Տեսնել պատասխանի հայերեն թարգմանությունը</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Optional Grammar Explanation Popup/Drawer */}
        {showExplanation && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 text-xs space-y-1.5 animate-fadeIn">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Քերականական հուշում:
            </div>
            <p className="text-slate-200">🇦🇲 {item.explanation.hy}</p>
            <p className="text-slate-400">🇷🇺 {item.explanation.ru}</p>
            <p className="text-slate-400 font-mono text-[11px]">🇪🇸 {item.explanation.es}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Formats answer text to highlight the grammatical verb endings boldly
function AnswerFormatted({
  answerEs,
  answerVerbs,
  isPresente,
}: {
  answerEs: string;
  answerVerbs: QuestionItem['answerVerbs'];
  isPresente: boolean;
}) {
  if (!answerVerbs || answerVerbs.length === 0) {
    return <span>{answerEs}</span>;
  }

  // Find occurrences of verbs and render them with highlighting
  let remaining = answerEs;
  const parts: React.ReactNode[] = [];
  let keyIndex = 0;

  for (const v of answerVerbs) {
    const idx = remaining.toLowerCase().indexOf(v.full.toLowerCase());
    if (idx !== -1) {
      if (idx > 0) {
        parts.push(<span key={keyIndex++}>{remaining.substring(0, idx)}</span>);
      }
      parts.push(
        <span
          key={keyIndex++}
          className={`inline-block px-1 rounded font-black ${
            isPresente
              ? 'bg-emerald-500/20 text-emerald-300 underline decoration-emerald-400 decoration-2'
              : 'bg-sky-500/20 text-sky-300 underline decoration-sky-400 decoration-2'
          }`}
        >
          {v.stem}
          <span className="font-black text-amber-300 bg-amber-950/60 px-0.5 rounded">
            {v.ending}
          </span>
        </span>
      );
      remaining = remaining.substring(idx + v.full.length);
    }
  }

  if (remaining.length > 0) {
    parts.push(<span key={keyIndex++}>{remaining}</span>);
  }

  return <>{parts}</>;
}
