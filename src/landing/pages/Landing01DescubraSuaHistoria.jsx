import React, { useState } from 'react';
import LandingLayout, { LandingCtaButton } from '../components/LandingLayout';
import './Landing01DescubraSuaHistoria.css';

// As 4 perguntas simples do dia a dia (Página 02 da LP 01)
const IDENTIFICATION_ITEMS = [
  {
    num: '01',
    question: 'Você já viveu algo marcante, mas não soube como contar?',
    tint: 'tile-cobalt',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
  },
  {
    num: '02',
    question: 'Guarda lembranças importantes que nunca contou para ninguém?',
    tint: 'tile-rose',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
  },
  {
    num: '03',
    question: 'Tem boas ideias na cabeça, mas não sabe por onde começar?',
    tint: 'tile-gold',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
  },
  {
    num: '04',
    question: 'Já tentou explicar um momento da sua vida e sentiu que faltaram palavras?',
    tint: 'tile-olive',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
  },
];

// Os 9 passos do V de Voar explicados em linguagem simples
const VOAR_9_STEPS = [
  {
    step: 1,
    code: '01',
    title: 'O Convite',
    short: 'Um primeiro passo leve para olhar para a sua vida.',
    tint: 'tile-gold',
    type: 'photo',
    image:
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=400&q=80',
  },
  {
    step: 2,
    code: '02',
    title: 'Bloco Mágico',
    short: 'Um espaço livre para soltar as primeiras lembranças no papel.',
    tint: 'tile-script',
    type: 'script',
  },
  {
    step: 3,
    code: '03',
    title: 'Linha do Tempo',
    short: 'Veja os momentos bons e os desafios que marcaram seu caminho.',
    tint: 'tile-blush-wave',
    type: 'wave',
  },
  {
    step: 4,
    code: '04',
    title: 'Mapa de Vida',
    short: 'Divida sua história em 4 partes fáceis de visualizar.',
    tint: 'tile-cobalt',
    type: 'photo',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
  },
  {
    step: 5,
    code: '05',
    title: 'Carta ao Passado',
    short: 'Uma conversa sincera e em paz com quem você já foi.',
    tint: 'tile-rose',
    type: 'photo',
    image:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80',
  },
  {
    step: 6,
    code: '06',
    title: 'O Espelho',
    short: 'Perceba o que mais se repete nas suas escolhas e no seu jeito.',
    tint: 'tile-wheel',
    type: 'wheel',
  },
  {
    step: 7,
    code: '07',
    title: 'Seu Propósito',
    short: 'Descubra o fio que liga os momentos mais importantes da sua vida.',
    tint: 'tile-amber-network',
    type: 'network',
  },
  {
    step: 8,
    code: '08',
    title: 'Banco de Histórias',
    short: 'Guarde todas as suas lembranças e ideias em um só lugar.',
    tint: 'tile-olive',
    type: 'photo',
    image:
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=400&q=80',
  },
  {
    step: 9,
    code: '09',
    title: 'Carta ao Futuro',
    short: 'Junte tudo o que descobriu e deixe um recado para o seu futuro.',
    tint: 'tile-dark-nodes',
    type: 'nodes',
  },
];

// Os 5 ganhos práticos em linguagem simples
const DISCOVERY_ITEMS = [
  {
    code: '01',
    text: 'Entender melhor o que você já viveu.',
    tint: 'tile-gold',
  },
  {
    code: '02',
    text: 'Ligar momentos da sua vida que pareciam soltos.',
    tint: 'tile-blush-wave',
  },
  {
    code: '03',
    text: 'Tirar ideias e lembranças da cabeça e passar para o papel.',
    tint: 'tile-script',
  },
  {
    code: '04',
    text: 'Descobrir quais histórias você mais quer contar.',
    tint: 'tile-cobalt',
  },
  {
    code: '05',
    text: 'Escrever ou gravar seus relatos com mais clareza.',
    tint: 'tile-dark-nodes',
  },
];

