import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Mic, 
  Camera, 
  FileText, 
  Lock, 
  Globe, 
  Tag, 
  Sparkles,
  BookOpen,
  Edit3,
  Check
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import AudioRecorder from '../components/AudioRecorder';
import './MinhasHistorias.css';

const THEMES = [
  'Alegre',
  'Superação',
  'Tristeza',
  'Amor & Família',
  'Mudança de Vida',
  'Lição de Vida',
  'Sonhos & Desafios'
];

export default function MinhasHistorias() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('todos'); // 'todos' | 'audio' | 'escrito' | 'digitado'
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeChallengePrompt, setActiveChallengePrompt] = useState('');
  const [editingStory, setEditingStory] = useState(null);

  // Form State
  const [formatType, setFormatType] = useState('digitado'); // 'digitado' | 'audio' | 'escrito'
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [theme, setTheme] = useState('Superação');
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [visibility, setVisibility] = useState('privado'); // 'privado' | 'publico' | 'anonimo'

  // Verifica se veio de um Desafio Criativo na Home
  useEffect(() => {
    const desafioTitulo = searchParams.get('desafioTitulo');
    const desafioPrompt = searchParams.get('desafioPrompt');
    const desafioTema = searchParams.get('desafioTema');
    if (desafioTitulo || desafioPrompt) {
      setEditingStory(null);
      setTitle(desafioTitulo ? `Desafio: ${desafioTitulo}` : '');
      setContent('');
      if (desafioTema && THEMES.includes(desafioTema)) {
        setTheme(desafioTema);
      }
      setActiveChallengePrompt(desafioPrompt || '');
      setFormatType('digitado');
      setVisibility('privado');
      setIsModalOpen(true);
      // Limpa a query string da URL sem disparar re-navegação que feche o modal
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      loadAllStories();
    } else {
      const guestLocal = JSON.parse(localStorage.getItem('coautoria_stories_guest') || '[]');
      setStories(guestLocal);
      setLoading(false);
    }
  }, [user]);

  const getStorageKey = () => `coautoria_stories_${user?.id || 'guest'}`;

  const loadAllStories = async () => {
    setLoading(true);
    try {
      let all = [];
      const { data: userStories, error: uError } = await supabase
        .from('user_stories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!uError && userStories) {
        all = [...userStories];
      }

      // 2. Carregar do Passo 8 (raw_stories)
      const { data: rawStories } = await supabase
        .from('raw_stories')
        .select('*')
        .eq('user_id', user.id);

      if (rawStories && rawStories.length > 0) {
        const mappedRaw = rawStories.map(rs => ({
          id: `raw-${rs.id}`,
          raw_db_id: rs.id,
          title: rs.title,
          content: rs.content || rs.lessons || '',
          theme: rs.emotion ? rs.emotion.charAt(0).toUpperCase() + rs.emotion.slice(1) : 'Superação',
          format: 'digitado',
          origin: 'Passo 8 (VOAR)',
          visibility: 'privado',
          status: 'aprovado',
          created_at: rs.created_at || new Date().toISOString()
        }));
        all = [...all, ...mappedRaw.filter(r => !all.some(a => a.id === r.id))];
      }

      // 3. Carregar notas do Passo 2 (notes)
      const { data: notesData } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id);

      if (notesData && notesData.length > 0) {
        const mappedNotes = notesData.map(n => ({
          id: `note-${n.id}`,
          note_db_id: n.id,
          title: `Memória (${n.type || 'Bloco Mágico'})`,
          content: n.content,
          theme: 'Lição de Vida',
          format: 'digitado',
          origin: 'Passo 2 (Bloco Mágico)',
          visibility: 'privado',
          status: 'aprovado',
          created_at: n.created_at || new Date().toISOString()
        }));
        all = [...all, ...mappedNotes.filter(n => !all.some(a => a.id === n.id))];
      }

      // 4. Carregar cartas do Passo 5 (past_letters)
      const { data: lettersData } = await supabase
        .from('past_letters')
        .select('*')
        .eq('user_id', user.id);

      if (lettersData && lettersData.length > 0) {
        const mappedLetters = lettersData.map(l => ({
          id: `letter-${l.id}`,
          title: 'Carta ao Meu Eu do Passado',
          content: 'Manuscrito original da Carta ao Passado.',
          image_url: l.image_url,
          theme: 'Superação',
          format: 'escrito',
          origin: 'Passo 5 (Carta ao Passado)',
          visibility: 'privado',
          status: 'aprovado',
          created_at: l.created_at || new Date().toISOString()
        }));
        all = [...all, ...mappedLetters.filter(l => !all.some(a => a.id === l.id))];
      }

      // Mesclar com alterações salvas localmente
      const localSaved = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');
      if (localSaved.length > 0) {
        const localMap = new Map(localSaved.map(item => [item.id, item]));
        const merged = all.map(item => localMap.get(item.id) || item);
        const newLocalOnly = localSaved.filter(l => !all.some(a => a.id === l.id));
        all = [...newLocalOnly, ...merged];
      }

      setStories(all);
    } catch (err) {
      console.error('Erro ao carregar histórias:', err);
    } finally {
      setLoading(false);
    }
  };

  const persistLocalStoryList = (updatedList) => {
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Erro ao salvar cache local:', e);
    }
  };

  const handleOpenNewStoryModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (story) => {
    setEditingStory(story);
    setTitle(story.title || '');
    setContent(story.content || '');
    setTheme(story.theme && THEMES.includes(story.theme) ? story.theme : 'Superação');
    setFormatType(story.format || 'digitado');
    setAudioUrl(story.audio_url || null);
    setAudioBlob(null);
    setImageUrl(story.image_url || null);
    setImageFile(null);
    setVisibility(story.visibility || 'privado');
    setActiveChallengePrompt('');
    setIsModalOpen(true);
  };

  const handleSendToPublicArchive = async (story) => {
    const isCurrentlyPublic = story.visibility !== 'privado';
    const nextVisibility = isCurrentlyPublic ? 'privado' : 'publico';
    const nextStatus = 'aprovado';

    const updatedStory = {
      ...story,
      visibility: nextVisibility,
      status: nextStatus,
      author_name: user?.user_metadata?.full_name || story.author_name || 'Autor Coautoria'
    };

    const updatedList = stories.map(s => (s.id === story.id ? updatedStory : s));
    setStories(updatedList);
    persistLocalStoryList(updatedList);

    if (user) {
      try {
        await supabase.from('user_stories').upsert([{
          id: String(story.id),
          user_id: user.id,
          author_name: updatedStory.author_name,
          title: updatedStory.title,
          content: updatedStory.content || '',
          theme: updatedStory.theme || 'Superação',
          format: updatedStory.format || 'digitado',
          audio_url: updatedStory.audio_url || null,
          image_url: updatedStory.image_url || null,
          visibility: nextVisibility,
          status: nextStatus,
          created_at: story.created_at || new Date().toISOString()
        }], { onConflict: 'id' });
      } catch (err) {
        console.warn('Fallback local ao atualizar visibilidade:', err);
      }
    }
  };

  const handleAudioReady = ({ blob, url }) => {
    setAudioBlob(blob);
    setAudioUrl(url);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveStory = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);

    try {
      let finalAudioUrl = audioUrl;
      let finalImageUrl = imageUrl;

      if (user && audioBlob) {
        try {
          const fileName = `audio-${user.id}-${Date.now()}.webm`;
          const { error: uploadError } = await supabase.storage
            .from('audio_stories')
            .upload(fileName, audioBlob);
          if (!uploadError) {
            const { data } = supabase.storage.from('audio_stories').getPublicUrl(fileName);
            finalAudioUrl = data?.publicUrl || audioUrl;
          }
        } catch (storageErr) {
          console.warn('Storage audio fallback:', storageErr);
        }
      }

      if (user && imageFile) {
        try {
          const fileName = `written-${user.id}-${Date.now()}-${imageFile.name}`;
          const { error: uploadError } = await supabase.storage
            .from('letters')
            .upload(`written/${fileName}`, imageFile);
          if (!uploadError) {
            const { data } = supabase.storage.from('letters').getPublicUrl(`written/${fileName}`);
            finalImageUrl = data?.publicUrl || imageUrl;
          }
        } catch (storageErr) {
          console.warn('Storage image fallback:', storageErr);
        }
      }

      const storyId = editingStory ? String(editingStory.id) : `story-${Date.now()}`;
      const storyRecord = {
        ...(editingStory || {}),
        id: storyId,
        user_id: user?.id || 'guest',
        author_name: user?.user_metadata?.full_name || editingStory?.author_name || 'Autor Coautoria',
        title: title.trim(),
        content,
        theme,
        format: formatType,
        audio_url: finalAudioUrl,
        image_url: finalImageUrl,
        visibility,
        status: 'aprovado',
        likes_count: editingStory?.likes_count || 0,
        comments_count: editingStory?.comments_count || 0,
        created_at: editingStory?.created_at || new Date().toISOString()
      };

      if (user) {
        try {
          await supabase
            .from('user_stories')
            .upsert([{
              id: storyRecord.id,
              user_id: user.id,
              author_name: storyRecord.author_name,
              title: storyRecord.title,
              content: storyRecord.content,
              theme: storyRecord.theme,
              format: storyRecord.format,
              audio_url: storyRecord.audio_url,
              image_url: storyRecord.image_url,
              visibility: storyRecord.visibility,
              status: storyRecord.status,
              created_at: storyRecord.created_at
            }], { onConflict: 'id' });

          // Se for uma história originada no Passo 8 ou Passo 2, atualiza a tabela de origem também
          if (editingStory?.raw_db_id) {
            await supabase
              .from('raw_stories')
              .update({ title: storyRecord.title, content: storyRecord.content })
              .eq('id', editingStory.raw_db_id);
          } else if (editingStory?.note_db_id) {
            await supabase
              .from('notes')
              .update({ content: storyRecord.content })
              .eq('id', editingStory.note_db_id);
          }
        } catch (dbErr) {
          console.warn('Salvo localmente:', dbErr);
        }
      }

      const nextStories = editingStory
        ? stories.map(s => (s.id === editingStory.id ? storyRecord : s))
        : [storyRecord, ...stories];

      setStories(nextStories);
      persistLocalStoryList(nextStories);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Erro ao salvar história:', err);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setEditingStory(null);
    setTitle('');
    setContent('');
    setFormatType('digitado');
    setTheme('Superação');
    setAudioUrl(null);
    setAudioBlob(null);
    setImageUrl(null);
    setImageFile(null);
    setVisibility('privado');
    setActiveChallengePrompt('');
  };

  const filteredStories = stories.filter(story => {
    if (activeTab === 'todos') return true;
    return story.format === activeTab;
  });

  return (
    <div className="historias-page animate-fade-in">
      {/* Fundo de folha pautada de caderno mais presente nesta página */}
      <div className="historias-notebook-backdrop" aria-hidden="true" />
      <header className="historias-header">
        <div className="header-top-row">
          <div>
            <span className="page-tag">MEU ACERVO</span>
            <h1 className="page-heading">Minhas Histórias</h1>
            <p className="page-sub">
              Banco e acervo pessoal. Suas memórias, áudios e manuscritos em um só lugar.
            </p>
          </div>

          <button 
            type="button"
            className="btn-add-story-fab"
            onClick={handleOpenNewStoryModal}
            title="Adicionar nova história"
          >
            <Plus size={22} />
            <span className="add-text">Nova História</span>
          </button>
        </div>

        {/* Abas de Formato */}
        <div className="format-tabs-bar">
          <button 
            className={`format-tab-btn ${activeTab === 'todos' ? 'active' : ''}`}
            onClick={() => setActiveTab('todos')}
          >
            Todos ({stories.length})
          </button>
          <button 
            className={`format-tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
            onClick={() => setActiveTab('audio')}
          >
            <Mic size={14} /> Áudios ({stories.filter(s => s.format === 'audio').length})
          </button>
          <button 
            className={`format-tab-btn ${activeTab === 'escrito' ? 'active' : ''}`}
            onClick={() => setActiveTab('escrito')}
          >
            <Camera size={14} /> Escrito / Fotos ({stories.filter(s => s.format === 'escrito').length})
          </button>
          <button 
            className={`format-tab-btn ${activeTab === 'digitado' ? 'active' : ''}`}
            onClick={() => setActiveTab('digitado')}
          >
            <FileText size={14} /> Digitado ({stories.filter(s => s.format === 'digitado').length})
          </button>
        </div>
      </header>

      {/* Conteúdo do Acervo */}
      <main className="historias-grid">
        {loading ? (
          <div className="loading-state">Carregando seu acervo...</div>
        ) : filteredStories.length === 0 ? (
          <div className="empty-stories-card">
            <BookOpen size={48} className="empty-icon text-primary" />
            <h3 className="empty-title">Nenhuma história encontrada nesta categoria</h3>
            <p className="empty-desc">
              Você pode adicionar suas próprias histórias gravando um áudio, enviando foto de escrita à mão ou digitando.
            </p>
            <button type="button" className="btn btn-primary mt-4" onClick={handleOpenNewStoryModal}>
              <Plus size={18} /> Adicionar Minha Primeira História
            </button>
          </div>
        ) : (
          filteredStories.map((story) => {
            const isPublic = story.visibility && story.visibility !== 'privado';
            return (
              <div key={story.id} className="story-card-item">
                <div className="story-card-header">
                  <span className="story-theme-badge">
                    <Tag size={12} /> {story.theme || 'Vida'}
                  </span>
                  <div className="story-vis-badge">
                    {!isPublic ? (
                      <span className="vis-privado flex items-center gap-1" title="Apenas você pode ver">
                        <Lock size={12} /> Privado
                      </span>
                    ) : (
                      <span className="vis-publico flex items-center gap-1" title="Visível no Acervo Público (Roda de Histórias)">
                        <Globe size={12} /> {story.visibility === 'anonimo' ? 'Público (Anônimo)' : 'No Acervo Público'}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="story-card-title">{story.title}</h3>
                {story.origin && (
                  <span className="story-origin-tag">Origem: {story.origin}</span>
                )}

                {story.audio_url && (
                  <div className="story-audio-player">
                    <audio controls src={story.audio_url} className="w-full" />
                  </div>
                )}

                {story.image_url && (
                  <div className="story-image-preview-container">
                    <img src={story.image_url} alt={story.title} className="story-preview-img" />
                  </div>
                )}

                {story.content && (
                  <div className="story-notebook-sheet">
                    <p className="story-card-content">{story.content}</p>
                  </div>
                )}

                <div className="story-card-footer">
                  <div className="story-meta-info">
                    <span className="story-format-label">
                      Formato: <strong>{story.format}</strong>
                    </span>
                    <span className="story-date">
                      {new Date(story.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {/* Botões de Editar e Mandar para o Acervo Público */}
                  <div className="story-card-actions">
                    <button
                      type="button"
                      className="btn-story-action btn-edit-story"
                      onClick={() => handleOpenEditModal(story)}
                    >
                      <Edit3 size={14} />
                      <span>Editar</span>
                    </button>

                    <button
                      type="button"
                      className={`btn-story-action ${isPublic ? 'btn-public-active' : 'btn-send-public'}`}
                      onClick={() => handleSendToPublicArchive(story)}
                      title={isPublic ? 'Clique para tornar privado novamente' : 'Publicar na Roda de Histórias'}
                    >
                      {isPublic ? (
                        <>
                          <Check size={14} />
                          <span>No Acervo Público</span>
                        </>
                      ) : (
                        <>
                          <Globe size={14} />
                          <span>Mandar para o Acervo Público</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Modal renderizado via Portal direto no body para nunca ficar preso ou fora de tela */}
      {isModalOpen && createPortal(
        <div
          className="historias-modal-backdrop"
          onClick={() => {
            setIsModalOpen(false);
            resetForm();
          }}
        >
          <div className="historias-modal-card" onClick={e => e.stopPropagation()}>
            <div className="sheet-header">
              <h2 className="sheet-title">
                {editingStory ? 'Editar História' : 'Escrever no Meu Caderno'}
              </h2>
              <button
                type="button"
                className="sheet-close-btn"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStory} className="sheet-form">
              {activeChallengePrompt && (
                <div className="challenge-prompt-banner">
                  <span className="challenge-banner-label">
                    <Sparkles size={13} /> Desafio Criativo
                  </span>
                  <p className="challenge-banner-text">“{activeChallengePrompt}”</p>
                </div>
              )}

              {/* Seleção do Formato */}
              <div>
                <label className="sheet-label">Formato da História</label>
                <div className="format-selector-group">
                  <button
                    type="button"
                    className={`format-select-btn ${formatType === 'digitado' ? 'active' : ''}`}
                    onClick={() => setFormatType('digitado')}
                  >
                    <FileText size={18} />
                    <span>Digitar</span>
                  </button>
                  <button
                    type="button"
                    className={`format-select-btn ${formatType === 'audio' ? 'active' : ''}`}
                    onClick={() => setFormatType('audio')}
                  >
                    <Mic size={18} />
                    <span>Gravar Áudio</span>
                  </button>
                  <button
                    type="button"
                    className={`format-select-btn ${formatType === 'escrito' ? 'active' : ''}`}
                    onClick={() => setFormatType('escrito')}
                  >
                    <Camera size={18} />
                    <span>Foto Manuscrita</span>
                  </button>
                </div>
              </div>

              {/* Título */}
              <div className="sheet-input-group">
                <label className="sheet-label">Título da História</label>
                <input 
                  type="text" 
                  className="sheet-input notebook-title-input"
                  placeholder="Ex: O dia em que superei o medo..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Tema Geral */}
              <div className="sheet-input-group">
                <label className="sheet-label">Classificação por Tema</label>
                <select 
                  className="sheet-select"
                  value={theme}
                  onChange={e => setTheme(e.target.value)}
                >
                  {THEMES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Campos Condicionais conforme Formato */}
              {formatType === 'audio' && (
                <div className="sheet-input-group">
                  <label className="sheet-label">Gravação de Voz</label>
                  <AudioRecorder onAudioReady={handleAudioReady} onClear={() => setAudioUrl(null)} />
                  <div className="notebook-paper-editor-wrap mt-2">
                    <textarea 
                      className="sheet-textarea notebook-lined-textarea"
                      rows="5"
                      placeholder="Descrição ou transcrição opcional do áudio..."
                      value={content}
                      onChange={e => setContent(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {formatType === 'escrito' && (
                <div className="sheet-input-group">
                  <label className="sheet-label">Foto da Escrita à Mão</label>
                  <div className="file-upload-box">
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment"
                      onChange={handleImageSelect}
                      id="handwritten-file-input"
                    />
                    <label htmlFor="handwritten-file-input" className="file-upload-label">
                      <Camera size={24} />
                      <span>{imageFile ? imageFile.name : 'Tirar foto ou escolher do dispositivo'}</span>
                    </label>
                  </div>
                  {imageUrl && (
                    <div className="image-preview-box mt-2">
                      <img src={imageUrl} alt="Preview" className="img-preview" />
                    </div>
                  )}
                  <div className="notebook-paper-editor-wrap mt-2">
                    <textarea 
                      className="sheet-textarea notebook-lined-textarea"
                      rows="5"
                      placeholder="Comentários ou transcrição da sua escrita à mão..."
                      value={content}
                      onChange={e => setContent(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {formatType === 'digitado' && (
                <div className="sheet-input-group">
                  <label className="sheet-label">Folha do Seu Caderno · Conteúdo da História</label>
                  <div className="notebook-paper-editor-wrap">
                    <div className="notebook-holes-strip" aria-hidden="true">
                      <span /><span /><span /><span /><span /><span />
                    </div>
                    <textarea 
                      className="sheet-textarea notebook-lined-textarea"
                      rows="8"
                      placeholder="Escreva sua história nas linhas do caderno com todos os detalhes..."
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Opções de Compartilhamento */}
              <div className="sheet-input-group share-options-section">
                <label className="sheet-label">Visibilidade & Compartilhamento</label>
                <div className="visibility-options">
                  <label className="vis-radio-option">
                    <input 
                      type="radio" 
                      name="visibility" 
                      value="privado"
                      checked={visibility === 'privado'}
                      onChange={() => setVisibility('privado')}
                    />
                    <div>
                      <strong>Privado</strong>
                      <p>Fica apenas no seu acervo pessoal e confidencial.</p>
                    </div>
                  </label>
                  <label className="vis-radio-option">
                    <input 
                      type="radio" 
                      name="visibility" 
                      value="publico"
                      checked={visibility === 'publico'}
                      onChange={() => setVisibility('publico')}
                    />
                    <div>
                      <strong>Público na Roda de Histórias</strong>
                      <p>Seu nome aparecerá como autor no acervo público da comunidade.</p>
                    </div>
                  </label>
                  <label className="vis-radio-option">
                    <input 
                      type="radio" 
                      name="visibility" 
                      value="anonimo"
                      checked={visibility === 'anonimo'}
                      onChange={() => setVisibility('anonimo')}
                    />
                    <div>
                      <strong>Anonimamente</strong>
                      <p>Sua história será compartilhada sem identificar seu nome ou perfil.</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="sheet-actions">
                <button 
                  type="button" 
                  className="btn-text font-medium"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={saving || !title.trim()}
                >
                  {saving ? 'Salvando...' : editingStory ? 'Salvar Alterações' : 'Salvar no Meu Acervo'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
