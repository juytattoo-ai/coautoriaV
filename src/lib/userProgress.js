import { supabase } from './supabase';

export const STEPS_METADATA = [
  { id: 1, title: 'O Convite', path: '/passo-1' },
  { id: 2, title: 'Bloco Mágico', path: '/passo-2' },
  { id: 3, title: 'Linha do Tempo', path: '/passo-3' },
  { id: 4, title: 'Mapa de Vida', path: '/passo-4' },
  { id: 5, title: 'Carta ao Passado', path: '/passo-5' },
  { id: 6, title: 'O Espelho', path: '/passo-6' },
  { id: 7, title: 'Declaração de Propósito', path: '/passo-7' },
  { id: 8, title: 'Banco de Histórias Brutas', path: '/passo-8' },
  { id: 9, title: 'Carta ao Futuro', path: '/passo-9' },
  { id: 10, title: 'Conclusão', path: '/conclusao' }
];

export async function getUserVoarProgress(userId) {
  if (!userId) {
    return {
      completedSteps: {},
      percentage: 0,
      currentStepId: 1,
      currentStepPath: '/passo-1',
      currentStepTitle: 'O Convite'
    };
  }

  try {
    const progress = {};

    // 1. Passo 1
    const [{ data: cData }, { data: s1Data }] = await Promise.all([
      supabase.from('commitments').select('id').eq('user_id', userId).limit(1).maybeSingle(),
      supabase.from('step1_reflections').select('*').eq('user_id', userId).limit(1).maybeSingle()
    ]);
    const s1Complete = cData && s1Data && (s1Data.selected_values?.length === 7) && [s1Data.q1, s1Data.q2, s1Data.q3, s1Data.q4].every(v => v?.trim().length > 0);
    if (s1Complete) progress[1] = true;

    // 2. Passo 2
    const { count: notesCount } = await supabase.from('notes').select('*', { count: 'exact', head: true }).eq('user_id', userId);
    if (notesCount >= 2) progress[2] = true;

    // 3. Passo 3
    const { count: timelineCount } = await supabase.from('timeline_events').select('*', { count: 'exact', head: true }).eq('user_id', userId);
    if (timelineCount >= 5) progress[3] = true;

    // 4. Passo 4
    const { data: chaptersData } = await supabase.from('life_chapters').select('id').eq('user_id', userId);
    if (chaptersData && chaptersData.length === 4) progress[4] = true;

    // 5. Passo 5
    const { count: lettersCount } = await supabase.from('past_letters').select('*', { count: 'exact', head: true }).eq('user_id', userId);
    if (lettersCount >= 1) progress[5] = true;

    // 6. Passo 6
    const { data: s6Data } = await supabase.from('mirror_reflections').select('answers').eq('user_id', userId).limit(1).maybeSingle();
    if (s6Data && s6Data.answers?.filter(a => a?.trim().length > 0).length === 10) progress[6] = true;

    // 7. Passo 7
    const { data: s7Data } = await supabase.from('purpose_statement').select('*').eq('user_id', userId).limit(1).maybeSingle();
    if (s7Data && ['theme', 'who_i_was', 'who_i_became', 'message_audience', 'message_transformation'].every(k => s7Data[k]?.trim().length > 0)) progress[7] = true;

    // 8. Passo 8
    const { count: storiesCount } = await supabase.from('raw_stories').select('*', { count: 'exact', head: true }).eq('user_id', userId);
    if (storiesCount >= 2) progress[8] = true;

    // 9. Passo 9
    const { data: s9Data } = await supabase.from('future_letters').select('checklist, image_url').eq('user_id', userId).limit(1).maybeSingle();
    if (s9Data && s9Data.image_url && s9Data.checklist && Object.values(s9Data.checklist).every(Boolean)) progress[9] = true;

    const completedCount = Object.keys(progress).length;
    const percentage = Math.round((completedCount / 9) * 100);

    // Find next pending step
    let nextStepId = 1;
    for (let i = 1; i <= 9; i++) {
      if (!progress[i]) {
        nextStepId = i;
        break;
      }
    }
    if (completedCount === 9) {
      nextStepId = 10;
    }

    const nextStepMeta = STEPS_METADATA.find(s => s.id === nextStepId) || STEPS_METADATA[0];

    return {
      completedSteps: progress,
      completedCount,
      percentage,
      currentStepId: nextStepId,
      currentStepPath: nextStepMeta.path,
      currentStepTitle: nextStepMeta.title
    };
  } catch (err) {
    console.error('Erro ao calcular progresso:', err);
    return {
      completedSteps: {},
      completedCount: 0,
      percentage: 0,
      currentStepId: 1,
      currentStepPath: '/passo-1',
      currentStepTitle: 'O Convite'
    };
  }
}
