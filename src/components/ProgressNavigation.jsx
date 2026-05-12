function StepPill({ step, index, onNavigate, variant = "mobile" }) {
  const isDone = step.status === "completed";
  const isCurrent = step.status === "current";
  const isFuture = step.status === "future";
  const disabled = isFuture;
  const isDesktop = variant === "desktop";

  return (
    <button
      type="button"
      onClick={() => onNavigate(step)}
      disabled={disabled}
      aria-current={isCurrent ? "step" : undefined}
      className={[
        "group flex items-center gap-3 rounded-xl border text-left transition-all duration-200",
        "min-h-[44px] touch-manipulation",
        isDesktop ? "w-full px-3 py-2.5" : "shrink-0 px-3 py-2",
        isDone &&
          "border-emerald-500/35 bg-emerald-500/10 text-emerald-50 shadow-sm hover:border-emerald-400/55 hover:bg-emerald-500/15 active:scale-[0.99]",
        isCurrent &&
          (isDesktop
            ? "border-white/25 bg-white text-slate-900 shadow-lg ring-2 ring-blue-400/35 hover:shadow-xl active:scale-[0.99]"
            : "border-blue-400/80 bg-white text-slate-900 shadow-md ring-2 ring-blue-500/25 hover:shadow-lg active:scale-[0.99]"),
        isFuture &&
          (isDesktop
            ? "cursor-not-allowed border-white/10 bg-white/5 text-slate-500 opacity-60"
            : "cursor-not-allowed border-slate-200/80 bg-slate-100/80 text-slate-400 opacity-70"),
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
          isDone && "bg-emerald-500 text-white shadow-inner",
          isCurrent &&
            "bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-sm",
          isFuture && (isDesktop ? "bg-slate-700 text-slate-400" : "bg-slate-200 text-slate-500"),
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {isDone ? (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          index + 1
        )}
      </span>
      <span
        className={[
          "text-xs font-semibold leading-snug",
          isDesktop ? "flex-1 text-[13px]" : "max-w-[10.5rem] sm:max-w-[12rem]",
        ].join(" ")}
      >
        {step.title}
      </span>
    </button>
  );
}

export default function ProgressNavigation({
  progressSteps,
  currentStepIndex,
  totalSteps,
  onNavigateToStep,
}) {
  const denom = Math.max(1, totalSteps - 1);
  const pct = Math.round((Math.max(0, currentStepIndex) / denom) * 100);

  return (
    <>
      {/* Mobile / tablet: faixa superior + scroll horizontal */}
      <div className="border-b border-white/10 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 lg:hidden">
        <div className="p-4 sm:p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Progresso
              </p>
              <p className="mt-1 text-lg font-bold tracking-tight text-white">
                {pct}% <span className="text-slate-400">concluído</span>
              </p>
            </div>
            <div className="text-right text-xs text-slate-400">
              Etapa {Math.max(1, currentStepIndex + 1)} / {totalSteps}
            </div>
          </div>
          <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 transition-[width] duration-500 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="border-t border-white/10 bg-slate-950/40 px-3 pb-3 pt-2">
          <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1 pt-1 [-webkit-overflow-scrolling:touch]">
            {progressSteps.map((step, index) => (
              <StepPill
                key={step.id}
                step={step}
                index={index}
                onNavigate={onNavigateToStep}
                variant="mobile"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: sidebar vertical */}
      <aside className="relative hidden w-full shrink-0 border-r border-white/10 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 lg:flex lg:w-80 lg:flex-col lg:p-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 0%, rgba(59,130,246,0.9), transparent 55%), radial-gradient(circle at 100% 80%, rgba(16,185,129,0.55), transparent 45%)",
          }}
        />
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Fluxo clínico
          </p>
          <h2 className="mt-2 text-lg font-bold leading-snug text-white">
            Progresso da classificação
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {pct}% concluído — toque nas etapas respondidas para revisar.
          </p>
          <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 transition-[width] duration-500 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <nav
          className="relative mt-6 flex flex-1 flex-col gap-1.5 overflow-y-auto pr-1 scrollbar-thin"
          aria-label="Etapas do classificador"
        >
          {progressSteps.map((step, index) => (
            <StepPill
              key={step.id}
              step={step}
              index={index}
              onNavigate={onNavigateToStep}
              variant="desktop"
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
