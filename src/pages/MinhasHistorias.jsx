import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Mic, 
  Camera, 
  FileText, 
  Share2, 
  Lock, 
  Globe, 
  Tag, 
  Calendar, 
  Play, 
  Pause, 
  Trash2, 
  ExternalLink,
  Sparkles,
  BookOpen
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
  const [activeTab, setActiveTab] = useState('todos'); // 'todos' | 'audio' | 'escrito' | 'digitado'
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

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

  // Playing audio state
  const [playingStoryId, setPlayingStoryId] = useState(null);

  useEffect(() => {
    if (user) {
      loadAllStories();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadAllStories = async () => {
    setLoading(true);
    try {
      // 1. Tentar carregar de user_stories (se existir)
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
          title: rs.title,
          content: rs.content || rs.lessons || '',
          theme: rs.emotion ? rs.emotion.charAt(0).toUpperCase() + rs.emotion.slice(1) : 'Superação',
          format: 'digitado',
          origin: 'Passo 8 (VOAR)',
          visibility: 'privado',
          status: 'aprovado',
          created_at: rs.created_at || new Date().toISOString()
        }));
        // Adicionar apenas os que não conflitam
        all = [...all, ...mappedRaw];
      }

      // 3. Carregar notas do Passo 2 (notes)
      const { data: notesData } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id);

      if (notesData && notesData.length > 0) {
        const mappedNotes = notesData.map(n => ({
          id: `note-${n.id}`,
          title: `Memória (${n.type || 'Bloco Mágico'})`,
          content: n.content,
          theme: 'Lição de Vida',
          format: 'digitado',
          origin: 'Passo 2 (Bloco Mágico)',
          visibility: 'privado',
          status: 'aprovado',
          created_at: n.created_at || new Date().toISOString()
        }));
        all = [...all, ...mappedNotes];
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
        all = [...all, ...mappedLetters];
      }

      // Se localStorage tiver histórias locais salvas também compor
      const localSaved = JSON.parse(localStorage.getItem(`coautoria_stories_${user.id}`) || '[]');
      if (localSaved.length > 0) {
        all = [...localSaved, ...all.filter(a => !localSaved.some(l => l.id === a.id))];
      }

      setStories(all);
    } catch (err) {
      console.error('Erro ao carregar histórias:', err);
    } finally {
      setLoading(false);
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
    if (!title.trim() || !user) return;
    setSaving(true);

    try {
      let finalAudioUrl = audioUrl;
      let finalImageUrl = imageUrl;

      // 1. Upload de áudio se houver blob
      if (audioBlob) {
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

      // 2. Upload de imagem se houver foto manuscrita
      if (imageFile) {
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

      const newStoryRecord = {
        id: `story-${Date.now()}`,
        user_id: user.id,
        author_name: user.user_metadata?.full_name || 'Autor Coautoria',
        title,
        content,
        theme,
        format: formatType,
        audio_url: finalAudioUrl,
        image_url: finalImageUrl,
        visibility, // 'privado' | 'publico' | 'anonimo'
        status: visibility === 'privado' ? 'aprovado' : 'pendente_aprovacao', // Moderação ADM
        likes_count: 0,
        comments_count: 0,
        created_at: new Date().toISOString()
      };

      // Tentar salvar no Supabase
      const { data, error } = await supabase
        .from('user_stories')
        .insert([newStoryRecord])
        .select();

      const savedStory = (data && data[0]) ? data[0] : newStoryRecord;

      // Persistir também localmente para segurança
      const localSaved = JSON.parse(localStorage.getItem(`coautoria_stories_${user.id}`) || '[]');
      localStorage.setItem(`coautoria_stories_${user.id}`, JSON.stringify([savedStory, ...localSaved]));

      setStories(prev => [savedStory, ...prev]);
      setIsModalOpen(false);
      resetForm();

      if (visibility !== 'privado') {
        alert('História salva com sucesso! Como você escolheu compartilhar, ela foi enviada para a validação da moderação antes de aparecer na Roda de Histórias.');
      }
    } catch (err) {
      console.error('Erro ao salvar história:', err);
      alert('Erro ao salvar. Sua história foi gravada no acervo local.');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setFormatType('digitado');
    setTheme('Superação');
    setAudioUrl(null);
    setAudioBlob(null);
    setImageUrl(null);
    setImageFile(null);
    setVisibility('privado');
  };

  const filteredStories = stories.filter(story => {
    if (activeTab === 'todos') return true;
    return story.format === activeTab;
  });

  return (
    <div className="historias-page animate-fade-in">
      <header className="historias-header">
        <div className="header-top-row">
          <div>
            <span className="page-tag">MEU ACERVO</span>
            <h1 className="page-heading">Minhas Histórias</h1>
            <p className="page-sub">
              Banco e acervo pessoal. Suas memórias, áudios e manuscritos em um só lugar.
            </p>
          </div>

          {/* Botão de Mais no Canto com visual flutuante elegante */}
          <button 
            className="btn-add-story-fab"
            onClick={() => setIsModalOpen(true)}
            title="Adicionar nova história"
          >
            <Plus size={22} />
            <span className="add-text">Nova História</span>
          </button>
        </div>

        {/* Abas de Formato: Todos, Áudio, Escrito, Digitado */}
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
            <button className="btn btn-primary mt-4" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> Adicionar Minha Primeira História
            </button>
          </div>
        ) : (
          filteredStories.map((story) => (
            <div key={story.id} className="story-card-item animate-fade-in">
              <div className="story-card-header">
                <span className="story-theme-badge">
                  <Tag size={12} /> {story.theme || 'Vida'}
                </span>
                <div className="story-vis-badge">
                  {story.visibility === 'privado' ? (
                    <span className="vis-privado flex items-center gap-1" title="Apenas você pode ver">
                      <Lock size={12} /> Privado
                    </span>
                  ) : story.status === 'pendente_aprovacao' ? (
                    <span className="vis-moderacao flex items-center gap-1" title="Em moderação antes de ir à Roda">
                      <Sparkles size={12} /> Moderação ADM
                    </span>
                  ) : (
                    <span className="vis-publico flex items-center gap-1" title="Público na Roda">
                      <Globe size={12} /> {story.visibility === 'anonimo' ? 'Anônimo' : 'Público'}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="story-card-title">{story.title}</h3>
              {story.origin && (
                <span className="story-origin-tag">Origem: {story.origin}</span>
              )}

              {/* Render por formato */}
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
                <p className="story-card-content">{story.content}</p>
              )}

              <div className="story-card-footer">
                <span className="story-format-label">
                  Formato: <strong>{story.format}</strong>
                </span>
                <span className="story-date">
                  {new Date(story.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Modal / Sheet Mobile-First para Adicionar História */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-sheet-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="sheet-header">
              <h2 className="sheet-title">Adicionar História</h2>
              <button className="sheet-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveStory} className="sheet-form">
              {/* Seleção do Formato */}
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

              {/* Título */}
              <div className="sheet-input-group">
                <label className="sheet-label">Título da História</label>
                <input 
                  type="text" 
                  className="sheet-input"
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
                  <textarea 
                    className="sheet-textarea mt-2"
                    rows="3"
                    placeholder="Descrição ou transcrição opcional do áudio..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                  />
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
                      <span>{imageFile ? imageFile.name : 'Tirar foto ou escolher do celular'}</span>
                    </label>
                  </div>
                  {imageUrl && (
                    <div className="image-preview-box mt-2">
                      <img src={imageUrl} alt="Preview" className="img-preview" />
                    </div>
                  )}
                  <textarea 
                    className="sheet-textarea mt-2"
                    rows="3"
                    placeholder="Comentários sobre a escrita à mão..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                  />
                </div>
              )}

              {formatType === 'digitado' && (
                <div className="sheet-input-group">
                  <label className="sheet-label">Conteúdo da História</label>
                  <textarea 
                    className="sheet-textarea"
                    rows="6"
                    placeholder="Escreva sua história aqui com todos os detalhes..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                  />
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
                      <p>Seu nome aparecerá como autor (passa por aprovação da moderação).</p>
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
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={saving || !title.trim()}
                >
                  {saving ? 'Salvando...' : 'Salvar no Meu Acervo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
