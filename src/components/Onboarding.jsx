import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Lock, ShieldCheck, Sparkles, Users, ArrowRight, ArrowLeft, Feather, Mic, FileText, Heart } from 'lucide-react';
import './Onboarding.css';

// As 9 estrelas da constelação do Módulo Voz (formando um desenho abstrato de asa / V celeste)
const CONSTELLATION_STARS = [
  { id: 1, x: 46, y: 88, r: 3.5, delay: '0.1s', label: '01' },
  { id: 2, x: 74, y: 126, r: 3, delay: '0.35s', label: '02' },
  { id: 3, x: 108, y: 168, r: 4, delay: '0.6s', label: '03' },
  { id: 4, x: 148, y: 214, r: 5, delay: '0.85s', label: '04', primary: true },
  { id: 5, x: 186, y: 158, r: 3.5, delay: '1.1s', label: '05' },
  { id: 6, x: 218, y: 112, r: 4, delay: '1.35s', label: '06' },
  { id: 7, x: 256, y: 66, r: 4.5, delay: '1.6s', label: '07', primary: true },
  { id: 8, x: 138, y: 108, r: 3.2, delay: '1.85s', label: '08' },
  { id: 9, x: 198, y: 62, r: 3.8, delay: '2.1s', label: '09' },
];

// Conexões entre as 9 estrelas formando um desenho abstrato de constelação
const CONSTELLATION_LINES = [
  { from: 0, to: 1, delay: '0.3s' },
  { from: 1, to: 2, delay: '0.55s' },
  { from: 2, to: 3, delay: '0.8s' },
  { from: 3, to: 4, delay: '1.05s' },
  { from: 4, to: 5, delay: '1.3s' },
  { from: 5, to: 6, delay: '1.55s' },
  // Linhas internas abstratas que fecham a geometria celeste
  { from: 1, to: 7, delay: '1.8s', secondary: true },
  { from: 7, to: 4, delay: '2.0s', secondary: true },
  { from: 7, to: 8, delay: '2.2s', secondary: true },
  { from: 8, to: 5, delay: '2.4s', secondary: true },
  { from: 8, to: 6, delay: '2.6s', secondary: true },
];

const SLIDES = [
  {
    id: 1,
    tag: 'Boas-vindas',
    headline: 'Toda história começa em algum lugar.',
    body: 'Aqui no App do Coautoria você explora suas ideias, descobre suas histórias e dá forma àquilo que tem para contar.',
    themeClass: 'slide-theme-welcome',
  },
  {
    id: 2,
    tag: 'Seu espaço, suas histórias',
    headline: 'Suas histórias te pertencem.',
    body: 'Seus registros são privados, você escolhe quais compartilhar.',
    themeClass: 'slide-theme-privacy',
  },
  {
    id: 3,
    tag: 'V de VOAR',
    headline: 'Descubra o que suas histórias têm a dizer.',
    body: 'Com o V do VOAR, você percorre uma jornada guiada para explorar suas experiências, encontrar conexões e construir sua própria narrativa.',
    themeClass: 'slide-theme-voar',
  },
  {
    id: 4,
    tag: 'Seu banco de histórias',
    headline: 'Guarde suas histórias, retome suas ideias e continue desenvolvendo aquilo que começou.',
    body: null,
    themeClass: 'slide-theme-bank',
  },
  {
    id: 5,
    tag: 'Comunidade & Inspiração',
    headline: 'Suas histórias podem inspirar alguém.',
    body: 'Compartilhe as histórias que se sente confortável em dividir com o mundo.',
    themeClass: 'slide-theme-inspire',
  },
];

