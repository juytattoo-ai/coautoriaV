import React, { useEffect } from 'react';
import { Calendar, Sparkles, MapPin, ArrowRight, Bell } from 'lucide-react';
import './Novidades.css';

export const UNREAD_NEWS_KEY = 'coautoria_last_read_news_id';
export const LATEST_NEWS_ID = 'coautoria_post_2026_10_12';

const COMMUNITY_POSTS = [
  {
    id: 'n-1',
    category: 'Artigo & Metodologia',
    title: 'A força da escrita vulnerável: Por que compartilhar liberta',
    date: '12 de Outubro, 2026',
    author: 'Equipe Editorial Coautoria',
    content: 'Muitas vezes guardamos nossas dores e vitórias em silêncio por medo de julgamento. Quando organizamos nossas memórias dentro de uma narrativa com começo, meio e aprendizado, transformamos o peso em legado. Ler e escrever na comunidade do Coautoria é um ato de reencontro consigo mesmo.',
    badge: 'Destaque'
  },
  {
    id: 'n-2',
    category: 'Evento ao Vivo',
    title: 'Encontro da Comunidade: Roda de Conversa Online - Módulo Voz',
    date: '24 de Outubro, 2026 · 19h30',
    author: 'Mentoria Coautoria',
    content: 'Um momento exclusivo para trocarmos percepções sobre os 9 passos do Módulo Voz. Traga suas anotações do Bloco Mágico e sua Declaração de Propósito para um bate-papo acolhedor e seguro via conferência de vídeo.',
    badge: 'Agenda'
  },
  {
    id: 'n-3',
    category: 'Atualização do App',
    title: 'Novidades no Ar: Gravação de Áudio e Acervo Pessoal Integrado',
    date: '08 de Outubro, 2026',
    author: 'Time de Produto',
    content: 'Agora você pode gravar histórias falando diretamente no microfone do celular, sem precisar digitar tudo! Além disso, todas as histórias que você compartilhar para a Roda passam por uma curadoria acolhedora de temas antes de irem a público.',
    badge: 'Atualização'
  }
];

export default function Novidades() {
  useEffect(() => {
    // Ao abrir a página, marcar a última postagem da Coautoria como lida
    localStorage.setItem(UNREAD_NEWS_KEY, LATEST_NEWS_ID);
  }, []);

  return (
    <div className="novidades-page animate-fade-in">
      <header className="novidades-header">
        <span className="page-tag">COMUNIDADE & ATUALIZAÇÕES</span>
        <h1 className="page-heading">Novidades</h1>
        <p className="page-sub">
          Artigos, eventos e atualizações. Fique por dentro de tudo o que acontece no ecossistema Coautoria.
        </p>
      </header>

      <main className="novidades-list">
        {COMMUNITY_POSTS.map(post => (
          <article key={post.id} className="novidade-card animate-fade-in">
            <div className="novidade-top-meta">
              <span className={`novidade-badge badge-${post.badge.toLowerCase()}`}>
                {post.badge}
              </span>
              <span className="novidade-date flex items-center gap-1">
                <Calendar size={13} /> {post.date}
              </span>
            </div>

            <h2 className="novidade-title">{post.title}</h2>
            <p className="novidade-content">{post.content}</p>

            <div className="novidade-footer">
              <span className="novidade-author">{post.author}</span>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
}
