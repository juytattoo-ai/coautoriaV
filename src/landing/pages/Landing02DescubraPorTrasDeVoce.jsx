import React, { useState } from 'react';
import LandingLayout, { LandingCtaButton } from '../components/LandingLayout';
import './Landing02DescubraPorTrasDeVoce.css';

// 2. As 5 perguntas em linguagem simples
const REFLECTION_QUESTIONS = [
  {
    num: '01',
    layer: 'Parte 1 · Memória',
    question: 'Por que algumas lembranças nunca saem da sua cabeça?',
  },
  {
    num: '02',
    layer: 'Parte 2 · Mudança',
    question: 'Quais momentos mudaram o seu jeito de ver a vida?',
  },
  {
    num: '03',
    layer: 'Parte 3 · Hábito',
    question: 'Que histórias você sempre conta quando fala de você?',
  },
  {
    num: '04',
    layer: 'Parte 4 · O que falta dizer',
    question: 'O que você viveu e ainda não conseguiu pôr em palavras?',
  },
  {
    num: '05',
    layer: 'Parte 5 · Conexões',
    question: 'Será que dois momentos da sua vida estão ligados e você nunca percebeu?',
  },
];

// 3. Os 9 passos do V de Voar explicados de forma simples e direta
const VOAR_LAYERS = [
  { step: '01', title: 'O Convite', focus: 'Um começo leve para olhar para a sua vida' },
  { step: '02', title: 'Bloco Mágico', focus: 'Anote lembranças e ideias sem se preocupar com regras' },
  { step: '03', title: 'Linha do Tempo', focus: 'Marque os momentos importantes e as grandes viradas' },
  { step: '04', title: 'Mapa de Vida', focus: 'Organize sua caminhada em quatro partes claras' },
  { step: '05', title: 'Carta ao Passado', focus: 'Escreva uma conversa sincera com quem você já foi' },
  { step: '06', title: 'O Espelho', focus: 'Veja o que mais se repete nas suas escolhas' },
  { step: '07', title: 'Seu Propósito', focus: 'Encontre o tema principal que une suas histórias' },
  { step: '08', title: 'Banco de Histórias', focus: 'Junte os pedaços de histórias que você descobriu' },
  { step: '09', title: 'Carta ao Futuro', focus: 'Deixe uma mensagem para os seus próximos passos' },
];

// 4. Os 5 pontos de liberdade em linguagem simples
const PACE_DIFFERENTIALS = [
  'Você escolhe sobre o que quer falar.',
  'Não precisa saber o que escrever antes de começar.',
  'Pode parar quando quiser e continuar depois.',
  'Pode guardar rascunhos e mudar o texto sempre que quiser.',
  'Não existe resposta certa ou errada: a história é sua.',
];

