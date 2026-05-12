function IconDownload(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={props.className}>
      <path
        d="M12 3v12m0 0l4-4m-4 4l-4-4M5 19h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconRefresh(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={props.className}>
      <path
        d="M4 12a8 8 0 0113.657-5.657M20 12a8 8 0 01-13.657 5.657M4 12H1m19 0h-3M4 12l2-2m14 2l-2-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FinishedResultView({
  resultRef,
  caseName,
  supragingivalDiagnosis,
  hasAttachmentLoss,
  hasPeriodontitis,
  safeStage,
  extensionDescriptor,
  grade,
  onExport,
  onReset,
}) {
  const supraHealthy = supragingivalDiagnosis === "Paciente saudável";

  return (
    <div className="flex flex-col items-stretch py-4 sm:py-8">
      <div
        ref={resultRef}
        role="region"
        aria-labelledby="resultado-titulo-principal"
        className="w-full rounded-3xl border border-slate-300/90 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/[0.06] sm:p-10 lg:p-12"
      >
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          Laudo resumido
        </p>
        <h2
          id="resultado-titulo-principal"
          className="mt-3 text-balance text-center text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-4xl"
        >
          ({caseName}) — Resultado final
        </h2>

        <div className="mt-8 space-y-6 text-left sm:mt-10 sm:space-y-8">
          <article
            className="rounded-2xl border border-slate-300/90 bg-white p-5 shadow-sm sm:p-7"
            aria-labelledby="resultado-supra-titulo"
          >
            <h3
              id="resultado-supra-titulo"
              className="text-xs font-bold uppercase tracking-wide text-slate-700"
            >
              Diagnóstico supragengival
            </h3>
            <p
              className={[
                "mt-3 text-pretty text-2xl font-black leading-snug sm:text-3xl lg:text-4xl",
                supraHealthy ? "text-emerald-950" : "text-red-950",
              ].join(" ")}
            >
              {supragingivalDiagnosis}
              {hasAttachmentLoss && !supraHealthy
                ? " em periodonto reduzido"
                : ""}
            </p>
          </article>

          <article
            className="rounded-2xl border border-slate-300/90 bg-white p-5 shadow-sm sm:p-7"
            aria-labelledby="resultado-final-titulo"
          >
            <h3
              id="resultado-final-titulo"
              className="text-xs font-bold uppercase tracking-wide text-slate-700"
            >
              Diagnóstico final (sub)
            </h3>
            {hasPeriodontitis ? (
              <p className="mt-3 text-pretty text-2xl font-black leading-snug text-red-950 sm:text-3xl lg:text-4xl">
                Periodontite estágio {safeStage} (
                {extensionDescriptor.toLowerCase()}) — Grau {grade}
              </p>
            ) : (
              <p className="mt-3 text-pretty text-2xl font-black leading-snug text-emerald-950 sm:text-3xl lg:text-4xl">
                Periodonto saudável
              </p>
            )}
          </article>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
        <button
          type="button"
          onClick={onExport}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-800 px-6 py-3 text-base font-semibold text-white shadow-md transition-all duration-200 hover:from-emerald-800 hover:to-emerald-900 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-950 focus-visible:ring-offset-2 active:scale-[0.99] sm:min-h-[52px] sm:px-8"
        >
          <IconDownload className="h-5 w-5 shrink-0" aria-hidden />
          Exportar resultado
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border-2 border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:border-blue-400 hover:bg-blue-200/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2 active:scale-[0.99] sm:min-h-[52px] sm:px-8"
        >
          <IconRefresh className="h-5 w-5 shrink-0 text-blue-800" aria-hidden />
          Nova classificação
        </button>
      </div>
    </div>
  );
}
