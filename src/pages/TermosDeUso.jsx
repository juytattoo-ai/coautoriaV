import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermosDeUso() {
  const navigate = useNavigate();

  return (
    <div className="page-container animate-fade-in" style={{ padding: '2rem 1rem' }}>
      <header className="page-header" style={{ maxWidth: '800px', margin: '0 auto 2rem auto' }}>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--bg-color-light)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <h1 className="page-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>Termos de Uso e Política de Privacidade</h1>
        
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
          <p className="mb-4"><strong>Última atualização: Setembro de 2026</strong></p>
          
          <h2 className="text-lg font-semibold text-primary mt-6 mb-2">1. Confidencialidade</h2>
          <p className="mb-4">
            Toda e qualquer história, relato, emoção, anotação ou arquivo enviado por você dentro deste aplicativo (Módulo Voz) é estritamente <strong>confidencial</strong> e protegido por autenticação. Somente você, logado em sua conta, possui autorização para acessar, ler ou modificar os próprios dados.
          </p>

          <h2 className="text-lg font-semibold text-primary mt-6 mb-2">2. Uso dos Dados</h2>
          <p className="mb-4">
            Seus dados são armazenados de forma segura e não serão compartilhados, vendidos, alugados ou tornados públicos sob nenhuma hipótese. O aplicativo atua apenas como uma ferramenta pessoal para auxiliar na sua autodescoberta e estruturação da sua mensagem.
          </p>

          <h2 className="text-lg font-semibold text-primary mt-6 mb-2">3. Responsabilidade</h2>
          <p className="mb-4">
            O preenchimento e reflexões aqui contidos são exercícios autobiográficos e emocionais. O aplicativo não substitui acompanhamento psicológico profissional, caso você sinta necessidade ao revisitar eventos passados.
          </p>

          <h2 className="text-lg font-semibold text-primary mt-6 mb-2">4. Exclusão de Conta</h2>
          <p className="mb-4">
            Você é proprietário integral das suas histórias. Caso decida encerrar sua jornada e excluir permanentemente todos os seus dados dos nossos servidores, você poderá solicitar a exclusão total da conta a qualquer momento.
          </p>
        </div>
      </main>
    </div>
  );
}
