import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PenTool, BookOpen, TrendingUp, Map, Mail, Search, Target, Database, Award, 
  CheckCircle, ArrowLeft, Lock, Sparkles 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserVoarProgress } from '../lib/userProgress';
import './Home.css';

const STEPS = [
  {
    id: 1,
    title: 'O Convite',
    description: 'Assuma o compromisso com a sua própria história',
    icon: <PenTool size={20} className="step-icon-svg" />,
    path: '/passo-1'
  },
  {
    id: 2,
    title: 'Bloco Mágico',
    description: 'Ative sua ferramenta de captura de memórias',
    icon: <BookOpen size={20} className="step-icon-svg" />,
    path: '/passo-2'
  },
  {
    id: 3,
    title: 'Linha do Tempo',
    description: 'Desenhe a curva emocional da sua vida',
    icon: <TrendingUp size={20} className="step-icon-svg" />,
    path: '/passo-3'
  },
  {
    id: 4,
    title: 'Mapa de Vida',
    description: 'Organize sua história em 4 capítulos',
    icon: <Map size={20} className="step-icon-svg" />,
    path: '/passo-4'
  },
  {
    id: 5,
    title: 'Carta ao Passado',
    description: 'Escreva com compaixão para quem você foi',
    icon: <Mail size={20} className="step-icon-svg" />,
    path: '/passo-5'
  },
  {
    id: 6,
    title: 'O Espelho',
    description: 'Identifique os padrões invisíveis que governam a sua vida',
    icon: <Search size={20} className="step-icon-svg" />,
    path: '/passo-6'
  },
  {
    id: 7,
    title: 'Declaração de Propósito',
    description: 'Sintetize as suas descobertas em uma frase de propósito',
    icon: <Target size={20} className="step-icon-svg" />,
    path: '/passo-7'
  },
  {
    id: 8,
    title: 'Banco de Histórias Brutas',
    description: 'Extraia micro-histórias da sua biografia',
    icon: <Database size={20} className="step-icon-svg" />,
    path: '/passo-8'
  },
  {
    id: 9,
    title: 'Carta ao Futuro',
    description: 'Celebre suas descobertas e sele o compromisso',
    icon: <Award size={20} className="step-icon-svg" />,
    path: '/passo-9'
  }
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [progressData, setProgressData] = useState({
    completedSteps: {},
    currentStepId: 1,
    percentage: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      if (!user) {
        setProgressData({
          completedSteps: {},
          currentStepId: 1,
          percentage: 0
        });
        setLoading(false);
        return;
      }

      try {
        const data = await getUserVoarProgress(user.id);
        setProgressData(data);
      } catch (err) {
        console.error('Erro ao buscar progresso:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [user]);

  // Se não estiver logado, exibe apenas o Passo 1.
  // Se estiver logado, exibe apenas os passos liberados até a etapa atual.
  const visibleSteps = user 
    ? STEPS.filter(step => step.id <= progressData.currentStepId)
    : STEPS.filter(step => step.id === 1);

  return (
    <div className="home-container animate-fade-in">
      {/* Botão de retorno para o Método V.O.A.R. */}
      <div className="w-full max-w-3xl mx-auto mb-6 flex justify-start">
        <button 
          className="back-btn"
          onClick={() => navigate('/voar')}
          title="Voltar ao Método V.O.A.R."
        >
          <ArrowLeft size={18} />
          <span>Voltar ao Método V.O.A.R.</span>
        </button>
      </div>

      <header className="home-header">
        <div className="logo-circle">
          <img src="/image/icone app.png" alt="Logo Coautoria" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <h1 className="home-title">Módulo Voz</h1>
        <h2 className="home-subtitle">O Despertar da Sua História</h2>
        
        {/* Caixa explicativa com espaçamento editorial generoso */}
        <div className="step-intro-box" style={{ maxWidth: '800px', margin: '0 auto 2.5rem auto' }}>
          <h3>O que é o Módulo VOZ?</h3>
          <p>
            O Módulo <strong>VOZ</strong> é o primeiro e mais íntimo alicerce da Metodologia V.O.A.R. Trata-se de um <strong>mergulho profundo no seu próprio “eu”</strong>. Antes de se preocupar com técnicas avançadas de escrita ou de pensar em como o público reagirá, você precisa resgatar quem você foi, quem você se tornou e qual é a verdade essencial que só você pode contar.
          </p>

          <div className="intro-subcard mt-4" style={{ borderLeftColor: 'var(--primary-color)' }}>
            <strong style={{ color: 'var(--primary-color)', display: 'block', marginBottom: '0.35rem' }}>
              🔒 Compromisso Tecnológico de Sigilo & Confidencialidade
            </strong>
            Tudo o que você escrever, gravar ou registrar nos 9 passos do Módulo Voz é <strong>estritamente sigiloso e confidencial</strong>. Nossos sistemas e bancos de dados garantem proteção e acesso restrito exclusivo à sua conta. Ninguém terá acesso aos seus desabafos e memórias sem sua autorização explícita. Escreva com o coração aberto e sem filtros.
          </div>
        </div>

        <div className="flex items-center justify-between w-full max-w-3xl mx-auto mb-4 px-2">
          <span className="home-methodology" style={{ margin: 0 }}>
            {user ? `Seu Avanço: ${progressData.percentage}% concluído` : 'Jornada em 9 Etapas · Módulo Voz'}
          </span>
          <span className="text-xs text-muted">
            {visibleSteps.length} de 9 etapas visíveis
          </span>
        </div>
      </header>

      <main className="steps-list">
        {visibleSteps.map((step) => {
          const isDone = !!progressData.completedSteps[step.id];
          const isCurrent = step.id === progressData.currentStepId;
          return (
            <div 
              key={step.id} 
              className={`step-card ${isCurrent ? 'border-primary ring-1 ring-primary/20' : ''}`}
              onClick={() => navigate(step.path)}
              role="button"
              tabIndex={0}
            >
              <div className="step-icon-container">
                {step.icon}
              </div>
              <div className="step-content">
                <h3 className="step-title">
                  <span className="step-number">0{step.id}</span> {step.title}
                </h3>
                <p className="step-desc">{step.description}</p>
              </div>
              <div className={`step-circle flex items-center justify-center ${isDone ? 'bg-success border-success' : ''}`}>
                {isDone && <CheckCircle size={16} color="white" />}
              </div>
            </div>
          );
        })}

        {/* Notificação discreta de etapas futuras protegidas */}
        {visibleSteps.length < 9 && (
          <div 
            className="p-4 border border-dashed rounded text-center text-sm text-secondary"
            style={{ 
              borderColor: 'var(--border-color)', 
              backgroundColor: 'rgba(255,255,255,0.4)',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-1 text-muted">
              <Lock size={15} />
              <span>
                {user 
                  ? `O Passo ${visibleSteps.length + 1} será desbloqueado assim que você concluir o Passo ${visibleSteps.length}.`
                  : 'Faça login no Passo 1 e assine o compromisso para desbloquear as etapas seguintes.'}
              </span>
            </div>
            <p className="text-xs text-muted">
              As etapas avançam em ordem para garantir a profundidade e a coerência da sua narrativa.
            </p>
          </div>
        )}

        {/* Card de Conclusão quando os 9 passos forem completados */}
        {progressData.percentage === 100 && (
          <div 
            className="step-card mt-4"
            onClick={() => navigate('/conclusao')}
            role="button"
            tabIndex={0}
            style={{ 
              borderColor: 'var(--primary-color)', 
              backgroundColor: 'var(--bg-color-tint)' 
            }}
          >
            <div className="step-icon-container" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
              <Award size={20} />
            </div>
            <div className="step-content">
              <h3 className="step-title" style={{ color: 'var(--primary-color)' }}>
                Conclusão do Módulo Voz
              </h3>
              <p className="step-desc">Acesse a síntese completa da sua jornada, valores e declaração de propósito.</p>
            </div>
            <div className="step-circle bg-success border-success flex items-center justify-center">
              <CheckCircle size={16} color="white" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
