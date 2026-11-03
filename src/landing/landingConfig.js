/**
 * Configuração Centralizada das Landing Pages do CoAutoria
 * ----------------------------------------------------------------------------
 * Altere os destinos dos CTAs abaixo (ou via variáveis de ambiente VITE_*)
 * para redirecionar todos os botões das 4 Landing Pages
 * sem precisar editar o código de cada página.
 */

export const LANDING_CTA_CONFIG = {
  // Destino principal padrão (entrada do V de Voar)
  defaultPrimaryDestination:
    import.meta.env.VITE_LANDING_CTA_PRIMARY_URL || '/voar/voz',

  // Destinos específicos por página (podem apontar para rotas internas ou URLs externas)
  pages: {
    lp01: {
      id: 'lp01',
      slug: '/lp/voce-tem-uma-historia',
      shortRoute: '/lp/1',
      title: 'Você tem uma história para contar',
      focus: 'Sua história · Comece pelo V de Voar',
      status: 'active',
      primaryCtaUrl:
        import.meta.env.VITE_LP01_CTA_URL || '/voar/voz',
      secondaryCtaUrl: '#como-funciona',
      headerCtaLabel: 'Começar no V de Voar',
    },
    lp02: {
      id: 'lp02',
      slug: '/lp/descubra-o-que-existe-por-tras-de-voce',
      shortRoute: '/lp/2',
      title: 'Descubra o que existe por trás de você',
      focus: 'Suas lembranças e o que elas mostram sobre você',
      status: 'active',
      primaryCtaUrl:
        import.meta.env.VITE_LP02_CTA_URL || '/voar/voz',
      secondaryCtaUrl: '#perguntas',
      headerCtaLabel: 'Começar a descobrir',
    },
    lp03: {
      id: 'lp03',
      slug: '/lp/suas-ideias-nao-precisam-morrer-no-bloco-de-notas',
      shortRoute: '/lp/3',
      title: 'Suas ideias não precisam morrer no bloco de notas',
      focus: 'Tire suas ideias do papel e monte sua história',
      status: 'active',
      primaryCtaUrl:
        import.meta.env.VITE_LP03_CTA_URL || '/minhas-historias',
      secondaryCtaUrl: '#do-pensamento-a-criacao',
      headerCtaLabel: 'Tirar ideias do papel',
    },
    lp04: {
      id: 'lp04',
      slug: '/lp/voce-consegue-contar-essa-historia',
      shortRoute: '/lp/4',
      title: 'Você consegue contar essa história?',
      focus: 'Desafio rápido · Veja como você conta uma história',
      status: 'active',
      primaryCtaUrl:
        import.meta.env.VITE_LP04_CTA_URL || '/voar/voz',
      secondaryCtaUrl: '#desafio-interativo',
      headerCtaLabel: 'Começar agora',
    },
  },

  // Links gerais do cabeçalho e rodapé
  brand: {
    name: 'CoAutoria',
    tagline: 'Um lugar simples para lembrar, organizar e contar as suas histórias.',
    appHomeUrl: '/',
    voarUrl: '/voar',
    termsUrl: '/termos',
  },
};

/**
 * Descobre para qual link o botão deve levar.
 * Também aceita ?cta_url=/caminho ou ?destino=/caminho no endereço da página.
 */
export function resolveLandingCtaUrl(pageKey = 'lp01', customOverride) {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const queryCta = params.get('cta_url') || params.get('destino');
    if (queryCta) return queryCta;
  }

  if (customOverride) return customOverride;

  const pageConfig = LANDING_CTA_CONFIG.pages[pageKey];
  return (
    pageConfig?.primaryCtaUrl || LANDING_CTA_CONFIG.defaultPrimaryDestination
  );
}
