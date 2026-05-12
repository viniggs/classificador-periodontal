import { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import ClassifierHeader from "./components/ClassifierHeader.jsx";
import FinishedResultView from "./components/FinishedResultView.jsx";
import HistoryAndMetricsPanel from "./components/HistoryAndMetricsPanel.jsx";
import ProgressNavigation from "./components/ProgressNavigation.jsx";

export default function PeriodontalClassifier() {
  const STAGE_NAMES = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
  };

  const supragingivalQuestion = {
    id: 0,
    title: "Diagnóstico supragengival",
    options: [
      {
        label: "ISG menor que 10%",
        diagnosis: "Paciente saudável",
      },
      {
        label: "ISG entre 10% e 30%",
        diagnosis: "Gengivite localizada",
      },
      {
        label: "ISG maior que 30%",
        diagnosis: "Gengivite generalizada",
      },
    ],
  };

  const stageQuestions = useMemo(
    () => [
      {
        id: 1,
        title: "MAIOR perda de inserção interproximal (PI)",
        options: [
          { label: "Sem perda de inserção", value: 0 },
          { label: "1-2 mm", value: 1 },
          { label: "3-4 mm", value: 2 },
          { label: "5 mm ou mais", value: 3 },
        ],
      },
      {
        id: 2,
        title: "Perda óssea radiográfica",
        options: [
          { label: "Terço coronário (<15%)", value: 1 },
          { label: "Terço coronário (15-33%)", value: 2 },
          { label: "Terço médio da raiz e além", value: 3 },
        ],
      },
      {
        id: 3,
        title: "Perda dentária por periodontite",
        options: [
          { label: "Nenhuma perda", value: 1 },
          { label: "Até 4 dentes", value: 3 },
          { label: "5 dentes ou mais", value: 4 },
        ],
      },
      {
        id: 4,
        title: "Complexidade do caso",
        options: [
          { label: "Nenhuma complexidade importante", value: 1 },
          { label: "PS máxima até 5 mm", value: 2 },
          {
            label:
              "PS 6 mm ou mais, defeitos verticais ou furca classe II/III",
            value: 3,
          },
          {
            label:
              "Colapso de mordida, menos de 10 pares oclusais ou reabilitação extensa",
            value: 4,
          },
        ],
      },
      {
        id: 5,
        title: "Extensão e distribuição",
        options: [
          {
            label: "Afeta apenas incisivos e molares",
            descriptor: "Padrão incisivo-molar",
          },
          {
            label: "Menos de 30% dos dentes envolvidos",
            descriptor: "Localizada",
          },
          {
            label: "Mais de 30% dos dentes envolvidos",
            descriptor: "Generalizada",
          },
        ],
      },
    ],
    []
  );

  const gradeQuestions = useMemo(
    () => [
      {
        id: 1,
        title: "Evidência direta de progressão",
        options: [
          {
            label: "Histórico de exames ausente",
            value: "NONE",
          },
          { label: "Sem PI em 5 anos", value: "A" },
          { label: "PI Menor que 2 mm em 5 anos", value: "B" },
          { label: "PI de 2 mm ou mais em 5 anos", value: "C" },
        ],
      },
      {
        id: 2,
        title: "% perda óssea / idade",
        options: [
          { label: "Menor que 0,25", value: "A" },
          { label: "0,25 até 1,0", value: "B" },
          { label: "Maior que 1,0", value: "C" },
        ],
      },
      {
        id: 3,
        title: "Fenótipo do caso",
        options: [
          { label: "Destruição lenta", value: "A" },
          { label: "Compatível com biofilme", value: "B" },
          { label: "Destruição excede biofilme", value: "C" },
        ],
      },
      {
        id: 4,
        title: "Tabagismo",
        options: [
          { label: "Não fumante", value: "A" },
          { label: "Menos de 10 cigarros/dia", value: "B" },
          { label: "10 cigarros/dia ou mais", value: "C" },
        ],
      },
      {
        id: 5,
        title: "Diabetes",
        options: [
          { label: "Sem diabetes", value: "A" },
          { label: "HbA1c menor que 7%", value: "B" },
          { label: "HbA1c 7% ou mais", value: "C" },
        ],
      },
    ],
    []
  );

  const gradePriority = {
    A: 1,
    B: 2,
    C: 3,
  };

  // Novo: steps para progresso
  const steps = useMemo(() => [
    { id: 0, title: "Identificação do Caso", mode: "caseName", questionIndex: 0 },
    { id: 1, title: "Diagnóstico Supragengival", mode: "supragingival", questionIndex: 0 },
    { id: 2, title: "Perda de Inserção Interproximal", mode: "stage", questionIndex: 0 },
    { id: 3, title: "Perda Óssea Radiográfica", mode: "stage", questionIndex: 1 },
    { id: 4, title: "Perda Dentária por Periodontite", mode: "stage", questionIndex: 2 },
    { id: 5, title: "Complexidade do Caso", mode: "stage", questionIndex: 3 },
    { id: 6, title: "Extensão e Distribuição", mode: "stage", questionIndex: 4 },
    { id: 7, title: "Evidência Direta de Progressão", mode: "grade", questionIndex: 0 },
    { id: 8, title: "% Perda Óssea / Idade", mode: "grade", questionIndex: 1 },
    { id: 9, title: "Fenótipo do Caso", mode: "grade", questionIndex: 2 },
    { id: 10, title: "Tabagismo", mode: "grade", questionIndex: 3 },
    { id: 11, title: "Diabetes", mode: "grade", questionIndex: 4 },
    { id: 12, title: "Resultado Final", mode: "finished", questionIndex: 0 },
  ], []);

  const [mode, setMode] = useState("caseName");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [stage, setStage] = useState(0);
  const [grade, setGrade] = useState("-");
  const [history, setHistory] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [supragingivalDiagnosis, setSupragingivalDiagnosis] = useState("");
  const [extensionDescriptor, setExtensionDescriptor] = useState("");
  const [hasAttachmentLoss, setHasAttachmentLoss] = useState(false);
  const [hasPeriodontitis, setHasPeriodontitis] = useState(false);
  const [caseName, setCaseName] = useState("");

  const resultRef = useRef(null);
  const screenRef = useRef(null);

  const questions =
    mode === "caseName"
      ? []
      : mode === "supragingival"
      ? [supragingivalQuestion]
      : mode === "stage"
      ? stageQuestions
      : gradeQuestions;

  const safeStage = STAGE_NAMES[stage] || "-";

  // Novo: calcular progresso
  const rawStepIndex = isFinished
    ? steps.length - 1
    : steps.findIndex(
        (step) => step.mode === mode && step.questionIndex === currentQuestion
      );
  const currentStepIndex = rawStepIndex < 0 ? 0 : rawStepIndex;
  const progressSteps = steps.map((step, index) => ({
    ...step,
    status:
      index < currentStepIndex
        ? "completed"
        : index === currentStepIndex
          ? "current"
          : "future",
  }));

  const resetFlow = () => {
    setMode("caseName");
    setCaseName("");
    setCurrentQuestion(0);
    setStage(0);
    setGrade("-");
    setHistory([]);
    setIsFinished(false);
    setSupragingivalDiagnosis("");
    setExtensionDescriptor("");
    setHasAttachmentLoss(false);
    setHasPeriodontitis(false);
  };

  // Novo: navegar para step
  const navigateToStep = (step) => {
    if (step.status === 'completed' || step.status === 'current') {
      setMode(step.mode);
      setCurrentQuestion(step.questionIndex);
      if (step.mode === 'finished') {
        setIsFinished(true);
      } else {
        setIsFinished(false);
      }
    }
  };

  const handleAnswer = (option) => {
    if (mode === "supragingival") {
      setSupragingivalDiagnosis(option.diagnosis);

      setHistory((prev) => [
        ...prev,
        {
          type: "supragingival",
          question: supragingivalQuestion.title,
          answer: option.label,
          previous: "-",
          updated: option.diagnosis,
          changed: true,
        },
      ]);

      setMode("stage");
      setCurrentQuestion(0);
      return;
    }

    if (mode === "stage") {
      if (questions[currentQuestion].title === "Extensão e distribuição") {
        setExtensionDescriptor(option.descriptor);

        setHistory((prev) => [
          ...prev,
          {
            type: "stage",
            question: questions[currentQuestion].title,
            answer: option.label,
            previous: "-",
            updated: option.descriptor,
            changed: true,
          },
        ]);
      } else {
        const previousStage = stage;
        const updatedStage = Math.max(previousStage, option.value);

        setStage(updatedStage);

        setHistory((prev) => [
          ...prev,
          {
            type: "stage",
            question: questions[currentQuestion].title,
            answer: option.label,
            previous: previousStage,
            updated: updatedStage,
            changed: updatedStage > previousStage,
          },
        ]);

        if (
          questions[currentQuestion].title ===
          "MAIOR perda de inserção interproximal (PI)"
        ) {
          if (option.value === 0) {
            setHasAttachmentLoss(false);
            setHasPeriodontitis(false);

            setHistory((prev) => [
              ...prev,
              {
                type: "stage",
                question: "Conclusão automática",
                answer: "Sem perda de inserção",
                previous: "-",
                updated: "Paciente sem periodontite",
                changed: false,
              },
            ]);

            setIsFinished(true);
            return;
          }

          setHasAttachmentLoss(true);
          setHasPeriodontitis(true);
        }
      }
    }

    if (mode === "grade") {
      if (option.value === "NONE") {
        setHistory((prev) => [
          ...prev,
          {
            type: "grade",
            question: questions[currentQuestion].title,
            answer: option.label,
            previous: grade,
            updated: grade,
            changed: false,
          },
        ]);
      } else {
        const previousPriority = grade === "-" ? 0 : gradePriority[grade];
        const selectedPriority = gradePriority[option.value];

        const updatedPriority = Math.max(
          previousPriority,
          selectedPriority
        );

        const updatedGrade = Object.keys(gradePriority).find(
          (key) => gradePriority[key] === updatedPriority
        );

        setGrade(updatedGrade || "C");

        setHistory((prev) => [
          ...prev,
          {
            type: "grade",
            question: questions[currentQuestion].title,
            answer: option.label,
            previous: grade,
            updated: updatedGrade || "C",
            changed: updatedGrade !== grade,
          },
        ]);
      }
    }

    const nextQuestion = currentQuestion + 1;

    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      return;
    }

    if (mode === "stage") {
      setMode("grade");
      setCurrentQuestion(0);
      return;
    }

    setIsFinished(true);
  };

  const exportResult = async () => {
    try {
      if (!screenRef.current) {
        alert("Não foi possível encontrar a tela para exportar.");
        return;
      }

      // Armazenar estilos originais antes de fazer qualquer mudança
      const originalStyles = new Map();
      const elementsWithGradients = screenRef.current.querySelectorAll("[class*='gradient']");
      
      elementsWithGradients.forEach(el => {
        originalStyles.set(el, el.style.background);
        // Converter gradientes para cores sólidas
        if (el.classList.contains('from-blue-600') && el.classList.contains('to-blue-800')) {
          el.style.background = 'rgb(37, 99, 235)';
        } else if (el.classList.contains('from-blue-500') && el.classList.contains('to-blue-700')) {
          el.style.background = 'rgb(59, 130, 246)';
        } else if (el.classList.contains('from-blue-600') && el.classList.contains('to-blue-700')) {
          el.style.background = 'rgb(37, 99, 235)';
        } else if (el.classList.contains('from-slate-50') && el.classList.contains('to-blue-50')) {
          el.style.background = 'rgb(248, 250, 252)';
        } else if (el.classList.contains('from-blue-100') && el.classList.contains('to-blue-200')) {
          el.style.background = 'rgb(219, 234, 254)';
        } else if (el.classList.contains('from-emerald-400') && el.classList.contains('to-emerald-600')) {
          el.style.background = 'rgb(52, 211, 153)';
        } else if (el.classList.contains('from-green-400') && el.classList.contains('to-green-600')) {
          el.style.background = 'rgb(74, 222, 128)';
        } else if (
          el.classList.contains('from-slate-900') &&
          el.classList.contains('to-slate-950')
        ) {
          el.style.background = 'rgb(15, 23, 42)';
        } else if (
          el.classList.contains('from-blue-400') &&
          el.classList.contains('to-emerald-400')
        ) {
          el.style.background = 'rgb(37, 99, 235)';
        } else if (
          el.classList.contains('from-emerald-600') &&
          el.classList.contains('to-emerald-700')
        ) {
          el.style.background = 'rgb(5, 150, 105)';
        } else {
          el.style.background = '';
        }
      });

      // Capturar
      const canvas = await html2canvas(screenRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        windowWidth: screenRef.current.scrollWidth,
        windowHeight: screenRef.current.scrollHeight,
      });

      // Restaurar os estilos originais
      originalStyles.forEach((originalStyle, el) => {
        el.style.background = originalStyle || '';
      });

      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.download = `${caseName || "caso"}-resultado-periodontal.png`;
      link.href = image;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao exportar imagem:", error);
      alert("Não foi possível exportar a imagem.");
    }
  };

  return (
    <div
      ref={screenRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/60 px-3 py-4 sm:px-5 sm:py-8 lg:flex lg:items-stretch lg:justify-center lg:py-10"
    >
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/[0.04]">
        <div className="flex flex-col lg:min-h-[min(100vh-4rem,920px)] lg:flex-row">
          <ProgressNavigation
            progressSteps={progressSteps}
            currentStepIndex={currentStepIndex}
            totalSteps={steps.length}
            onNavigateToStep={navigateToStep}
          />

          <div className="flex min-w-0 flex-1 flex-col">
            <main className="flex-1 px-4 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
              <ClassifierHeader mode={isFinished ? "finished" : mode} />

              <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50/90 via-white to-blue-50/25 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-900/[0.03] sm:p-7 lg:p-8">
                {!isFinished ? (
                  <>
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {mode === "caseName"
                        ? "Identificação do caso"
                        : mode === "supragingival"
                          ? "Diagnóstico supragengival"
                          : mode === "stage"
                            ? `Estágio — pergunta ${currentQuestion + 1} de ${questions.length}`
                            : `Grau — pergunta ${currentQuestion + 1} de ${questions.length}`}
                    </div>

                    <div
                      key={`${mode}-${currentQuestion}`}
                      className="animate-qp-enter"
                    >
                      <h2 className="mt-3 text-balance text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
                        {mode === "caseName"
                          ? "Digite o número ou nome do caso"
                          : questions[currentQuestion].title}
                      </h2>

                      {mode === "caseName" ? (
                        <div className="mt-8 space-y-5">
                          <label className="sr-only" htmlFor="case-name-input">
                            Nome ou número do caso
                          </label>
                          <input
                            id="case-name-input"
                            type="text"
                            value={caseName}
                            onChange={(e) => setCaseName(e.target.value)}
                            placeholder="Ex.: Caso 3 / João da Silva"
                            autoComplete="off"
                            className="w-full min-h-[52px] rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base text-slate-900 shadow-sm outline-none ring-0 transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)] sm:text-lg"
                          />

                          <button
                            type="button"
                            onClick={() => {
                              setMode("supragingival");
                              setCurrentQuestion(0);
                            }}
                            disabled={!caseName.trim()}
                            className="flex w-full min-h-[52px] items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 px-5 py-4 text-base font-bold text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-900 hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45 sm:text-lg"
                          >
                            Iniciar classificação
                          </button>
                        </div>
                      ) : (
                        <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-3.5">
                          {questions[currentQuestion].options.map((option) => (
                            <button
                              type="button"
                              key={option.label}
                              onClick={() => handleAnswer(option)}
                              className="group flex w-full min-h-[52px] items-start rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/60 hover:shadow-md active:scale-[0.99] sm:min-h-[56px] sm:px-6 sm:py-5"
                            >
                              <span className="mt-0.5 mr-3 hidden h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600 opacity-0 transition-opacity group-hover:opacity-100 sm:block" />
                              <span className="text-base font-semibold leading-snug text-slate-800 transition-colors group-hover:text-blue-900 sm:text-lg">
                                {option.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <FinishedResultView
                    resultRef={resultRef}
                    caseName={caseName}
                    supragingivalDiagnosis={supragingivalDiagnosis}
                    hasAttachmentLoss={hasAttachmentLoss}
                    hasPeriodontitis={hasPeriodontitis}
                    safeStage={safeStage}
                    extensionDescriptor={extensionDescriptor}
                    grade={grade}
                    onExport={exportResult}
                    onReset={resetFlow}
                  />
                )}
              </div>

              {!isFinished && (
                <HistoryAndMetricsPanel
                  safeStage={safeStage}
                  grade={grade}
                  history={history}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}