export default function Landing02DescubraPorTrasDeVoce() {
  const [activeLayer, setActiveLayer] = useState(null);

  const handleToggleLayer = (index) => {
    setActiveLayer((prev) => (prev === index ? null : index));
  };

  return (
    <LandingLayout pageKey="lp02" headerCtaLabel="Começar a descobrir">
      {/* ====================================================================
          1. HERO — PROVOCAÇÃO (Design da Imagem 2)
          ==================================================================== */}
      <section className="lp02-hero">
        <div className="lp-container lp02-hero-grid">
          <div className="lp02-hero-copy lp-reveal is-visible">
            <p className="lp02-central-concept">
              Você sabe o que aconteceu na sua vida. Mas já parou para ver a história que esses
              momentos contam juntos?
            </p>

            <h1 className="lp02-hero-title">
              Descubra o que
              <br />
              existe por trás
              <br />
              de você.
            </h1>

            <p className="lp02-hero-subtitle">
              Quando a gente faz novas perguntas sobre o que viveu, descobre coisas que nunca
              tinha notado antes.
            </p>

            <div className="lp02-hero-actions">
              <LandingCtaButton pageKey="lp02" variant="primary" size="lg">
                Começar a descobrir
              </LandingCtaButton>

              <a href="#perguntas" className="lp02-underlined-link">
                Ver as perguntas
              </a>
            </div>
          </div>

          {/* Coluna Direita: Colagem em Camadas idêntica à Imagem 2 */}
          <div className="lp02-hero-collage-col lp-reveal is-visible" aria-hidden="true">
            <div className="lp02-arch-collage">
              <div className="lp02-orange-bar-top" />
              <div className="lp02-dark-backdrop-square" />

              <div className="lp02-sphere-cluster">
                <img
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
                  alt=""
                  className="lp02-sphere-texture"
                />
                <div className="lp02-sphere-offset-ring" />
              </div>

              <svg
                className="lp02-concentric-arcs-svg"
                viewBox="0 0 300 300"
                fill="none"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((i) => (
                  <circle
                    key={i}
                    cx="220"
                    cy="220"
                    r={52 + i * 9}
                    stroke="#3b4cca"
                    strokeWidth="1.65"
                    opacity={0.82 - i * 0.04}
                  />
                ))}
              </svg>

              <div className="lp02-arch-photo-window">
                <img
                  src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=700&q=80"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. IDENTIFICAÇÃO — PERGUNTAS QUE FAZEM PENSAR
          ==================================================================== */}
      <section id="perguntas" className="lp02-questions-section">
        <div className="lp-container">
          <div className="lp02-questions-intro lp-reveal">
            <span className="lp02-kicker">01 · PERGUNTAS PARA PENSAR</span>
            <h2 className="lp02-section-title">
              Perguntas simples que ajudam você a se entender melhor.
            </h2>
          </div>

          <div className="lp02-layered-questions-stage">
            {REFLECTION_QUESTIONS.map((item, idx) => (
              <article
                key={item.num}
                className={`lp02-question-layer-card layer-pos-${idx + 1} lp-reveal`}
              >
                <div className="lp02-question-accent-bar" />
                <div className="lp02-question-meta">
                  <span className="lp02-question-num">{item.num}</span>
                  <span className="lp02-question-layer-name">{item.layer}</span>
                </div>
                <h3 className="lp02-question-text">{item.question}</h3>
              </article>
            ))}

            <div className="lp02-questions-floating-orb" aria-hidden="true">
              <div className="lp02-orb-dark-circle" />
              <div className="lp02-orb-orange-ring" />
            </div>
          </div>

          <div className="lp02-questions-closing lp-reveal">
            <p className="lp02-closing-serif">
              “Às vezes, mudar a pergunta é o primeiro passo para descobrir algo novo.”
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. APRESENTAÇÃO DA PROPOSTA (Seção Escura de Alto Contraste)
          ==================================================================== */}
      <section id="v-de-voar" className="lp02-dark-contrast-section">
        <div className="lp-container lp02-proposal-grid">
          <div className="lp02-proposal-left lp-reveal">
            <span className="lp02-kicker lp02-kicker-light">
              02 · UM ESPAÇO PARA SE CONHECER
            </span>

            <h2 className="lp02-section-title lp02-text-light">
              O que você viveu mostra muito mais do que parece.
            </h2>

            <p className="lp02-proposal-desc">
              O CoAutoria é um lugar prático para você lembrar do que viveu, organizar as ideias
              e contar suas próprias histórias — sem complicação e sem parecer consulta ou teste.
            </p>

            <p className="lp02-proposal-desc">
              Aqui você faz o <strong>V de Voar</strong>: um passo a passo de{' '}
              <strong>9 etapas</strong> que ajuda você a puxar lembranças, ligar os pontos e
              montar a sua história.
            </p>

            <div className="lp02-proposal-mini-collage" aria-hidden="true">
              <div className="lp02-mini-orange-bar" />
              <div className="lp02-mini-arch">
                <img
                  src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80"
                  alt=""
                  loading="lazy"
                />
              </div>
              <div className="lp02-mini-offset-ring" />
            </div>
          </div>

          <div className="lp02-proposal-right lp-reveal">
            <div className="lp02-layers-header">
              <span>JORNADA V DE VOAR · 09 PASSOS</span>
              <span>TOQUE PARA VER</span>
            </div>

            <div className="lp02-layers-stack">
              {VOAR_LAYERS.map((item, index) => {
                const isCurrent = activeLayer === index;
                return (
                  <button
                    key={item.step}
                    type="button"
                    aria-expanded={isCurrent}
                    onClick={() => handleToggleLayer(index)}
                    onPointerEnter={(e) => {
                      if (e.pointerType === 'mouse') {
                        setActiveLayer(index);
                      }
                    }}
                    onPointerLeave={(e) => {
                      if (e.pointerType === 'mouse') {
                        setActiveLayer((prev) => (prev === index ? null : prev));
                      }
                    }}
                    className={`lp02-layer-row ${isCurrent ? 'active' : ''}`}
                  >
                    <div className="lp02-layer-top-line">
                      <span className="lp02-layer-step">{item.step}</span>
                      <strong className="lp02-layer-title">{item.title}</strong>
                      <span className="lp02-layer-indicator" aria-hidden="true">
                        {isCurrent ? '−' : '+'}
                      </span>
                    </div>

                    <div className="lp02-layer-drawer" aria-hidden={!isCurrent}>
                      <div className="lp02-layer-drawer-inner">
                        <span className="lp02-layer-focus">{item.focus}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. UMA EXPERIÊNCIA NO SEU RITMO
          ==================================================================== */}
      <section id="como-funciona" className="lp02-pace-section">
        <div className="lp-container lp02-pace-grid">
          <div className="lp02-pace-collage-wrap lp-reveal" aria-hidden="true">
            <div className="lp02-pace-collage">
              <div className="lp02-pace-dark-block" />
              <div className="lp02-pace-orange-bar" />
              <div className="lp02-pace-arch-img">
                <img
                  src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80"
                  alt=""
                  loading="lazy"
                />
              </div>
              <div className="lp02-pace-circle-photo">
                <img
                  src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80"
                  alt=""
                  loading="lazy"
                />
                <div className="lp02-pace-circle-ring" />
              </div>
            </div>
          </div>

          <div className="lp02-pace-copy lp-reveal">
            <span className="lp02-kicker">03 · TUDO NO SEU TEMPO</span>
            <h2 className="lp02-section-title">
              Você faz no seu ritmo, sem pressa e sem cobrança.
            </h2>

            <ul className="lp02-pace-list">
              {PACE_DIFFERENTIALS.map((line, i) => (
                <li key={i} className="lp02-pace-item">
                  <span className="lp02-pace-num">0{i + 1}</span>
                  <span className="lp02-pace-text">{line}</span>
                </li>
              ))}
            </ul>

            <div className="lp02-pace-cta">
              <LandingCtaButton pageKey="lp02" variant="dark" size="md">
                Começar a descobrir
              </LandingCtaButton>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. SEU ESPAÇO DE DESCOBERTAS
          ==================================================================== */}
      <section className="lp02-space-section">
        <div className="lp-container lp02-space-grid">
          <div className="lp02-space-copy lp-reveal">
            <span className="lp02-kicker">04 · SEU LUGAR SEGURO</span>
            <h2 className="lp02-section-title">
              Um lugar só seu para guardar e cuidar das suas histórias.
            </h2>
            <p className="lp02-space-lead">
              Tudo o que você escreve ou grava em áudio fica salvo e organizado para você. Você
              pode mexer nos seus rascunhos quando quiser e decide se quer deixar a história só
              para você ou se quer mostrar para outras pessoas na comunidade.
            </p>
          </div>

          <div className="lp02-space-visual lp-reveal" aria-hidden="true">
            <div className="lp02-bank-layered-stage">
              <div className="lp02-bank-orange-bar" />
              <div className="lp02-bank-dark-frame">
                <div className="lp02-bank-card card-back">
                  <span className="lp02-bank-tag">RASCUNHO · GUARDADO</span>
                  <strong>O que aprendi quando precisei recomeçar</strong>
                </div>

                <div className="lp02-bank-card card-front">
                  <div className="lp02-bank-card-top">
                    <span className="lp02-bank-tag">MINHAS HISTÓRIAS · TEXTO E ÁUDIO</span>
                    <span className="lp02-bank-status">Você pode editar quando quiser</span>
                  </div>
                  <h4 className="lp02-bank-card-title">
                    “Naquela tarde percebi que duas lembranças antigas faziam parte da mesma
                    história...”
                  </h4>
                  <div className="lp02-bank-card-footer">
                    <span>Continuar escrevendo</span>
                    <span>•</span>
                    <span>Você escolhe se fica só para você ou se compartilha</span>
                  </div>
                </div>
              </div>
              <div className="lp02-bank-offset-ring" />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. CTA FINAL
          ==================================================================== */}
      <section className="lp02-final-cta-section">
        <div className="lp-container">
          <div className="lp02-final-collage-box lp-reveal">
            <div className="lp02-final-orange-bar" />

            <div className="lp02-final-content">
              <span className="lp02-kicker lp02-kicker-light">
                COMECE QUANDO QUISER
              </span>

              <h2 className="lp02-final-title">
                Que tal olhar para a sua vida com outros olhos?
              </h2>

              <p className="lp02-final-sub">
                Comece agora, passo a passo, e veja o que as suas lembranças têm para mostrar.
              </p>

              <LandingCtaButton pageKey="lp02" variant="primary" size="lg">
                Quero começar
              </LandingCtaButton>
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
