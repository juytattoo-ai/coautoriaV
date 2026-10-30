import { supabase } from './supabase';

// Banco de Desafios Criativos do Coautoria (alternam automaticamente a cada 3 dias)
export const STORY_CHALLENGES_DB = [
  {
    id: 'ch-1',
    title: 'Ponte entre Memórias',
    prompt: 'Crie uma história que conecte duas histórias suas existentes.',
    hint: 'Escolha duas lembranças de épocas diferentes e descubra o fio invisível que une quem você era nas duas situações.',
    suggestedTheme: 'Lição de Vida',
  },
  {
    id: 'ch-2',
    title: 'O Objeto no Seu Olhar',
    prompt: 'Crie uma história com algum objeto que está enxergando nesse exato momento.',
    hint: 'Olhe ao seu redor agora. Escolha o primeiro objeto que chamar sua atenção e conte uma memória ou reflexão despertada por ele.',
    suggestedTheme: 'Alegre',
  },
  {
    id: 'ch-3',
    title: 'O Cheiro da Infância',
    prompt: 'Escreva uma história a partir de um cheiro ou sabor que leva você imediatamente de volta à infância.',
    hint: 'Pode ser café passado na hora, terra molhada de chuva, bolo no forno ou o perfume de alguém querido.',
    suggestedTheme: 'Amor & Família',
  },
  {
    id: 'ch-4',
    title: 'A Frase que Ficou',
    prompt: 'Conte a história por trás de um conselho ou frase que alguém lhe disse e você nunca esqueceu.',
    hint: 'Quem disse essa frase? Onde vocês estavam e por que essas palavras mudaram seu jeito de ver a vida?',
    suggestedTheme: 'Lição de Vida',
  },
  {
    id: 'ch-5',
    title: 'Desvio de Rota',
    prompt: 'Relate um pequeno imprevisto ou erro de caminho que acabou levando você a um encontro ou descoberta feliz.',
    hint: 'Às vezes os melhores capítulos nascem quando o plano original dá errado.',
    suggestedTheme: 'Mudança de Vida',
  },
  {
    id: 'ch-6',
    title: 'Fotografia Imaginária',
    prompt: 'Se você pudesse tirar uma única fotografia de um momento que viveu sem câmera na mão, qual cena seria?',
    hint: 'Descreva as cores, a luz, as pessoas presentes e o sentimento exato daquele instante.',
    suggestedTheme: 'Amor & Família',
  },
  {
    id: 'ch-7',
    title: 'Pequena Coragem Silenciosa',
    prompt: 'Conte sobre um dia em que você teve coragem sem que ninguém ao redor percebesse.',
    hint: 'Nem toda bravura faz barulho. Qual foi a vitória íntima que só você sabe o quanto custou?',
    suggestedTheme: 'Superação',
  },
  {
    id: 'ch-8',
    title: 'Trilha Sonora de um Capítulo',
    prompt: 'Escolha uma música que marcou uma fase da sua vida e escreva a história que toca dentro dela.',
    hint: 'Quando essa canção começa a tocar, para onde sua memória viaja imediatamente?',
    suggestedTheme: 'Sonhos & Desafios',
  },
  {
    id: 'ch-9',
    title: 'A Primeira Vez',
    prompt: 'Narre a sensação de fazer algo importante pela primeiríssima vez.',
    hint: 'O primeiro dia em um novo lugar, a primeira viagem, o primeiro passo fora da zona de conforto.',
    suggestedTheme: 'Mudança de Vida',
  },
  {
    id: 'ch-10',
    title: 'Gratidão Não Dita',
    prompt: 'Escreva uma breve história sobre alguém que ajudou você em um momento difícil, mesmo com um gesto simples.',
    hint: 'Às vezes uma palavra gentil de um estranho ou o abraço de um amigo muda o rumo de um dia inteiro.',
    suggestedTheme: 'Amor & Família',
  },
  {
    id: 'ch-11',
    title: 'Janela do Tempo',
    prompt: 'Olhe pela janela mais próxima (ou imagine a rua onde cresceu) e conte uma memória que aconteceu ali fora.',
    hint: 'Como o cenário mudou e o que ainda permanece vivo dentro da sua lembrança?',
    suggestedTheme: 'Lição de Vida',
  },
  {
    id: 'ch-12',
    title: 'O Que Eu Diria Hoje',
    prompt: 'Lembre-se de uma preocupação que tirava seu sono há 5 anos e conte como você enxerga esse episódio hoje.',
    hint: 'O tempo transforma tempestades em aprendizado. O que mudou no seu olhar?',
    suggestedTheme: 'Superação',
  }
];

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
// Época base fixa para alinhar os ciclos de 3 dias
const EPOCH_START_MS = new Date('2026-01-01T00:00:00Z').getTime();

export function getCurrentThreeDayCycleInfo(challengesList = STORY_CHALLENGES_DB, offsetIndex = 0) {
  const now = Date.now();
  const elapsed = Math.max(0, now - EPOCH_START_MS);
  const cycleNumber = Math.floor(elapsed / THREE_DAYS_MS);
  const msIntoCurrentCycle = elapsed % THREE_DAYS_MS;
  const msRemaining = THREE_DAYS_MS - msIntoCurrentCycle;

  const daysRemaining = Math.floor(msRemaining / (24 * 60 * 60 * 1000));
  const hoursRemaining = Math.max(1, Math.floor((msRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)));

  const list = challengesList.length > 0 ? challengesList : STORY_CHALLENGES_DB;
  const activeIndex = (cycleNumber + offsetIndex) % list.length;
  const activeChallenge = list[activeIndex];

  let countdownLabel = '';
  if (daysRemaining >= 2) {
    countdownLabel = `Renova em ${daysRemaining} dias`;
  } else if (daysRemaining === 1) {
    countdownLabel = `Renova em 1 dia e ${hoursRemaining}h`;
  } else {
    countdownLabel = `Renova em ${hoursRemaining}h`;
  }

  return {
    challenge: activeChallenge,
    activeIndex,
    totalChallenges: list.length,
    cycleNumber,
    daysRemaining,
    hoursRemaining,
    countdownLabel,
  };
}

export async function fetchStoryChallenges() {
  try {
    const { data, error } = await supabase
      .from('story_challenges')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        title: row.title,
        prompt: row.prompt,
        hint: row.hint || '',
        suggestedTheme: row.suggested_theme || 'Lição de Vida',
      }));
    }
  } catch (err) {
    // Fallback silencioso para o banco local
  }
  return STORY_CHALLENGES_DB;
}

