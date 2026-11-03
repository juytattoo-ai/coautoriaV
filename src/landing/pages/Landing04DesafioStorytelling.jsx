import React, { useState } from 'react';
import { RotateCcw, ArrowRight, Check } from 'lucide-react';
import LandingLayout, { LandingCtaButton } from '../components/LandingLayout';
import './Landing04DesafioStorytelling.css';

// As 4 perguntas interativas do desafio rápido em linguagem simples
const CHALLENGE_QUESTIONS = [
  {
    id: 'who',
    stepLabel: 'Pista 01',
    question: 'Quem deixou a carta?',
    options: [
      'Alguém da casa',
      'Um visitante',
      'Um desconhecido',
      'Outra ideia...',
    ],
    angleNote: {
      'Alguém da casa': 'Alguém que já morava ali e conhecia bem a rotina.',
      'Um visitante': 'Alguém que passou por lá rapidinho, mas deixou um recado.',
      'Um desconhecido': 'Alguém de fora que entrou sem ninguém notar.',
      'Outra ideia...': 'Você escolhe quem faz parte dessa cena.',
    },
  },
  {
    id: 'forWhom',
    stepLabel: 'Pista 02',
    question: 'Para quem era a carta?',
    options: [
      'Alguém que chegaria de manhã',
      'Um grande amigo ou amor antigo',
      'Para a própria pessoa ler depois',
      'Outra ideia...',
    ],
    angleNote: {
      'Alguém que chegaria de manhã': 'A carta ficou na mesa para a primeira pessoa que acordasse.',
      'Um grande amigo ou amor antigo': 'Um recado importante para alguém muito próximo.',
      'Para a própria pessoa ler depois': 'Um lembrete deixado para ela mesma não esquecer.',
      'Outra ideia...': 'A história muda quando você escolhe quem vai ler.',
    },
  },
  {
    id: 'whyLeft',
    stepLabel: 'Pista 03',
    question: 'Por que a pessoa foi embora?',
    options: [
      'Preferiu escrever o que era difícil falar',
      'Estava começando uma vida nova',
      'Queria fazer uma surpresa',
      'Outra ideia...',
    ],
    angleNote: {
      'Preferiu escrever o que era difícil falar': 'Às vezes é mais fácil pôr no papel do que falar olhando nos olhos.',
      'Estava começando uma vida nova': 'Sair sem olhar para trás era o começo de uma mudança.',
      'Queria fazer uma surpresa': 'O bilhete era o primeiro passo de um convite especial.',
      'Outra ideia...': 'O motivo da saída dá todo o tom da história.',
    },
  },
  {
    id: 'whatHappened',
    stepLabel: 'Pista 04',
    question: 'O que aconteceu durante a noite?',
    options: [
      'A pessoa certa leu e guardou no bolso',
      'O vento levou pela janela aberta',
      'Quem escreveu voltou antes do sol nascer',
      'Outra ideia...',
    ],
    angleNote: {
      'A pessoa certa leu e guardou no bolso': 'O recado chegou nas mãos de quem precisava ler.',
      'O vento levou pela janela aberta': 'O acaso mudou o destino da carta antes do dia clarear.',
      'Quem escreveu voltou antes do sol nascer': 'A pessoa mudou de ideia e pegou o papel de volta.',
      'Outra ideia...': 'O final que você escolhe muda toda a cena.',
    },
  },
];

// 5. O que mais você pode contar no CoAutoria (em linguagem simples)
const OTHER_POSSIBILITIES = [
  {
    num: '01',
    title: 'Uma lembrança que você nunca contou.',
    desc: 'Aquele momento guardado na memória que fica muito mais claro quando vai para o papel.',
  },
  {
    num: '02',
    title: 'Uma ideia solta que pode virar projeto.',
    desc: 'Um pensamento anotado no celular que ganha começo, meio e fim.',
  },
  {
    num: '03',
    title: 'Algo que você viveu e quer dividir.',
    desc: 'Uma história real sua que pode inspirar outras pessoas.',
  },
  {
    num: '04',
    title: 'Um momento simples do dia a dia.',
    desc: 'Uma cena comum da sua rotina que ganha um novo sentido quando você para para olhar.',
  },
];

