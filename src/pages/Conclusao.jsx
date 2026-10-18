import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Star, Target, Database, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
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
          <div className="award-icon-wrapper mb-6">
            <Award size={64} className="text-primary mx-auto" />
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
        <section className="mt-12 p-6" style={{ backgroundColor: 'var(--bg-color-light)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', textAlign: 'left', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Competências Desenvolvidas no Módulo VOZ
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Ao concluir os 9 passos, você desenvolveu habilidades fundamentais para qualquer autor(a) que deseja escrever com verdade e profundidade:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '0.875rem', backgroundColor: 'var(--bg-color-tint)', borderLeft: '3px solid var(--primary-color)', borderRadius: 'var(--radius-xs)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              <strong style={{ color: 'var(--text-primary)' }}>1. Autoconsciência & Pacificação:</strong><br/>
              Capacidade de revisitar feridas, picos e vales do passado sem vitimismo, encontrando significado e compaixão no que viveu.
            </div>
            <div style={{ padding: '0.875rem', backgroundColor: 'var(--bg-color-tint)', borderLeft: '3px solid var(--primary-color)', borderRadius: 'var(--radius-xs)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              <strong style={{ color: 'var(--text-primary)' }}>2. Bússola Moral & Valores Virtuosos:</strong><br/>
              Clareza sobre os 7 princípios inegociáveis que norteiam suas decisões e dão peso ético à sua escrita.
            </div>
            <div style={{ padding: '0.875rem', backgroundColor: 'var(--bg-color-tint)', borderLeft: '3px solid var(--primary-color)', borderRadius: 'var(--radius-xs)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              <strong style={{ color: 'var(--text-primary)' }}>3. Arqueologia Narrativa em 4 Atos:</strong><br/>
              Compreensão da sua biografia dividida em Raízes, Descobertas, Transições e Presente.
            </div>
            <div style={{ padding: '0.875rem', backgroundColor: 'var(--bg-color-tint)', borderLeft: '3px solid var(--primary-color)', borderRadius: 'var(--radius-xs)', fontSize: '0.85rem', lineHeight: '1.5' }}>
              <strong style={{ color: 'var(--text-primary)' }}>4. Propósito & Fio Condutor:</strong><br/>
              Definição cristalina do seu Grande Tema e da Mensagem que transforma o público ou leitor.
            </div>
          </div>
        </section>

        {/* Preparação para o Módulo ORQUESTRAÇÃO */}
        <section className="mt-8 p-6" style={{ backgroundColor: 'var(--bg-color-tint)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', textAlign: 'left' }}>
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--primary-color)' }}>
              Próximo Horizonte da Metodologia V.O.A.R.
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Preparando-se para o Módulo O · ORQUESTRAÇÃO
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
            Agora que você encontrou a sua <strong>Voz</strong> e possui a matéria-prima em mãos, o próximo passo é aprender a <strong>orquestrar</strong> esse material. No Módulo <strong>ORQUESTRAÇÃO</strong>, você aprenderá a tecer arcos dramáticos, definir capítulos, controlar o ritmo da leitura e estruturar uma obra completa (seja um livro, biografia, palestra ou série de ensaios).
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <button className="btn btn-primary" onClick={() => navigate('/voar')}>
              Ver Trilha V.O.A.R. Completa →
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/minhas-historias')}>
              Acessar Meu Banco de Histórias
            </button>
          </div>
        </section>

        <div className="text-center mt-12 mb-8">
          <p className="final-quote">"Minha história importa. Minha voz importa. E eu vou compartilhá-la."</p>
          <button className="btn btn-outline mt-6" onClick={() => navigate('/')}>
            Voltar ao Início
          </button>
        </div>

      </main>
    </div>
  );
}
