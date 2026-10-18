import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle, Globe, Lock, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import AudioRecorder from '../components/AudioRecorder';
import './Step8BancoHistorias.css';

const initialFormState = {
  title: '',
  chapter: '',
  content: '',
  emotion: '',
  lessons: '',
  context: ''
};

export default function Step8BancoHistorias() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [stories, setStories] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ ...initialFormState });
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [visibility, setVisibility] = useState('privado'); // 'privado' | 'publico' | 'anonimo'

  useEffect(() => {
    if (user) {
      fetchStories();
    }
  }, [user]);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('raw_stories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setStories(data);
    } catch (err) {
      console.error("Erro ao buscar histórias:", err);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAudioReady = ({ blob, url }) => {
    setAudioBlob(blob);
    setAudioUrl(url);
  };

  const handleSaveStory = async () => {
    if (!formData.title.trim() || !user) return;
    setLoading(true);

    try {
      let finalAudioUrl = audioUrl;
      if (audioBlob) {
        try {
          const fileName = `audio-step8-${user.id}-${Date.now()}.webm`;
          const { error: uploadError } = await supabase.storage
            .from('audio_stories')
            .upload(fileName, audioBlob);
          if (!uploadError) {
            const { data } = supabase.storage.from('audio_stories').getPublicUrl(fileName);
            finalAudioUrl = data?.publicUrl || audioUrl;
          }
        } catch (storageErr) {
          console.warn('Storage fallback:', storageErr);
        }
      }

      // 1. Salvar na tabela original raw_stories
      const { data, error } = await supabase
        .from('raw_stories')
        .insert([{ 
          user_id: user.id,
          ...formData
        }])
        .select();

      if (error) throw error;

      // 2. Integrar ao acervo geral user_stories
      try {
        await supabase.from('user_stories').insert([{
          id: `step8-${Date.now()}`,
          user_id: user.id,
          author_name: user.user_metadata?.full_name || 'Autor Coautoria',
          title: formData.title,
          content: `${formData.content}\n\n[Lições: ${formData.lessons || ''}]`,
          theme: formData.emotion ? formData.emotion.charAt(0).toUpperCase() + formData.emotion.slice(1) : 'Superação',
          format: finalAudioUrl ? 'audio' : 'digitado',
          audio_url: finalAudioUrl,
          visibility,
          status: visibility === 'privado' ? 'aprovado' : 'pendente_aprovacao',
          created_at: new Date().toISOString()
        }]);
      } catch (intErr) {
        console.warn('Erro ao sincronizar com user_stories:', intErr);
      }
      
      if (data) {
        setStories(prev => [data[0], ...prev]);
        setFormData({ ...initialFormState });
        setAudioUrl(null);
        setAudioBlob(null);
        setVisibility('privado');
        setIsFormOpen(false);
      }
    } catch (err) {
      alert("Erro ao salvar história. A tabela 'raw_stories' foi criada?");
      console.error(err);
    } finally {
      setLoading(false);
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
          <button className="back-btn" onClick={() => navigate('/passo-7')}>
            <ArrowLeft size={20} />
            <span>Voltar ao Passo 7</span>
          </button>
        </div>
      </header>

      <main className="step-content-wrapper">
        <span className="step-badge">PASSO 8 DE 9</span>
        <h1 className="page-title" style={{textAlign: 'left', marginTop: '1rem'}}>Banco de Histórias Brutas</h1>
        <p className="page-subtitle" style={{textAlign: 'left', marginBottom: '2rem'}}>
          Garimpe a sua matéria-prima. Extraia de 2 a 6 micro-histórias da sua biografia que<br/>
          tenham carga emocional e ligação com o seu tema central.
        </p>

        {/* Botão de Adicionar */}
        {!isFormOpen && stories.length < 6 && (
          <button 
            className="new-story-trigger mb-8" 
            onClick={() => setIsFormOpen(true)}
          >
            <Plus size={20} /> Nova Micro-História ({stories.length}/6)
          </button>
        )}

        {/* Formulário de História */}
        {isFormOpen && (
          <div className="story-form-card animate-fade-in mb-8">
            <div className="form-grid-header mb-4">
              <div className="input-group">
                <label>Título</label>
                <input 
                  type="text" 
                  placeholder="Nome da história" 
                  value={formData.title}
                  onChange={e => handleFieldChange('title', e.target.value)}
                  className="story-input"
                />
              </div>
              <div className="input-group">
                <label>Capítulo da Vida</label>
                <input 
                  type="text" 
                  placeholder="Ex: Raízes, Descobertas..." 
                  value={formData.chapter}
                  onChange={e => handleFieldChange('chapter', e.target.value)}
                  className="story-input"
                />
              </div>
            </div>

            <div className="input-group mb-4">
              <label>O que aconteceu?</label>
              <textarea 
                placeholder="Descreva o fato com detalhes..." 
                value={formData.content}
                onChange={e => handleFieldChange('content', e.target.value)}
                className="story-textarea"
              />
            </div>

            <div className="input-group mb-4">
              <label>Emoção principal</label>
              <input 
                type="text" 
                placeholder="Ex: Medo, alegria, vergonha..." 
                value={formData.emotion}
                onChange={e => handleFieldChange('emotion', e.target.value)}
                className="story-input"
              />
            </div>

            <div className="input-group mb-4">
              <label>Lições aprendidas</label>
              <textarea 
                placeholder="O que essa experiência ensinou?" 
                value={formData.lessons}
                onChange={e => handleFieldChange('lessons', e.target.value)}
                className="story-textarea"
              />
            </div>

            <div className="input-group mb-6">
              <label>Contexto para contá-la</label>
              <textarea 
                placeholder="Quando/como usar essa história na sua mensagem..." 
                value={formData.context}
                onChange={e => handleFieldChange('context', e.target.value)}
                className="story-textarea"
              />
            </div>

            {/* Opção Adicional: Gravar Áudio da História */}
            <div className="input-group mb-6">
              <label>Gravação de Voz (Opcional)</label>
              <AudioRecorder onAudioReady={handleAudioReady} onClear={() => setAudioUrl(null)} />
            </div>

            {/* Opção Adicional: Compartilhamento com a Roda */}
            <div className="input-group mb-6 p-4 rounded-xl border bg-gray-50">
              <label className="font-semibold text-primary block mb-2">Compartilhar com a Roda de Histórias?</label>
              <div className="flex flex-col gap-2 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="step8_visibility" 
                    value="privado" 
                    checked={visibility === 'privado'}
                    onChange={() => setVisibility('privado')} 
                  />
                  <span><strong>Privado:</strong> Apenas no meu acervo pessoal</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="step8_visibility" 
                    value="publico" 
                    checked={visibility === 'publico'}
                    onChange={() => setVisibility('publico')} 
                  />
                  <span><strong>Público:</strong> Com meu nome na Roda (após validação de moderação)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="step8_visibility" 
                    value="anonimo" 
                    checked={visibility === 'anonimo'}
                    onChange={() => setVisibility('anonimo')} 
                  />
                  <span><strong>Anônimo:</strong> Compartilhar sem identificar meu perfil</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <button className="btn-text font-medium" onClick={() => setIsFormOpen(false)} disabled={loading}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleSaveStory} disabled={loading || !formData.title}>
                {loading ? 'Salvando...' : 'Salvar História'}
              </button>
            </div>
          </div>
        )}

        {/* Lista de Histórias */}
        <div className="stories-list">
          {stories.map((story) => (
            <div key={story.id} className="story-list-item animate-fade-in">
              <div className="story-info">
                <h4 className="story-title">{story.title}</h4>
                <p className="story-meta">{story.chapter} · {story.emotion}</p>
                <p className="story-preview">{story.content ? story.content.substring(0, 100) + '...' : ''}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="step-footer mt-12 pt-4 border-t flex justify-between items-center">
          <div className="flex items-center gap-2" style={{color: stories.length >= 2 ? 'var(--success-color)' : 'var(--text-muted)'}}>
            <CheckCircle size={20} />
            <span className="font-medium">
              {stories.length >= 2 ? 'Banco pronto' : `Faltam ${Math.max(0, 2 - stories.length)} histórias`}
            </span>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/passo-9')} disabled={stories.length < 2}>
            Próximo Passo →
          </button>
        </div>

      </main>
    </div>
  );
}