function trackChallengeEvent(eventName) {
  if (typeof window !== 'undefined') {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, { page: 'lp04_story_challenge' });
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, page: 'lp04_story_challenge' });
    }
  }
}

export default function Landing04DesafioStorytelling() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({
    who: 'Alguém da casa',
    forWhom: '',
    whyLeft: '',
    whatHappened: '',
  });
  const [customTexts, setCustomTexts] = useState({
    who: '',
    forWhom: '',
    whyLeft: '',
    whatHappened: '',
  });
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  const activeQuestion = CHALLENGE_QUESTIONS[currentQuestionIdx];
  const selectedOption = answers[activeQuestion.id];

  const handleSelectOption = (questionId, optionValue) => {
    if (!challengeStarted) {
      setChallengeStarted(true);
      trackChallengeEvent('coautoria_lp04_challenge_started');
    }

    const updated = { ...answers, [questionId]: optionValue };
    setAnswers(updated);

    if (optionValue !== 'Outra ideia...') {
      if (currentQuestionIdx < CHALLENGE_QUESTIONS.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIdx((prev) => Math.min(prev + 1, CHALLENGE_QUESTIONS.length - 1));
        }, 260);
      } else {
        setChallengeCompleted(true);
        trackChallengeEvent('coautoria_lp04_challenge_completed');
      }
    }
  };

  const handleResetChallenge = () => {
    setAnswers({
      who: 'Alguém da casa',
      forWhom: '',
      whyLeft: '',
      whatHappened: '',
    });
    setCustomTexts({
      who: '',
      forWhom: '',
      whyLeft: '',
      whatHappened: '',
    });
    setCurrentQuestionIdx(0);
    setChallengeCompleted(false);
  };

  const getDisplayAnswer = (id) => {
    const val = answers[id];
    if (val === 'Outra ideia...') {
      return customTexts[id]?.trim() || 'a sua própria ideia';
    }
    return val;
  };

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const currentAngleText =
    activeQuestion.angleNote[selectedOption] ||
    'Cada escolha mostra um novo jeito de ver a história.';

  return (
    <LandingLayout pageKey="lp04" headerCtaLabel="Começar agora">
      {/* ====================================================================
          1. HERO — CONVITE AO DESAFIO
          ==================================================================== */}
      <section className="lp04-hero">
        <div className="lp-container lp04-hero-grid">
          <div className="lp04-hero-copy lp-reveal is-visible">
            <span className="lp04-concept-eyebrow">
              UMA MESMA CENA PODE VIRAR MIL HISTÓRIAS. QUAL É A SUA?
            </span>

            <h1 className="lp04-hero-title">
              Você consegue
              <br />
              contar essa
              <br />
              <span className="lp04-underlined-word">
                história?
                <svg
                  viewBox="0 0 210 18"
                  className="lp04-brush-underline"
                  aria-hidden="true"
                >
                  <path
                    d="M 4 13 Q 95 3, 204 11"
                    stroke="#eb6b24"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>

            <p className="lp04-hero-sub-1">
              Uma cena curta. Algumas pistas.
              <br />
              Vários caminhos possíveis.
            </p>

            <p className="lp04-hero-sub-2">
              Veja como o seu jeito de olhar
              <br />
              muda toda a história.
            </p>

            <div className="lp04-hero-actions">
              <a href="#desafio-interativo" className="lp04-pill-btn">
                <span>Aceito o desafio</span>
                <ArrowRight size={16} />
              </a>

              <a href="#conexao-coautoria" className="lp04-saiba-mais-link">
                Saiba mais ↓
              </a>
            </div>
          </div>

          <div className="lp04-hero-Portal-col lp-reveal is-visible" aria-hidden="true">
            <div className="lp04-portal-collage">
              <svg viewBox="0 0 520 440" className="lp04-portal-scribbles-svg">
                <ellipse
                  cx="230"
                  cy="95"
                  rx="78"
                  ry="32"
                  transform="rotate(-18 230 95)"
                  stroke="#1e1c1a"
                  strokeWidth="1.1"
                  fill="none"
                  opacity="0.55"
                />
                <path
                  d="M 110 210 C 75 245, 78 305, 118 335"
                  stroke="#1e1c1a"
                  strokeWidth="1.2"
                  fill="none"
                />
                <path
                  d="M 415 110 C 465 125, 485 170, 455 215"
                  stroke="#1e1c1a"
                  strokeWidth="1.2"
                  fill="none"
                />
              </svg>

              <div className="lp04-clue-card clue-question-mark">
                <span>?</span>
              </div>

              <div className="lp04-clue-card clue-spiral-paper">
                <svg viewBox="0 0 110 70" className="lp04-spiral-svg">
                  <path
                    d="M 12 52 C 30 15, 78 18, 74 44 C 70 62, 42 58, 46 38 C 50 22, 82 26, 98 48"
                    stroke="#1e1c1a"
                    strokeWidth="1.6"
                    fill="none"
                  />
                </svg>
              </div>

              <div className="lp04-clue-card clue-tree-photo">
                <img
                  src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80"
                  alt=""
                />
              </div>

              <div className="lp04-clue-card clue-what-if">
                <span>E se...?</span>
              </div>

              <span className="lp04-portal-black-asterisk">*</span>

              <div className="lp04-doorway-monument">
                <div className="lp04-door-outer-frame">
                  <div className="lp04-door-orange-sky">
                    <div className="lp04-sky-clouds" />
                  </div>
                  <div className="lp04-wooden-door-leaf">
                    <div className="lp04-door-panel-top" />
                    <div className="lp04-door-panel-bottom" />
                    <div className="lp04-door-handle" />
                  </div>
                </div>

                <div className="lp04-stone-steps">
                  <div className="lp04-step step-1" />
                  <div className="lp04-step step-2" />
                  <div className="lp04-step step-3" />
                  <div className="lp04-step step-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. EXPERIÊNCIA INTERATIVA
          ==================================================================== */}
      <section id="desafio-interativo" className="lp04-challenge-band">
        <div className="lp-container">
          <div className="lp04-challenge-grid">
            <div className="lp04-challenge-left lp-reveal">
              <div className="lp04-interactive-pill-badge">
                <span className="lp04-badge-orange-dot" />
                <span>DESAFIO RÁPIDO</span>
              </div>

              <h2 className="lp04-challenge-heading">
                Uma cena curta.
                <br />
                Vários jeitos de contar.
              </h2>

              <p className="lp04-challenge-lead">
                <strong>Leia a cena</strong>, marque uma opção e veja como a história muda de
                acordo com quem conta.
              </p>

              <div className="lp04-question-stepper" role="tablist" aria-label="Pistas do desafio">
                {CHALLENGE_QUESTIONS.map((q, idx) => {
                  const isDone = Boolean(answers[q.id]);
                  const isCurrent = idx === currentQuestionIdx;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className={`lp04-stepper-DotBtn ${isCurrent ? 'active' : ''} ${
                        isDone ? 'done' : ''
                      }`}
                    >
                      <span>{q.stepLabel}</span>
                      {isDone && <Check size={12} />}
                    </button>
                  );
                })}
              </div>

              <div className="lp04-options-card">
                <div className="lp04-options-card-header">
                  <h3 className="lp04-options-question-title">
                    {activeQuestion.question}
                  </h3>
                  <span className="lp04-options-counter">
                    {currentQuestionIdx + 1} / {CHALLENGE_QUESTIONS.length}
                  </span>
                </div>

                <div className="lp04-radio-list">
                  {activeQuestion.options.map((option) => {
                    const isChecked = selectedOption === option;
                    return (
                      <div key={option} className="lp04-radio-item-wrap">
                        <button
                          type="button"
                          onClick={() => handleSelectOption(activeQuestion.id, option)}
                          className={`lp04-radio-pill ${isChecked ? 'selected' : ''}`}
                        >
                          <span className={`lp04-radio-circle ${isChecked ? 'checked' : ''}`}>
                            <span className="lp04-radio-inner-dot" />
                          </span>
                          <span className="lp04-radio-label">{option}</span>
                        </button>

                        {isChecked && option === 'Outra ideia...' && (
                          <div className="lp04-custom-input-box">
                            <input
                              type="text"
                              placeholder="Escreva com as suas palavras..."
                              value={customTexts[activeQuestion.id]}
                              onChange={(e) =>
                                setCustomTexts({
                                  ...customTexts,
                                  [activeQuestion.id]: e.target.value,
                                })
                              }
                              className="lp04-custom-text-input"
                            />
                            {currentQuestionIdx < CHALLENGE_QUESTIONS.length - 1 ? (
                              <button
                                type="button"
                                className="lp04-next-mini-btn"
                                onClick={() =>
                                  setCurrentQuestionIdx((prev) =>
                                    Math.min(prev + 1, CHALLENGE_QUESTIONS.length - 1)
                                  )
                                }
                              >
                                Próxima pista →
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="lp04-next-mini-btn"
                                onClick={() => setChallengeCompleted(true)}
                              >
                                Ver minha história →
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="lp04-options-footer-nav">
                  <button
                    type="button"
                    className="lp04-reset-btn"
                    onClick={handleResetChallenge}
                  >
                    <RotateCcw size={13} />
                    <span>Começar de novo</span>
                  </button>

                  {currentQuestionIdx < CHALLENGE_QUESTIONS.length - 1 ? (
                    <button
                      type="button"
                      className="lp04-advance-link"
                      onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                    >
                      Próxima pergunta →
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="lp04-advance-link"
                      onClick={() => setChallengeCompleted(true)}
                    >
                      Ver como ficou →
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="lp04-challenge-right lp-reveal">
              <div className="lp04-torn-typewriter-paper">
                <div className="lp04-orange-tape tape-top-right" aria-hidden="true" />

                <p className="lp04-typewriter-text">
                  Às 22h17, uma pessoa
                  <br />
                  deixou uma carta sobre uma
                  <br />
                  mesa, apagou as luzes e
                  <br />
                  saiu sem olhar para trás.
                </p>

                <p className="lp04-typewriter-text">
                  Na manhã seguinte,
                  <br />a carta havia desaparecido.
                </p>

                <svg
                  viewBox="0 0 150 24"
                  className="lp04-paper-orange-scribble"
                  aria-hidden="true"
                >
                  <path
                    d="M 10 18 L 135 6 L 85 16 L 142 14"
                    stroke="#eb6b24"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="lp04-clue-photo-row">
                <div className="lp04-handwritten-callout">
                  <p className="lp04-handwritten-text">
                    Cada escolha
                    <br />
                    mostra um novo
                    <br />
                    lado da história.
                  </p>
                  <svg viewBox="0 0 70 36" className="lp04-hand-arrow" aria-hidden="true">
                    <path
                      d="M 4 28 Q 34 8, 62 14 M 52 6 L 63 14 L 51 22"
                      stroke="#1e1c1a"
                      strokeWidth="1.6"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="lp04-live-angle-caption">{currentAngleText}</span>
                </div>

                <div className="lp04-table-letter-frame">
                  <div className="lp04-orange-tape tape-photo" aria-hidden="true" />
                  <img
                    src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80"
                    alt="Carta sobre a mesa de madeira"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================================
              3. REVELAÇÃO
              ================================================================== */}
          <div
            className={`lp04-revelation-card ${
              answeredCount >= 2 || challengeCompleted ? 'is-revealed' : ''
            }`}
          >
            <div className="lp04-revelation-header">
              <span className="lp04-revelation-tag">
                ✦ A HISTÓRIA QUE VOCÊ MONTOU ({answeredCount}/4 PISTAS)
              </span>
              <button
                type="button"
                className="lp04-reset-inline"
                onClick={handleResetChallenge}
              >
                <RotateCcw size={13} /> Testar outro jeito
              </button>
            </div>

            <p className="lp04-assembled-story">
              Na sua versão, <strong>{getDisplayAnswer('who').toLowerCase()}</strong> deixou a
              carta às 22h17{' '}
              {answers.forWhom && (
                <>
                  para <strong>{getDisplayAnswer('forWhom').toLowerCase()}</strong>
                </>
              )}
              {answers.whyLeft && (
                <>
                  , porque <strong>{getDisplayAnswer('whyLeft').toLowerCase()}</strong>
                </>
              )}
              {answers.whatHappened ? (
                <>
                  . E, durante a noite,{' '}
                  <strong>{getDisplayAnswer('whatHappened').toLowerCase()}</strong>.
                </>
              ) : (
                '. Continue marcando as pistas acima para ver o final.'
              )}
            </p>

            <div className="lp04-revelation-message-box">
              <h3 className="lp04-revelation-title">
                Viu como uma cena simples muda completamente com as suas escolhas?
              </h3>
              <p className="lp04-revelation-desc">
                Não existe resposta certa ou errada. Contar uma história é justamente isso:
                juntar momentos e dar o seu próprio olhar para o que aconteceu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. CONEXÃO COM O COAUTORIA
          ==================================================================== */}
      <section id="conexao-coautoria" className="lp04-connection-section">
        <div className="lp-container">
          <div className="lp04-connection-grid">
            <div className="lp04-connection-copy lp-reveal">
              <h2 className="lp04-connection-title">
                Agora imagine
                <br />
                fazer isso com as
                <br />
                suas histórias.
              </h2>

              <p className="lp04-connection-lead">
                O <strong>CoAutoria</strong> ajuda você a puxar lembranças, organizar ideias e
                contar o que já viveu de um jeito simples.
              </p>

              <p className="lp04-connection-sub">
                No <strong>V de Voar</strong>, você segue <strong>9 passos curtos</strong> com
                perguntas fáceis para ligar suas memórias e criar seus próprios textos.
              </p>

              <div className="lp04-connection-cta">
                <LandingCtaButton
                  pageKey="lp04"
                  variant="primary"
                  size="lg"
                  className="lp04-rounded-cta"
                >
                  Conhecer o CoAutoria
                </LandingCtaButton>
              </div>
            </div>

            <div className="lp04-connection-collage lp-reveal" aria-hidden="true">
              <div className="lp04-orange-dome" />

              <svg viewBox="0 0 110 150" className="lp04-left-squiggle">
                <path
                  d="M 45 10 C 35 55, 18 95, 22 125 C 25 140, 52 90, 68 95 C 82 100, 48 142, 62 145 C 76 148, 98 110, 104 95"
                  stroke="#1e1c1a"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>

              <div className="lp04-clouds-photo-card">
                <img
                  src="https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?auto=format&fit=crop&w=500&q=80"
                  alt=""
                  loading="lazy"
                />
              </div>

              <div className="lp04-brand-torn-card">
                <div className="lp04-brand-card-row">
                  <span className="lp04-brand-star">*</span>
                  <span className="lp04-brand-word">CoAutoria</span>
                </div>
                <span className="lp04-brand-tagline">Lembre. Ligue. Conte.</span>
              </div>
            </div>
          </div>

          {/* ==================================================================
              5. OUTRAS POSSIBILIDADES + 6. CTA FINAL
              ================================================================== */}
          <div className="lp04-possibilities-block lp-reveal">
            <span className="lp04-concept-eyebrow">
              O QUE VOCÊ PODE CONTAR AQUI
            </span>
            <div className="lp04-possibilities-grid">
              {OTHER_POSSIBILITIES.map((item) => (
                <article key={item.num} className="lp04-possibility-card">
                  <span className="lp04-possibility-num">{item.num}</span>
                  <h3 className="lp04-possibility-title">{item.title}</h3>
                  <p className="lp04-possibility-desc">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="lp04-final-banner lp-reveal">
            <h2 className="lp04-final-banner-title">
              Essa foi só uma cena. Imagine tudo o que existe nas suas histórias.
            </h2>
            <p className="lp04-final-banner-text">
              Entre no CoAutoria, dê o primeiro passo e descubra tudo o que você tem para contar.
            </p>
            <LandingCtaButton
              pageKey="lp04"
              variant="primary"
              size="lg"
              className="lp04-rounded-cta"
            >
              Conhecer o CoAutoria
            </LandingCtaButton>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
