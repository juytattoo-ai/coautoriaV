import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Coffee, ShieldCheck } from 'lucide-react';
import './VoarConstellation.css';

export const VOAR_STEPS_META = [
  { step: 1, group: 1, groupName: 'Ciclo I · O Despertar', title: 'O Convite', subtitle: 'O compromisso com a sua própria história foi selado.' },
  { step: 2, group: 1, groupName: 'Ciclo I · O Despertar', title: 'Bloco Mágico', subtitle: 'Suas primeiras memórias espontâneas ganharam lugar.' },
  { step: 3, group: 1, groupName: 'Ciclo I · O Despertar', title: 'Linha do Tempo', subtitle: 'Os picos e vales da sua jornada foram desenhados.' },
  { step: 4, group: 2, groupName: 'Ciclo II · O Mergulho', title: 'Mapa de Vida', subtitle: 'Os 4 grandes capítulos da sua biografia estão estruturados.' },
  { step: 5, group: 2, groupName: 'Ciclo II · O Mergulho', title: 'Carta ao Passado', subtitle: 'Um gesto de compaixão e paz com quem você foi.' },
  { step: 6, group: 2, groupName: 'Ciclo II · O Mergulho', title: 'O Espelho', subtitle: 'Os padrões invisíveis da sua trajetória vieram à luz.' },
  { step: 7, group: 3, groupName: 'Ciclo III · O Voo Autoral', title: 'Declaração de Propósito', subtitle: 'Sua história encontrou a mensagem que transforma o outro.' },
  { step: 8, group: 3, groupName: 'Ciclo III · O Voo Autoral', title: 'Banco de Histórias Brutas', subtitle: 'A matéria-prima da sua voz autoral foi garimpada.' },
  { step: 9, group: 3, groupName: 'Ciclo III · O Voo Autoral', title: 'Carta ao Futuro', subtitle: 'Todas as 9 estrelas se conectaram. Sua voz está pronta para voar.' },
];

// Mensagens motivacionais a cada grupo de 3 etapas (Passos 3, 6 e 9)
export const VOAR_GROUP_MILESTONES = {
  3: {
    badge: '1º Ciclo Concluído · 3 de 9 Etapas',
    title: 'Você concluiu as 3 primeiras etapas do seu trajeto!',
    message:
      'Olhar para a própria história exige presença e sensibilidade. Se você estiver inspirado(a), siga em frente para o próximo ciclo. Mas, se quiser descansar um pouco, tomar um café e voltar depois, está tudo bem também — todo o seu progresso continuará salvo com segurança exatamente aqui.',
  },
  6: {
    badge: '2º Ciclo Concluído · 6 de 9 Etapas',
    title: 'Dois terços da sua constelação já iluminam o caminho!',
    message:
      'Você atravessou o mergulho mais profundo das suas memórias e cartas. Honre o seu próprio ritmo: continue seu trajeto agora se desejar, ou faça uma pausa para respirar e volte quando quiser. Tudo o que você construiu permanece guardado esperando por você.',
  },
  9: {
    badge: '3º Ciclo Concluído · 9 de 9 Etapas',
    title: 'Jornada completa! As 9 estrelas da sua voz estão acesas.',
    message:
      'Você percorreu os 3 ciclos com coragem e verdade. Todo o seu acervo e suas reflexões estão salvos permanentemente para você revisitar sempre que quiser.',
  },
};

export const CONSTELLATION_STARS = [
  { id: 1, x: 46, y: 88, r: 4, label: '01' },
  { id: 2, x: 74, y: 126, r: 3.5, label: '02' },
  { id: 3, x: 108, y: 168, r: 4, label: '03', milestone: true },
  { id: 4, x: 148, y: 214, r: 5, label: '04', primary: true },
  { id: 5, x: 186, y: 158, r: 3.8, label: '05' },
  { id: 6, x: 218, y: 112, r: 4.2, label: '06', milestone: true },
  { id: 7, x: 256, y: 66, r: 4.8, label: '07', primary: true },
  { id: 8, x: 138, y: 108, r: 3.8, label: '08' },
  { id: 9, x: 198, y: 62, r: 4.8, label: '09', primary: true, milestone: true },
];

