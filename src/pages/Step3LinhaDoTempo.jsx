import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle, Activity, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import './Step3LinhaDoTempo.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="chart-tooltip">
        <p className="tooltip-title">{data.titulo}</p>
        <p className="tooltip-desc">{label} anos - {data.emocao}</p>
        <p className="tooltip-score">Nota: {data.pontuacao > 0 ? `+${data.pontuacao}` : data.pontuacao}</p>
      </div>
    );
  }
  return null;
};

export default function Step3LinhaDoTempo() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [events, setEvents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [emotion, setEmotion] = useState('');
  const [age, setAge] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .eq('user_id', user.id)
        .order('age', { ascending: true }); // Important to order by age for the chart
        
      if (error) throw error;
      if (data) setEvents(data);
    } catch (err) {
      console.error("Erro ao buscar eventos da linha do tempo:", err);
    }
  };

  const handleSaveEvent = async () => {
    if (!title.trim() || !age || !user) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('timeline_events')
        .insert([{ 
          user_id: user.id,
          title,
          emotion,
          age: parseInt(age, 10),
          score: parseInt(score, 10)
        }])
        .select();

      if (error) throw error;
      
      if (data) {
        // Re-fetch to guarantee sorting by age
        await fetchEvents();
        
        // Reset form
        setTitle('');
        setEmotion('');
        setAge('');
        setScore(0);
        setIsFormOpen(false);
      }
    } catch (err) {
      alert("Erro ao salvar evento. A tabela 'timeline_events' foi criada?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Prepara os dados para o gráfico de linha
  const chartData = events.map(ev => ({
    name: ev.age.toString(),
    pontuacao: ev.score,
    titulo: ev.title,
    emocao: ev.emotion
  }));

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header flex justify-between items-center w-full">
        <div className="flex gap-4">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            <span>Início</span>
          </button>
          <button className="back-btn" onClick={() => navigate('/passo-2')}>
            <ArrowLeft size={20} />
            <span>Voltar ao Passo 2</span>
          </button>
        </div>
      </header>

      <main className="step-content-wrapper">
        <span className="step-badge">PASSO 3 DE 9</span>
        <h1 className="page-title" style={{textAlign: 'left', marginTop: '1rem'}}>Linha do Tempo Emocional</h1>
        
        <div className="step-intro-box">
          <h3>Como funciona e para que serve a Linha do Tempo?</h3>
          <p>
            A vida não é uma linha reta; ela é composta por oscilações dramáticas. Ao pontuar cada marco com a sua respectiva idade e impacto emocional, você gera um <strong>gráfico vivo da sua trajetória</strong>, permitindo identificar com clareza os padrões e pontos de virada da sua biografia.
          </p>
          <div className="intro-subgrid">
            <div className="intro-subcard" style={{ borderLeftColor: 'var(--success-color)' }}>
              <strong style={{ color: 'var(--success-color)', display: 'block', marginBottom: '0.35rem' }}>▲ O que são PICOS (+)</strong>
              Conquistas, nascimentos, realizações, encontros transformadores e instantes de epifania e triunfo.
            </div>
            <div className="intro-subcard" style={{ borderLeftColor: 'var(--primary-color)' }}>
              <strong style={{ color: 'var(--primary-color)', display: 'block', marginBottom: '0.35rem' }}>▼ O que são VALES (-)</strong>
              Crises, rupturas, lutos, perdas e transições dolorosas. <em>Na boa narrativa, é nos vales que o herói descobre suas verdadeiras forças.</em>
            </div>
          </div>
        </div>

        {/* Gráfico */}
        <div className="chart-container mb-8">
          <h2 className="chart-title flex items-center gap-2">
            <Activity size={20} className="text-primary"/> Sua Curva Emocional
          </h2>
          
          <div className="chart-wrapper">
            {events.length === 0 ? (
              <div className="empty-chart">
                <Info size={32} />
                <p>O gráfico será desenhado conforme você adiciona eventos abaixo.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="name" tick={{fill: 'var(--text-secondary)'}} tickLine={false} axisLine={{stroke: 'var(--border-color)'}} />
                  <YAxis domain={[-10, 10]} tick={{fill: 'var(--text-secondary)'}} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="pontuacao" 
                    stroke="var(--primary-color)" 
                    strokeWidth={3}
                    dot={{ r: 6, fill: 'var(--primary-color)', strokeWidth: 0 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Botão de Adicionar */}
        {!isFormOpen && events.length < 10 && (
          <button 
            className="new-event-trigger mb-6" 
            onClick={() => setIsFormOpen(true)}
          >
            <Plus size={20} /> Adicionar Evento ({events.length}/10)
          </button>
        )}

        {/* Formulário de Evento */}
        {isFormOpen && (
          <div className="event-form-card animate-fade-in mb-8">
            <h3 className="text-lg font-medium text-primary mb-4">Novo Evento Marcante</h3>
            
            <div className="form-grid">
              <div className="input-group">
                <label>Título do Evento</label>
                <input 
                  type="text" 
                  placeholder="Ex: Primeiro trabalho, Casamento..." 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="timeline-input"
                />
              </div>
              
              <div className="input-group">
                <label>Emoção Principal</label>
                <input 
                  type="text" 
                  placeholder="Ex: Alegria, Ansiedade..." 
                  value={emotion}
                  onChange={e => setEmotion(e.target.value)}
                  className="timeline-input"
                />
              </div>

              <div className="input-group">
                <label>Idade (anos)</label>
                <input 
                  type="number" 
                  min="0"
                  max="120"
                  placeholder="Ex: 22" 
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="timeline-input"
                />
              </div>

              <div className="input-group">
                <label>Nota Emocional (-10 a +10)</label>
                <input 
                  type="range" 
                  min="-10" 
                  max="10" 
                  value={score}
                  onChange={e => setScore(e.target.value)}
                  className="timeline-range"
                />
                <div className="text-center font-medium mt-2" style={{color: score > 0 ? 'var(--success-color)' : score < 0 ? 'var(--danger-color)' : 'var(--text-secondary)'}}>
                  {score > 0 ? `+${score}` : score}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
              <button className="btn-text" onClick={() => setIsFormOpen(false)} disabled={loading}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSaveEvent} disabled={loading || !title || !age}>
                {loading ? 'Salvando...' : 'Salvar Evento'}
              </button>
            </div>
          </div>
        )}

        {/* Lista de Eventos */}
        <div className="events-list">
          {events.map((ev) => (
            <div key={ev.id} className="event-list-item animate-fade-in">
              <div className={`event-score-badge ${ev.score > 0 ? 'positive' : ev.score < 0 ? 'negative' : 'neutral'}`}>
                {ev.score > 0 ? `+${ev.score}` : ev.score}
              </div>
              <div className="event-info">
                <h4 className="event-title">{ev.title}</h4>
                <p className="event-meta">{ev.age} anos · {ev.emotion}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="step-footer mt-12 pt-4 border-t flex justify-between items-center">
          <div className="flex items-center gap-2" style={{color: events.length >= 5 ? 'var(--success-color)' : 'var(--text-muted)'}}>
            <CheckCircle size={20} />
            <span className="font-medium">
              {events.length >= 5 ? 'Passo concluído' : `Faltam ${Math.max(0, 5 - events.length)} eventos`}
            </span>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/passo-4')} disabled={events.length < 5}>
            Próximo Passo →
          </button>
        </div>

      </main>
    </div>
  );
}
