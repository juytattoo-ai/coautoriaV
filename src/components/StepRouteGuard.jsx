import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserVoarProgress } from '../lib/userProgress';

/**
 * StepRouteGuard garante que:
 * 1. O usuário precisa estar logado para acessar os passos 2 em diante.
 * 2. O usuário só pode acessar um passo se já tiver concluído todos os anteriores.
 * Se tentar burlar via URL direta, ele é redirecionado para a etapa pendente atual.
 */
export default function StepRouteGuard({ stepNumber, children }) {
  const { user, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [canAccess, setCanAccess] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/passo-1');

  useEffect(() => {
    async function verifyAccess() {
      if (authLoading) return;

      // Se não estiver logado, não pode acessar nenhum passo além do passo 1
      if (!user) {
        setCanAccess(false);
        setRedirectPath('/passo-1');
        setChecking(false);
        return;
      }

      // Passo 1 é sempre acessível para quem está logado
      if (stepNumber === 1) {
        setCanAccess(true);
        setChecking(false);
        return;
      }

      try {
        const progress = await getUserVoarProgress(user.id);
        
        // Pode acessar se o passo já estiver desbloqueado (menor ou igual ao passo atual)
        if (stepNumber <= progress.currentStepId) {
          setCanAccess(true);
        } else {
          setCanAccess(false);
          setRedirectPath(progress.currentStepPath || '/passo-1');
        }
      } catch (err) {
        console.error('Erro ao verificar acesso ao passo:', err);
        setCanAccess(false);
        setRedirectPath('/passo-1');
      } finally {
        setChecking(false);
      }
    }

    verifyAccess();
  }, [user, authLoading, stepNumber]);

  if (authLoading || checking) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh] text-muted">
        <span>Verificando permissão de acesso à etapa...</span>
      </div>
    );
  }

  if (!canAccess) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
