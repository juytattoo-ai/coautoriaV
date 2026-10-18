import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import './Step6OEspelho.css';

const QUESTIONS = [
  "Qual emoção ou sentimento aparece com mais frequência ao longo da sua história?",
  "Qual padrão de comportamento costuma se repetir quando você se vê diante de grandes dificuldades?",
  "Ao olhar para suas ações reais nos capítulos, os valores vividos na prática são os mesmos que você escolheu no início (Passo 1), ou outros valores guiaram suas decisões?",
  "Qual é o medo mais recorrente que te fez paralisar, recuar ou adiar decisões importantes?",
  "Qual é a sua maior fortaleza — aquilo que sempre te ajudou a se levantar mesmo quando tudo parecia ruir?",
  "Que tipo de pessoas, amizades e relações você costuma atrair para a sua jornada?",
  "Como você lida com as vitórias e conquistas? E como digere os tropeços e fracassos?",
  "Qual dúvida ou julgamento sobre si mesmo(a) você carregou por mais tempo como se fosse uma verdade?",
  "Qual convicção profunda ou certeza interior sempre te deu coragem nos momentos mais decisivos?",
  "Se a sua vida até aqui fosse um livro ou filme, qual seria o grande tema central?"
];

export default function Step6OEspelho() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState(Array(10).fill(''));
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      fetchReflections();
    }
  }, [user]);

  const fetchReflections = async () => {
    try {
      const { data, error } = await supabase
        .from('mirror_reflections')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "No rows found"
      
      if (data) {
        setAnswers(data.answers || Array(10).fill(''));
      }
    } catch (err) {
      console.error("Erro ao buscar reflexões:", err);
    }
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    setIsSaved(false);
  };

  const handleSaveAll = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Upsert reflection answers
      const { error } = await supabase
        .from('mirror_reflections')
        .upsert({ 
          user_id: user.id,
          answers: answers,
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

  const answeredCount = answers.filter(a => a.trim().length > 0).length;
  const isComplete = answeredCount === 10;

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header flex justify-between items-center w-full">
        <div className="flex gap-4">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            <span>Início</span>
          </button>
          <button className="back-btn" onClick={() => navigate('/passo-5')}>
            <ArrowLeft size={20} />
            <span>Voltar ao Passo 5</span>
          </button>
        </div>
      </header>

      <main className="step-content-wrapper">
        <span className="step-badge">PASSO 6 DE 9</span>
        <h1 className="page-title" style={{textAlign: 'left', marginTop: '1rem'}}>O Espelho</h1>
        <p className="page-subtitle" style={{textAlign: 'left', marginBottom: '3rem'}}>
          Dê um passo para trás e olhe todas as suas anotações. Identifique os padrões invisíveis<br/>
          que governam a sua vida respondendo a estas 10 perguntas profundas.
        </p>

        <div className="questions-list">
          {QUESTIONS.map((question, index) => (
            <div key={index} className="question-card">
              <div className="question-header">
                <span className="question-number">{index + 1}</span>
                <h3 className="question-text">{question}</h3>
              </div>
              <textarea
                className="question-textarea"
                placeholder="Reflita e escreva (salva automaticamente)..."
                value={answers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                onBlur={handleSaveAll}
              />
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="step-footer mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2" style={{color: isComplete ? 'var(--success-color)' : 'var(--text-muted)'}}>
            <CheckCircle size={20} />
            <span className="font-medium">
              {isComplete ? 'Passo concluído' : `${answeredCount} de 10 perguntas respondidas`}
            </span>
          </div>
          
          <div className="flex gap-4">
            <button 
              className={`btn flex items-center gap-2 ${isSaved ? 'btn-secondary' : 'btn-primary'}`}
              onClick={handleSaveAll}
              disabled={loading || isSaved}
            >
              {isSaved ? <CheckCircle size={18} /> : <Save size={18} />}
              {loading ? 'Salvando...' : isSaved ? 'Reflexões Salvas' : 'Salvar Reflexões'}
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/passo-7')}
            >
              Próximo Passo →
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
