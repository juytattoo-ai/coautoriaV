import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Save, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import './Step4MapaDeVida.css';

const CHAPTERS = [
  { id: 'raizes', label: 'Raízes' },
  { id: 'descobertas', label: 'Descobertas' },
  { id: 'transicoes', label: 'Transições' },
  { id: 'presente', label: 'O Presente' }
];

const FIELDS = [
  { key: 'positive_events', label: 'EVENTOS POSITIVOS', placeholder: 'Momentos bons que marcaram esse período...' },
  { key: 'negative_events', label: 'EVENTOS NEGATIVOS', placeholder: 'Momentos difíceis que moldaram você...' },
  { key: 'influencers', label: 'PESSOAS QUE INFLUENCIARAM', placeholder: 'Quem marcou essa fase da sua vida...' },
  { key: 'decisions', label: 'DECISÕES QUE MUDARAM O RUMO', placeholder: 'Escolhas que definiram caminhos...' },
  { key: 'beliefs', label: 'CRENÇAS FORMADAS', placeholder: 'O que você passou a acreditar...' },
  { key: 'current_perspective', label: 'RELEITURA ATUAL', placeholder: 'Como você vê esses fatos hoje, com maturidade...' },
  { key: 'main_insight', label: 'INSIGHT PRINCIPAL', placeholder: 'A grande lição deste capítulo...' }
];

const initialChapterState = {
  positive_events: '',
  negative_events: '',
  influencers: '',
  decisions: '',
  beliefs: '',
  current_perspective: '',
  main_insight: ''
};

