import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import LandingLayout, { LandingCtaButton } from '../components/LandingLayout';
import { LANDING_CTA_CONFIG } from '../landingConfig';

export default function LandingUpcomingPlaceholder({ pageKey = 'lp02', number = '02' }) {
  const config = LANDING_CTA_CONFIG.pages[pageKey] || LANDING_CTA_CONFIG.pages.lp02;

  return (
    <LandingLayout pageKey={pageKey}>
      <section style={{ padding: '5rem 0 6rem' }}>
        <div className="lp-container">
          <div
            style={{
              maxWidth: '680px',
              margin: '0 auto',
              backgroundColor: 'var(--bg-color-light)',
              border: '1px solid var(--border-color)',
              borderLeft: '3px solid var(--primary-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '2.75rem 2rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="lp-eyebrow-row">
              <span className="lp-eyebrow-index">LP {number}</span>
              <span className="lp-eyebrow-label">Estrutura Compartilhada Pronta</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)',
                marginBottom: '0.85rem',
              }}
            >
              Landing Page {number} · Pronta para receber o próximo briefing
            </h1>

            <p
              style={{
                fontSize: '0.98rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                marginBottom: '1.75rem',
              }}
            >
              Esta rota já compartilha o cabeçalho editorial, rodapé, tipografia, variáveis de
              cor e destinos de CTA configuráveis em{' '}
              <code>src/landing/landingConfig.js</code>. Assim que você enviar as
              especificações da Landing Page {number}, ela será implementada aqui mantendo sua
              identidade e animações próprias.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
              <Link to="/lp/1" className="lp-cta-btn lp-cta-outline lp-cta-md">
                <ArrowLeft size={16} />
                <span>Ver Landing Page 01</span>
              </Link>

              <LandingCtaButton pageKey={pageKey} variant="primary" size="md">
                Testar CTA Configurável ({config.primaryCtaUrl})
              </LandingCtaButton>
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}

