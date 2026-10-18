import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Heart, PenTool, LogOut } from 'lucide-react';
import TriggerWarning from '../components/TriggerWarning';
import AuthForm from '../components/AuthForm';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import './Step1Convite.css';

const VALUES_LIST = [
  'Amor', 'Ética', 'Família', 'Liberdade', 'Saúde', 'Sabedoria', 'Fé', 'Gratidão', 'Honestidade',
  'Coragem', 'Respeito', 'Responsabilidade', 'Solidariedade', 'Justiça', 'Humildade', 'Paciência',
  'Perseverança', 'Criatividade', 'Paz', 'Generosidade', 'Integridade', 'Empatia', 'Autenticidade',
  'Lealdade', 'Equilíbrio', 'Crescimento', 'Contribuição', 'Simplicidade', 'Disciplina', 'Compaixão'
];

export default function Step1Convite() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isCommitted, setIsCommitted] = useState(false);
  
  const [selectedValues, setSelectedValues] = useState([]);
  const [reflections, setReflections] = useState({
    q1: '', q2: '', q3: '', q4: ''
  });

  useEffect(() => {
    if (user) {
      fetchStep1Data();
    }
  }, [user]);

  const fetchStep1Data = async () => {
    try {
      const { data: commitmentData } = await supabase
        .from('commitments')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

      if (commitmentData) {
        setIsCommitted(true);
      }

      const { data, error } = await supabase
        .from('step1_reflections')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();
        
      if (data) {
        setSelectedValues(data.selected_values || []);
        setReflections({
          q1: data.q1 || '',
          q2: data.q2 || '',
          q3: data.q3 || '',
          q4: data.q4 || ''
        });
      }
    } catch (err) {
      // It's okay if not found
    }
  };

  const handleSaveData = async (newValues = selectedValues, newReflections = reflections) => {
    if (!user) return;
    try {
      await supabase
        .from('step1_reflections')
        .upsert({
          user_id: user.id,
          selected_values: newValues,
          q1: newReflections.q1,
          q2: newReflections.q2,
          q3: newReflections.q3,
          q4: newReflections.q4,
          updated_at: new Date()
        }, { onConflict: 'user_id' });
    } catch (err) {
      console.error('Erro ao salvar passo 1:', err);
    }
  };

  const handleValueToggle = (value) => {
    let newValues = [...selectedValues];
    if (newValues.includes(value)) {
      newValues = newValues.filter(v => v !== value);
    } else if (newValues.length < 7) {
      newValues.push(value);
    }
    setSelectedValues(newValues);
    handleSaveData(newValues, reflections);
  };

  const handleCommit = async () => {
    if (!user) return;
    setLoading(true);
    
    const userName = user.user_metadata?.full_name || user.email;

    const { error } = await supabase
      .from('commitments')
      .insert([{ 
        user_id: user.id, 
        signature_name: userName 
      }]);

    setLoading(false);
    
    if (!error) {
      setIsCommitted(true);
    } else {
      alert("Erro ao salvar compromisso. Certifique-se de que a tabela e as regras RLS estão configuradas corretamente.");
      console.error(error);
    }
  };

  const isComplete = selectedValues.length === 7 && Object.values(reflections).every(val => val.trim().length > 0) && isCommitted;

  const handleNextStep = async () => {
    navigate('/passo-2');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header flex justify-between items-center w-full">
        <div className="flex gap-4">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            <span>Início</span>
          </button>
        </div>
        {user && (
          <button className="btn-text flex items-center gap-2" onClick={handleLogout} style={{fontSize: '0.875rem'}}>
            <LogOut size={16} /> Sair
          </button>
        )}
      </header>

      <main className="step-content-wrapper">
        <span className="step-badge">PASSO 1 DE 9</span>
        <h1 className="page-title" style={{textAlign: 'left', marginTop: '1rem'}}>O Convite</h1>
        
        {!user ? (
          <>
            <p className="page-subtitle" style={{textAlign: 'left', marginBottom: '3rem'}}>
              Sua jornada é estritamente confidencial. Faça login ou crie sua conta para começar.
            </p>
            <AuthForm />
          </>
        ) : (
          <>
            <p className="page-subtitle" style={{textAlign: 'left', marginBottom: '3rem'}}>
              Tire-se do piloto automático e assuma um compromisso com a sua própria história.<br/>
              Assine o seu termo de compromisso e responda às perguntas fundamentais.
            </p>

            <TriggerWarning />

            {/* 1. Termo de Compromisso */}
            <div className="commitment-card mb-6">
              <h2 className="commitment-title flex items-center gap-2">
                <PenTool size={20} className="text-primary"/> Termo de Compromisso
              </h2>
              <p className="commitment-text">
                "Eu me comprometo a olhar para a minha história com coragem e compaixão. Aceito revisitar meu passado para encontrar minha voz e minha mensagem única. Prometo ser honesto(a) comigo mesmo(a) durante esta jornada."
              </p>

              {!isCommitted ? (
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
                  <div>
                    <span className="block text-sm text-secondary">Assinando como:</span>
                    <strong className="text-primary text-lg">{user.user_metadata?.full_name || user.email}</strong>
                  </div>
                  <button className="btn btn-primary" onClick={handleCommit} disabled={loading}>
                    {loading ? 'Assinando...' : 'Assinar Termo'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-success mt-4">
                  <CheckCircle size={20} />
                  <strong>Compromisso assinado.</strong>
                </div>
              )}
            </div>

            {/* O restante do formulário só deve ser preenchido se o compromisso estiver assinado (opcional, mas recomendado) */}
            <div style={{ opacity: isCommitted ? 1 : 0.5, pointerEvents: isCommitted ? 'auto' : 'none', transition: 'all 0.3s' }}>
              {/* 2. Valores Virtuosos */}
        <div className="commitment-card mb-6">
          <h2 className="commitment-title flex items-center gap-2">
            <Heart size={20} className="text-primary"/> Seus Valores Virtuosos
          </h2>
          <p className="text-secondary mb-3">
            <strong>O que são Valores Virtuosos?</strong> São os princípios fundamentais e a bússola moral que orientam suas decisões nas encruzilhadas da vida, mesmo quando ninguém está olhando.
          </p>
          <div className="intro-subcard" style={{ margin: '1.25rem 0 1.5rem 0', padding: '1.25rem 1.4rem', lineHeight: '1.65' }}>
            <strong style={{ color: 'var(--primary-color)', display: 'block', marginBottom: '0.4rem' }}>Por que focar em valores e virtudes?</strong>
            Sentimentos de dor, revolta ou mágoa podem surgir ao longo da memória — e eles terão espaço para serem acolhidos e ressignificados. Porém, são os <em>valores virtuosos</em> que garantem que sua narrativa não se perca no rancor, servindo de âncora para a sua transformação autoral.
          </div>
          <p className="text-secondary text-sm mb-4">Escolha os <strong>7 valores</strong> que mais definem a essência de quem você é:</p>
          
          <div className="values-grid">
            {VALUES_LIST.map(val => (
              <button 
                key={val}
                className={`value-btn ${selectedValues.includes(val) ? 'selected' : ''}`}
                onClick={() => handleValueToggle(val)}
              >
                {val}
              </button>
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <span className="text-secondary text-sm">{selectedValues.length}/7 selecionados</span>
            {selectedValues.length === 7 && <span className="text-success text-sm flex items-center gap-1"><CheckCircle size={14} /> Seleção de 7 valores concluída</span>}
          </div>
        </div>

        {/* 3. Reflexões Fundamentais */}
        <div className="reflections-list flex-col gap-6">
          {[
            { id: 'q1', text: '1. O que te trouxe até aqui e despertou seu desejo de olhar para a sua história?' },
            { id: 'q2', text: '2. Qual verdade profunda ou momento marcante sobre você mesmo(a) você deseja resgatar e compreender melhor nesta jornada?' },
            { id: 'q3', text: '3. Ao revisitar suas memórias e dores do passado, quais receios ou desconfortos surgem — e do que você precisa para atravessá-los com compaixão?' },
            { id: 'q4', text: '4. Que legado, sentimento ou transformação você deseja despertar na vida de quem um dia ler as suas palavras?' }
          ].map(q => (
            <div key={q.id} className="commitment-card">
              <h3 className="reflection-question">{q.text}</h3>
              <textarea 
                className="reflection-textarea"
                placeholder="Escreva sua reflexão com calma e sinceridade (salva automaticamente)..."
                value={reflections[q.id]}
                onChange={(e) => setReflections({...reflections, [q.id]: e.target.value})}
                onBlur={() => handleSaveData()}
              ></textarea>
            </div>
          ))}
        </div>

        <div className="step-footer mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2" style={{color: isComplete ? 'var(--success-color)' : 'var(--text-muted)'}}>
            <CheckCircle size={20} />
            <span className="font-medium">
              {isComplete ? 'Passo concluído' : 'Passo não concluído'}
            </span>
          </div>
          <button className="btn btn-primary" onClick={handleNextStep}>
            Próximo Passo →
          </button>
        </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
