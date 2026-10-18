import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, BookOpen, Users, Bell, Bookmark, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserVoarProgress } from '../lib/userProgress';
import { UNREAD_NEWS_KEY, LATEST_NEWS_ID } from './Novidades';
import './Hub.css';

export default function Hub() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [progressData, setProgressData] = useState({
    percentage: 0,
    currentStepPath: '/passo-1',
    currentStepTitle: 'O Convite'
  });
  const [hasNewNews, setHasNewNews] = useState(false);

  useEffect(() => {
    // Ponto amarelo brilhante aparece se houver postagem recente ainda não lida
    const lastReadPostId = localStorage.getItem(UNREAD_NEWS_KEY);
    if (lastReadPostId !== LATEST_NEWS_ID) {
      setHasNewNews(true);
    } else {
      setHasNewNews(false);
    }

    if (user) {
      getUserVoarProgress(user.id).then(setProgressData);
    }
  }, [user]);

  const handleOpenNews = () => {
    localStorage.setItem(UNREAD_NEWS_KEY, LATEST_NEWS_ID);
    setHasNewNews(false);
    navigate('/novidades');
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

      {/* 2. Hero Folio: Caderno de Bordo / Meu Espaço */}
      <section className="hub-journey-hero">
        <div className="journey-hero-header">
          <div className="journey-folio-tag">
            <Bookmark size={13} className="folio-icon" />
            <span>Caderno de Bordo · Meu Espaço</span>
          </div>
          <span className="journey-percentage-text">{progressData.percentage}% concluído</span>
        </div>

        <div className="journey-hero-body">
          <h2 className="journey-title">
            {progressData.percentage === 100 
              ? 'Módulo Voz Concluído' 
              : `Etapa Atual — ${progressData.currentStepTitle}`}
          </h2>
          <p className="journey-desc">
            {progressData.percentage === 0
              ? 'Dê o primeiro passo assinando o seu compromisso e despertando a sua voz autoral.'
              : progressData.percentage === 100
                ? 'Você completou as 9 etapas. Revise suas reflexões ou acesse seu acervo literário.'
                : 'Retome exatamente de onde parou e continue lapidando suas narrativas.'}
          </p>

          {/* Architectural progress track */}
          <div className="journey-progress-wrapper">
            <div className="journey-progress-track">
              <div 
                className="journey-progress-fill" 
                style={{ width: `${Math.max(4, progressData.percentage)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <button 
          className="btn-continue-journey"
          onClick={() => navigate(progressData.currentStepPath || '/passo-1')}
        >
          <span>Continuar minha jornada</span>
          <ArrowRight size={16} className="journey-arrow-icon" />
        </button>
      </section>

      {/* 3. Breve Explicação Inspiradora: O que é o VOAR e por que ele é importante */}
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

      {/* 4. Grid dos 4 Cards Clicáveis */}
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

        {/* Card 4: Novidades (Com Ponto Amarelo Brilhante) */}
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
