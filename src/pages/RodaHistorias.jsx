import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Filter, 
  Copy, 
  Check, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle,
  Clock,
  Sparkles,
  Send
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import './RodaHistorias.css';

const THEMES_FILTER = [
  'Todos',
  'Superação',
  'Alegre',
  'Tristeza',
  'Amor & Família',
  'Mudança de Vida',
  'Lição de Vida',
  'Sonhos & Desafios'
];

// Histórias públicas iniciais para a comunidade
const INITIAL_PUBLIC_STORIES = [
  {
    id: 'comm-1',
    author_name: 'Helena Ribeiro',
    author_avatar: 'H',
    title: 'A carta que guardei por quinze anos',
    content: 'Por mais de uma década achei que o silêncio era a melhor proteção. Quando escrevi para o meu passado pela primeira vez no método, entendi que a dor só queria ser ouvida com carinho e sem julgamentos. Hoje respiro mais leve.',
    theme: 'Superação',
    likes_count: 24,
    comments: [
      { id: 'c1', author: 'Mariana S.', text: 'Que texto emocionante! Me identifiquei profundamente.' }
    ],
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'aprovado',
    visibility: 'publico'
  },
  {
    id: 'comm-2',
    author_name: 'Autor Anônimo',
    author_avatar: '?',
    title: 'O recomeço aos 48 anos',
    content: 'Perdi a empresa, perdi a certeza, mas ao mapear meus capítulos da vida vi que minhas raízes eram mais fortes do que qualquer tempestade. Estou escrevendo o capítulo mais bonito da minha vida agora.',
    theme: 'Mudança de Vida',
    likes_count: 38,
    comments: [
      { id: 'c2', author: 'Carlos E.', text: 'Parabéns pela coragem! A vida sempre nos dá uma segunda chance.' }
    ],
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    status: 'aprovado',
    visibility: 'anonimo'
  },
  {
    id: 'comm-3',
    author_name: 'Beatriz Vasconcelos',
    author_avatar: 'B',
    title: 'O café da manhã com meu avô',
    content: 'Uma memória simples gravada no bloco mágico: o cheiro de café passado na caneca de esmalte e as piadas que ele contava antes da roça. Histórias simples são as que mais aquecem a alma.',
    theme: 'Alegre',
    likes_count: 17,
    comments: [],
    created_at: new Date(Date.now() - 3600000 * 42).toISOString(),
    status: 'aprovado',
    visibility: 'publico'
  }
];

