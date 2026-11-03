import React, { useState } from 'react';
import LandingLayout, { LandingCtaButton } from '../components/LandingLayout';
import './Landing03IdeiasBlocoDeNotas.css';

// 2. As 5 situações comuns em linguagem simples
const PROBLEM_NOTES = [
  {
    id: '01',
    noteTag: 'NOTA ESQUECIDA · 02:14',
    text: 'Você anota uma ideia no celular e nunca mais abre.',
    tilt: '-3.5deg',
  },
  {
    id: '02',
    noteTag: 'RASCUNHO PARADO',
    text: 'Começa um texto ou projeto, mas trava no meio.',
    tilt: '2.5deg',
  },
  {
    id: '03',
    noteTag: 'PASTAS E LINKS',
    text: 'Guarda vários links e frases, mas não sabe como juntar tudo.',
    tilt: '-2deg',
  },
  {
    id: '04',
    noteTag: 'FOLHA EM BRANCO',
    text: 'Sabe o que quer falar, mas não sabe como pôr em ordem.',
    tilt: '3deg',
  },
  {
    id: '05',
    noteTag: 'IDEIA SOLTA',
    text: 'Sente que tem boas ideias, mas falta um passo a passo para continuar.',
    tilt: '-1.8deg',
  },
];

// 3. Os 9 passos do V de Voar
const VOAR_9_MINI = [
  { num: '01', name: 'O Convite' },
  { num: '02', name: 'Bloco Mágico' },
  { num: '03', name: 'Linha do Tempo' },
  { num: '04', name: 'Mapa de Vida' },
  { num: '05', name: 'Carta ao Passado' },
  { num: '06', name: 'O Espelho' },
  { num: '07', name: 'Seu Propósito' },
  { num: '08', name: 'Banco de Histórias' },
  { num: '09', name: 'Carta ao Futuro' },
];

// 5. Os 4 pontos do Banco de Histórias em linguagem simples
const LIBRARY_PILLARS = [
  {
    code: '(01)',
    title: 'Junte texto e voz.',
    snippet: 'Escreva ou grave áudios rápidos no mesmo lugar.',
  },
  {
    code: '(02)',
    title: 'Ache tudo fácil.',
    snippet: 'Suas ideias não ficam perdidas no meio de listas de mercado ou recados.',
  },
  {
    code: '(03)',
    title: 'Continue aos poucos.',
    snippet: 'Volte no seu rascunho sempre que tiver uma ideia nova.',
  },
  {
    code: '(04)',
    title: 'Tire do papel.',
    snippet: 'Separe por assunto e transforme frases soltas em histórias prontas.',
  },
];

// 6. Para quem é o CoAutoria (em linguagem simples)
const AUDIENCE_PROFILES = [
  {
    tag: '*01',
    role: 'Quem cria conteúdo',
    desc: 'Para transformar coisas do dia a dia em vídeos, posts e roteiros com a sua cara.',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    tag: '*02',
    role: 'Quem gosta de escrever',
    desc: 'Para guardar começos de histórias, organizar partes do texto e não travar na folha em branco.',
    image:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80',
  },
  {
    tag: '*03',
    role: 'Estudantes',
    desc: 'Para juntar o que você estuda com o que você pensa e escrever de um jeito mais claro.',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  },
  {
    tag: '*04',
    role: 'Quem tem um negócio',
    desc: 'Para contar de forma simples como o seu projeto começou e por que ele existe.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    tag: '*05',
    role: 'Qualquer pessoa que gosta de criar',
    desc: 'Você não precisa trabalhar com escrita para ter um lugar calmo onde suas ideias ganham vida.',
    image:
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=400&q=80',
  },
];

