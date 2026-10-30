import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Star, Target, Database, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { VoarConstellationSvg } from '../components/VoarConstellation';
import './Conclusao.css';

export default function Conclusao() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    theme: '',
    purpose: '',
    storiesCount: 0,
    hasPastLetter: false,
    hasFutureLetter: false
  });

  useEffect(() => {
    if (user) {
      fetchSummary();
    }
  }, [user]);

  const fetchSummary = async () => {
    try {
      // Fetch Purpose Statement
      const { data: purposeData } = await supabase
        .from('purpose_statement')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Fetch Stories Count
      const { count: storiesCount } = await supabase
        .from('raw_stories')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch Past Letter
      const { data: pastLetterData } = await supabase
        .from('past_letters')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      // Fetch Future Letter
      const { data: futureLetterData } = await supabase
        .from('future_letters')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      setSummary({
        theme: purposeData?.theme || 'Seu Tema Central',
        purpose: purposeData ? `Minha mensagem é para ${purposeData.message_audience} para ${purposeData.message_transformation}.` : 'Sua declaração de propósito.',
        storiesCount: storiesCount || 0,
        hasPastLetter: pastLetterData && pastLetterData.length > 0,
        hasFutureLetter: futureLetterData && futureLetterData.length > 0
      });
    } catch (err) {
      console.error("Erro ao buscar resumo:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page-container flex items-center justify-center min-h-screen text-primary">Carregando o seu resumo...</div>;
  }

  return (
    <div className="page-container animate-fade-in conclusion-page">
      <main className="conclusion-wrapper">
        
        <div className="conclusion-header text-center mb-12">
          <div className="conclusion-constellation-showcase">
            <VoarConstellationSvg completedStep={9} mode="full" />
            <span className="conclusion-constellation-caption">
              V de VOAR · 9 Estrelas Conectadas
            </span>
          </div>
          <h1 className="conclusion-title">Parabéns, {user?.user_metadata?.full_name?.split(' ')[0] || 'Contador(a) de Histórias'}!</h1>
          <p className="conclusion-subtitle">
            Você concluiu o Módulo Voz com maestria. Abaixo está o reflexo da sua jornada<br/>
            e a fundação da mensagem que você vai levar para o mundo.
          </p>
        </div>

        <div className="summary-grid">
          {/* O Grande Tema */}
          <div className="summary-card">
            <div className="summary-icon-box">
              <Star size={24} className="text-primary" />
            </div>
            <h3 className="summary-card-title">O Seu Grande Tema</h3>
            <p className="summary-card-content highlight-text">"{summary.theme}"</p>
            <p className="summary-card-desc">Este é o fio condutor de toda a sua história.</p>
          </div>

          {/* Declaração de Propósito */}
          <div className="summary-card md:col-span-2">
            <div className="summary-icon-box">
              <Target size={24} className="text-primary" />
            </div>
            <h3 className="summary-card-title">Sua Declaração de Propósito</h3>
            <p className="summary-card-content italic text-lg">"{summary.purpose}"</p>
            <p className="summary-card-desc mt-2">Esta é a transformação que só você pode gerar.</p>
          </div>

          {/* Banco de Histórias */}
          <div className="summary-card">
            <div className="summary-icon-box">
              <Database size={24} className="text-primary" />
            </div>
            <h3 className="summary-card-title">Arsenal de Histórias</h3>
            <p className="summary-card-content highlight-text">{summary.storiesCount} micro-histórias</p>
            <p className="summary-card-desc">Matéria-prima garimpada e pronta para encantar.</p>
          </div>

          {/* Cartas */}
          <div className="summary-card">
            <div className="summary-icon-box">
              <MessageCircle size={24} className="text-primary" />
            </div>
            <h3 className="summary-card-title">Pazes com o Passado</h3>
            <div className="flex flex-col gap-2 mt-2">
              <p className="summary-card-desc flex items-center gap-2">
                <span className={`status-dot ${summary.hasPastLetter ? 'active' : ''}`}></span> 
                Carta ao Passado {summary.hasPastLetter ? 'Concluída' : 'Pendente'}
              </p>
              <p className="summary-card-desc flex items-center gap-2">
                <span className={`status-dot ${summary.hasFutureLetter ? 'active' : ''}`}></span> 
                Carta ao Futuro {summary.hasFutureLetter ? 'Concluída' : 'Pendente'}
              </p>
            </div>
          </div>
        </div>

        {/* Competências Desenvolvidas no Módulo VOZ (Considerações Vitor) */}
        <section className="conclusion-section-card">
          <h2 className="conclusion-section-heading">
            Competências Desenvolvidas no Módulo VOZ
          </h2>
          <p className="conclusion-section-lead">
            Ao concluir os 9 passos, você desenvolveu habilidades fundamentais para qualquer autor(a) que deseja escrever com verdade e profundidade:
          </p>

          <div className="conclusion-competencies-grid">
            <div className="conclusion-competency-item">
              <strong>1. Autoconsciência & Pacificação:</strong>
              <span>Capacidade de revisitar feridas, picos e vales do passado sem vitimismo, encontrando significado e compaixão no que viveu.</span>
            </div>
            <div className="conclusion-competency-item">
              <strong>2. Bússola Moral & Valores Virtuosos:</strong>
              <span>Clareza sobre os 7 princípios inegociáveis que norteiam suas decisões e dão peso ético à sua escrita.</span>
            </div>
            <div className="conclusion-competency-item">
              <strong>3. Arqueologia Narrativa em 4 Atos:</strong>
              <span>Compreensão da sua biografia dividida em Raízes, Descobertas, Transições e Presente.</span>
            </div>
            <div className="conclusion-competency-item">
              <strong>4. Propósito & Fio Condutor:</strong>
              <span>Definição cristalina do seu Grande Tema e da Mensagem que transforma o público ou leitor.</span>
            </div>
          </div>
        </section>

        {/* Preparação para o Módulo ORQUESTRAÇÃO */}
        <section className="conclusion-section-card conclusion-next-module-card">
          <div className="conclusion-next-eyebrow">
            Próximo Horizonte da Metodologia V.O.A.R.
          </div>
          <h2 className="conclusion-section-heading">
            Preparando-se para o Módulo O · ORQUESTRAÇÃO
          </h2>
          <p className="conclusion-section-lead">
            Agora que você encontrou a sua <strong>Voz</strong> e possui a matéria-prima em mãos, o próximo passo é aprender a <strong>orquestrar</strong> esse material. No Módulo <strong>ORQUESTRAÇÃO</strong>, você aprenderá a tecer arcos dramáticos, definir capítulos, controlar o ritmo da leitura e estruturar uma obra completa (seja um livro, biografia, palestra ou série de ensaios).
          </p>
          <div className="conclusion-next-actions">
            <button className="btn btn-primary" onClick={() => navigate('/voar')}>
              Ver Trilha V.O.A.R. Completa →
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/minhas-historias')}>
              Acessar Meu Banco de Histórias
            </button>
          </div>
        </section>

        <div className="conclusion-footer-block">
          <p className="final-quote">"Minha história importa. Minha voz importa. E eu vou compartilhá-la."</p>
          <button className="btn btn-outline conclusion-home-btn" onClick={() => navigate('/')}>
            Voltar ao Início
          </button>
        </div>

      </main>
    </div>
  );
}
