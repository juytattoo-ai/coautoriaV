import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, BookOpen, Users, Bell, Bookmark, Sparkles, Clock, RefreshCw, Feather, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserVoarProgress } from '../lib/userProgress';
import { fetchStoryChallenges, getCurrentThreeDayCycleInfo, STORY_CHALLENGES_DB } from '../lib/storyChallenges';
import { CONSTELLATION_STARS, CONSTELLATION_CONNECTIONS } from '../components/VoarConstellation';
import { UNREAD_NEWS_KEY, LATEST_NEWS_ID } from './Novidades';
import './Hub.css';

export default function Hub() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [progressData, setProgressData] = useState({
    completedSteps: {},
    completedCount: 0,
    percentage: 0,
    currentStepId: 1,
    currentStepPath: '/passo-1',
    currentStepTitle: 'O Convite'
  });
  const [hasNewNews, setHasNewNews] = useState(false);

  // Banco de Desafios de 3 em 3 dias
  const [challengesList, setChallengesList] = useState(STORY_CHALLENGES_DB);
  const [challengeOffset, setChallengeOffset] = useState(0);

  useEffect(() => {
    const lastReadPostId = localStorage.getItem(UNREAD_NEWS_KEY);
    if (lastReadPostId !== LATEST_NEWS_ID) {
      setHasNewNews(true);
    } else {
      setHasNewNews(false);
    }

    if (user) {
      getUserVoarProgress(user.id).then(setProgressData);
    }

    fetchStoryChallenges().then(setChallengesList);
  }, [user]);

  const handleOpenNews = () => {
    localStorage.setItem(UNREAD_NEWS_KEY, LATEST_NEWS_ID);
    setHasNewNews(false);
    navigate('/novidades');
  };

  const completedCount = progressData.completedCount ?? Object.keys(progressData.completedSteps || {}).length;
  const currentCycle = progressData.currentStepId <= 3 ? 1 : progressData.currentStepId <= 6 ? 2 : 3;
  const cycleInfo = getCurrentThreeDayCycleInfo(challengesList, challengeOffset);
  const activeChallenge = cycleInfo.challenge;

  const getStarById = (id) => CONSTELLATION_STARS.find((s) => s.id === id);

  const handleAcceptChallenge = () => {
    const params = new URLSearchParams({
      desafioTitulo: activeChallenge.title,
      desafioPrompt: activeChallenge.prompt,
      desafioTema: activeChallenge.suggestedTheme || 'Lição de Vida'
    });
    navigate(`/minhas-historias?${params.toString()}`);
  };

  return (
    <div className="hub-page animate-fade-in">
      {/* 1. Masthead Editorial com a Logo */}
      <header className="hub-header">
        <div className="hub-masthead-emblem">
          <img src="/image/icone app.png" alt="Logo Coautoria" className="hub-masthead-logo" />
        </div>
        <div className="hub-masthead-edition">Caderno de Memória & Autoria</div>
        <h1 className="hub-brand-name">Coautoria</h1>
        <p className="hub-brand-tagline">
          Um espaço para descobrir, construir e compartilhar histórias.
        </p>
        <div className="hub-masthead-rule"></div>
      </header>

      {/* 2. QUADRO DE CONTINUIDADE EM DESTAQUE (Módulo Atual do Usuário) */}
      <section className="hub-journey-hero">
        <div className="journey-hero-accent-bar" aria-hidden="true" />

        <div className="journey-hero-header">
          <div className="journey-folio-tag">
            <Bookmark size={14} className="folio-icon" />
            <span>Continue de onde parou · Módulo Voz</span>
          </div>

          <div className="journey-stats-badges">
            <span className="journey-steps-count-badge">
              <Star size={12} className="star-badge-icon" />
              <strong>{completedCount} de 9</strong> etapas concluídas
            </span>
            <span className="journey-percentage-text">{progressData.percentage}%</span>
          </div>
        </div>

        <div className="journey-hero-content-row">
          <div className="journey-hero-body">
            <span className="journey-cycle-kicker">
              {completedCount === 9
                ? 'Jornada Completa · 3 Ciclos Finalizados'
                : `${currentCycle}º Ciclo em andamento · Passo ${progressData.currentStepId || 1} de 9`}
            </span>

            <h2 className="journey-title">
              {progressData.percentage === 100
                ? 'Módulo Voz Concluído!'
                : `Próximo Passo: ${progressData.currentStepTitle}`}
            </h2>

            <p className="journey-desc">
              {progressData.percentage === 0
                ? 'Dê o primeiro passo assinando o seu compromisso e acendendo a 1ª estrela da sua constelação.'
                : progressData.percentage === 100
                  ? 'Todas as 9 estrelas estão acesas! Revise a síntese da sua jornada ou alimente seu acervo.'
                  : `Você já concluiu ${completedCount} de 9 etapas. Retome sua escrita exatamente de onde parou — seu progresso está salvo.`}
            </p>

            {/* Barra de 9 segmentos dividida em 3 grupos de 3 etapas */}
            <div className="journey-progress-wrapper">
              <div className="journey-nine-steps-bar">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((stepNum) => {
                  const isDone = stepNum <= completedCount;
                  const isCurrent = stepNum === progressData.currentStepId && completedCount < 9;
                  return (
                    <div
                      key={stepNum}
                      className={`journey-step-seg ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''} ${stepNum === 3 || stepNum === 6 ? 'group-end' : ''}`}
                      title={`Passo ${stepNum}`}
                    />
                  );
                })}
              </div>
              <div className="journey-triad-captions">
                <span>Ciclo I (1–3)</span>
                <span>Ciclo II (4–6)</span>
                <span>Ciclo III (7–9)</span>
              </div>
            </div>
          </div>

          {/* Miniatura da Constelação do Usuário no Card Principal */}
          <div className="journey-hero-constellation-box" aria-hidden="true">
            <svg viewBox="25 40 250 195" className="journey-hero-constellation-svg">
              {CONSTELLATION_CONNECTIONS.map((conn, idx) => {
                const s1 = getStarById(conn.from);
                const s2 = getStarById(conn.to);
                const isLit = Math.max(conn.from, conn.to) <= Math.max(1, completedCount);
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
                    opacity={isLit ? 0.9 : 0.45}
                  />
                );
              })}
              {CONSTELLATION_STARS.map((star) => {
                const isLit = star.id <= completedCount;
                const isNext = star.id === progressData.currentStepId && completedCount < 9;
                return (
                  <g key={star.id}>
                    {(isLit || isNext) && (
                      <circle
                        cx={star.x}
                        cy={star.y}
                        r={star.r * 2.8}
                        fill="var(--primary-color)"
                        opacity={isLit ? '0.3' : '0.18'}
                      />
                    )}
                    <circle
                      cx={star.x}
                      cy={star.y}
                      r={isLit || isNext ? star.r * 1.15 : star.r * 0.75}
                      fill={isLit ? 'var(--primary-color)' : isNext ? '#f59e0b' : 'var(--border-color-dark)'}
                    />
                  </g>
                );
              })}
            </svg>
            <span className="hero-constellation-label">{completedCount}/9 estrelas</span>
          </div>
        </div>

        <button
          className="btn-continue-journey"
          onClick={() => navigate(progressData.currentStepPath || '/passo-1')}
        >
          <span>
            {progressData.percentage === 0
              ? 'Começar Passo 1: O Convite'
              : progressData.percentage === 100
                ? 'Ver Conclusão do Módulo Voz'
                : `Retomar Passo ${progressData.currentStepId}: ${progressData.currentStepTitle}`}
          </span>
          <ArrowRight size={17} className="journey-arrow-icon" />
        </button>
      </section>

      {/* 3. NOVA ÁREA: DESAFIOS CRIATIVOS */}
      <section className="hub-challenge-card">
        <div className="challenge-card-top">
          <div className="challenge-badge-group">
            <span className="challenge-pill-tag">
              <Sparkles size={12} />
              <span>Desafio Criativo</span>
            </span>
            <span className="challenge-title-small">{activeChallenge.title}</span>
          </div>
        </div>

        <blockquote className="challenge-main-prompt">
          “{activeChallenge.prompt}”
        </blockquote>

        {activeChallenge.hint && (
          <p className="challenge-hint-text">{activeChallenge.hint}</p>
        )}

        <div className="challenge-card-actions">
          <button
            type="button"
            className="btn-accept-challenge"
            onClick={handleAcceptChallenge}
          >
            <Feather size={15} />
            <span>Escrever história deste desafio</span>
            <ArrowRight size={14} />
          </button>

          <button
            type="button"
            className="btn-swap-challenge"
            onClick={() => setChallengeOffset((prev) => prev + 1)}
            title="Ver outro desafio do banco de ideias"
          >
            <RefreshCw size={13} />
            <span>Outro desafio</span>
          </button>
        </div>
      </section>

      {/* 4. Breve Explicação Inspiradora: O que é o VOAR e por que ele é importante */}
      <section className="hub-voar-summary-card">
        <div className="voar-summary-header">
          <span className="voar-summary-tag">Metodologia de Escrita</span>
          <h2 className="voar-summary-title">O que é a Metodologia V.O.A.R. e por que ela é importante?</h2>
        </div>
        <p className="voar-summary-text">
          Nossas vivências pessoais costumam se perder na dispersão da memória. O <strong>Método V.O.A.R.</strong> foi criado para dar estrutura, dignidade e propósito à sua trajetória, conduzindo você por 4 dimensões integradas:
        </p>
        <div className="voar-summary-pills-grid">
          <div className="voar-summary-pill">
            <strong>V · Voz</strong>
            <span>O mergulho no próprio "eu", valores e propósito.</span>
          </div>
          <div className="voar-summary-pill">
            <strong>O · Orquestração</strong>
            <span>A arquitetura dos capítulos e arcos narrativos.</span>
          </div>
          <div className="voar-summary-pill">
            <strong>A · Apresentação</strong>
            <span>A estética, estilo e formato de expressão.</span>
          </div>
          <div className="voar-summary-pill">
            <strong>R · Ressonância</strong>
            <span>O eco da mensagem e a conexão com o leitor.</span>
          </div>
        </div>
      </section>

      {/* 5. Grid dos 4 Cards Clicáveis */}
      <section className="hub-cards-grid">
        {/* Card 1: Método V.O.A.R. */}
        <article 
          className="hub-action-card"
          onClick={() => navigate('/voar')}
          role="button"
          tabIndex={0}
        >
          <div className="card-watermark-icon" aria-hidden="true">
            <Compass size={68} strokeWidth={1.2} />
          </div>

          <div className="card-info">
            <h3 className="card-main-title">Método V.O.A.R.</h3>
            <p className="card-main-subtitle">Passo a passo da sua jornada de escrita e reflexão.</p>
          </div>
          <div className="card-footer-action">
            <span className="card-meta-pill">Módulo Voz Disponível</span>
            <span className="card-action-link">Acessar <ArrowRight size={14} /></span>
          </div>
        </article>

        {/* Card 2: Minhas Histórias */}
        <article 
          className="hub-action-card"
          onClick={() => navigate('/minhas-historias')}
          role="button"
          tabIndex={0}
        >
          <div className="card-watermark-icon" aria-hidden="true">
            <BookOpen size={68} strokeWidth={1.2} />
          </div>

          <div className="card-info">
            <h3 className="card-main-title">Minhas Histórias</h3>
            <p className="card-main-subtitle">Banco e acervo pessoal de memórias, áudios e textos.</p>
          </div>
          <div className="card-footer-action">
            <span className="card-meta-pill">Áudio · Escrita · Texto</span>
            <span className="card-action-link">Abrir acervo <ArrowRight size={14} /></span>
          </div>
        </article>

        {/* Card 3: Roda de Histórias */}
        <article 
          className="hub-action-card"
          onClick={() => navigate('/roda-de-historias')}
          role="button"
          tabIndex={0}
        >
          <div className="card-watermark-icon" aria-hidden="true">
            <Users size={68} strokeWidth={1.2} />
          </div>

          <div className="card-info">
            <h3 className="card-main-title">Roda de Histórias</h3>
            <p className="card-main-subtitle">Compartilhe suas narrativas e conecte-se com a comunidade.</p>
          </div>
          <div className="card-footer-action">
            <span className="card-meta-pill">Comunidade & Conexão</span>
            <span className="card-action-link">Participar <ArrowRight size={14} /></span>
          </div>
        </article>

        {/* Card 4: Novidades */}
        <article 
          className="hub-action-card"
          onClick={handleOpenNews}
          role="button"
          tabIndex={0}
        >
          <div className="card-watermark-icon" aria-hidden="true">
            <Bell size={68} strokeWidth={1.2} />
          </div>

          <div className="card-info">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="card-main-title" style={{ marginBottom: 0 }}>Novidades</h3>
              {hasNewNews && (
                <span className="glowing-yellow-dot" title="Novidade recente disponível"></span>
              )}
            </div>
            <p className="card-main-subtitle">Artigos, encontros literários, eventos e atualizações.</p>
          </div>
          <div className="card-footer-action">
            <span className="card-meta-pill">Publicações Recentes</span>
            <span className="card-action-link">Ler avisos <ArrowRight size={14} /></span>
          </div>
        </article>
      </section>
    </div>
  );
}