export default function Landing03IdeiasBlocoDeNotas() {
  const [organizeNotes, setOrganizeNotes] = useState(false);
  const [creationStage, setCreationStage] = useState('capture');

  return (
    <LandingLayout pageKey="lp03" headerCtaLabel="Tirar ideias do papel">
      {/* ====================================================================
          1. HERO — TIPOGRAFIA MONUMENTAL + ELEMENTOS VISUAIS (Design Imagem 3)
          ==================================================================== */}
      <section className="lp03-untold-hero">
        <div className="lp-container lp03-hero-stage">
          <div className="lp03-concept-bar lp-reveal is-visible">
            <span className="lp03-concept-asterisk">(*)</span>
            <span>Quantas boas ideias você já teve e nunca tirou do papel?</span>
          </div>

          <div className="lp03-monumental-board lp-reveal is-visible">
            <div className="lp03-m-row">
              <span className="lp03-m-word">suas</span>

              <div className="lp03-notes-grid-insert" aria-hidden="true">
                <div className="lp03-mini-phones-grid">
                  <div className="lp03-mini-phone">
                    <img
                      src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=240&q=80"
                      alt=""
                    />
                  </div>
                  <div className="lp03-mini-phone">
                    <img
                      src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=240&q=80"
                      alt=""
                    />
                  </div>
                  <div className="lp03-mini-phone">
                    <img
                      src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=240&q=80"
                      alt=""
                    />
                  </div>
                  <div className="lp03-mini-phone">
                    <img
                      src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=240&q=80"
                      alt=""
                    />
                  </div>
                  <div className="lp03-mini-phone">
                    <img
                      src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=240&q=80"
                      alt=""
                    />
                  </div>
                  <div className="lp03-mini-phone">
                    <img
                      src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=240&q=80"
                      alt=""
                    />
                  </div>
                </div>
                <span className="lp03-giant-asterisk">*</span>
              </div>

              <span className="lp03-m-word">ideias</span>

              <div className="lp03-doorway-insert" aria-hidden="true">
                <svg viewBox="0 0 100 128" className="lp03-doorway-svg">
                  <path
                    d="M 52 6 L 52 14 M 48 10 L 56 10 M 68 12 L 68 18 M 65 15 L 71 15"
                    stroke="#181715"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <rect x="34" y="22" width="44" height="94" fill="#e25b2d" />
                  <polygon
                    points="34,22 12,14 12,122 34,116"
                    fill="#f6f4ee"
                    stroke="#181715"
                    strokeWidth="1.6"
                  />
                  <circle
                    cx="58"
                    cy="46"
                    r="8"
                    stroke="#181715"
                    strokeWidth="1.8"
                    fill="none"
                  />
                  <path
                    d="M 38 72 C 46 58, 66 58, 76 74 M 58 54 L 58 86 L 46 114 M 58 86 L 70 114"
                    stroke="#181715"
                    strokeWidth="1.8"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <div className="lp03-m-row">
              <span className="lp03-m-word">não precisam</span>
            </div>

            <div className="lp03-m-row lp03-m-row-bottom">
              <div className="lp03-paren-stack-insert" aria-hidden="true">
                <span className="lp03-giant-paren">(</span>
                <div className="lp03-card-fan">
                  <div className="lp03-fan-card fan-orange" />
                  <div className="lp03-fan-card fan-paper">
                    <span>ideia #14</span>
                    <small>rascunho</small>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1516414447565-b14be0adf13e?auto=format&fit=crop&w=400&q=80"
                    alt=""
                    className="lp03-fan-card fan-photo"
                  />
                </div>
                <span className="lp03-giant-paren">)</span>
              </div>

              <span className="lp03-m-word">no bloco</span>

              <div className="lp03-hero-sidenote">
                <h1 className="lp03-sr-only">
                  Suas ideias não precisam morrer no bloco de notas.
                </h1>
                <p>
                  <strong>(*)</strong> Tire as ideias soltas da cabeça e transforme em histórias,
                  textos e projetos de verdade.
                </p>
              </div>
            </div>
          </div>

          <div className="lp03-hero-bottom-bar">
            <LandingCtaButton pageKey="lp03" variant="primary" size="lg">
              Quero tirar minhas ideias do papel
            </LandingCtaButton>

            <a href="#o-problema" className="lp03-scroll-indicator" aria-label="Rolar para ver mais">
              <span className="lp03-scroll-vertical-text">ROLE PARA VER MAIS</span>
              <span className="lp03-scroll-circle">↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. O PROBLEMA — "Você tem uma ideia boa. E depois?"
          ==================================================================== */}
      <section id="o-problema" className="lp03-problem-section">
        <div className="lp-container">
          <div className="lp03-problem-header lp-reveal">
            <div>
              <span className="lp03-tag">* 01 · QUANDO A IDEIA TRAVA</span>
              <h2 className="lp03-big-h2">
                Você tem uma ideia boa. <span>E depois?</span>
              </h2>
            </div>

            <button
              type="button"
              className={`lp03-toggle-order-btn ${organizeNotes ? 'is-organized' : ''}`}
              onClick={() => setOrganizeNotes((prev) => !prev)}
            >
              <span>{organizeNotes ? '✓ Notas arrumadas' : '✦ Arrumar estas notas'}</span>
            </button>
          </div>

          <div
            className={`lp03-scattered-notes-grid ${
              organizeNotes ? 'grid-organized' : ''
            } lp-reveal`}
          >
            {PROBLEM_NOTES.map((item) => (
              <article
                key={item.id}
                className="lp03-notepad-card"
                style={{ '--note-tilt': item.tilt }}
              >
                <div className="lp03-notepad-top">
                  <span className="lp03-notepad-id">({item.id})</span>
                  <span className="lp03-notepad-meta">{item.noteTag}</span>
                </div>
                <p className="lp03-notepad-text">{item.text}</p>
              </article>
            ))}
          </div>

          <div className="lp03-problem-closing lp-reveal">
            <span className="lp03-closing-star">*</span>
            <p className="lp03-closing-statement">
              “O problema quase nunca é falta de ideia. É falta de um lugar simples para fazer
              essa ideia crescer.”
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. APRESENTAÇÃO DO COAUTORIA
          ==================================================================== */}
      <section className="lp03-platform-section">
        <div className="lp-container">
          <div className="lp03-platform-layout lp-reveal">
            <div className="lp03-platform-copy">
              <span className="lp03-tag">* 02 · COMO O COAUTORIA AJUDA</span>
              <h2 className="lp03-big-h2">
                Um lugar simples para suas ideias <span>saírem do papel.</span>
              </h2>
              <p className="lp03-platform-lead">
                O CoAutoria ajuda você a juntar suas anotações, organizar o que pensa e montar
                histórias completas, sem deixar nada esquecido no celular.
              </p>
              <p className="lp03-platform-lead">
                Dentro da plataforma você encontra o <strong>V de Voar</strong>: um passo a passo
                de <strong>9 etapas</strong> que faz perguntas fáceis para você ligar suas
                lembranças e criar seus próprios textos.
              </p>

              <div className="lp03-platform-cta">
                <LandingCtaButton pageKey="lp03" variant="primary" size="md">
                  Quero tirar minhas ideias do papel
                </LandingCtaButton>
              </div>
            </div>

            <div className="lp03-voar-board">
              <div className="lp03-voar-board-head">
                <span className="lp03-board-title">( JORNADA V DE VOAR · 9 PASSOS )</span>
                <span className="lp03-board-asterisk">*</span>
              </div>

              <div className="lp03-voar-chips-grid">
                {VOAR_9_MINI.map((st) => (
                  <div key={st.num} className="lp03-voar-chip">
                    <span className="lp03-chip-num">{st.num}</span>
                    <span className="lp03-chip-name">{st.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. DO PENSAMENTO À CRIAÇÃO (1. Anote · 2. Junte · 3. Monte)
          ==================================================================== */}
      <section id="do-pensamento-a-criacao" className="lp03-creation-section">
        <div className="lp-container">
          <div className="lp03-creation-header lp-reveal">
            <span className="lp03-tag">* 03 · PASSO A PASSO</span>
            <h2 className="lp03-big-h2">
              Da anotação solta até a <span>história pronta.</span>
            </h2>
          </div>

          <div className="lp03-creation-interactive lp-reveal">
            <div className="lp03-creation-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={creationStage === 'capture'}
                className={`lp03-stage-tab ${creationStage === 'capture' ? 'active' : ''}`}
                onClick={() => setCreationStage('capture')}
              >
                <span className="lp03-tab-num">1. Anote</span>
                <p>Guarde a ideia assim que ela aparecer, em texto ou voz.</p>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={creationStage === 'explore'}
                className={`lp03-stage-tab ${creationStage === 'explore' ? 'active' : ''}`}
                onClick={() => setCreationStage('explore')}
              >
                <span className="lp03-tab-num">2. Junte</span>
                <p>Responda perguntas simples que ligam uma ideia na outra.</p>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={creationStage === 'construa'}
                className={`lp03-stage-tab ${creationStage === 'construa' ? 'active' : ''}`}
                onClick={() => setCreationStage('construa')}
              >
                <span className="lp03-tab-num">3. Monte</span>
                <p>Coloque tudo em ordem e dê forma ao que você quer contar.</p>
              </button>
            </div>

            <div className={`lp03-transformation-canvas stage-${creationStage}`}>
              <svg className="lp03-transform-svg" viewBox="0 0 600 260" fill="none">
                <path
                  d="M 110 130 L 300 90 L 490 130 M 110 130 L 300 185 L 490 130"
                  stroke="#e25b2d"
                  strokeWidth="1.8"
                  strokeDasharray={creationStage === 'capture' ? '4 12' : 'none'}
                  opacity={creationStage === 'capture' ? '0.2' : '0.85'}
                />
              </svg>

              <div className="lp03-t-node node-a">
                <span className="lp03-node-tag">IDEIA 1</span>
                <strong>“Uma frase que pensei no caminho de casa”</strong>
              </div>

              <div className="lp03-t-node node-b">
                <span className="lp03-node-tag">IDEIA 2</span>
                <strong>“Uma lembrança de algo que vivi anos atrás”</strong>
              </div>

              <div className="lp03-t-node node-c">
                <span className="lp03-node-tag">
                  {creationStage === 'construa' ? 'HISTÓRIA PRONTA' : 'IDEIA 3'}
                </span>
                <strong>
                  {creationStage === 'construa'
                    ? 'História pronta e organizada para você usar onde quiser'
                    : '“A pergunta que junta os dois momentos”'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. UM ESPAÇO QUE ACOMPANHA SUAS IDEIAS
          ==================================================================== */}
      <section className="lp03-library-section">
        <div className="lp-container">
          <div className="lp03-library-header lp-reveal">
            <span className="lp03-tag">* 04 · TUDO EM UM SÓ LUGAR</span>
            <h2 className="lp03-big-h2">
              Um caderno vivo que <span>acompanha o seu ritmo.</span>
            </h2>
          </div>

          <div className="lp03-library-board lp-reveal">
            {LIBRARY_PILLARS.map((pillar) => (
              <div key={pillar.code} className="lp03-library-card">
                <span className="lp03-library-code">{pillar.code}</span>
                <h3 className="lp03-library-title">{pillar.title}</h3>
                <p className="lp03-library-snippet">{pillar.snippet}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. PARA QUEM É O COAUTORIA?
          ==================================================================== */}
      <section className="lp03-audience-section">
        <div className="lp-container">
          <div className="lp03-audience-top lp-reveal">
            <div>
              <span className="lp03-tag">* 05 · PARA QUEM É?</span>
              <h2 className="lp03-big-h2">
                Para qualquer pessoa que tem ideias <span>( todo mundo )</span>
              </h2>
            </div>
            <p className="lp03-audience-note">
              <strong>(*)</strong> Você não precisa trabalhar com escrita para usar o CoAutoria.
            </p>
          </div>

          <div className="lp03-audience-grid lp-reveal">
            {AUDIENCE_PROFILES.map((item) => (
              <article key={item.tag} className="lp03-audience-card">
                <div className="lp03-audience-img-wrap">
                  <img src={item.image} alt="" loading="lazy" />
                  <span className="lp03-audience-tag">{item.tag}</span>
                </div>
                <h3 className="lp03-audience-role">{item.role}</h3>
                <p className="lp03-audience-desc">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. CTA FINAL
          ==================================================================== */}
      <section className="lp03-final-cta">
        <div className="lp-container lp03-final-stage lp-reveal">
          <span className="lp03-final-asterisk" aria-hidden="true">
            *
          </span>

          <h2 className="lp03-final-giant">
            Pare de só guardar ideias.
            <br />
            <span>Comece a dar vida para elas.</span>
          </h2>

          <p className="lp03-final-sub">
            Tudo o que você precisa para começar é de uma primeira anotação.
          </p>

          <LandingCtaButton pageKey="lp03" variant="primary" size="lg">
            Começar agora
          </LandingCtaButton>
        </div>
      </section>
    </LandingLayout>
  );
}
