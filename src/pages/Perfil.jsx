import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Trash2, 
  ShieldCheck, 
  CheckCircle, 
  Save, 
  Camera, 
  LogOut,
  AlertTriangle,
  Award
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { getUserVoarProgress, STEPS_METADATA } from '../lib/userProgress';
import AuthForm from '../components/AuthForm';
import './Perfil.css';

export default function Perfil() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Form profile
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Progress stats
  const [progressData, setProgressData] = useState({
    completedSteps: {},
    percentage: 0
  });

  // Modal de Exclusão Permanente
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
      setWhatsapp(user.user_metadata?.whatsapp || '');
      setPhotoUrl(user.user_metadata?.avatar_url || '');
      getUserVoarProgress(user.id).then(setProgressData);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      // 1. Atualizar dados do usuário (metadados e email se modificado)
      const updates = {
        data: {
          full_name: fullName,
          whatsapp: whatsapp,
          avatar_url: photoUrl
        }
      };

      if (email !== user.email) {
        updates.email = email;
      }

      if (newPassword.trim().length >= 6) {
        updates.password = newPassword.trim();
      }

      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;

      setStatusMsg({ 
        type: 'success', 
        text: 'Dados atualizados com sucesso!' + (newPassword ? ' Senha alterada.' : '') 
      });
      setNewPassword('');
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: err.message || 'Erro ao atualizar dados.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleDeleteAccountPermanently = async () => {
    if (confirmDeleteText !== 'EXCLUIR') {
      alert('Por favor, digite a palavra EXCLUIR para confirmar.');
      return;
    }

    try {
      setLoading(true);
      // Apagar registros do usuário nas tabelas principais
      await Promise.all([
        supabase.from('commitments').delete().eq('user_id', user.id),
        supabase.from('step1_reflections').delete().eq('user_id', user.id),
        supabase.from('notes').delete().eq('user_id', user.id),
        supabase.from('timeline_events').delete().eq('user_id', user.id),
        supabase.from('life_chapters').delete().eq('user_id', user.id),
        supabase.from('past_letters').delete().eq('user_id', user.id),
        supabase.from('mirror_reflections').delete().eq('user_id', user.id),
        supabase.from('purpose_statement').delete().eq('user_id', user.id),
        supabase.from('raw_stories').delete().eq('user_id', user.id),
        supabase.from('future_letters').delete().eq('user_id', user.id),
        supabase.from('user_stories').delete().eq('user_id', user.id)
      ]);

      // Limpar localStorage
      localStorage.clear();

      // Sign out
      await supabase.auth.signOut();
      alert('Sua conta e todos os seus dados foram permanentemente excluídos do Coautoria.');
      window.location.href = '/';
    } catch (err) {
      console.error('Erro ao excluir conta:', err);
      alert('Não foi possível excluir automaticamente todos os registros no servidor. Desconectando sua sessão.');
      await supabase.auth.signOut();
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="perfil-page animate-fade-in">
        <header className="perfil-header text-center">
          <h1 className="page-heading">Acesse seu Perfil</h1>
          <p className="page-sub">Faça login ou crie sua conta para gerenciar seus dados e progresso.</p>
        </header>
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="perfil-page animate-fade-in">
      <header className="perfil-header">
        <div className="flex items-center justify-between">
          <div>
            <span className="page-tag">CONFIGURAÇÕES DE CONTA</span>
            <h1 className="page-heading">Meu Perfil</h1>
            <p className="page-sub">Gerencie suas informações, segurança e acompanhe seu progresso.</p>
          </div>
          <button className="btn-logout flex items-center gap-1.5" onClick={handleLogout}>
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      {statusMsg.text && (
        <div className={`status-banner ${statusMsg.type} mb-6`}>
          {statusMsg.text}
        </div>
      )}

      {/* 1. Barra Geral de Progresso dos Métodos */}
      <section className="perfil-progress-card mb-6">
        <div className="progress-card-header flex items-center justify-between mb-2">
          <h3 className="progress-card-title flex items-center gap-2">
            <Award size={20} className="text-primary" /> Progresso do Método V.O.A.R.
          </h3>
          <span className="progress-percentage-pill">{progressData.percentage}%</span>
        </div>
        <p className="text-xs text-secondary mb-3">
          Módulo Voz: {Object.keys(progressData.completedSteps).length} de 9 etapas completadas.
        </p>
        
        <div className="general-progress-track mb-4">
          <div className="general-progress-fill" style={{ width: `${progressData.percentage}%` }}></div>
        </div>

        {/* Progresso detalhado de cada uma das 9 etapas */}
        <div className="steps-progress-grid">
          {STEPS_METADATA.slice(0, 9).map(step => {
            const isDone = !!progressData.completedSteps[step.id];
            return (
              <div key={step.id} className={`step-stat-item ${isDone ? 'done' : 'pending'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="step-stat-name">0{step.id} - {step.title}</span>
                  {isDone ? (
                    <CheckCircle size={14} className="text-success" />
                  ) : (
                    <span className="step-stat-status">Pendente</span>
                  )}
                </div>
                <div className="step-mini-bar">
                  <div className={`step-mini-fill ${isDone ? 'fill-full' : ''}`}></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Formulário de Dados Pessoais & Senha */}
      <form onSubmit={handleUpdateProfile} className="perfil-form-card mb-6">
        <h3 className="section-title mb-4">Dados Cadastrais</h3>

        <div className="avatar-edit-row mb-4 flex items-center gap-4">
          <div className="perfil-avatar-circle">
            {photoUrl ? (
              <img src={photoUrl} alt="Avatar" className="avatar-img" />
            ) : (
              <span>{fullName?.charAt(0) || user.email?.charAt(0) || 'U'}</span>
            )}
          </div>
          <div className="flex-1">
            <label className="text-xs text-secondary font-medium block mb-1">URL da Foto de Perfil</label>
            <input 
              type="url"
              placeholder="https://exemplo.com/minha-foto.jpg"
              value={photoUrl}
              onChange={e => setPhotoUrl(e.target.value)}
              className="perfil-input"
            />
          </div>
        </div>

        <div className="input-row mb-3">
          <label className="input-label flex items-center gap-1.5">
            <User size={15} /> Nome Completo
          </label>
          <input 
            type="text"
            className="perfil-input"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="input-row mb-3">
          <label className="input-label flex items-center gap-1.5">
            <Mail size={15} /> E-mail
          </label>
          <input 
            type="email"
            className="perfil-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-row mb-3">
          <label className="input-label flex items-center gap-1.5">
            <Phone size={15} /> WhatsApp
          </label>
          <input 
            type="tel"
            className="perfil-input"
            placeholder="(00) 00000-0000"
            value={whatsapp}
            onChange={e => setWhatsapp(e.target.value)}
          />
        </div>

        <div className="input-row mb-5">
          <label className="input-label flex items-center gap-1.5">
            <Lock size={15} /> Nova Senha (opcional)
          </label>
          <input 
            type="password"
            className="perfil-input"
            placeholder="Deixe em branco para manter a atual"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          <Save size={18} /> {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>

      {/* 3. Privacidade & Aviso Legal LGPD */}
      <section className="lgpd-notice-card mb-6">
        <div className="flex items-start gap-3">
          <ShieldCheck size={26} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="lgpd-title font-semibold mb-1">Aviso sobre a LGPD e Confidencialidade</h4>
            <p className="text-xs text-secondary leading-relaxed">
              Em total conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD)</strong>, 
              suas memórias, gravações de áudio e relatos íntimos permanecem estritamente sob sua titularidade. 
              Garantimos criptografia e sigilo absoluto. Suas histórias só se tornam visíveis para outras pessoas se você 
              optar explicitamente por enviá-las para a Roda de Histórias, onde passam previamente por moderação preventiva.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Exclusão Permanente de Conta */}
      <section className="danger-zone-card">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="danger-title text-danger font-semibold">Exclusão Permanente da Conta</h4>
            <p className="text-xs text-secondary">
              Exclui definitivamente todos os seus textos, áudios, reflexões e acessos.
            </p>
          </div>
          <button 
            type="button" 
            className="btn-danger-outline flex items-center gap-1.5"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={16} /> Excluir Conta
          </button>
        </div>
      </section>

      {/* Modal de confirmação da exclusão */}
      {showDeleteModal && (
        <div className="modal-backdrop" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-sheet-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="sheet-header">
              <div className="flex items-center gap-2 text-danger">
                <AlertTriangle size={24} />
                <h3 className="sheet-title">Atenção: Exclusão Irreversível</h3>
              </div>
              <button className="sheet-close-btn" onClick={() => setShowDeleteModal(false)}>✕</button>
            </div>

            <p className="text-sm text-secondary mb-4 leading-relaxed">
              Esta ação <strong>apagará permanentemente</strong> todo o seu histórico no Coautoria, incluindo o Termo de Compromisso, Linha do Tempo, Mapa de Vida, Cartas ao Passado/Futuro e Acervo de Histórias. Não será possível recuperar esses dados.
            </p>

            <div className="sheet-input-group mb-4">
              <label className="sheet-label">Para confirmar, digite <strong>EXCLUIR</strong> abaixo:</label>
              <input 
                type="text" 
                className="sheet-input"
                placeholder="EXCLUIR"
                value={confirmDeleteText}
                onChange={e => setConfirmDeleteText(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <button className="btn-text font-medium" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
              <button 
                className="btn-delete-final"
                disabled={confirmDeleteText !== 'EXCLUIR' || loading}
                onClick={handleDeleteAccountPermanently}
              >
                {loading ? 'Excluindo...' : 'Confirmar Exclusão Permanente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
