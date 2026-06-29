// Anamnese infantil - 30 perguntas em 6 grupos.
// Fonte da verdade: RAG Notion "07 - Pamella Freitas".
// Respondida SEMPRE pelo responsavel legal, nunca pela crianca.

export interface QuestionnaireQuestion {
  id: string;
  group: number;
  order: number;
  prompt: string;
}

export interface QuestionnaireGroup {
  group: number;
  key: string;
  title: string;
  description: string;
  questions: QuestionnaireQuestion[];
}

export const QUESTIONNAIRE: QuestionnaireGroup[] = [
  {
    group: 1,
    key: 'identificacao',
    title: 'Identificacao e motivo da procura',
    description: 'O ponto de partida: o que traz voces ate aqui, agora.',
    questions: [
      { id: 'g1q1', group: 1, order: 1, prompt: 'O que esta acontecendo que fez voces buscarem ajuda agora? Desde quando perceberam?' },
      { id: 'g1q2', group: 1, order: 2, prompt: 'Como isso aparece no dia a dia da crianca? Em que momentos fica mais evidente?' },
      { id: 'g1q3', group: 1, order: 3, prompt: 'O que voces esperam ou desejam que melhore com o acompanhamento?' },
      { id: 'g1q4', group: 1, order: 4, prompt: 'A crianca ja passou por atendimento psicologico, psiquiatrico, fonoaudiologico ou neurologico antes? Como foi?' },
      { id: 'g1q5', group: 1, order: 5, prompt: 'Existe algum diagnostico, laudo ou hipotese ja levantada por outro profissional?' },
    ],
  },
  {
    group: 2,
    key: 'gestacao',
    title: 'Gestacao, parto e primeiros anos',
    description: 'A historia do comeco, no tempo de cada crianca.',
    questions: [
      { id: 'g2q1', group: 2, order: 1, prompt: 'Como foi a gestacao? Houve intercorrencias, uso de medicacao ou estresse importante?' },
      { id: 'g2q2', group: 2, order: 2, prompt: 'Como foi o parto (tipo, tempo, intercorrencias) e os primeiros dias de vida?' },
      { id: 'g2q3', group: 2, order: 3, prompt: 'Em que idade sentou, engatinhou, andou e falou as primeiras palavras? Algo chamou atencao?' },
      { id: 'g2q4', group: 2, order: 4, prompt: 'Como foi a amamentacao e a introducao alimentar?' },
      { id: 'g2q5', group: 2, order: 5, prompt: 'Houve separacoes longas, mudancas grandes ou perdas importantes nos primeiros anos?' },
    ],
  },
  {
    group: 3,
    key: 'saude',
    title: 'Saude, sono e rotina fisica',
    description: 'Como o corpo dela tem estado.',
    questions: [
      { id: 'g3q1', group: 3, order: 1, prompt: 'Como e a saude geral hoje? Alguma condicao, alergia, medicacao continua ou acompanhamento medico?' },
      { id: 'g3q2', group: 3, order: 2, prompt: 'Como e o sono: horario, qualidade, dorme sozinha, pesadelos, dificuldades?' },
      { id: 'g3q3', group: 3, order: 3, prompt: 'Como e a alimentacao: come de tudo, e seletiva, tem alguma relacao dificil com comida?' },
      { id: 'g3q4', group: 3, order: 4, prompt: 'Ja teve internacoes, cirurgias, convulsoes ou episodios de saude marcantes?' },
      { id: 'g3q5', group: 3, order: 5, prompt: 'Como descreveriam o nivel de energia e agitacao dela no geral?' },
    ],
  },
  {
    group: 4,
    key: 'comportamento',
    title: 'Comportamento e emocoes',
    description: 'Como ela sente e mostra o que sente.',
    questions: [
      { id: 'g4q1', group: 4, order: 1, prompt: 'Como reage quando contrariada, frustrada ou diante de um "nao"?' },
      { id: 'g4q2', group: 4, order: 2, prompt: 'Como expressa o que sente? (fala, guarda para si, somatiza, explode)' },
      { id: 'g4q3', group: 4, order: 3, prompt: 'Existem medos, manias, rituais ou comportamentos repetitivos?' },
      { id: 'g4q4', group: 4, order: 4, prompt: 'Como e o humor no geral? Mudou algo recentemente?' },
      { id: 'g4q5', group: 4, order: 5, prompt: 'O que mais te preocupa hoje no comportamento ou no emocional dela?' },
    ],
  },
  {
    group: 5,
    key: 'escola',
    title: 'Escola, aprendizagem e socializacao',
    description: 'A crianca no mundo, fora de casa.',
    questions: [
      { id: 'g5q1', group: 5, order: 1, prompt: 'Como e o desempenho e a relacao dela com a escola? Gosta de ir?' },
      { id: 'g5q2', group: 5, order: 2, prompt: 'A escola ja trouxe alguma observacao sobre comportamento, atencao ou aprendizagem?' },
      { id: 'g5q3', group: 5, order: 3, prompt: 'Como se relaciona com outras criancas?' },
      { id: 'g5q4', group: 5, order: 4, prompt: 'Como lida com regras, combinados e figuras de autoridade fora de casa?' },
      { id: 'g5q5', group: 5, order: 5, prompt: 'Ha algo que ela faca com muito prazer ou facilidade - algo em que brilha?' },
    ],
  },
  {
    group: 6,
    key: 'familia',
    title: 'Familia, rotina e dinamica em casa',
    description: 'O solo onde ela cresce todos os dias.',
    questions: [
      { id: 'g6q1', group: 6, order: 1, prompt: 'Quem mora na casa e qual a relacao da crianca com cada pessoa?' },
      { id: 'g6q2', group: 6, order: 2, prompt: 'Como e a rotina de um dia tipico, do acordar ao dormir?' },
      { id: 'g6q3', group: 6, order: 3, prompt: 'Como sao colocados os limites e combinados em casa? Voces se sentem alinhados?' },
      { id: 'g6q4', group: 6, order: 4, prompt: 'Houve mudancas recentes na familia (mudanca de casa, separacao, novo irmao, perda, troca de escola)?' },
      { id: 'g6q5', group: 6, order: 5, prompt: 'Tem algo que gostariam que a psicologa soubesse e que nenhuma pergunta acima tocou?' },
    ],
  },
];

export const ALL_QUESTIONS: QuestionnaireQuestion[] = QUESTIONNAIRE.flatMap((g) => g.questions);
export const QUESTION_IDS: string[] = ALL_QUESTIONS.map((q) => q.id);
export const TOTAL_GROUPS = QUESTIONNAIRE.length;
export const TOTAL_QUESTIONS = ALL_QUESTIONS.length;

export function isValidQuestionId(id: string): boolean {
  return QUESTION_IDS.includes(id);
}

export function groupByNumber(group: number): QuestionnaireGroup | undefined {
  return QUESTIONNAIRE.find((g) => g.group === group);
}
