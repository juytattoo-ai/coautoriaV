import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import './Step7Proposito.css';

export default function Step7Proposito() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    theme: '',
    who_i_was: '',
    who_i_became: '',
    message_audience: '',
    message_transformation: ''
  });

  const [extraData, setExtraData] = useState({
    what_is_missing: '',
    johari_window: ''
  });

  useEffect(() => {
    if (user) {
      fetchPurposeStatement();
      try {
        const cached = localStorage.getItem(`coautoria_step7_extras_${user.id}`);
        if (cached) {
          setExtraData(JSON.parse(cached));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [user]);

  const handleExtraChange = (field, value) => {
    const updated = { ...extraData, [field]: value };
    setExtraData(updated);
    if (user) {
      localStorage.setItem(`coautoria_step7_extras_${user.id}`, JSON.stringify(updated));
    }
  };

  const fetchPurposeStatement = async () => {
    try {
      const { data, error } = await supabase
        .from('purpose_statement')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setFormData({
          theme: data.theme || '',
          who_i_was: data.who_i_was || '',
          who_i_became: data.who_i_became || '',
          message_audience: data.message_audience || '',
          message_transformation: data.message_transformation || ''
        });
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Erro ao buscar declaração de propósito:", err);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('purpose_statement')
        .upsert({ 
          user_id: user.id,
          ...formData,
          updated_at: new Date()
        }, { onConflict: 'user_id' });

      if (error) throw error;
      
      setIsSaved(true);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isComplete = Object.values(formData).every(val => val.trim().length > 0);

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header flex justify-between items-center w-full">
        <div className="flex gap-4">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            <span>Início</span>
          </button>
          <button className="back-btn" onClick={() => navigate('/passo-6')}>
            <ArrowLeft size={20} />
            <span>Voltar ao Passo 6</span>
          </button>
        </div>
      </header>

      <main className="step-content-wrapper">
        <span className="step-badge">PASSO 7 DE 9</span>
        <h1 className="page-title" style={{textAlign: 'left', marginTop: '1rem'}}>Declaração de Propósito</h1>
        <p className="page-subtitle" style={{textAlign: 'left', marginBottom: '3rem'}}>
          Sintetize as suas descobertas em uma frase de propósito clara e verdadeira, usando o<br/>
          método de 3 camadas.
        </p>

        <div className="step-intro-box">
          <h3>História ou Mensagem? Qual a diferença?</h3>
          <p>
            A sua <strong>História</strong> é o conjunto de fatos, memórias e capítulos que você viveu até aqui. A sua <strong>Mensagem</strong> é a sabedoria destilada dessa jornada — ou seja, a transformação e a força que as suas palavras podem gerar no outro.
          </p>
        </div>

        <div className="purpose-sections">
          
          {/* Seção 1 */}
          <section className="purpose-card">
            <div className="purpose-header">
              <span className="purpose-number">1</span>
              <h2 className="purpose-title">O Grande Tema</h2>
            </div>
            <p className="purpose-description">Defina o tema central da sua história em até 3 palavras.</p>
            <input 
              type="text" 
              className="purpose-input" 
              placeholder="Ex: Superação, Recomeço, Coragem (salva automaticamente)"
              value={formData.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              onBlur={handleSave}
            />
          </section>

          {/* Seção 2 */}
          <section className="purpose-card">
            <div className="purpose-header">
              <span className="purpose-number">2</span>
              <h2 className="purpose-title">A Transformação</h2>
            </div>
            
            <div className="transformation-flow">
              <div className="transformation-step">
                <label>Quem eu era</label>
                <input 
                  type="text" 
                  className="purpose-input" 
                  placeholder="Ex: Uma pessoa com medo de se expressar..."
                  value={formData.who_i_was}
                  onChange={(e) => handleChange('who_i_was', e.target.value)}
                  onBlur={handleSave}
                />
              </div>
              
              <div className="transformation-arrow">
                <ArrowRight size={20} />
              </div>
              
              <div className="transformation-step">
                <label>Quem me tornei</label>
                <input 
                  type="text" 
                  className="purpose-input" 
                  placeholder="Ex: Alguém que usa a voz para inspirar..."
                  value={formData.who_i_became}
                  onChange={(e) => handleChange('who_i_became', e.target.value)}
                  onBlur={handleSave}
                />
              </div>
            </div>

            {/* O que ainda falta aprender */}
            <div className="mt-4 pt-3 border-t">
              <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">
                E o que você ainda está aprendendo a desenvolver? (O que ainda falta)
              </label>
              <input 
                type="text" 
                className="purpose-input" 
                placeholder="Ex: Aprender a dizer não, confiar no meu próprio ritmo..."
                value={extraData.what_is_missing}
                onChange={(e) => handleExtraChange('what_is_missing', e.target.value)}
              />
            </div>
          </section>

          {/* Seção 3 */}
          <section className="purpose-card">
            <div className="purpose-header">
              <span className="purpose-number">3</span>
              <h2 className="purpose-title">A Frase de Propósito</h2>
            </div>
            
            <div className="statement-fields">
              <div className="statement-field">
                <label>Para quem é a minha mensagem?</label>
                <input 
                  type="text" 
                  className="purpose-input" 
                  placeholder="Ex: pessoas que têm medo de recomeçar"
                  value={formData.message_audience}
                  onChange={(e) => handleChange('message_audience', e.target.value)}
                  onBlur={handleSave}
                />
              </div>
              
              <div className="statement-field">
                <label>Que transformação ela gera?</label>
                <input 
                  type="text" 
                  className="purpose-input" 
                  placeholder="Ex: encontrar coragem para dar o primeiro passo"
                  value={formData.message_transformation}
                  onChange={(e) => handleChange('message_transformation', e.target.value)}
                  onBlur={handleSave}
                />
              </div>
            </div>
          </section>

          {/* Seção 4: Janela de Johari */}
          <section className="purpose-card">
            <div className="purpose-header">
              <span className="purpose-number">4</span>
              <h2 className="purpose-title">O Espelho do Outro (Janela de Johari)</h2>
            </div>
            <p className="purpose-description">
              Muitas vezes, as maiores virtudes da nossa história são aquelas que os outros enxergam com facilidade, mas nós mesmos demoramos a reconhecer.
            </p>
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
              O que amigos, familiares ou mentores costumam elogiar ou ver em você que você talvez ainda subestime?
            </label>
            <textarea 
              className="purpose-input" 
              style={{ minHeight: '80px', width: '100%', resize: 'vertical' }}
              placeholder="Ex: 'Meus amigos sempre dizem que sou uma pessoa acolhedora que sabe escutar sem julgar...'"
              value={extraData.johari_window}
              onChange={(e) => handleExtraChange('johari_window', e.target.value)}
            />
          </section>

        </div>

        {/* Footer actions */}
        <div className="step-footer mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2" style={{color: isComplete ? 'var(--success-color)' : 'var(--text-muted)'}}>
            <CheckCircle size={20} />
            <span className="font-medium">
              {isComplete ? 'Passo concluído' : 'Preencha todos os campos'}
            </span>
          </div>
          
          <div className="flex gap-4">
            <button 
              className={`btn flex items-center gap-2 ${isSaved ? 'btn-secondary' : 'btn-primary'}`}
              onClick={handleSave}
              disabled={loading || !isComplete || isSaved}
            >
              {isSaved ? <CheckCircle size={18} /> : <Save size={18} />}
              {loading ? 'Salvando...' : isSaved ? 'Declaração Salva' : 'Salvar Declaração'}
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/passo-8')}
              disabled={!isSaved}
            >
              Próximo Passo →
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
