import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Feather, Music, Layout, Radio, Info, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import './MetodoVoar.css';

const VOAR_MODULES = [
  {
    letter: 'V',
    title: 'Voz',
    subtitle: 'O Despertar da Sua História',
    description: 'Um mergulho corajoso no próprio eu. Desperte memórias, identifique valores virtuosos e forje sua declaração de propósito com total sigilo.',
    available: true,
    stepsCount: 9,
    icon: Feather,
    color: '#b84a20'
  },
  {
    letter: 'O',
    title: 'Orquestração',
    subtitle: 'A Estruturação e Arquitetura da Obra',
    description: 'Conecte os pontos da sua trajetória. Organize capítulos, arcos dramáticos, pontos de virada e dê contorno harmônico ao seu livro ou narrativa.',
    available: false,
    stepsCount: 8,
    icon: Music,
    color: '#3a4f66'
  },
  {
    letter: 'A',
    title: 'Apresentação',
    subtitle: 'A Expressão e Entrega da Narrativa',
    description: 'Lapidação estilística e estética. Escolha os formatos de expressão (livro, palestra, áudio, ensaio) e refine a postura da sua autoria diante do público.',
    available: false,
    stepsCount: 10,
    icon: Layout,
    color: '#2d5a43'
  },
  {
    letter: 'R',
    title: 'Ressonância',
    subtitle: 'O Eco e a Mensagem no Mundo',
    description: 'Conecte sua voz ao leitor. Gere identificação profunda, promova transformação comunitária e faça sua história reverberar na vida de outras pessoas.',
    available: false,
    stepsCount: 6,
    icon: Radio,
    color: '#8a6229'
  }
];

export default function MetodoVoar() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('V');
  const [showMethodologyGuide, setShowMethodologyGuide] = useState(false);

  return (
    <div className="voar-hub-page animate-fade-in">
      <header className="voar-hub-header">
        <span className="voar-meta-tag">Jornada Completa de Autoria</span>
        <h1 className="voar-hub-title">Metodologia V.O.A.R.</h1>
        <p className="voar-hub-subtitle">
          Uma caminhada integrada em 4 dimensões essenciais da escrita de si: <strong>Voz, Orquestração, Apresentação e Ressonância</strong>.
        </p>

        {/* Botão de Guia Metodológico / Arquitetura */}
        <button 
          className="btn-toggle-guide"
          onClick={() => setShowMethodologyGuide(!showMethodologyGuide)}
        >
          <Info size={16} />
          <span>O que é a Metodologia V.O.A.R., seus Objetivos & Trilhas?</span>
          {showMethodologyGuide ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Guia Explicativo Completo (Considerações Vitor) */}
        {showMethodologyGuide && (
          <div className="methodology-guide-card animate-fade-in">
            <div className="guide-section">
              <h3 className="guide-title">1. Objetivo Geral da Metodologia</h3>
              <p className="guide-text">
                O Método V.O.A.R. foi desenhado para conduzir qualquer pessoa a transformar memórias dispersas e vivências pessoais em uma obra autoral estruturada, potente e com voz própria. Trata-se de uma jornada de desenvolvimento pessoal e habilidade narrativa.
              </p>
            </div>

            <div className="guide-section">
              <h3 className="guide-title">2. A Arquitetura em 4 Módulos</h3>
              <div className="guide-modules-list">
                <div className="guide-module-item">
                  <strong>V · VOZ:</strong> O mergulho no próprio "eu". Antes de aprender "como contar", é preciso saber "quem é você na história". Resgate de memórias, alinhamento de valores e declaração de propósito autoral.
                </div>
                <div className="guide-module-item">
                  <strong>O · ORQUESTRAÇÃO:</strong> A arquitetura da trama. Organização dos fatos em arcos narrativos, capítulos, ritmo, dosagem emocional e estrutura de livro.
                </div>
                <div className="guide-module-item">
                  <strong>A · APRESENTAÇÃO:</strong> A estética e entrega. Estilo da escrita, escolha dos formatos finais (obra impressa, digital, fala pública) e lapidação literária.
                </div>
                <div className="guide-module-item">
                  <strong>R · RESSONÂNCIA:</strong> O eco no leitor e na comunidade. O impacto da mensagem no outro, escuta ativa, conexão afetiva e transformação coletiva.
                </div>
              </div>
            </div>

            <div className="guide-section">
              <h3 className="guide-title">3. Trilhas & Consumo Flexível</h3>
              <p className="guide-text">
                Os módulos podem ser vividos como uma <strong>jornada sequencial completa</strong> ou consumidos de forma <strong>independente / sob demanda</strong>, respeitando o momento, as necessidades e os objetivos específicos de cada participante.
              </p>
            </div>
          </div>
        )}

        {/* Abas / Caminhos V - O - A - R */}
        <div className="voar-tabs-row">
          {VOAR_MODULES.map((mod) => {
            const isSelected = activeTab === mod.letter;
            return (
              <button
                key={mod.letter}
                type="button"
                className={`voar-tab-pill ${isSelected ? 'active' : ''} ${!mod.available ? 'locked-tab' : ''}`}
                onClick={() => {
                  if (mod.available) {
                    setActiveTab(mod.letter);
                  }
                }}
              >
                <span className="tab-letter">{mod.letter}</span>
                <span className="tab-title-text">{mod.title}</span>
                {!mod.available && (
                  <span className="tab-lock-icon" title="Em breve">
                    <Lock size={12} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Grid com visual dos 4 módulos */}
      <section className="voar-modules-overview">
        <div className="voar-modules-grid">
          {VOAR_MODULES.map((mod) => {
            const isVoice = mod.letter === 'V';
            const Icon = mod.icon;
            return (
              <div 
                key={mod.letter}
                className={`voar-module-card ${isVoice ? 'module-active' : 'module-locked'}`}
                onClick={() => {
                  if (isVoice) {
                    navigate('/voar/voz');
                  }
                }}
                role={isVoice ? 'button' : undefined}
                tabIndex={isVoice ? 0 : undefined}
                style={{ cursor: isVoice ? 'pointer' : 'default' }}
              >
                {!mod.available && (
                  <div className="card-lock-overlay">
                    <div className="subtle-lock-badge">
                      <Lock size={13} />
                      <span>Em breve</span>
                    </div>
                  </div>
                )}

                <div className="module-card-top">
                  <div 
                    className="module-letter-badge"
                    style={{ color: mod.color }}
                  >
                    {mod.letter}
                  </div>
                  {isVoice ? (
                    <span className="module-status-active">Disponível</span>
                  ) : (
                    <span className="module-status-locked">Bloqueado</span>
                  )}
                </div>

                <div className="module-card-body">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={16} style={{ color: mod.color }} />
                    <h3 className="module-title">{mod.title}</h3>
                  </div>
                  <h4 className="module-subtitle">{mod.subtitle}</h4>
                  <p className="module-desc">{mod.description}</p>
                </div>

                <div className="module-card-footer mt-4 pt-3 border-t flex items-center justify-between text-xs">
                  {isVoice ? (
                    <>
                      <span className="font-medium text-primary flex items-center gap-1">
                        9 Etapas de Autoria
                      </span>
                      <span className="font-semibold text-primary flex items-center gap-1">
                        Abrir Módulo <ArrowRight size={14} />
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-muted">Trilha em elaboração</span>
                      <span className="text-muted flex items-center gap-1">
                        <Lock size={12} /> Bloqueado
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
