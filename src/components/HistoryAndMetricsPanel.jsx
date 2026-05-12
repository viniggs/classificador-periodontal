export default function HistoryAndMetricsPanel({
  safeStage,
  grade,
  history,
}) {
  return (
    <section className="mt-6 rounded-3xl border border-slate-200/90 bg-white/90 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03] backdrop-blur sm:mt-8 sm:p-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
          Progressão atual
        </h3>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Atualiza conforme critérios clínicos
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Estágio
          </div>
          <div className="mt-2 text-5xl font-black tracking-tight text-blue-700 sm:text-6xl">
            {safeStage}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-emerald-50/40 p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Grau
          </div>
          <div className="mt-2 text-5xl font-black tracking-tight text-emerald-700 sm:text-6xl">
            {grade}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-200/80 pt-6">
        <h4 className="text-base font-bold text-slate-800">
          Histórico de respostas
        </h4>
        {history.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-6 text-center text-sm text-slate-600">
            Nenhuma resposta registrada ainda.
          </div>
        ) : (
          <ul className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-1 scrollbar-thin">
            {history.map((item, index) => (
              <li
                key={`${item.question}-${index}`}
                className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-5"
              >
                <div className="text-sm font-bold text-slate-900 sm:text-base">
                  {item.question}
                </div>
                <div className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.answer}
                </div>
                <div className="mt-3 text-sm font-semibold text-blue-700 sm:text-base">
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
