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
  Send,
  Flag,
  UserX,
  RotateCcw,
  ExternalLink
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

const REPORT_REASONS = [
  'Conteúdo ofensivo ou discurso de ódio',
  'Assédio, desrespeito ou exposição indevida',
  'Gatilho sensível severo sem aviso',
  'Spam, propaganda ou conteúdo falso',
  'Outro motivo'
];

// F-02 / F-10: Sanitiza URLs de mídia para permitir apenas protocolos seguros (https, http, blob)
const isSafeMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url, window.location.origin);
    return ['https:', 'http:', 'blob:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

// Sem histórias fictícias de mockup (apenas histórias reais compartilhadas)
const INITIAL_PUBLIC_STORIES = [];

export default function RodaHistorias() {
  const { user, isAdmin } = useAuth();
  const [selectedTheme, setSelectedTheme] = useState('Todos');
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLikes, setUserLikes] = useState({});
  const [openCommentsId, setOpenCommentsId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [copiedTextId, setCopiedTextId] = useState(null);
  const [shareStoryTarget, setShareStoryTarget] = useState(null);

  // Segurança & Moderação UGC (Exigência Apple Guideline 1.2 & Google Play)
  const [reportedStoryIds, setReportedStoryIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('coautoria_reported_stories') || '[]');
    } catch {
      return [];
    }
  });
  const [blockedUsers, setBlockedUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('coautoria_blocked_users') || '[]');
    } catch {
      return [];
    }
  });
  const [showBlockedModal, setShowBlockedModal] = useState(false);

  // Modal de Denúncia (Report)
  const [reportTarget, setReportTarget] = useState(null); // { storyId, storyTitle, commentId, authorName }
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportDetails, setReportDetails] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState('');

  // Painel de Moderação ADM (Restrito a Administradores)
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminTab, setAdminTab] = useState('pendentes'); // 'pendentes' | 'denuncias'
  const [pendingStories, setPendingStories] = useState([]);
  const [reportedList, setReportedList] = useState([]);

  useEffect(() => {
    loadPublicFeed();
    loadBlockedUsers();
    if (isAdmin) {
      loadPendingStories();
      loadAdminReports();
    }
  }, [user, isAdmin]);

  const showTemporaryFeedback = (msg) => {
    setFeedbackBanner(msg);
    setTimeout(() => setFeedbackBanner(''), 4500);
  };

  const loadBlockedUsers = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('blocked_users')
        .select('blocked_user_id, blocked_author_name')
        .eq('blocker_id', user.id);

      if (!error && data && data.length > 0) {
        const merged = [...blockedUsers];
        data.forEach(item => {
          if (!merged.some(b => b.id === item.blocked_user_id)) {
            merged.push({
              id: item.blocked_user_id,
              name: item.blocked_author_name || 'Usuário bloqueado'
            });
          }
        });
        setBlockedUsers(merged);
        localStorage.setItem('coautoria_blocked_users', JSON.stringify(merged));
      }
    } catch {
      // Fallback local já inicializado
    }
  };

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
      } catch {
        // ignore
      }

      // Concatenar com dados de comunidade
      const combined = [...localPublicStories, ...remoteStories, ...INITIAL_PUBLIC_STORIES];
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
    if (!isAdmin) return;
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

  const loadAdminReports = async () => {
    if (!isAdmin) return;
    try {
      const { data } = await supabase
        .from('story_reports')
        .select('*')
        .eq('status', 'pendente')
        .order('created_at', { ascending: false });

      if (data) {
        setReportedList(data);
      }
    } catch {
      // tabela pode ainda não estar criada
    }
  };

  const handleLike = async (storyId) => {
    const isLiked = !!userLikes[storyId];
    const nextState = !isLiked;
    const updatedLikesMap = { ...userLikes, [storyId]: nextState };
    setUserLikes(updatedLikesMap);
    try {
      localStorage.setItem('coautoria_roda_likes', JSON.stringify(updatedLikesMap));
    } catch {
      // ignore
    }

    const target = stories.find(s => s.id === storyId);
    const nextCount = Math.max(0, (target?.likes_count || 0) + (nextState ? 1 : -1));

    setStories(current =>
      current.map(s => (s.id === storyId ? { ...s, likes_count: nextCount } : s))
    );

    if (user) {
      try {
        await supabase
          .from('user_stories')
          .update({ likes_count: nextCount })
          .eq('id', storyId);
      } catch {
        // fallback silencioso
      }
    }
  };

  const handleAddComment = async (storyId) => {
    if (!newCommentText.trim()) return;
    const authorName = user?.user_metadata?.full_name || 'Companheiro(a) de Jornada';
    const newComment = {
      id: `c-${Date.now()}`,
      author: authorName,
      text: newCommentText.trim(),
      created_at: new Date().toISOString()
    };

    const target = stories.find(s => s.id === storyId);
    const nextComments = [...(Array.isArray(target?.comments) ? target.comments : []), newComment];

    setStories(prev =>
      prev.map(s =>
        s.id === storyId
          ? { ...s, comments: nextComments, comments_count: nextComments.length }
          : s
      )
    );
    setNewCommentText('');

    if (user) {
      try {
        await supabase
          .from('user_stories')
          .update({
            comments: nextComments,
            comments_count: nextComments.length
          })
          .eq('id', storyId);
      } catch {
        // fallback silencioso
      }
    }
  };

  const getDisplayAuthor = (story) =>
    story.visibility === 'anonimo' ? 'Autor(a) Anônimo(a)' : (story.author_name || 'Autor Coautoria');

  const formatStoryTextWithAuthor = (story) => {
    const authorLabel = getDisplayAuthor(story);
    return `“${story.title}”\n\n${story.content || ''}\n\n— Por ${authorLabel} (CoAutoria)`;
  };

  const handleCopyStoryText = (story) => {
    navigator.clipboard.writeText(formatStoryTextWithAuthor(story));
    setCopiedTextId(story.id);
    setTimeout(() => setCopiedTextId(null), 2500);
  };

  const getStoryShareUrl = (story) =>
    `${window.location.origin}/roda-de-historias?historia=${story.id}`;

  const handleShare = (story) => {
    setShareStoryTarget(story);
  };

  const handleSocialShareStory = (platform, story) => {
    const url = encodeURIComponent(getStoryShareUrl(story));
    const fullText = encodeURIComponent(formatStoryTextWithAuthor(story));
    const shortText = encodeURIComponent(`“${story.title}” — Por ${getDisplayAuthor(story)} no CoAutoria`);

    let targetUrl = '';
    if (platform === 'whatsapp') {
      targetUrl = `https://wa.me/?text=${fullText}%0A%0A${url}`;
    } else if (platform === 'telegram') {
      targetUrl = `https://t.me/share/url?url=${url}&text=${fullText}`;
    } else if (platform === 'twitter') {
      targetUrl = `https://twitter.com/intent/tweet?text=${shortText}&url=${url}`;
    } else if (platform === 'facebook') {
      targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === 'linkedin') {
      targetUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }

    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Envio de Denúncia (Report) — Apple Guideline 1.2 & Google Play UGC
  const handleOpenReportModal = (story, comment = null) => {
    setReportTarget({
      storyId: String(story.id),
      storyTitle: story.title,
      commentId: comment ? String(comment.id) : null,
      commentText: comment ? comment.text : null,
      authorName: comment
        ? comment.author
        : (story.visibility === 'anonimo' ? 'Autor(a) Anônimo(a)' : story.author_name)
    });
    setReportReason(REPORT_REASONS[0]);
    setReportDetails('');
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!reportTarget) return;
    setSubmittingReport(true);

    try {
      if (user) {
        await supabase.from('story_reports').insert([{
          reporter_id: user.id,
          story_id: reportTarget.storyId,
          comment_id: reportTarget.commentId,
          reason: reportReason,
          details: reportDetails.trim() || null,
          status: 'pendente'
        }]);
      }
    } catch (err) {
      console.warn('Denúncia registrada localmente:', err);
    } finally {
      if (reportTarget.commentId) {
        // Oculta o comentário denunciado imediatamente para o usuário
        setStories(prev =>
          prev.map(s => {
            if (String(s.id) === reportTarget.storyId) {
              return {
                ...s,
                comments: (s.comments || []).filter(c => String(c.id) !== reportTarget.commentId)
              };
            }
            return s;
          })
        );
        showTemporaryFeedback('Comentário denunciado e ocultado do seu feed. Nossa equipe analisará em até 24h.');
      } else {
        // Oculta a história denunciada imediatamente para o usuário
        const nextReported = [...new Set([...reportedStoryIds, reportTarget.storyId])];
        setReportedStoryIds(nextReported);
        localStorage.setItem('coautoria_reported_stories', JSON.stringify(nextReported));
        showTemporaryFeedback('História denunciada e ocultada do seu feed. Nossa equipe analisará em até 24h.');
      }

      setSubmittingReport(false);
      setReportTarget(null);
      if (isAdmin) loadAdminReports();
    }
  };

  // Bloqueio de Usuário — Apple Guideline 1.2 & Google Play UGC
  const handleBlockAuthor = async (story) => {
    const authorIdentifier = String(story.user_id || story.author_name || story.id);
    const displayAuthor = story.visibility === 'anonimo'
      ? 'Autor(a) Anônimo(a)'
      : (story.author_name || 'Usuário');

    const confirmed = window.confirm(
      `Deseja bloquear "${displayAuthor}"?\n\nAs publicações deste autor deixarão de aparecer imediatamente na sua Roda de Histórias.`
    );
    if (!confirmed) return;

    const nextBlocked = [
      ...blockedUsers.filter(b => b.id !== authorIdentifier),
      { id: authorIdentifier, name: displayAuthor }
    ];
    setBlockedUsers(nextBlocked);
    localStorage.setItem('coautoria_blocked_users', JSON.stringify(nextBlocked));

    if (user) {
      try {
        await supabase.from('blocked_users').upsert([{
          blocker_id: user.id,
          blocked_user_id: authorIdentifier,
          blocked_author_name: displayAuthor
        }], { onConflict: 'blocker_id,blocked_user_id' });
      } catch {
        // Salvo localmente
      }
    }

    showTemporaryFeedback(`"${displayAuthor}" foi bloqueado(a). Suas postagens foram ocultadas.`);
  };

  const handleUnblockAuthor = async (blockedId) => {
    const nextBlocked = blockedUsers.filter(b => b.id !== blockedId);
    setBlockedUsers(nextBlocked);
    localStorage.setItem('coautoria_blocked_users', JSON.stringify(nextBlocked));

    if (user) {
      try {
        await supabase
          .from('blocked_users')
          .delete()
          .eq('blocker_id', user.id)
          .eq('blocked_user_id', blockedId);
      } catch {
        // Ignorar erro remoto
      }
    }
  };

  // Funções de Moderação ADM (Restritas a isAdmin)
  const handleModerateStory = async (storyId, newStatus, assignedTheme) => {
    if (!isAdmin) return;
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

  const handleResolveReport = async (reportId, actionStatus, storyId) => {
    if (!isAdmin) return;
    try {
      await supabase
        .from('story_reports')
        .update({ status: actionStatus })
        .eq('id', reportId);

      if (actionStatus === 'removido' && storyId) {
        await supabase
          .from('user_stories')
          .update({ status: 'rejeitado' })
          .eq('id', storyId);
        loadPublicFeed();
      }
      setReportedList(prev => prev.filter(r => r.id !== reportId));
    } catch (err) {
      console.error('Erro ao resolver denúncia:', err);
    }
  };

  const filteredStories = stories.filter(story => {
    const authorIdentifier = String(story.user_id || story.author_name || story.id);
    if (reportedStoryIds.includes(String(story.id))) return false;
    if (blockedUsers.some(b => b.id === authorIdentifier)) return false;
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

          <div className="flex items-center gap-2 flex-wrap">
            {blockedUsers.length > 0 && (
              <button
                type="button"
                className="btn-blocked-users"
                onClick={() => setShowBlockedModal(true)}
                title="Gerenciar autores bloqueados"
              >
                <UserX size={15} />
                <span>Bloqueados ({blockedUsers.length})</span>
              </button>
            )}

            {/* Botão de Moderação ADM — exibido exclusivamente para administradores */}
            {isAdmin && (
              <button 
                type="button"
                className="btn-adm-moderation"
                onClick={() => setShowAdminModal(true)}
                title="Acesso de Moderação e Validação de Conteúdo"
              >
                <ShieldAlert size={16} />
                <span>
                  Moderação ADM {(pendingStories.length + reportedList.length) > 0 && `(${pendingStories.length + reportedList.length})`}
                </span>
              </button>
            )}
          </div>
        </div>

        {feedbackBanner && (
          <div className="moderation-feedback-banner animate-fade-in">
            <CheckCircle2 size={16} />
            <span>{feedbackBanner}</span>
          </div>
        )}

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
            const isOwnStory = user && story.user_id === user.id;

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

                  <div className="flex items-center gap-2">
                    <span className="story-theme-tag">
                      {story.theme || 'Vida'}
                    </span>

                    {/* Ações de Segurança UGC: Denunciar e Bloquear Autor */}
                    {!isOwnStory && (
                      <div className="story-safety-actions">
                        <button
                          type="button"
                          className="safety-icon-btn"
                          onClick={() => handleOpenReportModal(story)}
                          title="Denunciar conteúdo impróprio"
                          aria-label="Denunciar história"
                        >
                          <Flag size={14} />
                        </button>
                        <button
                          type="button"
                          className="safety-icon-btn"
                          onClick={() => handleBlockAuthor(story)}
                          title="Bloquear este autor"
                          aria-label="Bloquear autor"
                        >
                          <UserX size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Título & Conteúdo */}
                <h3 className="story-headline">{story.title}</h3>
                
                {isSafeMediaUrl(story.audio_url) && (
                  <div className="feed-audio-player my-3">
                    <audio controls src={story.audio_url} className="w-full" />
                  </div>
                )}

                {isSafeMediaUrl(story.image_url) && (
                  <div className="feed-image-preview my-3">
                    <img src={story.image_url} alt={story.title} />
                  </div>
                )}

                <p className="story-body-text">{story.content}</p>

                {/* Ações: Curtir, Comentar, Copiar com Autor, Compartilhar, Denunciar */}
                <div className="story-actions-bar">
                  <button 
                    type="button"
                    className={`action-btn ${isLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(story.id)}
                  >
                    <Heart size={18} fill={isLiked ? '#e53935' : 'none'} color={isLiked ? '#e53935' : 'currentColor'} />
                    <span>{story.likes_count || 0}</span>
                  </button>

                  <button 
                    type="button"
                    className="action-btn"
                    onClick={() => setOpenCommentsId(isCommentsOpen ? null : story.id)}
                  >
                    <MessageCircle size={18} />
                    <span>{commentsCount}</span>
                  </button>

                  <button
                    type="button"
                    className="action-btn"
                    onClick={() => handleCopyStoryText(story)}
                    title="Copiar texto da história com o nome do autor"
                  >
                    {copiedTextId === story.id ? (
                      <>
                        <Check size={17} color="#00c851" />
                        <span className="text-success font-semibold">Texto copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={17} />
                        <span>Copiar com autor</span>
                      </>
                    )}
                  </button>

                  <div className="share-btn-wrapper">
                    <button 
                      type="button"
                      className="action-btn"
                      onClick={() => handleShare(story)}
                      title="Compartilhar nas redes sociais ou copiar link"
                    >
                      <Share2 size={18} />
                      <span>Compartilhar</span>
                    </button>
                  </div>

                  {!isOwnStory && (
                    <button
                      type="button"
                      className="action-btn action-btn-report ml-auto"
                      onClick={() => handleOpenReportModal(story)}
                      title="Denunciar relato"
                    >
                      <Flag size={15} />
                      <span>Denunciar</span>
                    </button>
                  )}
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
                            <div className="flex items-center justify-between gap-2">
                              <strong className="comment-author">{c.author}</strong>
                              <button
                                type="button"
                                className="comment-report-btn"
                                onClick={() => handleOpenReportModal(story, c)}
                                title="Denunciar comentário"
                              >
                                <Flag size={12} /> Denunciar
                              </button>
                            </div>
                            <p className="comment-text">{c.text}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="add-comment-input-row">
                      <input 
                        type="text" 
                        placeholder="Escreva um comentário respeitoso e acolhedor..."
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

      {/* Modal de Compartilhamento em Redes Sociais e Cópia com Autor */}
      {shareStoryTarget && (
        <div className="modal-backdrop" onClick={() => setShareStoryTarget(null)}>
          <div className="modal-sheet-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="sheet-header">
              <div className="flex items-center gap-2">
                <Share2 size={20} className="text-primary" />
                <h2 className="sheet-title">Compartilhar História</h2>
              </div>
              <button type="button" className="sheet-close-btn" onClick={() => setShareStoryTarget(null)}>✕</button>
            </div>

            <p className="text-sm text-secondary mb-4">
              “{shareStoryTarget.title}” — <strong>{getDisplayAuthor(shareStoryTarget)}</strong>
            </p>

            <div className="roda-share-social-grid">
              <button
                type="button"
                className="roda-share-social-btn"
                onClick={() => handleSocialShareStory('whatsapp', shareStoryTarget)}
              >
                <span>WhatsApp</span>
                <ExternalLink size={14} />
              </button>
              <button
                type="button"
                className="roda-share-social-btn"
                onClick={() => handleSocialShareStory('telegram', shareStoryTarget)}
              >
                <span>Telegram</span>
                <ExternalLink size={14} />
              </button>
              <button
                type="button"
                className="roda-share-social-btn"
                onClick={() => handleSocialShareStory('twitter', shareStoryTarget)}
              >
                <span>X (Twitter)</span>
                <ExternalLink size={14} />
              </button>
              <button
                type="button"
                className="roda-share-social-btn"
                onClick={() => handleSocialShareStory('facebook', shareStoryTarget)}
              >
                <span>Facebook</span>
                <ExternalLink size={14} />
              </button>
              <button
                type="button"
                className="roda-share-social-btn"
                onClick={() => handleSocialShareStory('linkedin', shareStoryTarget)}
              >
                <span>LinkedIn</span>
                <ExternalLink size={14} />
              </button>
              {typeof navigator !== 'undefined' && navigator.share && (
                <button
                  type="button"
                  className="roda-share-social-btn"
                  onClick={() => {
                    navigator.share({
                      title: shareStoryTarget.title,
                      text: formatStoryTextWithAuthor(shareStoryTarget),
                      url: getStoryShareUrl(shareStoryTarget)
                    }).catch(() => {});
                  }}
                >
                  <span>Mais opções do aparelho...</span>
                  <Share2 size={14} />
                </button>
              )}
            </div>

            <div className="mt-4 pt-4 border-t flex flex-col gap-2">
              <button
                type="button"
                className="btn btn-outline w-full flex items-center justify-center gap-2"
                onClick={() => handleCopyStoryText(shareStoryTarget)}
              >
                {copiedTextId === shareStoryTarget.id ? <Check size={16} /> : <Copy size={16} />}
                <span>
                  {copiedTextId === shareStoryTarget.id
                    ? 'Texto com nome do autor copiado!'
                    : 'Copiar texto completo com nome do autor'}
                </span>
              </button>

              <button
                type="button"
                className="btn-text text-sm flex items-center justify-center gap-2 py-2"
                onClick={() => {
                  navigator.clipboard.writeText(getStoryShareUrl(shareStoryTarget));
                  setCopiedId(shareStoryTarget.id);
                  setTimeout(() => setCopiedId(null), 2500);
                }}
              >
                {copiedId === shareStoryTarget.id ? '✓ Link copiado!' : 'Copiar apenas o link da história'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Denúncia (Report UGC) */}
      {reportTarget && (
        <div className="modal-backdrop" onClick={() => setReportTarget(null)}>
          <div className="modal-sheet-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="sheet-header">
              <div className="flex items-center gap-2">
                <Flag size={20} className="text-danger" />
                <h2 className="sheet-title">
                  {reportTarget.commentId ? 'Denunciar Comentário' : 'Denunciar Publicação'}
                </h2>
              </div>
              <button type="button" className="sheet-close-btn" onClick={() => setReportTarget(null)}>✕</button>
            </div>

            <p className="text-sm text-secondary mb-4">
              Ajude a manter a Roda de Histórias um ambiente seguro e acolhedor. O conteúdo denunciado será ocultado imediatamente para você e revisado pela nossa moderação.
            </p>

            <form onSubmit={handleSubmitReport} className="report-form">
              <div className="mb-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
                  Motivo da denúncia
                </label>
                <div className="report-reasons-list">
                  {REPORT_REASONS.map(reason => (
                    <label key={reason} className="report-reason-option">
                      <input
                        type="radio"
                        name="reportReason"
                        value={reason}
                        checked={reportReason === reason}
                        onChange={() => setReportReason(reason)}
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary mb-1">
                  Detalhes adicionais (opcional)
                </label>
                <textarea
                  className="report-textarea"
                  rows="3"
                  placeholder="Descreva brevemente o que aconteceu..."
                  value={reportDetails}
                  onChange={e => setReportDetails(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  className="btn-text text-sm"
                  onClick={() => setReportTarget(null)}
                  disabled={submittingReport}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submittingReport}
                >
                  {submittingReport ? 'Enviando...' : 'Enviar Denúncia e Ocultar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Gerenciamento de Usuários Bloqueados */}
      {showBlockedModal && (
        <div className="modal-backdrop" onClick={() => setShowBlockedModal(false)}>
          <div className="modal-sheet-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="sheet-header">
              <div className="flex items-center gap-2">
                <UserX size={20} className="text-primary" />
                <h2 className="sheet-title">Autores Bloqueados</h2>
              </div>
              <button type="button" className="sheet-close-btn" onClick={() => setShowBlockedModal(false)}>✕</button>
            </div>

            <p className="text-sm text-secondary mb-4">
              Publicações de autores bloqueados não aparecem no seu feed da Roda de Histórias.
            </p>

            {blockedUsers.length === 0 ? (
              <p className="text-sm text-muted text-center py-4">Nenhum autor bloqueado.</p>
            ) : (
              <div className="blocked-users-list">
                {blockedUsers.map(b => (
                  <div key={b.id} className="blocked-user-row">
                    <span className="font-medium text-sm">{b.name}</span>
                    <button
                      type="button"
                      className="btn-unblock"
                      onClick={() => handleUnblockAuthor(b.id)}
                    >
                      <RotateCcw size={13} /> Desbloquear
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Moderação ADM (Exclusivo para Administradores) */}
      {isAdmin && showAdminModal && (
        <div className="modal-backdrop" onClick={() => setShowAdminModal(false)}>
          <div className="modal-sheet-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="sheet-header">
              <div className="flex items-center gap-2">
                <ShieldAlert size={22} className="text-primary" />
                <h2 className="sheet-title">Painel de Moderação ADM</h2>
              </div>
              <button type="button" className="sheet-close-btn" onClick={() => setShowAdminModal(false)}>✕</button>
            </div>

            <div className="admin-tabs-row mb-4">
              <button
                type="button"
                className={`theme-chip-btn ${adminTab === 'pendentes' ? 'active' : ''}`}
                onClick={() => setAdminTab('pendentes')}
              >
                Histórias Pendentes ({pendingStories.length})
              </button>
              <button
                type="button"
                className={`theme-chip-btn ${adminTab === 'denuncias' ? 'active' : ''}`}
                onClick={() => setAdminTab('denuncias')}
              >
                Denúncias ({reportedList.length})
              </button>
            </div>

            {adminTab === 'pendentes' ? (
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
                          type="button"
                          className="btn-reject flex items-center gap-1"
                          onClick={() => handleModerateStory(ps.id, 'rejeitado')}
                        >
                          <XCircle size={16} /> Rejeitar
                        </button>
                        <button 
                          type="button"
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
            ) : (
              <div className="admin-pending-list">
                {reportedList.length === 0 ? (
                  <div className="empty-pending-box text-center p-6 bg-gray-50 rounded-xl">
                    <CheckCircle2 size={32} className="text-success mx-auto mb-2" />
                    <p className="font-medium">Nenhuma denúncia pendente.</p>
                  </div>
                ) : (
                  reportedList.map(rep => (
                    <div key={rep.id} className="pending-story-card p-4 border rounded-xl mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-danger text-sm">{rep.reason}</span>
                        <span className="text-xs text-muted">
                          {new Date(rep.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-xs text-secondary mb-2">
                        ID da História: <code>{rep.story_id}</code>
                        {rep.comment_id ? ` · Comentário: ${rep.comment_id}` : ''}
                      </p>
                      {rep.details && (
                        <p className="text-sm text-secondary mb-3 italic">"{rep.details}"</p>
                      )}
                      <div className="flex justify-end gap-2 pt-2 border-t">
                        <button
                          type="button"
                          className="btn-text text-xs"
                          onClick={() => handleResolveReport(rep.id, 'analisado', rep.story_id)}
                        >
                          Arquivar Denúncia
                        </button>
                        <button
                          type="button"
                          className="btn-reject flex items-center gap-1"
                          onClick={() => handleResolveReport(rep.id, 'removido', rep.story_id)}
                        >
                          <XCircle size={15} /> Remover Publicação
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
