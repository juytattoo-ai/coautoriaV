import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, EyeOff, FileText, Mic, Users, Trash2 } from 'lucide-react';
import './TermosDeUso.css';

export default function TermosDeUso() {
  const navigate = useNavigate();

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header flex justify-between items-center w-full">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
      </header>

      <main className="terms-content-wrapper">
        <div className="terms-header text-center mb-12">
          <Shield size={48} className="text-primary mx-auto mb-4" />
          <h1 className="page-title">Termos de Uso, Privacidade e Diretrizes da Comunidade</h1>
          <p className="page-subtitle">
            Transparência, segurança e respeito absoluto pela sua história (Em conformidade com a LGPD — Lei nº 13.709/2018).
          </p>
        </div>

        <div className="terms-card">
          <section className="terms-section">
            <h2 className="flex items-center gap-2"><Lock size={20} className="text-primary"/> 1. Confidencialidade por Padrão e Visibilidade Opcional</h2>
            <p>
              Todo o conteúdo que você escreve, grava ou envia dentro da jornada do <strong>Método V.O.A.R.</strong> (Passos 1 a 9) e no seu acervo pessoal (<strong>Minhas Histórias</strong>) é <strong>100% privado e confidencial por padrão</strong>. Seus textos, linha do tempo, mapa de vida, espelho de padrões e cartas manuscritas pertencem exclusivamente a você e são protegidos por políticas de isolamento de linha (Row Level Security).
            </p>
            <p className="mt-2">
              Suas histórias só ficam visíveis para outros membros da comunidade se você escolher ativamente a opção <strong>"Público na Roda de Histórias"</strong> ou <strong>"Anonimamente"</strong> ao salvar ou compartilhar um relato. Você pode reverter qualquer história para o modo <strong>Privado</strong> ou excluí-la a qualquer momento.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="flex items-center gap-2"><EyeOff size={20} className="text-primary"/> 2. Dados Coletados e Finalidade</h2>
            <p>
              Coletamos apenas os dados estritamente necessários para identificar sua conta e sincronizar sua jornada com segurança:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-secondary">
              <li><strong>Dados de Cadastro:</strong> Nome, endereço de e-mail e telefone/WhatsApp (opcional) para autenticação, recuperação de acesso e suporte.</li>
              <li><strong>Conteúdo Autoral:</strong> Textos, reflexões, gravações de voz e fotos de cartas manuscritas inseridos voluntariamente por você nos exercícios do aplicativo.</li>
            </ul>
            <p className="mt-2">
              Seus dados pessoais <strong>jamais são vendidos ou comercializados</strong> com terceiros ou redes de publicidade.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="flex items-center gap-2"><Mic size={20} className="text-primary"/> 3. Permissões do Dispositivo (Câmera, Fotos e Microfone)</h2>
            <p>
              Para oferecer uma experiência completa de registro de memórias, o aplicativo pode solicitar acesso a recursos do seu aparelho somente quando você acionar essas funções:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-secondary">
              <li><strong>Microfone:</strong> Utilizado exclusivamente quando você escolhe gravar uma história narrada em áudio em <em>Minhas Histórias</em>.</li>
              <li><strong>Câmera e Galeria de Fotos:</strong> Utilizadas exclusivamente quando você escolhe fotografar ou anexar a imagem de suas cartas manuscritas (Passos 5 e 9 ou <em>Minhas Histórias</em>).</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2 className="flex items-center gap-2"><Users size={20} className="text-primary"/> 4. Regras de Convivência e Moderação na Roda de Histórias (UGC)</h2>
            <p>
              A <strong>Roda de Histórias</strong> é um espaço de acolhimento, empatia e respeito mútuo. Ao publicar um relato ou comentário, você concorda que <strong>não é permitido</strong> publicar conteúdos que contenham:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-secondary">
              <li>Discurso de ódio, discriminação, racismo, homofobia, xenofobia ou intolerância de qualquer natureza;</li>
              <li>Assédio, intimidação, difamação ou exposição de dados privados de terceiros;</li>
              <li>Conteúdo sexualmente explícito, pornográfico, violento ou que incentive autolesão;</li>
              <li>Spam, golpes, propaganda comercial não autorizada ou links maliciosos.</li>
            </ul>
            <p className="mt-2">
              <strong>Ferramentas de Segurança:</strong> Todos os usuários contam com botões de <strong>Denunciar Publicação/Comentário</strong> e <strong>Bloquear Autor</strong> diretamente no feed. Conteúdos denunciados são ocultados imediatamente para o denunciante e revisados pela equipe de moderação em até 24 horas, podendo resultar na remoção do conteúdo e banimento da conta infratora.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="flex items-center gap-2"><FileText size={20} className="text-primary"/> 5. Natureza do Método (Aviso Importante)</h2>
            <p>
              O CoAutoria e o Método V.O.A.R. são ferramentas de desenvolvimento pessoal, escrita expressiva e organização narrativa (storytelling). O aplicativo <strong>não substitui acompanhamento psicológico, psiquiátrico ou médico profissional</strong>. Caso esteja vivenciando sofrimento emocional agudo, procure apoio especializado (no Brasil, o CVV atende gratuitamente pelo telefone 188, 24 horas por dia).
            </p>
          </section>

          <section className="terms-section">
            <h2 className="flex items-center gap-2"><Trash2 size={20} className="text-primary"/> 6. Exclusão Permanente de Conta e Dados (LGPD)</h2>
            <p>
              Você tem controle integral sobre a sua conta e pode exercer seu direito de exclusão definitiva a qualquer momento:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-secondary">
              <li><strong>Pelo Aplicativo (Exclusão Imediata):</strong> Acesse a aba <strong>Perfil</strong>, role até a seção <em>"Exclusão Permanente da Conta"</em>, clique em <strong>Excluir Conta</strong> e digite <code>EXCLUIR</code> para confirmar.</li>
              <li><strong>O que é apagado:</strong> Todos os seus textos, notas, eventos da linha do tempo, mapa de vida, cartas manuscritas, arquivos de áudio armazenados no servidor, histórias publicadas e credenciais de login são removidos de forma imediata e irreversível.</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
