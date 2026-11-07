import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Bell,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Copy,
  Check,
  Send,
  UploadCloud,
  Trash2,
  X,
  ExternalLink
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import './Novidades.css';

export const UNREAD_NEWS_KEY = 'coautoria_last_read_news_id';
export const LATEST_NEWS_ID = 'coautoria_news_seen';

const BADGE_OPTIONS = ['Destaque', 'Agenda', 'Atualização', 'Artigo', 'Comunidade'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

const isSafeMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url, window.location.origin);
    return ['https:', 'http:', 'blob:', 'data:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

export default function Novidades() {
  const { user, isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Interações dos usuários
  const [userLikes, setUserLikes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('coautoria_news_likes') || '{}');
    } catch {
      return {};
    }
  });
  const [openCommentsId, setOpenCommentsId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [copiedTextId, setCopiedTextId] = useState(null);
  const [shareModalPost, setShareModalPost] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Modal de Criação de Novidades (Exclusivo Admin)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [title, setTitle] = useState('');
  const [badge, setBadge] = useState('Destaque');
  const [dateLabel, setDateLabel] = useState(() =>
    new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  );
  const [authorName, setAuthorName] = useState('Equipe Coautoria');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDraggingImg, setIsDraggingImg] = useState(false);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(UNREAD_NEWS_KEY, LATEST_NEWS_ID);
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      let remotePosts = [];
      const { data, error } = await supabase
        .from('app_news')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        remotePosts = data;
      }

      const localPosts = JSON.parse(localStorage.getItem('coautoria_app_news_cache') || '[]');
      const combined = [...remotePosts, ...localPosts];
      const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
      setPosts(unique);
      if (unique[0]?.id) {
        localStorage.setItem(UNREAD_NEWS_KEY, unique[0].id);
      }
    } catch (err) {
      console.warn('Erro ao carregar novidades:', err);
      const localPosts = JSON.parse(localStorage.getItem('coautoria_app_news_cache') || '[]');
      setPosts(localPosts);
    } finally {
      setLoading(false);
    }
  };

  const persistLocalNews = (updated) => {
    try {
      localStorage.setItem('coautoria_app_news_cache', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const processSelectedImage = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormError('Formato inválido. Selecione uma imagem JPG, PNG, WEBP ou HEIC.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setFormError('A imagem deve ter no máximo 5 MB. Escolha um arquivo menor.');
      return;
    }
    setFormError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    if (!isAdmin || !title.trim() || !content.trim()) return;
    setSavingPost(true);
    setFormError('');

    try {
      let finalImageUrl = null;

      if (imageFile && user) {
        const ext = (imageFile.name.split('.').pop() || 'jpg').toLowerCase();
        const filePath = `${user.id}/news-${user.id}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from('letters')
          .upload(filePath, imageFile);

        if (!upErr) {
          const { data: pubData } = supabase.storage.from('letters').getPublicUrl(filePath);
          finalImageUrl = pubData?.publicUrl || null;
        }
      }

      const newPost = {
        id: `news-${Date.now()}`,
        author_id: user?.id || null,
        author: authorName.trim() || 'Equipe Coautoria',
        badge,
        title: title.trim(),
        content: content.trim(),
        date_label: dateLabel.trim() || new Date().toLocaleDateString('pt-BR'),
        image_url: finalImageUrl || imagePreview || null,
        likes_count: 0,
        comments: [],
        created_at: new Date().toISOString()
      };

      try {
        await supabase.from('app_news').insert([newPost]);
      } catch (dbErr) {
        console.warn('Novidade salva em cache local:', dbErr);
      }

      const nextPosts = [newPost, ...posts];
      setPosts(nextPosts);
      persistLocalNews(nextPosts);

      // Reset form
      setTitle('');
      setContent('');
      setImageFile(null);
      setImagePreview('');
      setShowCreateModal(false);
    } catch (err) {
      setFormError(err.message || 'Erro ao publicar novidade.');
    } finally {
      setSavingPost(false);
    }
  };

  const handleDeleteNews = async (postId) => {
    if (!isAdmin) return;
    if (!window.confirm('Deseja excluir esta novidade permanentemente?')) return;

    const nextPosts = posts.filter(p => p.id !== postId);
    setPosts(nextPosts);
    persistLocalNews(nextPosts);

    try {
      await supabase.from('app_news').delete().eq('id', postId);
    } catch {
      // ignore
    }
  };

  const handleLike = async (post) => {
    const isLiked = !!userLikes[post.id];
    const nextLiked = !isLiked;
    const nextLikesCount = Math.max(0, (post.likes_count || 0) + (nextLiked ? 1 : -1));

    const updatedLikesMap = { ...userLikes, [post.id]: nextLiked };
    setUserLikes(updatedLikesMap);
    localStorage.setItem('coautoria_news_likes', JSON.stringify(updatedLikesMap));

    const updatedPosts = posts.map(p =>
      p.id === post.id ? { ...p, likes_count: nextLikesCount } : p
    );
    setPosts(updatedPosts);
    persistLocalNews(updatedPosts);

    try {
      await supabase
        .from('app_news')
        .update({ likes_count: nextLikesCount })
        .eq('id', post.id);
    } catch {
      // ignore
    }
  };

  const handleAddComment = async (post) => {
    const text = (commentInputs[post.id] || '').trim();
    if (!text) return;

    const commenterName = user?.user_metadata?.full_name || 'Membro Coautoria';
    const newComment = {
      id: `nc-${Date.now()}`,
      author: commenterName,
      text,
      created_at: new Date().toISOString()
    };

    const nextComments = [...(post.comments || []), newComment];
    const updatedPosts = posts.map(p =>
      p.id === post.id ? { ...p, comments: nextComments } : p
    );

    setPosts(updatedPosts);
    persistLocalNews(updatedPosts);
    setCommentInputs(prev => ({ ...prev, [post.id]: '' }));

    try {
      await supabase
        .from('app_news')
        .update({ comments: nextComments })
        .eq('id', post.id);
    } catch {
      // ignore
    }
  };

  const formatCopyTextWithAuthor = (post) => {
    return `“${post.title}”\n\n${post.content}\n\n— Por ${post.author || 'Equipe Coautoria'} (CoAutoria)`;
  };

  const handleCopyTextWithAuthor = (post) => {
    const formatted = formatCopyTextWithAuthor(post);
    navigator.clipboard.writeText(formatted);
    setCopiedTextId(post.id);
    setTimeout(() => setCopiedTextId(null), 2500);
  };

  const getShareUrl = (post) => `${window.location.origin}/novidades?post=${post.id}`;

  const handleSocialShare = (platform, post) => {
    const url = encodeURIComponent(getShareUrl(post));
    const textWithAuthor = encodeURIComponent(formatCopyTextWithAuthor(post));
    const shortTitle = encodeURIComponent(`${post.title} — Por ${post.author || 'CoAutoria'}`);

    let targetUrl = '';
    if (platform === 'whatsapp') {
      targetUrl = `https://wa.me/?text=${textWithAuthor}%0A%0A${url}`;
    } else if (platform === 'telegram') {
      targetUrl = `https://t.me/share/url?url=${url}&text=${textWithAuthor}`;
    } else if (platform === 'twitter') {
      targetUrl = `https://twitter.com/intent/tweet?text=${shortTitle}&url=${url}`;
    } else if (platform === 'facebook') {
      targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === 'linkedin') {
      targetUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }

    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="novidades-page animate-fade-in">
      <header className="novidades-header">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="page-tag">COMUNIDADE & ATUALIZAÇÕES</span>
            <h1 className="page-heading">Novidades</h1>
            <p className="page-sub">
              Artigos, eventos e atualizações. Fique por dentro de tudo o que acontece no ecossistema Coautoria.
            </p>
          </div>

          {isAdmin && (
            <button
              type="button"
              className="btn btn-primary flex items-center gap-2"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={18} />
              <span>Publicar Novidade (ADM)</span>
            </button>
          )}
        </div>
      </header>

      <main className="novidades-list">
        {loading ? (
          <div className="loading-state">Carregando novidades...</div>
        ) : posts.length === 0 ? (
          <div className="empty-novidades-box">
            <Bell size={40} className="text-primary mx-auto mb-3" />
            <h3 className="empty-novidades-title">Nenhuma novidade publicada no momento</h3>
            <p className="empty-novidades-sub">
              Assim que a equipe do Coautoria publicar novos avisos, eventos ou artigos, eles aparecerão aqui.
            </p>
            {isAdmin && (
              <button
                type="button"
                className="btn btn-primary mt-4"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={16} /> Criar Primeira Publicação
              </button>
            )}
          </div>
        ) : (
          posts.map(post => {
            const isLiked = !!userLikes[post.id];
            const isCommentsOpen = openCommentsId === post.id;
            const commentsList = post.comments || [];

            return (
              <article key={post.id} className="novidade-card animate-fade-in">
                <div className="novidade-top-meta">
                  <span className={`novidade-badge badge-${(post.badge || 'destaque').toLowerCase()}`}>
                    {post.badge || 'Destaque'}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="novidade-date flex items-center gap-1">
                      <Calendar size={13} /> {post.date_label || post.date}
                    </span>
                    {isAdmin && (
                      <button
                        type="button"
                        className="novidade-delete-btn"
                        onClick={() => handleDeleteNews(post.id)}
                        title="Excluir novidade (ADM)"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <h2 className="novidade-title">{post.title}</h2>

                {isSafeMediaUrl(post.image_url) && (
                  <div className="novidade-image-wrap">
                    <img src={post.image_url} alt={post.title} className="novidade-img" />
                  </div>
                )}

                <p className="novidade-content">{post.content}</p>

                <div className="novidade-footer">
                  <span className="novidade-author">Por {post.author || 'Equipe Coautoria'}</span>
                </div>

                {/* Barra de Ações: Curtir, Comentar, Copiar Texto com Autor e Compartilhar */}
                <div className="novidade-actions-bar">
                  <button
                    type="button"
                    className={`novidade-action-btn ${isLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(post)}
                  >
                    <Heart
                      size={17}
                      fill={isLiked ? '#e53935' : 'none'}
                      color={isLiked ? '#e53935' : 'currentColor'}
                    />
                    <span>{post.likes_count || 0}</span>
                  </button>

                  <button
                    type="button"
                    className="novidade-action-btn"
                    onClick={() => setOpenCommentsId(isCommentsOpen ? null : post.id)}
                  >
                    <MessageCircle size={17} />
                    <span>{commentsList.length}</span>
                  </button>

                  <button
                    type="button"
                    className="novidade-action-btn"
                    onClick={() => handleCopyTextWithAuthor(post)}
                    title="Copiar texto completo com créditos do autor"
                  >
                    {copiedTextId === post.id ? (
                      <>
                        <Check size={16} color="#00c851" />
                        <span className="text-success font-semibold">Texto copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>Copiar com autor</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="novidade-action-btn"
                    onClick={() => setShareModalPost(post)}
                  >
                    <Share2 size={16} />
                    <span>Compartilhar</span>
                  </button>
                </div>

                {/* Comentários da Novidade */}
                {isCommentsOpen && (
                  <div className="novidade-comments-box animate-fade-in">
                    <div className="novidade-comments-list">
                      {commentsList.length === 0 ? (
                        <p className="novidade-no-comments">Seja o primeiro a comentar nesta novidade.</p>
                      ) : (
                        commentsList.map(c => (
                          <div key={c.id} className="novidade-comment-item">
                            <strong className="novidade-comment-author">{c.author}</strong>
                            <p className="novidade-comment-text">{c.text}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="novidade-comment-input-row">
                      <input
                        type="text"
                        placeholder="Escreva um comentário..."
                        value={commentInputs[post.id] || ''}
                        onChange={e =>
                          setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))
                        }
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleAddComment(post);
                        }}
                      />
                      <button
                        type="button"
                        className="novidade-send-comment-btn"
                        onClick={() => handleAddComment(post)}
                      >
                        <Send size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </main>

      {/* Modal de Compartilhamento em Redes Sociais e Cópia */}
      {shareModalPost && (
        <div className="modal-backdrop" onClick={() => setShareModalPost(null)}>
          <div className="modal-sheet-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="sheet-header">
              <div className="flex items-center gap-2">
                <Share2 size={20} className="text-primary" />
                <h2 className="sheet-title">Compartilhar Novidade</h2>
              </div>
              <button type="button" className="sheet-close-btn" onClick={() => setShareModalPost(null)}>✕</button>
            </div>

            <p className="text-sm text-secondary mb-4">
              “{shareModalPost.title}” — <strong>{shareModalPost.author}</strong>
            </p>

            <div className="share-social-grid">
              <button
                type="button"
                className="share-social-btn"
                onClick={() => handleSocialShare('whatsapp', shareModalPost)}
              >
                <span>WhatsApp</span>
                <ExternalLink size={14} />
              </button>
              <button
                type="button"
                className="share-social-btn"
                onClick={() => handleSocialShare('telegram', shareModalPost)}
              >
                <span>Telegram</span>
                <ExternalLink size={14} />
              </button>
              <button
                type="button"
                className="share-social-btn"
                onClick={() => handleSocialShare('twitter', shareModalPost)}
              >
                <span>X (Twitter)</span>
                <ExternalLink size={14} />
              </button>
              <button
                type="button"
                className="share-social-btn"
                onClick={() => handleSocialShare('facebook', shareModalPost)}
              >
                <span>Facebook</span>
                <ExternalLink size={14} />
              </button>
              <button
                type="button"
                className="share-social-btn"
                onClick={() => handleSocialShare('linkedin', shareModalPost)}
              >
                <span>LinkedIn</span>
                <ExternalLink size={14} />
              </button>
              {typeof navigator !== 'undefined' && navigator.share && (
                <button
                  type="button"
                  className="share-social-btn"
                  onClick={() => {
                    navigator.share({
                      title: shareModalPost.title,
                      text: formatCopyTextWithAuthor(shareModalPost),
                      url: getShareUrl(shareModalPost)
                    }).catch(() => {});
                  }}
                >
                  <span>Mais opções do aparelho...</span>
                  <Share2 size={14} />
                </button>
              )}
            </div>

            <div className="share-copy-actions mt-4 pt-4 border-t flex flex-col gap-2">
              <button
                type="button"
                className="btn btn-outline w-full flex items-center justify-center gap-2"
                onClick={() => handleCopyTextWithAuthor(shareModalPost)}
              >
                {copiedTextId === shareModalPost.id ? <Check size={16} /> : <Copy size={16} />}
                <span>
                  {copiedTextId === shareModalPost.id
                    ? 'Texto com nome do autor copiado!'
                    : 'Copiar texto completo com nome do autor'}
                </span>
              </button>

              <button
                type="button"
                className="btn-text text-sm flex items-center justify-center gap-2 py-2"
                onClick={() => {
                  navigator.clipboard.writeText(getShareUrl(shareModalPost));
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2500);
                }}
              >
                {copiedLink ? '✓ Link copiado!' : 'Copiar apenas o link da publicação'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Publicar Novidade (Exclusivo Admin) */}
      {isAdmin && showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal-sheet-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="sheet-header">
              <h2 className="sheet-title">Nova Publicação em Novidades (ADM)</h2>
              <button type="button" className="sheet-close-btn" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>

            {formError && (
              <div className="status-banner error mb-4">{formError}</div>
            )}

            <form onSubmit={handleCreateNews} className="novidade-admin-form">
              <div className="sheet-input-group mb-3">
                <label className="sheet-label">Título da Novidade</label>
                <input
                  type="text"
                  className="sheet-input"
                  placeholder="Ex: Encontro ao Vivo da Comunidade Coautoria"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="sheet-input-group">
                  <label className="sheet-label">Selo / Categoria</label>
                  <select
                    className="sheet-select"
                    value={badge}
                    onChange={e => setBadge(e.target.value)}
                  >
                    {BADGE_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="sheet-input-group">
                  <label className="sheet-label">Data ou Horário Exibido</label>
                  <input
                    type="text"
                    className="sheet-input"
                    placeholder="Ex: 15 de Novembro, 2026 · 19h30"
                    value={dateLabel}
                    onChange={e => setDateLabel(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="sheet-input-group mb-3">
                <label className="sheet-label">Autor / Assinatura</label>
                <input
                  type="text"
                  className="sheet-input"
                  placeholder="Ex: Equipe Editorial Coautoria"
                  value={authorName}
                  onChange={e => setAuthorName(e.target.value)}
                  required
                />
              </div>

              {/* Upload de Imagem com Drag & Drop + Galeria (Limite 5 MB) */}
              <div className="sheet-input-group mb-3">
                <label className="sheet-label">Imagem da Publicação (Opcional · Máx. 5 MB)</label>
                <div
                  className={`novidade-img-dropzone ${isDraggingImg ? 'dragging' : ''}`}
                  onDragOver={e => {
                    e.preventDefault();
                    setIsDraggingImg(true);
                  }}
                  onDragLeave={() => setIsDraggingImg(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setIsDraggingImg(false);
                    const file = e.dataTransfer?.files?.[0];
                    if (file) processSelectedImage(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="novidade-img-preview-box">
                      <img src={imagePreview} alt="Prévia" />
                      <button
                        type="button"
                        className="novidade-remove-img-btn"
                        onClick={e => {
                          e.stopPropagation();
                          setImageFile(null);
                          setImagePreview('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <div className="novidade-dropzone-placeholder">
                      <UploadCloud size={24} className="text-primary mb-1" />
                      <span className="font-semibold text-sm">
                        Arraste uma imagem aqui ou clique para selecionar
                      </span>
                      <span className="text-xs text-muted">JPG, PNG, WEBP ou HEIC · Até 5 MB</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) processSelectedImage(f);
                    }}
                  />
                </div>
              </div>

              <div className="sheet-input-group mb-4">
                <label className="sheet-label">Texto da Novidade</label>
                <textarea
                  className="sheet-textarea"
                  rows="6"
                  placeholder="Escreva o conteúdo completo da novidade..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  className="btn-text"
                  onClick={() => setShowCreateModal(false)}
                  disabled={savingPost}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingPost || !title.trim() || !content.trim()}
                >
                  {savingPost ? 'Publicando...' : 'Publicar Novidade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
