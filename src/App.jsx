import React, { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";

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

  // Mapa de cores Tailwind convertidas para RGB
  const tailwindColors = {
    "text-zinc-800": "rgb(24, 24, 27)",
    "text-zinc-600": "rgb(82, 82, 91)",
    "text-zinc-500": "rgb(113, 113, 122)",
    "text-zinc-700": "rgb(63, 63, 70)",
    "bg-zinc-100": "rgb(244, 244, 245)",
    "bg-zinc-50": "rgb(250, 250, 250)",
    "bg-white": "rgb(255, 255, 255)",
    "bg-blue-600": "rgb(37, 99, 235)",
    "bg-emerald-600": "rgb(5, 150, 105)",
    "bg-emerald-700": "rgb(4, 120, 87)",
    "text-blue-600": "rgb(37, 99, 235)",
    "text-emerald-600": "rgb(5, 150, 105)",
    "text-emerald-700": "rgb(5, 150, 105)",
    "text-red-500": "rgb(239, 68, 68)",
    "border-zinc-200": "rgb(228, 228, 231)",
    "border-zinc-300": "rgb(212, 212, 216)",
  };

  // CSS completo para preservar formatação
  const exportCss = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    div {
      display: block;
    }
    
    .min-h-screen {
      min-height: 100vh;
    }
    
    .flex {
      display: flex;
    }
    
    .items-center {
      align-items: center;
    }
    
    .justify-center {
      justify-content: center;
    }
    
    .justify-between {
      justify-content: space-between;
    }
    
    .p-6 {
      padding: 1.5rem;
    }
    
    .p-8 {
      padding: 2rem;
    }
    
    .p-10 {
      padding: 2.5rem;
    }
    
    .p-5 {
      padding: 1.25rem;
    }
    
    .p-4 {
      padding: 1rem;
    }
    
    .px-5 {
      padding-left: 1.25rem;
      padding-right: 1.25rem;
    }
    
    .py-3 {
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
    }
    
    .py-12 {
      padding-top: 3rem;
      padding-bottom: 3rem;
    }
    
    .px-6 {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
    
    .py-3 {
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
    }
    
    .gap-4 {
      gap: 1rem;
    }
    
    .gap-6 {
      gap: 1.5rem;
    }
    
    .space-y-8 > * + * {
      margin-top: 2rem;
    }
    
    .space-y-12 > * + * {
      margin-top: 3rem;
    }
    
    .space-y-5 > * + * {
      margin-top: 1.25rem;
    }
    
    .space-y-4 > * + * {
      margin-top: 1rem;
    }
    
    .space-y-3 > * + * {
      margin-top: 0.75rem;
    }
    
    .mb-10 {
      margin-bottom: 2.5rem;
    }
    
    .mb-8 {
      margin-bottom: 2rem;
    }
    
    .mb-1 {
      margin-bottom: 0.25rem;
    }
    
    .mb-3 {
      margin-bottom: 0.75rem;
    }
    
    .mb-4 {
      margin-bottom: 1rem;
    }
    
    .mt-8 {
      margin-top: 2rem;
    }
    
    .mt-2 {
      margin-top: 0.5rem;
    }
    
    .w-full {
      width: 100%;
    }
    
    .max-w-6xl {
      max-width: 72rem;
    }
    
    .max-w-3xl {
      max-width: 48rem;
    }
    
    .rounded-3xl {
      border-radius: 1.5rem;
    }
    
    .rounded-2xl {
      border-radius: 1rem;
    }
    
    .rounded-2xl {
      border-radius: 1rem;
    }
    
    .shadow-2xl {
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    
    .shadow-xl {
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    
    .border {
      border: 1px solid;
    }
    
    .text-3xl {
      font-size: 1.875rem;
      line-height: 2.25rem;
    }
    
    .text-2xl {
      font-size: 1.5rem;
      line-height: 2rem;
    }
    
    .text-lg {
      font-size: 1.125rem;
      line-height: 1.75rem;
    }
    
    .text-sm {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
    
    .text-xs {
      font-size: 0.75rem;
      line-height: 1rem;
    }
    
    .text-5xl {
      font-size: 3rem;
      line-height: 1;
    }
    
    .font-black {
      font-weight: 900;
    }
    
    .font-bold {
      font-weight: 700;
    }
    
    .font-semibold {
      font-weight: 600;
    }
    
    .font-medium {
      font-weight: 500;
    }
    
    .uppercase {
      text-transform: uppercase;
    }
    
    .tracking-wide {
      letter-spacing: 0.05em;
    }
    
    .leading-relaxed {
      line-height: 1.625;
    }
    
    .grid {
      display: grid;
    }
    
    .grid-cols-1 {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    
    .lg\\:grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    
    .lg\\:col-span-2 {
      grid-column: span 2 / span 2;
    }
    
    .lg\\:flex-row {
      flex-direction: row;
    }
    
    .flex-wrap {
      flex-wrap: wrap;
    }
    
    .flex-col {
      flex-direction: column;
    }
    
    .sm\\:flex-row {
      flex-direction: row;
    }
    
    .text-left {
      text-align: left;
    }
    
    .text-center {
      text-align: center;
    }
    
    button {
      cursor: pointer;
      border: none;
      font-family: inherit;
    }
    
    button:hover {
      opacity: 0.9;
    }
    
    input {
      font-family: inherit;
    }
    
    input:focus {
      outline: none;
    }
    
    .flex.flex-col.items-center.justify-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      min-height: 100%;
    }
    
    .flex.flex-col.items-center.justify-center.py-12 {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding-top: 3rem;
      padding-bottom: 3rem;
      min-height: auto;
    }
    
    .flex.gap-4.justify-center {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    
    .flex.flex-col.gap-4.justify-center {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      justify-content: center;
    }
    
    .flex.flex-col.sm\\:flex-row {
      display: flex;
      flex-direction: column;
    }
    
    @media (min-width: 640px) {
      .flex.flex-col.sm\\:flex-row {
        flex-direction: row;
      }
    }
  `;

  const exportResult = async () => {
    try {
      if (!screenRef.current) {
        alert("Não foi possível encontrar a tela para exportar.");
        return;
      }

      // Criar um elemento clone para manipular sem afetar o original
      const clonedElement = screenRef.current.cloneNode(true);
      document.body.appendChild(clonedElement);
      clonedElement.style.position = "absolute";
      clonedElement.style.left = "-9999px";
      clonedElement.style.top = "-9999px";

      // REMOVER OS BOTÕES
      const buttonContainer = clonedElement.querySelector(".flex.flex-col.sm\\:flex-row");
      if (buttonContainer) {
        buttonContainer.remove();
      }

      // REMOVER O BADGE "Classificando Grau"
      const badges = clonedElement.querySelectorAll(".px-5.py-3.rounded-2xl.bg-zinc-100.border.border-zinc-200");
      badges.forEach(badge => {
        if (badge.textContent.includes("Classificando") || badge.textContent.includes("Diagnóstico") || badge.textContent.includes("Identificação") || badge.textContent.includes("Estágio")) {
          badge.remove();
        }
      });

      // Criar e injetar estilo CSS
      const styleElement = document.createElement("style");
      styleElement.textContent = exportCss;
      clonedElement.insertBefore(styleElement, clonedElement.firstChild);

      // Processar recursivamente todos os elementos
      const processAllElements = (el) => {
        if (el === styleElement) return; // Pular o style tag

        // Pegar todas as classes
        const classes = el.className.split(" ");

        // Aplicar cores baseado nas classes
        classes.forEach((className) => {
          if (className.startsWith("text-")) {
            const rgbColor = tailwindColors[className];
            if (rgbColor) el.style.color = rgbColor;
          }
          if (className.startsWith("bg-")) {
            const rgbBg = tailwindColors[className];
            if (rgbBg) el.style.backgroundColor = rgbBg;
          }
          if (className.startsWith("border-")) {
            const rgbBorder = tailwindColors[className];
            if (rgbBorder) el.style.borderColor = rgbBorder;
          }
        });

        // Processar filhos recursivamente
        Array.from(el.children).forEach(processAllElements);
      };

      processAllElements(clonedElement);

      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#f4f4f5",
      });

      document.body.removeChild(clonedElement);

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
    <div ref={screenRef} className="min-h-screen bg-zinc-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-zinc-800">
              Classificador Periodontal
            </h1>
          </div>

          <div className="px-5 py-3 rounded-2xl bg-zinc-100 border border-zinc-200 font-semibold text-zinc-700">
            {mode === "caseName"
              ? "Identificação do Caso"
              : mode === "supragingival"
              ? "Diagnóstico Supragengival"
              : mode === "stage"
              ? "Classificando Estágio"
              : "Classificando Grau"}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-50 border border-zinc-200 rounded-3xl p-6">
            {!isFinished ? (
              <>
                <div className="text-sm text-zinc-500 mb-1">
                  {mode === "caseName"
                    ? "Identificação do caso"
                    : mode === "supragingival"
                    ? "Diagnóstico supragengival"
                    : mode === "stage"
                    ? `Estágio - Pergunta ${currentQuestion + 1} de ${questions.length}`
                    : `Grau - Pergunta ${currentQuestion + 1} de ${questions.length}`}
                </div>

                <h2 className="text-2xl font-bold text-zinc-800 mb-8">
                  {mode === "caseName"
                    ? "Digite o número/nome do caso"
                    : questions[currentQuestion].title}
                </h2>

                {mode === "caseName" ? (
                  <div className="space-y-5">
                    <input
                      type="text"
                      value={caseName}
                      onChange={(e) => setCaseName(e.target.value)}
                      placeholder="Ex: Caso 3 / João da Silva"
                      className="w-full rounded-2xl border border-zinc-300 bg-white p-5 text-lg outline-none focus:border-blue-500"
                    />

                    <button
                      onClick={() => {
                        setMode("supragingival");
                        setCurrentQuestion(0);
                      }}
                      disabled={!caseName.trim()}
                      className="w-full rounded-2xl bg-blue-600 p-5 text-lg font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                      Iniciar classificação
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions[currentQuestion].options.map((option) => (
                      <button
                        key={option.label}
                        onClick={() => handleAnswer(option)}
                        className="w-full rounded-2xl border border-zinc-300 bg-white p-5 text-left transition hover:border-blue-500 hover:bg-blue-50"
                      >
                        <div className="font-medium text-zinc-800">
                          {option.label}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div
                  ref={resultRef}
                  className="w-full max-w-3xl rounded-3xl border border-zinc-200 bg-white p-10 shadow-xl"
                >
                  <div className="text-zinc-600 text-3xl font-black mb-10">
                    ({caseName}) - Resultado final:
                  </div>

                  <div className="space-y-12 text-left">
                    <div>
                      <div className="text-lg font-black uppercase tracking-wide text-zinc-600 mb-1">
                        Diagnóstico Supragengival:
                      </div>

                      <div
                        className={`text-3xl font-black leading-relaxed ${
                          supragingivalDiagnosis === "Paciente saudável"
                            ? "text-emerald-700"
                            : "text-red-500"
                        }`}
                      >
                        {supragingivalDiagnosis}
                        {hasAttachmentLoss &&
                        supragingivalDiagnosis !== "Paciente saudável"
                          ? " em periodonto reduzido"
                          : ""}
                      </div>
                    </div>

                    <div>
                      <div className="text-lg font-black uppercase tracking-wide text-zinc-600 mb-1">
                        Diagnóstico Final (sub):
                      </div>

                      {hasPeriodontitis ? (
                        <div className="text-3xl font-black text-red-500 leading-relaxed">
                          Periodontite estágio {safeStage} ({extensionDescriptor.toLowerCase()}) - Grau {grade}
                        </div>
                      ) : (
                        <div className="text-3xl font-black text-emerald-700 leading-relaxed">
                          Periodonto saudável
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <button
                    onClick={exportResult}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-semibold transition hover:bg-emerald-700"
                  >
                    Exportar resposta
                  </button>

                  <button
                    onClick={resetFlow}
                    className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold transition hover:bg-blue-700"
                  >
                    Fazer nova classificação
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6">
            <h3 className="text-xl font-bold text-zinc-800 mb-1">
              Progressão Atual
            </h3>

            <div className="space-y-5 mb-8">
              <div>
                <div className="text-sm text-zinc-500 mb-1">Estágio</div>

                <div className="text-5xl font-black text-blue-600">
                  {safeStage}
                </div>
              </div>

              <div>
                <div className="text-sm text-zinc-500 mb-1">Grau</div>

                <div className="text-5xl font-black text-emerald-600">
                  {grade}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-zinc-700">Histórico</h4>

              {history.length === 0 ? (
                <div className="text-sm text-zinc-500">
                  Nenhuma resposta registrada ainda.
                </div>
              ) : (
                history.map((item, index) => (
                  <div
                    key={`${item.question}-${index}`}
                    className="bg-white border border-zinc-200 rounded-2xl p-4"
                  >
                    <div className="font-semibold text-zinc-800 mb-1">
                      {item.question}
                    </div>

                    <div className="text-sm text-zinc-500 mb-3">
                      {item.answer}
                    </div>

                    <div className="font-bold text-blue-600">
                      {item.previous !== item.updated
                        ? `${item.previous} -> ${item.updated}`
                        : `Mantém ${item.updated}`}
                    </div>

                    {item.changed && (
                      <div className="mt-2 text-xs font-semibold text-emerald-600">
                        Gravidade aumentada neste critério
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}