export default function HistoryAndMetricsPanel({
  safeStage,
  grade,
  history,
}) {
  return (
    <section className="mt-6 rounded-3xl border border-blue-300/90 bg-blue-200/25 p-5 shadow-[0_4px_20px_rgba(15,23,42,0.06)] ring-1 ring-blue-900/10 backdrop-blur sm:mt-8 sm:p-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
          Progressão atual
        </h3>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
          Atualiza conforme critérios clínicos
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.08)] transition-shadow duration-200 hover:shadow-md">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Estágio
          </div>
          <div className="mt-2 text-5xl font-black tracking-tight text-blue-800 sm:text-6xl">
            {safeStage}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-300 bg-gradient-to-br from-white to-emerald-50/70 p-5 shadow-[0_2px_8px_rgba(15,23,42,0.08)] transition-shadow duration-200 hover:shadow-md">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Grau
          </div>
          <div className="mt-2 text-5xl font-black tracking-tight text-emerald-700 sm:text-6xl">
            {grade}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-300/90 pt-6">
        <h4 className="text-base font-bold text-slate-800">
          Histórico de respostas
        </h4>
        {history.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-400/80 bg-white px-4 py-6 text-center text-sm text-slate-700 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)]">
            Nenhuma resposta registrada ainda.
          </div>
        ) : (
          <ul className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-1 scrollbar-thin">
            {history.map((item, index) => (
              <li
                key={`${item.question}-${index}`}
                className="rounded-2xl border border-slate-300 bg-white p-4 shadow-[0_1px_4px_rgba(15,23,42,0.07)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-[0_4px_12px_rgba(15,23,42,0.1)] sm:p-5"
              >
                <div className="text-sm font-bold text-slate-900 sm:text-base">
                  {item.question}
                </div>
                <div className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.answer}
                </div>
                <div className="mt-3 text-sm font-semibold text-blue-800 sm:text-base">
                  {item.previous !== item.updated
                    ? `${item.previous} → ${item.updated}`
                    : `Mantém ${item.updated}`}
                </div>
                {item.changed && (
                  <div className="mt-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                    Gravidade aumentada neste critério
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
