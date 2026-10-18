import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, User, Phone } from 'lucide-react';
import './AuthForm.css';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: 'error', text: 'Por favor, digite seu e-mail acima primeiro.' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Supabase sends a reset link to the email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // You can specify a redirect URL here if needed, e.g., redirectTo: window.location.origin + '/reset-password'
      });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Link de recuperação enviado! Verifique seu e-mail.' });
      setIsResetting(false);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Erro ao tentar recuperar a senha.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isResetting) {
      return handleResetPassword(e);
    }

    if (!isLogin && !acceptTerms) {
      setMessage({ type: 'error', text: 'Você precisa aceitar os termos de uso para criar uma conta.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // User will be automatically set in AuthContext
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              whatsapp: whatsapp,
            }
          }
        });
        
        if (error) throw error;
        setMessage({ 
          type: 'success', 
          text: 'Conta criada! Você já pode entrar ou verifique seu e-mail se necessário.' 
        });
        setIsLogin(true); // Switch to login view
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Ocorreu um erro.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card animate-fade-in">
      <div className="auth-header">
        <h2 className="auth-title">
          {isResetting ? 'Recuperar Senha' : isLogin ? 'Bem-vindo de volta' : 'Criar Conta'}
        </h2>
        <p className="auth-subtitle">
          {isResetting 
            ? 'Digite seu e-mail abaixo para receber um link de redefinição.'
            : isLogin 
              ? 'Entre para continuar sua jornada de autoconhecimento.' 
              : 'Sua história é confidencial. Crie uma conta para proteger seus dados.'}
        </p>
      </div>

      {message.text && (
        <div className={`auth-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && !isResetting && (
          <>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                placeholder="Nome completo" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
              />
            </div>
            <div className="input-wrapper">
              <Phone size={18} className="input-icon" />
              <input 
                type="tel" 
                placeholder="WhatsApp (com DDD)" 
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required={!isLogin}
              />
            </div>
          </>
        )}

        <div className="input-wrapper">
          <Mail size={18} className="input-icon" />
          <input 
            type="email" 
            placeholder="Seu melhor e-mail" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {!isResetting && (
          <div className="input-wrapper">
            <Lock size={18} className="input-icon" />
            <input 
              type="password" 
              placeholder="Senha (mínimo 6 caracteres)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
        )}

        {!isLogin && !isResetting && (
          <div className="terms-checkbox-wrapper mt-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1"
                required
              />
              <span className="text-sm text-secondary">
                Eu concordo com os <a href="/termos" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Termos de Uso e Política de Privacidade</a> e aceito compartilhar meus dados para uso confidencial neste aplicativo.
              </span>
            </label>
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-full mt-4" disabled={loading}>
          {loading ? 'Aguarde...' : isResetting ? 'Enviar Link' : (isLogin ? 'Entrar' : 'Criar minha conta')}
        </button>
      </form>

      <div className="auth-footer mt-6 flex flex-col gap-3">
        {isLogin && !isResetting && (
          <button 
            className="btn-text text-sm" 
            onClick={() => {
              setIsResetting(true);
              setMessage({ type: '', text: '' });
            }}
            type="button"
          >
            Esqueceu sua senha?
          </button>
        )}
        
        <button 
          className="btn-text text-sm" 
          onClick={() => {
            setIsResetting(false);
            setIsLogin(!isLogin);
            setMessage({ type: '', text: '' });
          }}
          type="button"
        >
          {isLogin 
            ? 'Ainda não tem conta? Clique aqui para criar.' 
            : 'Já tem uma conta? Clique aqui para entrar.'}
        </button>
      </div>
    </div>
  );
}