export const CONSTELLATION_CONNECTIONS = [
  { from: 1, to: 2, secondary: false },
  { from: 2, to: 3, secondary: false },
  { from: 3, to: 4, secondary: false },
  { from: 4, to: 5, secondary: false },
  { from: 5, to: 6, secondary: false },
  { from: 6, to: 7, secondary: false },
  { from: 2, to: 8, secondary: true },
  { from: 5, to: 8, secondary: true },
  { from: 8, to: 9, secondary: true },
  { from: 6, to: 9, secondary: true },
  { from: 7, to: 9, secondary: false },
];

/**
 * Constelação minimalista gigante e sutil de fundo para as páginas do V de VOAR
 * Usa exatamente o mesmo desenho de 9 estrelas e conexões da animação do V de VOAR,
 * ampliado de ponta a ponta da tela (sem círculos/alvos).
 */
export function VoarBackgroundConstellation() {
  // Mesmas 9 estrelas da animação principal, posicionadas em escala ampla (1200x760)
  // para que as pontas da constelação apareçam nas laterais dos cards
  const bgStars = [
    { id: 1, x: 95, y: 230, r: 5, label: '01', primary: true },
    { id: 2, x: 205, y: 365, r: 4.2, label: '02' },
    { id: 3, x: 345, y: 515, r: 4.8, label: '03', milestone: true },
    { id: 4, x: 535, y: 670, r: 6, label: '04', primary: true },
    { id: 5, x: 735, y: 475, r: 4.5, label: '05' },
    { id: 6, x: 925, y: 310, r: 5, label: '06', milestone: true },
    { id: 7, x: 1105, y: 145, r: 5.8, label: '07', primary: true },
    { id: 8, x: 495, y: 295, r: 4.5, label: '08' },
    { id: 9, x: 815, y: 130, r: 5.8, label: '09', primary: true, milestone: true },
  ];

  const getBgStar = (id) => bgStars.find((s) => s.id === id);

  return (
    <div className="voar-bg-constellation-layer" aria-hidden="true">
      <svg
        className="voar-bg-constellation-svg"
        viewBox="0 0 1200 760"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="voarBgStarAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.55" />
            <stop offset="55%" stopColor="var(--primary-color)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Conexões idênticas à animação da constelação de 9 estrelas */}
        {CONSTELLATION_CONNECTIONS.map((conn, idx) => {
          const s1 = getBgStar(conn.from);
          const s2 = getBgStar(conn.to);
          return (
            <line
              key={`bg-conn-${idx}`}
              x1={s1.x}
              y1={s1.y}
              x2={s2.x}
              y2={s2.y}
              stroke="var(--primary-color)"
              strokeWidth={conn.secondary ? '1.15' : '1.65'}
              strokeDasharray={conn.secondary ? '5 7' : undefined}
              strokeLinecap="round"
              opacity={conn.secondary ? '0.28' : '0.42'}
            />
          );
        })}

        {/* As 9 estrelas com a mesma estética de brilho, flare e numeração da animação */}
        {bgStars.map((star, idx) => (
          <g key={star.id} className="voar-bg-star-node">
            <circle
              cx={star.x}
              cy={star.y}
              r={star.r * 4.2}
              fill="url(#voarBgStarAura)"
              className="voar-star-aura-loop"
              style={{ animationDelay: `${idx * 0.35}s` }}
            />
            <circle
              cx={star.x}
              cy={star.y}
              r={star.r}
              fill="var(--primary-color)"
              opacity="0.6"
            />
            {(star.primary || star.milestone) && (
              <g stroke="var(--primary-color)" strokeWidth="0.95" opacity="0.45">
                <line x1={star.x - 14} y1={star.y} x2={star.x + 14} y2={star.y} />
                <line x1={star.x} y1={star.y - 14} x2={star.x} y2={star.y + 14} />
              </g>
            )}
            <text
              x={star.x}
              y={star.y - (star.r + 10)}
              textAnchor="middle"
              fill="var(--text-secondary)"
              opacity="0.45"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                fontWeight: 400,
                letterSpacing: '0.12em',
              }}
            >
              {star.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/**
 * Barra de progresso + mini-constelação exibida durante os 9 passos do Módulo Voz.
 * Mostra quantas etapas foram concluídas, os 3 grupos de 3 etapas e a constelação acendendo junto.
 */
export function VoarStepProgressBar({ currentStep = 1, isStepDone = false }) {
  const completedCount = isStepDone ? currentStep : Math.max(0, currentStep - 1);
  const percentage = Math.round((completedCount / 9) * 100);
  const meta = VOAR_STEPS_META.find((m) => m.step === currentStep) || VOAR_STEPS_META[0];
  const getStarById = (id) => CONSTELLATION_STARS.find((s) => s.id === id);

  return (
    <div className="voar-step-progress-banner">
      <div className="voar-step-progress-main">
        <div className="voar-step-progress-header">
          <div className="voar-step-progress-titles">
            <span className="voar-step-cycle-tag">{meta.groupName}</span>
            <span className="voar-step-count-label">
              <strong>{completedCount} de 9</strong> etapas concluídas ({percentage}%)
            </span>
          </div>
          <span className="voar-step-saved-pill">
            <ShieldCheck size={12} /> Progresso salvo
          </span>
        </div>

        {/* Barra dividida em 3 grupos de 3 etapas */}
        <div className="voar-triad-bars" aria-label={`Progresso: ${completedCount} de 9 etapas`}>
          {[0, 1, 2].map((groupIndex) => (
            <div key={groupIndex} className="voar-triad-group">
              {[1, 2, 3].map((offset) => {
                const stepNum = groupIndex * 3 + offset;
                const isDone = stepNum <= completedCount;
                const isCurrent = stepNum === currentStep && !isStepDone;
                return (
                  <div
                    key={stepNum}
                    className={`voar-triad-segment ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
                    title={`Passo ${stepNum}`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="voar-triad-labels">
          <span className={meta.group === 1 ? 'active' : ''}>Ciclo I (1–3)</span>
          <span className={meta.group === 2 ? 'active' : ''}>Ciclo II (4–6)</span>
          <span className={meta.group === 3 ? 'active' : ''}>Ciclo III (7–9)</span>
        </div>
      </div>

      {/* Mini Constelação ao lado que avança junto com o progresso */}
      <div className="voar-mini-constellation-box" title={`${completedCount} de 9 estrelas acesas`}>
        <svg viewBox="25 40 250 195" className="voar-mini-constellation-svg">
          {CONSTELLATION_CONNECTIONS.map((conn, idx) => {
            const s1 = getStarById(conn.from);
            const s2 = getStarById(conn.to);
            const isLit = Math.max(conn.from, conn.to) <= Math.max(completedCount, currentStep);
            return (
              <line
                key={idx}
                x1={s1.x}
                y1={s1.y}
                x2={s2.x}
                y2={s2.y}
                stroke={isLit ? 'var(--primary-color)' : 'var(--border-color-dark)'}
                strokeWidth={isLit ? '1.8' : '1'}
                strokeDasharray={isLit ? undefined : '2 4'}
                opacity={isLit ? 0.85 : 0.4}
              />
            );
          })}
          {CONSTELLATION_STARS.map((star) => {
            const isLit = star.id <= completedCount;
            const isCurrent = star.id === currentStep && !isLit;
            return (
              <g key={star.id}>
                {(isLit || isCurrent) && (
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={star.r * 2.5}
                    fill="var(--primary-color)"
                    opacity={isLit ? '0.28' : '0.18'}
                  />
                )}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={isLit || isCurrent ? star.r * 1.15 : star.r * 0.8}
                  fill={isLit ? 'var(--primary-color)' : isCurrent ? '#f59e0b' : 'var(--border-color-dark)'}
                />
              </g>
            );
          })}
        </svg>
        <span className="mini-constellation-label">{completedCount}/9 estrelas</span>
      </div>
    </div>
  );
}

/**
 * SVG da Constelação de 9 Estrelas (usado na celebração de cada passo e na Conclusão).
 */
export function VoarConstellationSvg({ completedStep = 9, mode = 'step' }) {
  const getStarById = (id) => CONSTELLATION_STARS.find((s) => s.id === id);

  return (
    <div className="voar-constellation-canvas" aria-hidden="true">
      <div className="voar-constellation-ambient" />

      <svg
        className="voar-constellation-svg"
        viewBox="0 0 300 255"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="voarStarAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.75" />
            <stop offset="60%" stopColor="var(--primary-color)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="voarNewStarBurst" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="45%" stopColor="var(--primary-color)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Silhueta apagada de fundo */}
        {CONSTELLATION_CONNECTIONS.map((conn, idx) => {
          const s1 = getStarById(conn.from);
          const s2 = getStarById(conn.to);
          return (
            <line
              key={`dim-line-${idx}`}
              x1={s1.x}
              y1={s1.y}
              x2={s2.x}
              y2={s2.y}
              className="voar-line-unlit"
            />
          );
        })}

        {/* 2. Linhas acesas ou se acendendo */}
        {CONSTELLATION_CONNECTIONS.map((conn, idx) => {
          const s1 = getStarById(conn.from);
          const s2 = getStarById(conn.to);
          const maxStar = Math.max(conn.from, conn.to);
          const minStar = Math.min(conn.from, conn.to);

          if (mode === 'full') {
            const delay = `${0.25 + idx * 0.2}s`;
            return (
              <line
                key={`full-line-${idx}`}
                x1={s1.x}
                y1={s1.y}
                x2={s2.x}
                y2={s2.y}
                className={`voar-line-animating ${conn.secondary ? 'is-secondary' : ''}`}
                style={{ animationDelay: delay }}
              />
            );
          }

          const isAlreadyLit = maxStar < completedStep;
          const isIgnitingNow = maxStar === completedStep && minStar < completedStep;

          if (!isAlreadyLit && !isIgnitingNow) return null;

          const start = conn.from === completedStep ? s2 : s1;
          const end = conn.from === completedStep ? s1 : s2;

          return (
            <line
              key={`step-line-${idx}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              className={
                isAlreadyLit
                  ? `voar-line-lit ${conn.secondary ? 'is-secondary' : ''}`
                  : `voar-line-igniting ${conn.secondary ? 'is-secondary' : ''}`
              }
            />
          );
        })}

        {/* 3. As 9 estrelas */}
        {CONSTELLATION_STARS.map((star, idx) => {
          const isPastLit = mode === 'step' && star.id < completedStep;
          const isCurrentIgniting = mode === 'step' && star.id === completedStep;
          const isUnlit = mode === 'step' && star.id > completedStep;
          const fullDelay = `${0.12 + idx * 0.22}s`;

          return (
            <g key={star.id} className="voar-star-node">
              <circle
                cx={star.x}
                cy={star.y}
                r={star.r * 0.78}
                className="voar-star-unlit-dot"
              />

              <text
                x={star.x}
                y={star.y - (star.r + 7)}
                textAnchor="middle"
                className={`voar-star-number ${
                  isUnlit ? 'is-unlit' : isCurrentIgniting ? 'is-igniting' : 'is-lit'
                }`}
              >
                {star.label}
              </text>

              {mode === 'full' && (
                <g className="voar-star-full-anim" style={{ animationDelay: fullDelay }}>
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={star.r * 3.6}
                    fill="url(#voarStarAura)"
                    className="voar-star-aura-loop"
                    style={{ animationDelay: fullDelay }}
                  />
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={star.r}
                    className="voar-star-core-lit"
                  />
                  {(star.primary || star.id === 9 || star.id === 1) && (
                    <g className="voar-star-flare">
                      <line x1={star.x - 10} y1={star.y} x2={star.x + 10} y2={star.y} />
                      <line x1={star.x} y1={star.y - 10} x2={star.x} y2={star.y + 10} />
                    </g>
                  )}
                </g>
              )}

              {isPastLit && (
                <g className="voar-star-already-lit">
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={star.r * 3.2}
                    fill="url(#voarStarAura)"
                    className="voar-star-aura-loop"
                  />
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={star.r}
                    className="voar-star-core-lit"
                  />
                </g>
              )}

              {isCurrentIgniting && (
                <g className="voar-star-igniting-group">
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={star.r * 2}
                    className="voar-star-ignition-ring"
                  />
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={star.r * 4.4}
                    fill="url(#voarNewStarBurst)"
                    className="voar-star-ignition-aura"
                  />
                  <g className="voar-star-ignition-flare">
                    <line x1={star.x - 13} y1={star.y} x2={star.x + 13} y2={star.y} />
                    <line x1={star.x} y1={star.y - 13} x2={star.x} y2={star.y + 13} />
                  </g>
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={star.r * 1.15}
                    className="voar-star-ignition-core"
                  />
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * Tela de transição com fade suave exibida ao concluir cada um dos 9 passos.
 * A cada 3 etapas (Passos 3, 6 e 9), exibe também o card motivacional de ciclo,
 * lembrando que a pessoa pode continuar ou descansar com o progresso salvo.
 */
export function VoarStepCelebration({ stepNumber, onContinue }) {
  const navigate = useNavigate();
  const meta = VOAR_STEPS_META.find((m) => m.step === stepNumber) || VOAR_STEPS_META[0];
  const isFinalStep = stepNumber === 9;
  const groupMilestone = VOAR_GROUP_MILESTONES[stepNumber];

  return (
    <div className="voar-celebration-overlay" role="dialog" aria-modal="true">
      <div className="voar-celebration-inner">
        <div className="voar-celebration-top">
          <span className="voar-celebration-counter">
            ESTRELAS ACESAS · 0{stepNumber} / 09
          </span>
        </div>

        <div className="voar-celebration-stage">
          <VoarConstellationSvg completedStep={stepNumber} mode="step" />

          <div className="voar-celebration-text">
            <span className="voar-celebration-eyebrow voar-fade-up-1">
              <Sparkles size={13} strokeWidth={1.6} />
              <span>Passo {stepNumber} Concluído · {meta.title}</span>
            </span>

            <h2 className="voar-celebration-headline voar-fade-up-2">
              {isFinalStep
                ? 'A 9ª estrela se acendeu. Sua constelação está completa.'
                : stepNumber === 1
                  ? 'A primeira estrela da sua constelação se acendeu.'
                  : `A ${stepNumber}ª estrela da sua constelação se acendeu.`}
            </h2>

            <p className="voar-celebration-subtext voar-fade-up-3">
              {meta.subtitle}
            </p>

            {/* Mensagem motivacional especial a cada grupo de 3 etapas (Passos 3, 6 e 9) */}
            {groupMilestone && (
              <div className="voar-milestone-pause-card voar-fade-up-3">
                <div className="milestone-pause-badge">
                  <Coffee size={13} />
                  <span>{groupMilestone.badge}</span>
                </div>
                <strong className="milestone-pause-title">{groupMilestone.title}</strong>
                <p className="milestone-pause-desc">{groupMilestone.message}</p>
              </div>
            )}
          </div>
        </div>

        <div className="voar-celebration-footer voar-fade-up-3">
          {groupMilestone && !isFinalStep && (
            <button
              type="button"
              className="voar-celebration-btn-rest"
              onClick={() => navigate('/')}
            >
              <Coffee size={15} strokeWidth={1.5} />
              <span>Descansar e voltar depois</span>
            </button>
          )}
          <button
            type="button"
            className="voar-celebration-btn"
            onClick={onContinue}
          >
            <span>
              {isFinalStep ? 'Ver Síntese do Módulo Voz' : `Avançar para o Passo ${stepNumber + 1}`}
            </span>
            <ArrowRight size={17} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
