import { useRef, useState } from "react";
import ClassifierHeader from "./components/ClassifierHeader.jsx";
import FinishedResultView from "./components/FinishedResultView.jsx";
import HistoryAndMetricsPanel from "./components/HistoryAndMetricsPanel.jsx";
import ProgressNavigation from "./components/ProgressNavigation.jsx";
import {
  gradePriority,
  gradeQuestions,
  STAGE_NAMES,
  stageQuestions,
  steps,
  supragingivalQuestion,
} from "./constants/classifierData.js";
import {
  captureNodeToPngDataUrl,
  downloadDataUrl,
} from "./utils/exportScreenshot.js";

export default function PeriodontalClassifier() {
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
    const root = screenRef.current;
    if (!root) {
      alert("Não foi possível encontrar a tela para exportar.");
      return;
    }

    try {
      const dataUrl = await captureNodeToPngDataUrl(root, {
        scale: 2,
        backgroundColor: null,
      });
      downloadDataUrl(
        dataUrl,
        `${caseName || "caso"}-resultado-periodontal.png`
      );
    } catch (error) {
      console.error("Erro ao exportar imagem:", error);
      alert("Não foi possível exportar a imagem.");
    }
  };

  return (
    <div
      ref={screenRef}
      className="min-h-screen bg-blue-200/90 px-3 py-4 sm:px-5 sm:py-8 lg:flex lg:items-stretch lg:justify-center lg:py-10"
    >
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/[0.04]">
        <div className="flex flex-col lg:min-h-[calc(100vh-5rem)] lg:flex-row">
          <ProgressNavigation
            progressSteps={progressSteps}
            currentStepIndex={currentStepIndex}
            totalSteps={steps.length}
            onNavigateToStep={navigateToStep}
          />

          <div className="flex min-w-0 flex-1 flex-col bg-slate-50">
            <main className="flex-1 px-4 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
              <ClassifierHeader mode={isFinished ? "finished" : mode} />

              <div
                className={
                  isFinished
                    ? "rounded-3xl border border-slate-300/90 bg-slate-50 p-5 shadow-[0_4px_20px_rgba(15,23,42,0.07)] ring-1 ring-slate-900/[0.06] sm:p-7 lg:p-8"
                    : mode === "caseName"
                      ? "rounded-3xl border border-slate-300/90 bg-slate-50 p-5 shadow-[0_4px_20px_rgba(15,23,42,0.07)] ring-1 ring-slate-900/[0.06] sm:p-7 lg:p-8"
                      : "rounded-3xl border border-blue-300/90 bg-blue-200/90 p-5 shadow-[0_4px_20px_rgba(30,58,138,0.12)] ring-1 ring-blue-900/10 sm:p-7 lg:p-8"
                }
              >
                {!isFinished ? (
                  <>
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
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
                            className="w-full min-h-[52px] rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.08)] outline-none ring-0 transition-all duration-200 placeholder:text-slate-500 focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,99,235,0.2)] sm:text-lg"
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
                              className="group flex w-full min-h-[52px] items-start rounded-2xl border border-slate-300 bg-white px-5 py-4 text-left shadow-[0_1px_3px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-200/50 hover:shadow-[0_4px_14px_rgba(37,99,235,0.15)] active:scale-[0.99] sm:min-h-[56px] sm:px-6 sm:py-5"
                            >
                              <span className="mt-1 mr-3 hidden h-2 w-2 shrink-0 rounded-full border border-slate-400 bg-slate-200 transition-all group-hover:border-blue-500 group-hover:bg-blue-600 sm:block" />
                              <span className="text-base font-semibold leading-snug text-slate-900 transition-colors group-hover:text-blue-950 sm:text-lg">
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