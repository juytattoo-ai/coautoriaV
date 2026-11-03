import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Smartphone, Monitor } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import { LANDING_CTA_CONFIG, resolveLandingCtaUrl } from '../landingConfig';
import '../LandingShared.css';

/**
 * Mostra os blocos da página suavemente conforme a pessoa rola a tela
 */
export function useLandingReveal() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const elements = document.querySelectorAll('.lp-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

/**
 * Botão reutilizável com destino configurável em um só lugar
 */
export function LandingCtaButton({
  pageKey = 'lp01',
  href,
  variant = 'primary',
  size = 'lg',
  children,
  showArrow = true,
  className = '',
  onClick,
}) {
  const navigate = useNavigate();
  const targetUrl = resolveLandingCtaUrl(pageKey, href);

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
      if (e.defaultPrevented) return;
    }

    if (!targetUrl) return;

    if (targetUrl.startsWith('#')) {
      e.preventDefault();
      const targetEl = document.querySelector(targetUrl);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    if (/^https?:\/\//i.test(targetUrl)) {
      return;
    }

    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(targetUrl);
  };

  return (
    <a
      href={targetUrl}
      onClick={handleClick}
      className={`lp-cta-btn lp-cta-${variant} lp-cta-${size} ${className}`}
    >
      <span className="lp-cta-dot" aria-hidden="true">•</span>
      <span>{children}</span>
      {showArrow && <ArrowRight size={16} strokeWidth={1.75} className="lp-cta-arrow" />}
    </a>
  );
}

/**
 * Estrutura compartilhada das 4 páginas de entrada (Desktop e Celular)
 */
export default function LandingLayout({
  pageKey = 'lp01',
  children,
  headerCtaLabel,
  customCtaUrl,
}) {
  useLandingReveal();
  const location = useLocation();
  const [viewportMode, setViewportMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('coautoria_lp_viewport') || 'desktop';
    }
    return 'desktop';
  });

  const pageConfig = LANDING_CTA_CONFIG.pages[pageKey] || LANDING_CTA_CONFIG.pages.lp01;
  const topCtaLabel = headerCtaLabel || pageConfig.headerCtaLabel || 'Começar agora';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleChangeViewport = (mode) => {
    setViewportMode(mode);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('coautoria_lp_viewport', mode);
    }
  };

  const isMobileSim = viewportMode === 'mobile';

  return (
    <div
      className={`lp-outer-stage ${
        isMobileSim ? 'lp-stage-mobile-simulator' : ''
      }`}
    >
      {/* Barra superior para trocar entre as 4 páginas e ver em Computador ou Celular */}
      <div className="lp-preview-switcher-bar">
        <div className="lp-switcher-container lp-preview-switcher-inner">
          <div className="lp-switcher-left">
            <span className="lp-switcher-label">Páginas:</span>
            <nav className="lp-switcher-pills" aria-label="Trocar entre as 4 páginas">
              {Object.values(LANDING_CTA_CONFIG.pages).map((lp, idx) => {
                const isActive = lp.id === pageKey;
                return (
                  <Link
                    key={lp.id}
                    to={lp.shortRoute}
                    className={`lp-switcher-pill ${isActive ? 'active' : ''}`}
                  >
                    <span className="lp-pill-num">0{idx + 1}</span>
                    <span className="lp-pill-text">
                      {idx === 0
                        ? 'Sua História'
                        : idx === 1
                          ? 'Suas Lembranças'
                          : idx === 2
                            ? 'Suas Ideias'
                            : 'Desafio Rápido'}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Botão para ver como fica no Computador ou no Celular (390px) */}
          <div className="lp-viewport-toggle-group" role="group" aria-label="Formato da tela">
            <button
              type="button"
              onClick={() => handleChangeViewport('desktop')}
              className={`lp-viewport-btn ${!isMobileSim ? 'active' : ''}`}
              title="Ver em tela de computador"
            >
              <Monitor size={13} />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => handleChangeViewport('mobile')}
              className={`lp-viewport-btn ${isMobileSim ? 'active' : ''}`}
              title="Ver em tela de celular (390px)"
            >
              <Smartphone size={13} />
              <span>Mobile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Moldura que mostra a página inteira ou dentro da tela de celular */}
      <div className={`lp-device-frame ${isMobileSim ? 'is-mobile-device' : ''}`}>
        {isMobileSim && (
          <div className="lp-phone-notch-bar" aria-hidden="true">
            <span className="lp-phone-time">9:41</span>
            <div className="lp-phone-dynamic-island" />
            <span className="lp-phone-battery">5G · 100%</span>
          </div>
        )}

        <div
          className={`lp-shell lp-theme-${pageKey} ${
            isMobileSim ? 'lp-mobile-view' : ''
          }`}
        >
          {/* Topo da página */}
          <header className="lp-shared-header">
            <div className="lp-container lp-header-inner">
              <Link to={LANDING_CTA_CONFIG.brand.appHomeUrl} className="lp-wordmark">
                coautoria<span className="lp-wordmark-dot">.</span>
              </Link>

              <nav className="lp-header-center-nav" aria-label="Atalhos da página">
                <a href="#identificacao">COMEÇAR</a>
                <a href="#v-de-voar">V DE VOAR</a>
                <a href="#como-funciona">PASSO A PASSO</a>
              </nav>

              <div className="lp-header-actions">
                <ThemeToggle />
                <LandingCtaButton
                  pageKey={pageKey}
                  href={customCtaUrl}
                  variant="primary"
                  size="sm"
                  showArrow={false}
                >
                  {topCtaLabel}
                </LandingCtaButton>
              </div>
            </div>
          </header>

          {/* Conteúdo de cada página */}
          <main className="lp-main-content">{children}</main>

          {/* Rodapé simples e direto */}
          <footer className="lp-shared-footer">
            <div className="lp-container lp-footer-inner">
              <div className="lp-footer-brand-col">
                <Link to={LANDING_CTA_CONFIG.brand.appHomeUrl} className="lp-wordmark">
                  coautoria<span className="lp-wordmark-dot">.</span>
                </Link>
                <p className="lp-footer-manifesto">
                  Um lugar simples para lembrar, organizar e contar as suas histórias.
                </p>
              </div>

              <div className="lp-footer-links-col">
                <div className="lp-footer-group">
                  <span className="lp-footer-group-title">O que fazer aqui</span>
                  <Link to="/voar/voz">Jornada V de Voar</Link>
                  <Link to="/minhas-historias">Minhas Histórias</Link>
                  <Link to="/roda-de-historias">Roda de Histórias</Link>
                </div>

                <div className="lp-footer-group">
                  <span className="lp-footer-group-title">Páginas</span>
                  <Link to="/lp/1">01 · Sua História</Link>
                  <Link to="/lp/2">02 · Suas Lembranças</Link>
                  <Link to="/lp/3">03 · Suas Ideias</Link>
                  <Link to="/lp/4">04 · Desafio Rápido</Link>
                </div>

                <div className="lp-footer-group">
                  <span className="lp-footer-group-title">Sua Conta</span>
                  <Link to="/">Entrar na plataforma</Link>
                  <Link to="/termos">Termos e Privacidade</Link>
                </div>
              </div>
            </div>

            <div className="lp-container lp-footer-bottom">
              <span>© {new Date().getFullYear()} CoAutoria</span>
              <span className="lp-footer-coordinates">FEITO PARA LER NO CELULAR E NO COMPUTADOR</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
