import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PenTool, BookOpen, TrendingUp, Map, Mail, Search, Target, Database, Award, 
  CheckCircle, ArrowLeft, Lock, Coffee, Sparkles 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserVoarProgress } from '../lib/userProgress';
import { VoarBackgroundConstellation, VoarStepProgressBar, VoarStepCelebration, VOAR_GROUP_MILESTONES } from '../components/VoarConstellation';
import './Home.css';

const STEPS = [
  {
    id: 1,
    group: 1,
    title: 'O Convite',
    description: 'Assuma o compromisso com a sua própria história',
    icon: <PenTool size={20} className="step-icon-svg" />,
    path: '/passo-1'
  },
  {
    id: 2,
    group: 1,
    title: 'Bloco Mágico',
    description: 'Ative sua ferramenta de captura de memórias',
    icon: <BookOpen size={20} className="step-icon-svg" />,
    path: '/passo-2'
  },
  {
    id: 3,
    group: 1,
    title: 'Linha do Tempo',
    description: 'Desenhe a curva emocional da sua vida',
    icon: <TrendingUp size={20} className="step-icon-svg" />,
    path: '/passo-3'
  },
  {
    id: 4,
    group: 2,
    title: 'Mapa de Vida',
    description: 'Organize sua história em 4 capítulos',
    icon: <Map size={20} className="step-icon-svg" />,
    path: '/passo-4'
  },
  {
    id: 5,
    group: 2,
    title: 'Carta ao Passado',
    description: 'Escreva com compaixão para quem você foi',
    icon: <Mail size={20} className="step-icon-svg" />,
    path: '/passo-5'
  },
  {
    id: 6,
    group: 2,
    title: 'O Espelho',
    description: 'Identifique os padrões invisíveis que governam a sua vida',
    icon: <Search size={20} className="step-icon-svg" />,
    path: '/passo-6'
  },
  {
    id: 7,
    group: 3,
    title: 'Declaração de Propósito',
    description: 'Sintetize as suas descobertas em uma frase de propósito',
    icon: <Target size={20} className="step-icon-svg" />,
    path: '/passo-7'
  },
  {
    id: 8,
    group: 3,
    title: 'Banco de Histórias Brutas',
    description: 'Extraia micro-histórias da sua biografia',
    icon: <Database size={20} className="step-icon-svg" />,
    path: '/passo-8'
  },
  {
    id: 9,
    group: 3,
    title: 'Carta ao Futuro',
    description: 'Celebre suas descobertas e sele o compromisso',
    icon: <Award size={20} className="step-icon-svg" />,
    path: '/passo-9'
  }
];

