import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Plus, Sparkles, CheckCircle, Mic } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import AudioRecorder from '../components/AudioRecorder';
import './Step2BlocoMagico.css';

const NOTE_TYPES = ['Memória', 'Sonho', 'Insight', 'Conversa', 'Outro'];

export default function Step2BlocoMagico() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form state
  const [noteType, setNoteType] = useState('Memória');
  const [noteContent, setNoteContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  // Fetch notes on load
  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Erro ao buscar notas:", error);
        return;
      }
      
      if (data) {
        setNotes(data);
      }
    } catch (err) {
      console.error("Exceção ao buscar notas:", err);
    }
  };

  const handleAudioReady = ({ url }) => {
    setAudioUrl(url);
    if (!noteContent) {
      setNoteContent('Memória gravada via áudio no Bloco Mágico.');
    }
  };

  const handleSaveNote = async () => {
    if (!noteContent.trim() || !user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('notes')
      .insert([{ type: noteType, content: noteContent, user_id: user.id }])
      .select();

    setLoading(false);

    if (error) {
      alert("Erro ao salvar anotação. Você criou a tabela 'notes' no Supabase?");
      console.error(error);
    } else if (data) {
      setNotes([data[0], ...notes]); // Add to beginning
      setNoteContent('');
      setNoteType('Memória');
      setIsFormOpen(false);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header flex justify-between items-center w-full">
        <div className="flex gap-4">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            <span>Início</span>
          </button>
          <button className="back-btn" onClick={() => navigate('/passo-1')}>
            <ArrowLeft size={20} />
            <span>Voltar ao Passo 1</span>
          </button>
        </div>
      </header>

      <main className="step-content-wrapper">
        <span className="step-badge">PASSO 2 DE 9</span>
        <h1 className="page-title" style={{textAlign: 'left', marginTop: '1rem'}}>Bloco Mágico</h1>
        
        <div className="step-intro-box">
          <h3>Para que serve o Bloco Mágico?</h3>
          <p>
            Nossa mente não revive o passado em ordem cronológica. As lembranças mais preciosas — uma frase de infância, um sonho marcante, um cheiro ou um insight inesperado — costumam surgir nos momentos mais espontâneos.
          </p>
          <p>
            O <strong>Bloco Mágico</strong> é o seu caderno de bolso contínuo. Ele serve para você <strong>despejar fragmentos de memória no instante em que surgem</strong>, por áudio ou digitação, sem se preocupar com estética, lógica ou gramática. Tudo o que você guardar aqui alimentará os passos seguintes e o seu acervo pessoal de histórias.
          </p>
        </div>

        {/* Botão de Nova Anotação */}
        {!isFormOpen && (
          <button 
            className="new-note-trigger" 
            onClick={() => setIsFormOpen(true)}
          >
            <Plus size={20} /> Nova Anotação
          </button>
        )}

        {/* Formulário de Captura */}
        {isFormOpen && (
          <div className="capture-form-card animate-fade-in">
            <div className="capture-header">
              <span className="flex items-center gap-2 font-medium text-primary">
                <Sparkles size={18} /> Captura Rápida
              </span>
              <select 
                className="type-select"
                value={noteType}
                onChange={(e) => setNoteType(e.target.value)}
              >
                {NOTE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <textarea
              className="capture-textarea"
              placeholder="O que veio à sua mente? Anote sem filtros..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              autoFocus
            />

            {/* Gravar áudio opcional */}
            <div className="mb-4">
              <AudioRecorder onAudioReady={handleAudioReady} onClear={() => setAudioUrl(null)} />
            </div>

            <div className="capture-actions">
              <button 
                className="btn-text" 
                onClick={() => setIsFormOpen(false)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSaveNote}
                disabled={loading || !noteContent.trim()}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        )}

        {/* Lista de Notas ou Estado Vazio */}
        <div className="notes-list mt-8">
          {notes.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={48} className="empty-icon" />
              <p>Nenhuma anotação ainda.<br/>Comece a capturar suas memórias!</p>
            </div>
          ) : (
            notes.map(note => (
              <div key={note.id} className="note-card animate-fade-in">
                <div className="note-badge">{note.type}</div>
                <p className="note-content">{note.content}</p>
                <span className="note-date">
                  {new Date(note.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer Navigation */}
        <div className="step-footer mt-8 pt-4 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-medium" style={{color: notes.length >= 2 ? 'var(--success-color)' : 'var(--text-muted)'}}>
            <CheckCircle size={20} />
            <span>{notes.length >= 2 ? 'Passo concluído' : `Faltam ${Math.max(0, 2 - notes.length)} anotações (min. 2)`}</span>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/passo-3')} disabled={notes.length < 2}>
            Próximo Passo →
          </button>
        </div>

      </main>
    </div>
  );
}