export default function Landing01DescubraSuaHistoria() {
  const [activeStep, setActiveStep] = useState(VOAR_9_STEPS[0]);

  return (
    <LandingLayout pageKey="lp01" headerCtaLabel="Descobrir minha história">
      {/* ====================================================================
          1. PÁGINA 01 (HERO) — MOSAICO CIRCULAR + GRID (Estilo "synthesis")
          ==================================================================== */}
      <section className="lp01-syn-hero">
        <div className="lp-container">
          <div className="lp01-syn-hero-top lp-reveal is-visible">
            <span className="lp01-syn-eyebrow">
              TODA PESSOA TEM UMA BOA HISTÓRIA. TALVEZ VOCÊ SÓ AINDA NÃO TENHA VISTO A SUA.
            </span>

            <h1 className="lp01-syn-title">
              Você tem uma história para contar.
            </h1>

            <p className="lp01-syn-subtitle">
              As coisas que você viveu, suas lembranças e suas ideias guardam histórias únicas.
              Aqui você descobre cada uma delas de um jeito simples.
            </p>

            <div className="lp01-syn-hero-ctas">
              <LandingCtaButton pageKey="lp01" variant="primary" size="lg">
                Descobrir minha história
              </LandingCtaButton>
              <a href="#como-funciona" className="lp01-syn-text-link">
                Como funciona?
              </a>
            </div>
          </div>

          {/* Mosaico Circular + Grid Quadrado */}
          <div className="lp01-syn-figure-wrap lp-reveal is-visible">
            <div className="lp01-syn-keyhole-mosaic">
              {/* Disco Circular Superior Esquerdo */}
              <div className="lp01-syn-circle-cluster" aria-hidden="true">
                <div className="syn-cell tile-gold">
                  <svg viewBox="0 0 100 100" className="syn-cell-svg">
                    <path
                      d="M 10 80 L 45 20 L 85 65 M 25 55 L 70 40"
                      stroke="#ffffff"
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                </div>
                <div className="syn-cell tile-rose">
                  <div className="syn-micro-note">
                    <span>Qual lembrança continua viva em você?</span>
                  </div>
                </div>
                <div className="syn-cell tile-cobalt">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                    alt=""
                  />
                </div>
                <div className="syn-cell tile-gold">
                  <img
                    src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=400&q=80"
                    alt=""
                  />
                </div>

                <div className="syn-cell tile-magenta">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                    alt=""
                  />
                </div>
                <div className="syn-cell tile-script">
                  <div className="syn-handwriting">
                    <span>aquela conversa...</span>
                    <span>o dia da mudança</span>
                    <span>ideias no papel</span>
                    <span>tudo se liga</span>
                  </div>
                </div>
                <div className="syn-cell tile-teal">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                    alt=""
                  />
                </div>
                <div className="syn-cell tile-lime">
                  <svg viewBox="0 0 100 100" className="syn-cell-svg">
                    <circle cx="32" cy="36" r="10" fill="#3f6212" />
                    <circle cx="68" cy="28" r="7" fill="#3f6212" />
                    <circle cx="54" cy="64" r="12" fill="#3f6212" />
                    <line x1="20" y1="82" x2="82" y2="48" stroke="#3f6212" strokeWidth="2" />
                  </svg>
                </div>

                <div className="syn-cell tile-cobalt">
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
                    alt=""
                  />
                </div>
                <div className="syn-cell tile-dark-portrait">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
                    alt=""
                  />
                </div>
                <div className="syn-cell syn-circle-cutout-spacer" />
                <div className="syn-cell syn-circle-cutout-spacer" />

                <div className="syn-cell tile-amber-eye">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
                    alt=""
                  />
                </div>
                <div className="syn-cell tile-mint-glass">
                  <img
                    src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80"
                    alt=""
                  />
                </div>
                <div className="syn-cell syn-circle-cutout-spacer" />
                <div className="syn-cell syn-circle-cutout-spacer" />
              </div>

              {/* Quadrado Central de Texto em Linguagem Simples */}
              <div className="lp01-syn-central-copy-box">
                <p>
                  VOCÊ NÃO PRECISA SER ESCRITOR NEM TER UMA VIDA DE FILME PARA TER UMA BOA
                  HISTÓRIA. O QUE VOCÊ VIVEU GANHA FORÇA QUANDO VOCÊ JUNTA AS PEÇAS.
                </p>
              </div>

              {/* Extensão em Grid Quadrado Inferior Direito */}
              <div className="lp01-syn-square-extension" aria-hidden="true">
                <div className="syn-cell syn-ext-empty" />
                <div className="syn-cell syn-ext-empty" />
                <div className="syn-cell tile-sepia">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
                    alt=""
                  />
                </div>
                <div className="syn-cell tile-wheel">
                  <svg viewBox="0 0 100 100" className="syn-cell-svg">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#181715"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                      fill="none"
                    />
                    <line x1="50" y1="10" x2="50" y2="90" stroke="#d95834" strokeWidth="1.2" />
                    <line x1="10" y1="50" x2="90" y2="50" stroke="#181715" strokeWidth="0.9" />
                    <line x1="22" y1="22" x2="78" y2="78" stroke="#181715" strokeWidth="0.9" />
                    <line x1="78" y1="22" x2="22" y2="78" stroke="#d95834" strokeWidth="0.9" />
                  </svg>
                </div>

                <div className="syn-cell syn-ext-empty" />
                <div className="syn-cell tile-slate">
                  <img
                    src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80"
                    alt=""
                  />
                </div>
                <div className="syn-cell tile-cream-network">
                  <svg viewBox="0 0 100 100" className="syn-cell-svg">
                    <path
                      d="M 15 45 L 55 25 L 82 50 L 45 80 Z"
                      stroke="#eab308"
                      strokeWidth="1.2"
                      fill="none"
                    />
                    <circle cx="15" cy="45" r="3" fill="#d95834" />
                    <circle cx="55" cy="25" r="3.5" fill="#eab308" />
                    <circle cx="82" cy="50" r="3" fill="#d95834" />
                    <circle cx="45" cy="80" r="3.5" fill="#eab308" />
                  </svg>
                </div>
                <div className="syn-cell tile-mint-portrait">
                  <img
                    src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80"
                    alt=""
                  />
                </div>

                <div className="syn-cell tile-blush-wave">
                  <svg viewBox="0 0 100 100" className="syn-cell-svg">
                    <path
                      d="M 8 78 Q 25 75, 34 40 T 52 18 T 70 72 T 92 58"
                      stroke="#d95834"
                      strokeWidth="1.8"
                      fill="none"
                    />
                  </svg>
                </div>
                <div className="syn-cell tile-mint-portrait">
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"
                    alt=""
                  />
                </div>
                <div className="syn-cell tile-blue-waves">
                  <svg viewBox="0 0 100 100" className="syn-cell-svg">
                    <path
                      d="M 0 65 Q 25 45, 50 60 T 100 40 L 100 100 L 0 100 Z"
                      fill="#3b82f6"
                      opacity="0.45"
                    />
                    <path
                      d="M 0 78 Q 30 58, 60 72 T 100 55 L 100 100 L 0 100 Z"
                      fill="#1d4ed8"
                      opacity="0.7"
                    />
                  </svg>
                </div>
                <div className="syn-cell tile-dark-nodes">
                  <svg viewBox="0 0 100 100" className="syn-cell-svg">
                    <line x1="50" y1="50" x2="22" y2="26" stroke="#eab308" strokeWidth="1.4" />
                    <line x1="50" y1="50" x2="80" y2="30" stroke="#e11d48" strokeWidth="1.4" />
                    <line x1="50" y1="50" x2="28" y2="82" stroke="#3b82f6" strokeWidth="1.4" />
                    <line x1="50" y1="50" x2="82" y2="78" stroke="#10b981" strokeWidth="1.4" />
                    <circle cx="50" cy="50" r="9" fill="#e11d48" />
                    <circle cx="22" cy="26" r="5" fill="#eab308" />
                    <circle cx="80" cy="30" r="6" fill="#d95834" />
                    <circle cx="28" cy="82" r="5" fill="#3b82f6" />
                    <circle cx="82" cy="78" r="5" fill="#10b981" />
                  </svg>
                </div>

                <div className="syn-cell tile-olive">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
                    alt=""
                  />
                </div>
                <div className="syn-cell tile-amber-network">
                  <svg viewBox="0 0 100 100" className="syn-cell-svg">
                    <path
                      d="M 15 80 L 40 30 L 75 65 L 90 20 M 40 30 L 85 45"
                      stroke="#181715"
                      strokeWidth="1.2"
                      fill="none"
                    />
                    <circle cx="40" cy="30" r="5" fill="#181715" />
                    <circle cx="75" cy="65" r="6" fill="#181715" />
                    <circle cx="15" cy="80" r="4" fill="#181715" />
                    <circle cx="90" cy="20" r="4.5" fill="#181715" />
                  </svg>
                </div>
                <div className="syn-cell tile-sepia">
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80"
                    alt=""
                  />
                </div>
                <div className="syn-cell tile-lime">
                  <svg viewBox="0 0 100 100" className="syn-cell-svg">
                    <circle cx="50" cy="50" r="28" fill="#ffffff" opacity="0.7" />
                    <circle cx="35" cy="32" r="12" fill="#ffffff" opacity="0.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. PÁGINA 02 (IDENTIFICAÇÃO) — COM CTA MESCLADO NO CANTO INFERIOR DIREITO
          ==================================================================== */}
      <section id="identificacao" className="lp01-syn-section">
        <div className="lp-container">
          <div className="lp01-syn-section-head lp-reveal">
            <span className="lp01-syn-eyebrow">01 · ISSO ACONTECE COM VOCÊ?</span>
            <h2 className="lp01-syn-h2">
              Às vezes a gente guarda boas histórias sem perceber.
            </h2>
          </div>

          {/* Quadro da Página 02: 4 situações + Fechamento com CTA no canto inferior direito */}
          <div className="lp01-syn-ident-mosaic lp-reveal">
            {IDENTIFICATION_ITEMS.map((item) => (
              <div key={item.num} className="lp01-syn-ident-pair">
                <div className={`syn-cell ${item.tint} lp01-ident-visual-cell`}>
                  <img src={item.image} alt="" loading="lazy" />
                  <span className="lp01-cell-corner-num">{item.num}</span>
                </div>
                <div className="lp01-ident-copy-cell">
                  <p>{item.question}</p>
                </div>
              </div>
            ))}

            {/* Fechamento do quadro com CTA discreto e mesclado no canto inferior direito */}
            <div className="lp01-syn-ident-cutout">
              <p className="lp01-ident-cutout-quote">
                “VOCÊ NÃO PRECISA INVENTAR UMA VIDA NOVA. SÓ PRECISA OLHAR DE UM JEITO NOVO PARA
                O QUE JÁ VIVEU.”
              </p>

              <div className="lp01-ident-bottom-right-cta">
                <LandingCtaButton pageKey="lp01" variant="blended" size="md">
                  Descobrir minha história
                </LandingCtaButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. APRESENTAÇÃO DO V DE VOAR — OS 9 PASSOS SIMPLES
          ==================================================================== */}
      <section id="v-de-voar" className="lp01-syn-section">
        <div className="lp-container">
          <div className="lp01-syn-section-head lp-reveal">
            <span className="lp01-syn-eyebrow">02 · V DE VOAR · 9 PASSOS SIMPLES</span>
            <h2 className="lp01-syn-h2">
              Um caminho leve para encontrar o que existe nas suas lembranças.
            </h2>
            <p className="lp01-syn-lead">
              Você responde uma pergunta por vez, no seu tempo, sem pressa e sem complicação.
            </p>
          </div>

          <div className="lp01-voar-mosaic-stage lp-reveal">
            <div className="lp01-voar-9-grid">
              {VOAR_9_STEPS.slice(0, 4).map((item) => (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setActiveStep(item)}
                  className={`syn-cell ${item.tint} lp01-voar-step-tile ${
                    activeStep.step === item.step ? 'is-selected' : ''
                  }`}
                >
                  {item.image && <img src={item.image} alt="" loading="lazy" />}
                  {item.type === 'script' && (
                    <div className="syn-handwriting">
                      <span>bloco mágico</span>
                      <span>lembranças</span>
                      <span>ideias soltas</span>
                    </div>
                  )}
                  {item.type === 'wave' && (
                    <svg viewBox="0 0 100 100" className="syn-cell-svg">
                      <path
                        d="M 8 78 Q 25 75, 34 40 T 52 18 T 70 72 T 92 58"
                        stroke="#d95834"
                        strokeWidth="2.2"
                        fill="none"
                      />
                    </svg>
                  )}
                  <span className="lp01-tile-code">{item.code}</span>
                  <span className="lp01-tile-name">{item.title}</span>
                </button>
              ))}

              {/* Quadrado Central Aberto explicando o passo selecionado */}
              <div className="lp01-voar-center-cutout">
                <span className="lp01-cutout-step-tag">
                  PASSO {activeStep.code} DE 09 · V DE VOAR
                </span>
                <h3 className="lp01-cutout-step-title">{activeStep.title}</h3>
                <p className="lp01-cutout-step-desc">{activeStep.short}</p>
                <span className="lp01-cutout-hint">
                  Toque nos quadrados para ver cada passo
                </span>
              </div>

              {VOAR_9_STEPS.slice(4, 9).map((item) => (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => setActiveStep(item)}
                  className={`syn-cell ${item.tint} lp01-voar-step-tile ${
                    activeStep.step === item.step ? 'is-selected' : ''
                  }`}
                >
                  {item.image && <img src={item.image} alt="" loading="lazy" />}
                  {item.type === 'wheel' && (
                    <svg viewBox="0 0 100 100" className="syn-cell-svg">
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        stroke="#181715"
                        strokeWidth="1.2"
                        strokeDasharray="3 3"
                        fill="none"
                      />
                      <line x1="50" y1="12" x2="50" y2="88" stroke="#d95834" strokeWidth="1.4" />
                      <line x1="12" y1="50" x2="88" y2="50" stroke="#181715" strokeWidth="1.1" />
                    </svg>
                  )}
                  {item.type === 'network' && (
                    <svg viewBox="0 0 100 100" className="syn-cell-svg">
                      <path
                        d="M 18 76 L 45 26 L 78 62 L 88 22"
                        stroke="#181715"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      <circle cx="45" cy="26" r="5" fill="#181715" />
                      <circle cx="78" cy="62" r="6" fill="#181715" />
                      <circle cx="18" cy="76" r="4" fill="#181715" />
                    </svg>
                  )}
                  {item.type === 'nodes' && (
                    <svg viewBox="0 0 100 100" className="syn-cell-svg">
                      <line x1="50" y1="50" x2="22" y2="26" stroke="#eab308" strokeWidth="1.5" />
                      <line x1="50" y1="50" x2="80" y2="30" stroke="#e11d48" strokeWidth="1.5" />
                      <line x1="50" y1="50" x2="28" y2="82" stroke="#3b82f6" strokeWidth="1.5" />
                      <line x1="50" y1="50" x2="82" y2="78" stroke="#10b981" strokeWidth="1.5" />
                      <circle cx="50" cy="50" r="8" fill="#d95834" />
                      <circle cx="22" cy="26" r="4.5" fill="#eab308" />
                      <circle cx="80" cy="30" r="5" fill="#e11d48" />
                      <circle cx="28" cy="82" r="4.5" fill="#3b82f6" />
                      <circle cx="82" cy="78" r="4.5" fill="#10b981" />
                    </svg>
                  )}
                  <span className="lp01-tile-code">{item.code}</span>
                  <span className="lp01-tile-name">{item.title}</span>
                </button>
              ))}

              {/* 12ª célula (canto inferior direito do quadro): CTA mesclado ao design */}
              <div className="lp01-voar-corner-cta-cell">
                <span className="lp01-corner-cta-hint">Pronto para começar?</span>
                <LandingCtaButton pageKey="lp01" variant="blended" size="sm">
                  Começar passo 01
                </LandingCtaButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. COMO FUNCIONA + O QUE VOCÊ VAI FAZER AQUI
          ==================================================================== */}
      <section id="como-funciona" className="lp01-syn-section">
        <div className="lp-container">
          <div className="lp01-syn-section-head lp-reveal">
            <span className="lp01-syn-eyebrow">03 · COMO FUNCIONA</span>
            <h2 className="lp01-syn-h2">
              Três passos simples para organizar o que você viveu.
            </h2>
          </div>

          <div className="lp01-how-syn-grid lp-reveal">
            <article className="lp01-how-syn-card">
              <div className="lp01-how-circle-mosaic">
                <div className="syn-cell tile-script">
                  <div className="syn-handwriting">
                    <span>perguntas</span>
                    <span>memórias</span>
                  </div>
                </div>
                <div className="syn-cell tile-gold">
                  <img
                    src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=300&q=80"
                    alt=""
                  />
                </div>
                <div className="syn-cell tile-rose" />
                <div className="syn-cell syn-cutout-mini">01</div>
              </div>
              <h3 className="lp01-how-syn-title">1. Lembre</h3>
              <p className="lp01-how-syn-desc">
                Responda perguntas fáceis que ajudam a puxar boas memórias.
              </p>
            </article>

            <article className="lp01-how-syn-card">
              <div className="lp01-how-circle-mosaic">
                <div className="syn-cell tile-blush-wave">
                  <svg viewBox="0 0 100 100" className="syn-cell-svg">
                    <path
                      d="M 10 70 Q 35 20, 60 65 T 90 30"
                      stroke="#d95834"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
                <div className="syn-cell tile-amber-network">
                  <svg viewBox="0 0 100 100" className="syn-cell-svg">
                    <line x1="20" y1="75" x2="78" y2="25" stroke="#181715" strokeWidth="1.6" />
                    <circle cx="20" cy="75" r="5" fill="#181715" />
                    <circle cx="78" cy="25" r="5" fill="#181715" />
                  </svg>
                </div>
                <div className="syn-cell tile-cobalt" />
                <div className="syn-cell syn-cutout-mini">02</div>
              </div>
              <h3 className="lp01-how-syn-title">2. Ligue os pontos</h3>
              <p className="lp01-how-syn-desc">
                Veja como momentos diferentes da sua vida conversam entre si.
              </p>
            </article>

            <article className="lp01-how-syn-card">
              <div className="lp01-how-circle-mosaic">
                <div className="syn-cell tile-dark-nodes">
                  <svg viewBox="0 0 100 100" className="syn-cell-svg">
                    <circle cx="50" cy="50" r="8" fill="#d95834" />
                    <circle cx="25" cy="30" r="4" fill="#eab308" />
                    <circle cx="75" cy="70" r="4" fill="#10b981" />
                    <line x1="25" y1="30" x2="75" y2="70" stroke="#ffffff" strokeWidth="1.2" />
                  </svg>
                </div>
                <div className="syn-cell tile-olive">
                  <img
                    src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=300&q=80"
                    alt=""
                  />
                </div>
                <div className="syn-cell tile-lime" />
                <div className="syn-cell syn-cutout-mini">03</div>
              </div>
              <h3 className="lp01-how-syn-title">3. Conte do seu jeito</h3>
              <p className="lp01-how-syn-desc">
                Junte tudo o que descobriu e monte a sua história com clareza.
              </p>
            </article>
          </div>

          <div className="lp01-discoveries-mosaic-band lp-reveal">
            <div className="lp01-discoveries-band-header">
              <span className="lp01-syn-eyebrow">04 · O QUE VOCÊ VAI FAZER AQUI</span>
            </div>
            <div className="lp01-discoveries-band-grid">
              {DISCOVERY_ITEMS.map((d) => (
                <div key={d.code} className="lp01-discovery-tile-card">
                  <div className={`lp01-discovery-color-bar ${d.tint}`} />
                  <span className="lp01-discovery-code">{d.code}</span>
                  <p className="lp01-discovery-phrase">{d.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. CTA FINAL
          ==================================================================== */}
      <section className="lp01-syn-final-cta">
        <div className="lp-container">
          <div className="lp01-syn-final-box lp-reveal">
            <span className="lp01-syn-eyebrow">
              SUA HISTÓRIA COMEÇA AQUI
            </span>
            <h2 className="lp01-syn-final-title">
              Sua história está esperando para ser contada.
            </h2>
            <p className="lp01-syn-final-sub">
              Dê o primeiro passo agora e veja tudo o que a sua vida tem para mostrar.
            </p>
            <LandingCtaButton pageKey="lp01" variant="primary" size="lg">
              Começar minha história
            </LandingCtaButton>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