export default function Step4MapaDeVida() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState(CHAPTERS[0].id);
  const [loading, setLoading] = useState(false);
  const [savedChapters, setSavedChapters] = useState({}); // To track which are saved
  
  const [formData, setFormData] = useState({
    raizes: { ...initialChapterState },
    descobertas: { ...initialChapterState },
    transicoes: { ...initialChapterState },
    presente: { ...initialChapterState }
  });

  useEffect(() => {
    if (user) {
      fetchChapters();
    }
  }, [user]);

  const fetchChapters = async () => {
    try {
      const { data, error } = await supabase
        .from('life_chapters')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newData = { ...formData };
        const savedMap = { ...savedChapters };
        
        data.forEach(chap => {
          if (newData[chap.chapter_id]) {
            newData[chap.chapter_id] = chap.content;
            savedMap[chap.chapter_id] = true;
          }
        });
        
        setFormData(newData);
        setSavedChapters(savedMap);
      }
    } catch (err) {
      console.error("Erro ao buscar capítulos:", err);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value
      }
    }));
    setSavedChapters(prev => ({ ...prev, [activeTab]: false }));
  };

  const handleSaveChapter = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('life_chapters')
        .upsert({ 
          user_id: user.id,
          chapter_id: activeTab,
          content: formData[activeTab],
          updated_at: new Date()
        }, { onConflict: 'user_id, chapter_id' });

      if (error) throw error;
      
      setSavedChapters(prev => ({...prev, [activeTab]: true}));
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeChapterLabel = CHAPTERS.find(c => c.id === activeTab)?.label;
  const isCurrentChapterSaved = !!savedChapters[activeTab];
  const allChaptersSaved = CHAPTERS.every(c => savedChapters[c.id]);

  const getNextChapter = () => {
    const currentIndex = CHAPTERS.findIndex(c => c.id === activeTab);
    if (currentIndex < CHAPTERS.length - 1) {
      return CHAPTERS[currentIndex + 1];
    }
    return null;
  };
  const nextChapter = getNextChapter();

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header flex justify-between items-center w-full">
        <div className="flex gap-4">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            <span>Início</span>
          </button>
          <button className="back-btn" onClick={() => navigate('/passo-3')}>
            <ArrowLeft size={20} />
            <span>Voltar ao Passo 3</span>
          </button>
        </div>
      </header>

      <main className="step-content-wrapper">
        <span className="step-badge">PASSO 4 DE 9</span>
        <h1 className="page-title" style={{textAlign: 'left', marginTop: '1rem'}}>Mapa de Vida Universal</h1>
        
        <div className="step-intro-box">
          <h3>Para que serve o Mapa de Vida Universal?</h3>
          <p>
            O <strong>Mapa de Vida Universal</strong> organiza o mosaico de memórias em <strong>4 Atos Arquetípicos</strong> fundamentais da existência humana. Esta divisão em capítulos permite transformar a cronologia pura em capítulos de formação e sabedoria literária.
          </p>
          <div className="intro-subgrid">
            <div className="intro-subcard">
              <strong style={{ display: 'block', marginBottom: '0.25rem' }}>1. Raízes</strong>
              Infância, família, ancestralidade e o chão formativo onde você foi plantado(a).
            </div>
            <div className="intro-subcard">
              <strong style={{ display: 'block', marginBottom: '0.25rem' }}>2. Descobertas</strong>
              Juventude, primeiras escolhas autônomas, expansão do mundo, sonhos e testes.
            </div>
            <div className="intro-subcard">
              <strong style={{ display: 'block', marginBottom: '0.25rem' }}>3. Transições</strong>
              Crises, rupturas, mudanças drásticas de rota, perdas e reinvenções.
            </div>
            <div className="intro-subcard">
              <strong style={{ display: 'block', marginBottom: '0.25rem' }}>4. O Presente</strong>
              Sua maturidade atual, o olhar integrador sobre o passado e seu ponto de partida para o futuro.
            </div>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="tabs-container">
          {CHAPTERS.map(chapter => (
            <button
              key={chapter.id}
              className={`tab-btn ${activeTab === chapter.id ? 'active' : ''}`}
              onClick={() => setActiveTab(chapter.id)}
            >
              {chapter.label}
              {savedChapters[chapter.id] && <CheckCircle size={14} className="ml-1 inline-block text-success" />}
            </button>
          ))}
        </div>

        {/* Conteúdo do Capítulo */}
        <div className="chapter-card animate-fade-in">
          <div className="chapter-header">
            <BookOpen size={20} className="text-primary" />
            <h2>{activeChapterLabel}</h2>
            {isCurrentChapterSaved && (
              <span className="saved-badge flex items-center gap-1"><CheckCircle size={14}/> Salvo</span>
            )}
          </div>

          <div className="fields-list">
            {FIELDS.map(field => (
              <div key={field.key} className="field-group">
                <label className="field-label">{field.label}</label>
                <textarea
                  className="chapter-textarea"
                  placeholder={field.placeholder + " (salva automaticamente)"}
                  value={formData[activeTab][field.key]}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  onBlur={handleSaveChapter}
                />
              </div>
            ))}
          </div>

          <div className="chapter-footer">
            <button 
              className={`btn flex items-center gap-2 ${isCurrentChapterSaved ? 'btn-secondary' : 'btn-primary'}`}
              onClick={handleSaveChapter}
              disabled={loading || isCurrentChapterSaved}
            >
              {isCurrentChapterSaved ? <CheckCircle size={18} /> : <Save size={18} />}
              {loading ? 'Salvando...' : isCurrentChapterSaved ? 'Capítulo Salvo' : 'Salvar Capítulo'}
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="step-footer mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2" style={{color: allChaptersSaved ? 'var(--success-color)' : 'var(--text-muted)'}}>
            <CheckCircle size={20} />
            <span className="font-medium">
              {allChaptersSaved ? 'Passo concluído' : 'Preencha todos os 4 capítulos'}
            </span>
          </div>
          <div className="flex gap-4 items-center">
            {nextChapter && (
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setActiveTab(nextChapter.id);
                }}
              >
                Ir para {nextChapter.label} →
              </button>
            )}
            <button 
              className="btn btn-primary" 
              style={{ opacity: allChaptersSaved ? 1 : 0.5 }}
              onClick={() => {
                if (!allChaptersSaved) {
                  alert("Você precisa concluir e salvar os 4 grandes capítulos antes de prosseguir para o próximo passo.");
                } else {
                  navigate('/passo-5');
                }
              }}
            >
              Próximo Passo →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
