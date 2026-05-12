/** Dados estáticos do fluxo clínico (2017) — não alterar labels/valores sem revisão clínica. */

export const STAGE_NAMES = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
};

export const supragingivalQuestion = {
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

export const stageQuestions = [
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
];

export const gradeQuestions = [
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
];

export const gradePriority = {
  A: 1,
  B: 2,
  C: 3,
};

export const steps = [
  { id: 0, title: "Identificação do Caso", mode: "caseName", questionIndex: 0 },
  {
    id: 1,
    title: "Diagnóstico Supragengival",
    mode: "supragingival",
    questionIndex: 0,
  },
  {
    id: 2,
    title: "Perda de Inserção Interproximal",
    mode: "stage",
    questionIndex: 0,
  },
  {
    id: 3,
    title: "Perda Óssea Radiográfica",
    mode: "stage",
    questionIndex: 1,
  },
  {
    id: 4,
    title: "Perda Dentária por Periodontite",
    mode: "stage",
    questionIndex: 2,
  },
  {
    id: 5,
    title: "Complexidade do Caso",
    mode: "stage",
    questionIndex: 3,
  },
  {
    id: 6,
    title: "Extensão e Distribuição",
    mode: "stage",
    questionIndex: 4,
  },
  {
    id: 7,
    title: "Evidência Direta de Progressão",
    mode: "grade",
    questionIndex: 0,
  },
  {
    id: 8,
    title: "% Perda Óssea / Idade",
    mode: "grade",
    questionIndex: 1,
  },
  { id: 9, title: "Fenótipo do Caso", mode: "grade", questionIndex: 2 },
  { id: 10, title: "Tabagismo", mode: "grade", questionIndex: 3 },
  { id: 11, title: "Diabetes", mode: "grade", questionIndex: 4 },
  { id: 12, title: "Resultado Final", mode: "finished", questionIndex: 0 },
];
