const MODE_LABELS = {
  caseName: "Identificação do caso",
  supragingival: "Diagnóstico supragengival",
  stage: "Classificação de estágio",
  grade: "Classificação de grau",
  finished: "Resultado final",
};

export default function ClassifierHeader({ mode }) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Periodontia · 2017
        </p>
        <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Classificador periodontal
        </h1>
        <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-slate-600 sm:text-base">
          Fluxo guiado para estágio, grau e diagnóstico supragengival, com
          histórico e exportação do resultado.
        </p>
      </div>
      <div className="inline-flex shrink-0 items-center gap-2 self-start rounded-2xl border border-slate-200/90 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-900/[0.04] sm:self-auto">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
        </span>
        {MODE_LABELS[mode] ?? MODE_LABELS.caseName}
      </div>
    </header>
  );
}