const GROUPS_INFO = [
  {
    group: 1,
    label: 'Grupo 1 · Etapas 01 a 03',
    title: 'Ciclo I: O Despertar da Memória',
    milestoneStep: 3
  },
  {
    group: 2,
    label: 'Grupo 2 · Etapas 04 a 06',
    title: 'Ciclo II: O Mergulho & Ressignificação',
    milestoneStep: 6
  },
  {
    group: 3,
    label: 'Grupo 3 · Etapas 07 a 09',
    title: 'Ciclo III: Propósito & Voo Autoral',
    milestoneStep: 9
  }
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [progressData, setProgressData] = useState({
    completedSteps: {},
    completedCount: 0,
    currentStepId: 1,
    percentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [celebrationCycleStep, setCelebrationCycleStep] = useState(null);

  useEffect(() => {
    async function loadProgress() {
      if (!user) {
        setProgressData({
          completedSteps: {},
          completedCount: 0,
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

  const visibleSteps = user 
    ? STEPS.filter(step => step.id <= progressData.currentStepId)
    : STEPS.filter(step => step.id === 1);

  const completedCount = progressData.completedCount ?? Object.keys(progressData.completedSteps || {}).length;

  if (celebrationCycleStep) {
    return (
      <VoarStepCelebration
        stepNumber={celebrationCycleStep}
        onContinue={() => setCelebrationCycleStep(null)}
      />
    );
  }

  return (
    <div className="home-container animate-fade-in" style={{ position: 'relative' }}>
      {/* Constelação minimalista grande e sutil de fundo */}
      <VoarBackgroundConstellation />

      {/* Botão de retorno para o Método V.O.A.R. */}
      <div className="w-full max-w-3xl mx-auto mb-6 flex justify-start" style={{ position: 'relative', zIndex: 1 }}>
        <button 
          className="back-btn"
          onClick={() => navigate('/voar')}
          title="Voltar ao Método V.O.A.R."
        >
          <ArrowLeft size={18} />
          <span>Voltar ao Método V.O.A.R.</span>
        </button>
      </div>

      <header className="home-header" style={{ position: 'relative', zIndex: 1 }}>
        <div className="logo-circle">
          <img src="/image/icone app.png" alt="Logo Coautoria" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <h1 className="home-title">Módulo Voz</h1>
        <h2 className="home-subtitle">O Despertar da Sua História</h2>
        
        {/* Caixa explicativa com espaçamento editorial generoso */}
        <div className="step-intro-box" style={{ maxWidth: '800px', margin: '0 auto 1.75rem auto' }}>
          <h3>O que é o Módulo VOZ?</h3>
          <p>
            O Módulo <strong>VOZ</strong> é o primeiro e mais íntimo alicerce da Metodologia V.O.A.R. Trata-se de um <strong>mergulho profundo no seu próprio “eu”</strong>, dividido em <strong>3 grupos de 3 etapas</strong> para que você avance no seu ritmo.
          </p>

          <div className="intro-subcard mt-4" style={{ borderLeftColor: 'var(--primary-color)' }}>
            <strong style={{ color: 'var(--primary-color)', display: 'block', marginBottom: '0.35rem' }}>
              🔒 Compromisso Tecnológico de Sigilo & Confidencialidade
            </strong>
            Tudo o que você escrever, gravar ou registrar nos 9 passos do Módulo Voz é <strong>estritamente sigiloso e confidencial</strong>. Nossos sistemas garantem proteção exclusiva à sua conta.
          </div>
        </div>

        {/* Barra de conclusão que avança junto com o progresso + Constelação */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <VoarStepProgressBar
            currentStep={Math.min(9, progressData.currentStepId || 1)}
            isStepDone={completedCount === 9}
          />
        </div>
      </header>

      <main className="steps-list" style={{ position: 'relative', zIndex: 1 }}>
        {GROUPS_INFO.map((groupInfo) => {
          const groupSteps = visibleSteps.filter(s => s.group === groupInfo.group);
          if (groupSteps.length === 0) return null;

          const isGroupCompleted =
            !!progressData.completedSteps[groupInfo.milestoneStep - 2] &&
            !!progressData.completedSteps[groupInfo.milestoneStep - 1] &&
            !!progressData.completedSteps[groupInfo.milestoneStep];

          const milestoneMsg = VOAR_GROUP_MILESTONES[groupInfo.milestoneStep];

          return (
            <div key={groupInfo.group} className="voar-step-group-block">
              <div className="voar-group-header">
                <span className="voar-group-tag">{groupInfo.label}</span>
                <h3 className="voar-group-title">{groupInfo.title}</h3>
              </div>

              <div className="voar-group-steps">
                {groupSteps.map((step) => {
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
              </div>

              {/* Mensagem motivacional ao final de cada grupo de 3 etapas */}
              {(isGroupCompleted || groupSteps.length === 3) && milestoneMsg && (
                <div className={`voar-group-motivational-card ${isGroupCompleted ? 'completed' : ''}`}>
                  <div className="motivational-icon-wrap">
                    <Coffee size={18} />
                  </div>
                  <div className="motivational-body">
                    <span className="motivational-badge">
                      {isGroupCompleted ? milestoneMsg.badge : `Pausa Consciente · Fim do ${groupInfo.group}º Grupo`}
                    </span>
                    <h4 className="motivational-title">{milestoneMsg.title}</h4>
                    <p className="motivational-text">{milestoneMsg.message}</p>
                    <button
                      type="button"
                      className="btn-outline text-xs mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded"
                      onClick={() => setCelebrationCycleStep(groupInfo.milestoneStep)}
                    >
                      <Sparkles size={13} />
                      <span>Ver animação das 3 estrelas deste ciclo</span>
                    </button>
                  </div>
                </div>
              )}
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
              As etapas avançam em 3 ciclos de 3 passos para garantir profundidade e acolhimento à sua narrativa.
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
              <p className="step-desc">Acesse a sua constelação completa de 9 estrelas e a síntese da sua jornada.</p>
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