export default function RodaHistorias() {
  const { user } = useAuth();
  const [selectedTheme, setSelectedTheme] = useState('Todos');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLikes, setUserLikes] = useState({});
  const [openCommentsId, setOpenCommentsId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Painel de Moderação ADM
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [pendingStories, setPendingStories] = useState([]);

  useEffect(() => {
    loadPublicFeed();
    loadPendingStories();
  }, [user]);

  const loadPublicFeed = async () => {
    try {
      let remoteStories = [];
      const { data, error } = await supabase
        .from('user_stories')
        .select('*')
        .neq('visibility', 'privado')
        .eq('status', 'aprovado')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        remoteStories = data;
      }

      // Buscar também histórias públicas salvas localmente pelo usuário
      let localPublicStories = [];
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('coautoria_stories_')) {
            const arr = JSON.parse(localStorage.getItem(k) || '[]');
            const pub = arr.filter(s => s.visibility && s.visibility !== 'privado');
            localPublicStories = [...localPublicStories, ...pub];
          }
        }
      } catch (e) {
        // ignore
      }

      // Concatenar com dados mock de comunidade
      const combined = [...localPublicStories, ...remoteStories, ...INITIAL_PUBLIC_STORIES];
      // Remover duplicatas por id
      const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
      setStories(unique);
    } catch (err) {
      console.error('Erro ao carregar Roda de Histórias:', err);
      setStories(INITIAL_PUBLIC_STORIES);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingStories = async () => {
    try {
      const { data } = await supabase
        .from('user_stories')
        .select('*')
        .neq('visibility', 'privado')
        .eq('status', 'pendente_aprovacao');

      if (data) {
        setPendingStories(data);
      }
    } catch (err) {
      console.warn('Erro ao carregar pendentes do ADM:', err);
    }
  };

  const handleLike = (storyId) => {
    setUserLikes(prev => {
      const isLiked = prev[storyId];
      const nextState = !isLiked;
      setStories(current =>
        current.map(s => {
          if (s.id === storyId) {
            return {
              ...s,
              likes_count: (s.likes_count || 0) + (nextState ? 1 : -1)
            };
          }
          return s;
        })
      );
      return { ...prev, [storyId]: nextState };
    });
  };

  const handleAddComment = (storyId) => {
    if (!newCommentText.trim()) return;
    const authorName = user?.user_metadata?.full_name || 'Companheiro(a) de Jornada';

    setStories(prev =>
      prev.map(s => {
        if (s.id === storyId) {
          const currentComments = s.comments || [];
          return {
            ...s,
            comments: [
              ...currentComments,
              {
                id: `c-${Date.now()}`,
                author: authorName,
                text: newCommentText.trim()
              }
            ]
          };
        }
        return s;
      })
    );
    setNewCommentText('');
  };

  const handleShare = async (story) => {
    const shareTitle = `Coautoria: "${story.title}"`;
    const shareUrl = window.location.origin + `/roda-de-historias?historia=${story.id}`;
    const shareText = `Leia esta história inspiradora no Coautoria: "${story.title}"`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (err) {
        // Fallback
      }
    }

    // Modal ou copiar link
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopiedId(story.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Funções de Moderação ADM
  const handleModerateStory = async (storyId, newStatus, assignedTheme) => {
    try {
      await supabase
        .from('user_stories')
        .update({ status: newStatus, theme: assignedTheme || 'Superação' })
        .eq('id', storyId);

      setPendingStories(prev => prev.filter(p => p.id !== storyId));
      loadPublicFeed();
      alert(`História ${newStatus === 'aprovado' ? 'aprovada com sucesso para a Roda!' : 'rejeitada.'}`);
    } catch (err) {
      console.error(err);
      setPendingStories(prev => prev.filter(p => p.id !== storyId));
    }
  };

  const filteredStories = stories.filter(story => {
    if (selectedTheme === 'Todos') return true;
    return story.theme === selectedTheme;
  });

  return (
    <div className="roda-page animate-fade-in">
      {/* Elemento gráfico minimalista de Fogueira sempre visível no fundo */}
      <div className="roda-campfire-backdrop" aria-hidden="true">
        <svg className="campfire-bg-svg" viewBox="0 0 1200 820" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Grandes anéis concêntricos de contação de histórias (visíveis nas laterais e ao redor dos cards) */}
          <circle cx="600" cy="430" r="490" stroke="var(--primary-color)" strokeWidth="1.2" strokeDasharray="6 10" opacity="0.38" />
          <circle cx="600" cy="430" r="390" stroke="var(--primary-color)" strokeWidth="1" opacity="0.32" />
          <circle cx="600" cy="430" r="290" stroke="var(--primary-color)" strokeWidth="1.2" strokeDasharray="4 8" opacity="0.4" />
          <circle cx="600" cy="430" r="195" stroke="var(--primary-color)" strokeWidth="1" opacity="0.36" />

          {/* Linhas radiais sutis de calor da fogueira */}
          <line x1="600" y1="430" x2="120" y2="180" stroke="var(--primary-color)" strokeWidth="0.8" strokeDasharray="3 8" opacity="0.28" />
          <line x1="600" y1="430" x2="1080" y2="180" stroke="var(--primary-color)" strokeWidth="0.8" strokeDasharray="3 8" opacity="0.28" />
          <line x1="600" y1="430" x2="90" y2="580" stroke="var(--primary-color)" strokeWidth="0.8" strokeDasharray="3 8" opacity="0.28" />
          <line x1="600" y1="430" x2="1110" y2="580" stroke="var(--primary-color)" strokeWidth="0.8" strokeDasharray="3 8" opacity="0.28" />

          {/* Fagulhas / brasas subindo pelas laterais e centro */}
          <circle cx="565" cy="175" r="3.5" fill="var(--primary-color)" className="ember-spark spark-1" />
          <circle cx="638" cy="145" r="3" fill="var(--primary-color)" className="ember-spark spark-2" />
          <circle cx="600" cy="115" r="2.5" fill="var(--primary-color)" className="ember-spark spark-3" />
          <circle cx="205" cy="310" r="3.5" fill="var(--primary-color)" opacity="0.45" />
          <circle cx="995" cy="310" r="3.5" fill="var(--primary-color)" opacity="0.45" />
          <circle cx="155" cy="495" r="4" fill="var(--primary-color)" opacity="0.4" />
          <circle cx="1045" cy="495" r="4" fill="var(--primary-color)" opacity="0.4" />

          {/* Fogueira central grande em traço minimalista (estilo linhas de caderno) */}
          <g className="campfire-bg-centerpiece">
            {/* Chamas grandes */}
            <path
              className="campfire-flame-outer"
              d="M600 195 C655 275, 705 335, 672 412 C650 458, 550 458, 528 412 C495 335, 545 275, 600 195 Z"
              stroke="var(--primary-color)"
              strokeWidth="2.2"
              fill="rgba(184, 74, 32, 0.06)"
              opacity="0.65"
            />
            <path
              className="campfire-flame-inner"
              d="M600 255 C636 308, 664 352, 642 405 C626 436, 574 436, 558 405 C536 352, 564 308, 600 255 Z"
              stroke="var(--primary-color)"
              strokeWidth="1.7"
              fill="rgba(184, 74, 32, 0.08)"
              opacity="0.6"
            />
            <path
              d="M600 315 C620 345, 632 372, 620 402 C612 418, 588 418, 580 402 C568 372, 580 345, 600 315 Z"
              stroke="var(--primary-color)"
              strokeWidth="1.3"
              opacity="0.55"
            />

            {/* Toras de lenha cruzadas */}
            <line x1="485" y1="490" x2="715" y2="432" stroke="var(--primary-color)" strokeWidth="2.6" strokeLinecap="round" opacity="0.6" />
            <line x1="485" y1="432" x2="715" y2="490" stroke="var(--primary-color)" strokeWidth="2.6" strokeLinecap="round" opacity="0.6" />
            <line x1="450" y1="506" x2="750" y2="506" stroke="var(--primary-color)" strokeWidth="1.5" strokeDasharray="6 8" opacity="0.45" />
          </g>

          {/* Duas pequenas fogueiras / lanternas nas laterais para aparecerem sempre fora dos cards */}
          <g opacity="0.52">
            <path
              d="M145 355 C162 380, 175 398, 165 422 C158 436, 132 436, 125 422 C115 398, 128 380, 145 355 Z"
              stroke="var(--primary-color)"
              strokeWidth="1.5"
            />
            <line x1="115" y1="446" x2="175" y2="430" stroke="var(--primary-color)" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="115" y1="430" x2="175" y2="446" stroke="var(--primary-color)" strokeWidth="1.8" strokeLinecap="round" />
          </g>
          <g opacity="0.52">
            <path
              d="M1055 355 C1072 380, 1085 398, 1075 422 C1068 436, 1042 436, 1035 422 C1025 398, 1038 380, 1055 355 Z"
              stroke="var(--primary-color)"
              strokeWidth="1.5"
            />
            <line x1="1025" y1="446" x2="1085" y2="430" stroke="var(--primary-color)" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="1025" y1="430" x2="1085" y2="446" stroke="var(--primary-color)" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      <header className="roda-header">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="page-tag">COMUNIDADE COAUTORIA · EM VOLTA DA FOGUEIRA</span>
            <h1 className="page-heading">Roda de Histórias</h1>
            <p className="page-sub">
              Aqueça-se na roda e compartilhe suas histórias com o mundo. Conecte-se com relatos reais e inspiradores.
            </p>
          </div>

          {/* Botão de Moderação ADM */}
          <button 
            className="btn-adm-moderation"
            onClick={() => setShowAdminModal(true)}
            title="Acesso de Moderação e Validação de Conteúdo"
          >
            <ShieldAlert size={16} />
            <span>Moderação ADM {pendingStories.length > 0 && `(${pendingStories.length})`}</span>
          </button>
        </div>

        {/* Filtro por Tema */}
        <div className="themes-filter-bar">
          <span className="filter-label flex items-center gap-1">
            <Filter size={14} /> Filtrar:
          </span>
          <div className="filter-scroll">
            {THEMES_FILTER.map(theme => (
              <button
                key={theme}
                className={`theme-chip-btn ${selectedTheme === theme ? 'active' : ''}`}
                onClick={() => setSelectedTheme(theme)}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Feed da Roda */}
      <main className="roda-feed">
        {loading ? (
          <div className="loading-state">Conectando à Roda de Histórias...</div>
        ) : filteredStories.length === 0 ? (
          <div className="empty-state-box">
            <p>Nenhuma história encontrada com o tema "{selectedTheme}".</p>
          </div>
        ) : (
          filteredStories.map((story) => {
            const isLiked = !!userLikes[story.id];
            const isCommentsOpen = openCommentsId === story.id;
            const commentsCount = story.comments ? story.comments.length : 0;

            return (
              <article key={story.id} className="feed-story-card animate-fade-in">
                {/* Header do Autor */}
                <div className="story-author-bar">
                  <div className="author-info flex items-center gap-3">
                    <div className="author-avatar-circle">
                      {story.visibility === 'anonimo' ? '?' : (story.author_avatar || story.author_name?.charAt(0) || 'U')}
                    </div>
                    <div>
                      <h4 className="author-name">
                        {story.visibility === 'anonimo' ? 'Autor(a) Anônimo(a)' : story.author_name}
                      </h4>
                      <span className="story-post-time flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(story.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <span className="story-theme-tag">
                    {story.theme || 'Vida'}
                  </span>
                </div>

                {/* Título & Conteúdo */}
                <h3 className="story-headline">{story.title}</h3>
                
                {story.audio_url && (
                  <div className="feed-audio-player my-3">
                    <audio controls src={story.audio_url} className="w-full" />
                  </div>
                )}

                {story.image_url && (
                  <div className="feed-image-preview my-3">
                    <img src={story.image_url} alt={story.title} />
                  </div>
                )}

                <p className="story-body-text">{story.content}</p>

                {/* Ações: Curtir, Comentar, Compartilhar */}
                <div className="story-actions-bar">
                  <button 
                    className={`action-btn ${isLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(story.id)}
                  >
                    <Heart size={18} fill={isLiked ? '#e53935' : 'none'} color={isLiked ? '#e53935' : 'currentColor'} />
                    <span>{story.likes_count || 0}</span>
                  </button>

                  <button 
                    className="action-btn"
                    onClick={() => setOpenCommentsId(isCommentsOpen ? null : story.id)}
                  >
                    <MessageCircle size={18} />
                    <span>{commentsCount}</span>
                  </button>

                  <div className="share-btn-wrapper">
                    <button 
                      className="action-btn"
                      onClick={() => handleShare(story)}
                      title="Compartilhar no WhatsApp, Insta, Face ou Copiar Link"
                    >
                      {copiedId === story.id ? (
                        <>
                          <Check size={18} color="#00c851" />
                          <span className="text-success font-semibold">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Share2 size={18} />
                          <span>Compartilhar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Área de Comentários Aberta */}
                {isCommentsOpen && (
                  <div className="comments-section-container animate-fade-in">
                    <div className="comments-list">
                      {commentsCount === 0 ? (
                        <p className="no-comments-msg">Seja o primeiro a deixar uma mensagem de carinho.</p>
                      ) : (
                        story.comments.map(c => (
                          <div key={c.id} className="comment-item">
                            <strong className="comment-author">{c.author}</strong>
                            <p className="comment-text">{c.text}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="add-comment-input-row">
                      <input 
                        type="text" 
                        placeholder="Escreva um comentário carinhoso..."
                        value={newCommentText}
                        onChange={e => setNewCommentText(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleAddComment(story.id);
                        }}
                      />
                      <button 
                        type="button" 
                        className="send-comment-btn"
                        onClick={() => handleAddComment(story.id)}
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </main>

      {/* Modal de Moderação ADM */}
      {showAdminModal && (
        <div className="modal-backdrop" onClick={() => setShowAdminModal(false)}>
          <div className="modal-sheet-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="sheet-header">
              <div className="flex items-center gap-2">
                <ShieldAlert size={22} className="text-primary" />
                <h2 className="sheet-title">Painel de Moderação ADM</h2>
              </div>
              <button className="sheet-close-btn" onClick={() => setShowAdminModal(false)}>✕</button>
            </div>

            <p className="text-sm text-secondary mb-4">
              Avaliação de segurança: validação obrigatória antes da publicação para prevenir conteúdo +18 ou gatilhos severos sem classificação adequada.
            </p>

            <div className="admin-pending-list">
              {pendingStories.length === 0 ? (
                <div className="empty-pending-box text-center p-6 bg-gray-50 rounded-xl">
                  <CheckCircle2 size={32} className="text-success mx-auto mb-2" />
                  <p className="font-medium">Nenhuma história pendente de moderação no momento.</p>
                  <span className="text-xs text-muted">Todas as histórias compartilhadas estão em conformidade.</span>
                </div>
              ) : (
                pendingStories.map(ps => (
                  <div key={ps.id} className="pending-story-card p-4 border rounded-xl mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-primary">{ps.title}</span>
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                        {ps.visibility === 'anonimo' ? 'Anônimo' : ps.author_name}
                      </span>
                    </div>
                    <p className="text-sm text-secondary mb-3">{ps.content}</p>

                    <div className="flex justify-end gap-2 pt-2 border-t">
                      <button 
                        className="btn-reject flex items-center gap-1"
                        onClick={() => handleModerateStory(ps.id, 'rejeitado')}
                      >
                        <XCircle size={16} /> Rejeitar
                      </button>
                      <button 
                        className="btn-approve flex items-center gap-1"
                        onClick={() => handleModerateStory(ps.id, 'aprovado', ps.theme)}
                      >
                        <CheckCircle2 size={16} /> Aprovar para Roda
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