export default function Onboarding({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const navigate = useNavigate();

  const handleFinish = useCallback(() => {
    if (onComplete) {
      onComplete();
    } else {
      navigate('/');
    }
  }, [onComplete, navigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinish();
    }
  }, [currentIndex, handleFinish]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Navegação por teclado (Setas Direita / Esquerda / Enter)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleFinish]);

  // Suporte a swipe no mobile
  const onTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const onTouchEnd = (e) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (deltaX < -45) {
      handleNext();
    } else if (deltaX > 45) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  const slide = SLIDES[currentIndex];

  return (
    <div
      className={`onboarding-root ${slide.themeClass}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Elementos sutis de textura e atmosfera de fundo */}
      <div className="onboarding-ambient-glow" aria-hidden="true" />
      <div className="onboarding-paper-lines" aria-hidden="true" />

      <div className="onboarding-container">
        {/* Topo: Barra com 5 segmentos que vai se completando + cabeçalho minimalista */}
        <header className="onboarding-header">
          <div className="onboarding-segments" role="tablist" aria-label="Progresso do Onboarding">
            {SLIDES.map((s, idx) => {
              const isCompleted = idx < currentIndex;
              const isActive = idx === currentIndex;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Tela ${idx + 1}: ${s.tag}`}
                  className={`onboarding-segment ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                >
                  <span className="onboarding-segment-fill" />
                </button>
              );
            })}
          </div>

          <div className="onboarding-top-meta">
            <span className="onboarding-step-counter">
              0{currentIndex + 1} <span className="counter-divider">/</span> 05
            </span>
            <button
              type="button"
              className="onboarding-skip-btn"
              onClick={handleFinish}
            >
              Pular
            </button>
          </div>
        </header>

        {/* Área central: Ilustração animada + Textos com fade-in de baixo para cima */}
        <main key={slide.id} className="onboarding-stage">
          <div className="onboarding-visual-stage">
            {currentIndex === 0 && <VisualWelcome />}
            {currentIndex === 1 && <VisualPrivacy />}
            {currentIndex === 2 && <VisualConstellation />}
            {currentIndex === 3 && <VisualStoryBank />}
            {currentIndex === 4 && <VisualInspire />}
          </div>

          <div className="onboarding-text-block">
            <span className="onboarding-eyebrow fade-up-1">{slide.tag}</span>
            <h1 className={`onboarding-headline fade-up-2 ${!slide.body ? 'onboarding-headline-solo' : ''}`}>
              {slide.headline}
            </h1>
            {slide.body && (
              <p className="onboarding-subtext fade-up-3">
                {slide.body}
              </p>
            )}
          </div>
        </main>

        {/* Rodapé de navegação minimalista */}
        <footer className="onboarding-footer">
          <div className="onboarding-nav-controls">
            <button
              type="button"
              className={`onboarding-btn-back ${currentIndex === 0 ? 'invisible' : ''}`}
              onClick={handlePrev}
              aria-label="Voltar para tela anterior"
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
              <span>Anterior</span>
            </button>

            <button
              type="button"
              className="onboarding-btn-next"
              onClick={handleNext}
            >
              <span>{currentIndex === SLIDES.length - 1 ? 'Começar' : 'Continuar'}</span>
              <ArrowRight size={17} strokeWidth={1.5} className="btn-next-icon" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ==========================================================================
   TELA 1: Boas-vindas — Origem da história, traço de tinta e folha viva
   ========================================================================== */
function VisualWelcome() {
  return (
    <div className="visual-scene scene-welcome" aria-hidden="true">
      {/* Ondas concêntricas onde a primeira gota de ideia nasce */}
      <div className="origin-ripple ripple-1" />
      <div className="origin-ripple ripple-2" />
      <div className="origin-ripple ripple-3" />

      {/* SVG com linha contínua de tinta desenhando-se no espaço */}
      <svg className="welcome-ink-svg" viewBox="0 0 280 220" fill="none">
        <path
          className="ink-flow-path"
          d="M 28 168 C 72 168, 82 95, 138 110 C 188 124, 195 58, 252 52"
          stroke="var(--primary-color)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          className="ink-flow-path-subtle"
          d="M 42 184 C 96 178, 114 134, 168 140 C 210 144, 224 94, 256 84"
          stroke="var(--primary-color)"
          strokeWidth="0.8"
          strokeDasharray="3 5"
          strokeLinecap="round"
        />
        <circle className="ink-origin-dot" cx="28" cy="168" r="3.5" fill="var(--primary-color)" />
        <circle className="ink-spark-dot" cx="252" cy="52" r="4" fill="var(--primary-color)" />
      </svg>

      {/* Emblema Coautoria flutuando suavemente sobre páginas em branco */}
      <div className="welcome-floating-pages">
        <div className="paper-sheet sheet-back" />
        <div className="paper-sheet sheet-mid" />
        <div className="paper-sheet sheet-front">
          <img
            src="/image/icone app.png"
            alt="Coautoria"
            className="welcome-emblem-img"
          />
          <div className="sheet-writing-lines">
            <span className="writing-line line-w1" />
            <span className="writing-line line-w2" />
            <span className="writing-line line-w3" />
          </div>
        </div>
      </div>

      {/* Pena minimalista flutuando */}
      <div className="welcome-feather-badge">
        <Feather size={16} strokeWidth={1.5} />
      </div>
    </div>
  );
}

/* ==========================================================================
   TELA 2: Seu espaço, suas histórias — Diário privado & escolha de partilha
   ========================================================================== */
function VisualPrivacy() {
  return (
    <div className="visual-scene scene-privacy" aria-hidden="true">
      {/* Anéis orbitais de proteção */}
      <div className="sanctuary-orbit orbit-outer" />
      <div className="sanctuary-orbit orbit-inner" />

      {/* Caderno / Cofre Pessoal no centro */}
      <div className="privacy-journal-card">
        <div className="journal-spine" />
        <div className="journal-content">
          <div className="privacy-lock-halo">
            <Lock size={22} strokeWidth={1.4} className="privacy-lock-icon" />
          </div>
          <div className="journal-secret-lines">
            <span className="secret-line s-line-1" />
            <span className="secret-line s-line-2" />
          </div>
          <div className="privacy-toggle-pill">
            <span className="privacy-dot" />
            <span className="privacy-pill-text">Privado por padrão</span>
          </div>
        </div>
      </div>

      {/* Cartão secundário representando a escolha consciente de compartilhar */}
      <div className="privacy-choice-badge badge-left">
        <ShieldCheck size={15} strokeWidth={1.5} />
        <span>Só seu</span>
      </div>

      <div className="privacy-choice-badge badge-right">
        <Sparkles size={14} strokeWidth={1.5} />
        <span>Você escolhe</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   TELA 3: V de VOAR — Constelação de 9 estrelas se conectando em desenho abstrato
   ========================================================================== */
function VisualConstellation() {
  return (
    <div className="visual-scene scene-constellation" aria-hidden="true">
      <div className="constellation-halo" />

      <svg
        className="constellation-svg"
        viewBox="0 0 300 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.65" />
            <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Linhas conectando as 9 estrelas gradualmente */}
        {CONSTELLATION_LINES.map((line, index) => {
          const start = CONSTELLATION_STARS[line.from];
          const end = CONSTELLATION_STARS[line.to];
          return (
            <line
              key={index}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              className={`constellation-line ${line.secondary ? 'line-secondary' : 'line-primary'}`}
              style={{ animationDelay: line.delay }}
            />
          );
        })}

        {/* As 9 estrelas da jornada */}
        {CONSTELLATION_STARS.map((star) => (
          <g
            key={star.id}
            className="constellation-star-group"
            style={{ animationDelay: star.delay }}
          >
            {/* Halo pulsante ao redor da estrela */}
            <circle
              cx={star.x}
              cy={star.y}
              r={star.r * 3.4}
              fill="url(#starGlow)"
              className="star-pulse-aura"
              style={{ animationDelay: star.delay }}
            />
            {/* Estrela central */}
            <circle
              cx={star.x}
              cy={star.y}
              r={star.r}
              className={`star-core ${star.primary ? 'star-core-primary' : ''}`}
            />
            {/* Brilho em cruz sutil nas estrelas principais */}
            {star.primary && (
              <g className="star-cross-flare">
                <line
                  x1={star.x - 9}
                  y1={star.y}
                  x2={star.x + 9}
                  y2={star.y}
                  stroke="var(--primary-color)"
                  strokeWidth="0.75"
                   strokeOpacity="0.6"
                />
                <line
                  x1={star.x}
                  y1={star.y - 9}
                  x2={star.x}
                  y2={star.y + 9}
                  stroke="var(--primary-color)"
                  strokeWidth="0.75"
                  strokeOpacity="0.6"
                />
              </g>
            )}
          </g>
        ))}
      </svg>

      <div className="constellation-caption">
        <span>9 estrelas · 1 narrativa conectada</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   TELA 4: Seu banco de histórias — Mesmo ícone BookOpen do menu inferior
   ========================================================================== */
function VisualStoryBank() {
  return (
    <div className="visual-scene scene-bank" aria-hidden="true">
      {/* Fragmentos de ideias que convergem e são guardados no banco */}
      <div className="memory-fragment frag-audio">
        <Mic size={13} strokeWidth={1.5} />
        <div className="mini-waveform">
          <span /><span /><span /><span /><span />
        </div>
      </div>

      <div className="memory-fragment frag-note">
        <FileText size={13} strokeWidth={1.5} />
        <div className="mini-note-lines">
          <span /><span />
        </div>
      </div>

      <div className="memory-fragment frag-spark">
        <Sparkles size={13} strokeWidth={1.5} />
        <span>Ideia salva</span>
      </div>

      {/* Arcos sutis guiando as memórias para o livro */}
      <svg className="bank-arcs-svg" viewBox="0 0 260 220" fill="none">
        <path
          className="bank-arc-path"
          d="M 48 64 Q 130 35 130 105"
          stroke="var(--primary-color)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <path
          className="bank-arc-path"
          d="M 212 72 Q 130 45 130 105"
          stroke="var(--primary-color)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
      </svg>

      {/* Ícone exato do menu inferior (BookOpen) em destaque arquitetônico */}
      <div className="bank-central-emblem">
        <div className="bank-emblem-ring ring-outer" />
        <div className="bank-emblem-ring ring-inner" />
        <div className="bank-icon-box">
          <BookOpen size={40} strokeWidth={1.35} className="bank-book-icon" />
        </div>
        <span className="bank-nav-label-preview">Minhas Histórias</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   TELA 5: Suas histórias podem inspirar alguém — Ondas de ressonância
   ========================================================================== */
function VisualInspire() {
  return (
    <div className="visual-scene scene-inspire" aria-hidden="true">
      {/* Ondas de ressonância se expandindo a partir da sua história */}
      <div className="inspire-wave wave-1" />
      <div className="inspire-wave wave-2" />
      <div className="inspire-wave wave-3" />

      {/* Linhas de conexão sutis entre o centro e outras vidas */}
      <svg className="inspire-network-svg" viewBox="0 0 260 220" fill="none">
        <line x1="130" y1="110" x2="58" y2="62" className="inspire-ray ray-1" />
        <line x1="130" y1="110" x2="206" y2="66" className="inspire-ray ray-2" />
        <line x1="130" y1="110" x2="64" y2="164" className="inspire-ray ray-3" />
        <line x1="130" y1="110" x2="202" y2="160" className="inspire-ray ray-4" />
      </svg>

      {/* Centro: A história compartilhada */}
      <div className="inspire-center-node">
        <Heart size={24} strokeWidth={1.4} className="inspire-heart-icon" />
      </div>

      {/* Nós ao redor que se iluminam ao receber a história */}
      <div className="inspire-listener-node node-tl">
        <Users size={14} strokeWidth={1.5} />
      </div>
      <div className="inspire-listener-node node-tr">
        <Sparkles size={14} strokeWidth={1.5} />
      </div>
      <div className="inspire-listener-node node-bl">
        <BookOpen size={14} strokeWidth={1.5} />
      </div>
      <div className="inspire-listener-node node-br">
        <Feather size={14} strokeWidth={1.5} />
      </div>
    </div>
  );
}

