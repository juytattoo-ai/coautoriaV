import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AppLayout from './components/AppLayout';
import Onboarding from './components/Onboarding';
import Hub from './pages/Hub';
import MetodoVoar from './pages/MetodoVoar';
import MinhasHistorias from './pages/MinhasHistorias';
import RodaHistorias from './pages/RodaHistorias';
import Novidades from './pages/Novidades';
import Perfil from './pages/Perfil';
import Home from './pages/Home';
import StepRouteGuard from './components/StepRouteGuard';

// Landing Pages (Estrutura Compartilhada)
import Landing01DescubraSuaHistoria from './landing/pages/Landing01DescubraSuaHistoria';
import Landing02DescubraPorTrasDeVoce from './landing/pages/Landing02DescubraPorTrasDeVoce';
import Landing03IdeiasBlocoDeNotas from './landing/pages/Landing03IdeiasBlocoDeNotas';
import Landing04DesafioStorytelling from './landing/pages/Landing04DesafioStorytelling';

// Passos do Método VOAR (Módulo Voz)
import Step1Convite from './pages/Step1Convite';
import Step2BlocoMagico from './pages/Step2BlocoMagico';
import Step3LinhaDoTempo from './pages/Step3LinhaDoTempo';
import Step4MapaDeVida from './pages/Step4MapaDeVida';
import Step5Carta from './pages/Step5Carta';
import Step6OEspelho from './pages/Step6OEspelho';
import Step7Proposito from './pages/Step7Proposito';
import Step8BancoHistorias from './pages/Step8BancoHistorias';
import Step9CartaFuturo from './pages/Step9CartaFuturo';
import Conclusao from './pages/Conclusao';
import TermosDeUso from './pages/TermosDeUso';

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  const [guestDismissed, setGuestDismissed] = useState(false);
  const [manualReplay, setManualReplay] = useState(false);

  const isLandingRoute = location.pathname.startsWith('/lp');

  // Sempre que o usuário conectar a conta, garante que o onboarding automático não apareça.
  // Se desconectar depois, volta a exibir para visitante deslogado.
  useEffect(() => {
    if (user) {
      setGuestDismissed(true);
    } else {
      setGuestDismissed(false);
    }
  }, [user]);

  const showOnboarding = !isLandingRoute && ((!user && !guestDismissed) || manualReplay);

  const handleCompleteOnboarding = () => {
    setGuestDismissed(true);
    setManualReplay(false);
  };

  // Se estiver em uma das 4 Landing Pages (/lp/*), renderiza com o LandingLayout próprio
  if (isLandingRoute) {
    return (
      <Routes>
        <Route path="/lp" element={<Navigate to="/lp/1" replace />} />
        <Route path="/lp/1" element={<Landing01DescubraSuaHistoria />} />
        <Route path="/lp/voce-tem-uma-historia" element={<Landing01DescubraSuaHistoria />} />
        <Route path="/lp/2" element={<Landing02DescubraPorTrasDeVoce />} />
        <Route
          path="/lp/descubra-o-que-existe-por-tras-de-voce"
          element={<Landing02DescubraPorTrasDeVoce />}
        />
        <Route path="/lp/3" element={<Landing03IdeiasBlocoDeNotas />} />
        <Route
          path="/lp/suas-ideias-nao-precisam-morrer-no-bloco-de-notas"
          element={<Landing03IdeiasBlocoDeNotas />}
        />
        <Route path="/lp/4" element={<Landing04DesafioStorytelling />} />
        <Route
          path="/lp/voce-consegue-contar-essa-historia"
          element={<Landing04DesafioStorytelling />}
        />
      </Routes>
    );
  }

  return (
    <>
      {showOnboarding && (
        <Onboarding onComplete={handleCompleteOnboarding} />
      )}
      <AppLayout>
        <Routes>
          {/* Rota /onboarding */}
          <Route
            path="/onboarding"
            element={
              user && !manualReplay ? (
                <Navigate to="/" replace />
              ) : (
                <Onboarding onComplete={handleCompleteOnboarding} />
              )
            }
          />

          {/* Hub Inicial */}
          <Route path="/" element={<Hub />} />

            {/* Módulos & Recursos Principais */}
            <Route path="/voar" element={<MetodoVoar />} />
            <Route path="/voar/voz" element={<Home />} />
            <Route path="/minhas-historias" element={<MinhasHistorias />} />
            <Route path="/roda-de-historias" element={<RodaHistorias />} />
            <Route path="/novidades" element={<Novidades />} />
            <Route path="/perfil" element={<Perfil onReplayOnboarding={() => setManualReplay(true)} />} />

            {/* Passos do Módulo Voz protegidos sequencialmente */}
            <Route path="/passo-1" element={<Step1Convite />} />
            <Route 
              path="/passo-2" 
              element={
                <StepRouteGuard stepNumber={2}>
                  <Step2BlocoMagico />
                </StepRouteGuard>
              } 
            />
            <Route 
              path="/passo-3" 
              element={
                <StepRouteGuard stepNumber={3}>
                  <Step3LinhaDoTempo />
                </StepRouteGuard>
              } 
            />
            <Route 
              path="/passo-4" 
              element={
                <StepRouteGuard stepNumber={4}>
                  <Step4MapaDeVida />
                </StepRouteGuard>
              } 
            />
            <Route 
              path="/passo-5" 
              element={
                <StepRouteGuard stepNumber={5}>
                  <Step5Carta />
                </StepRouteGuard>
              } 
            />
            <Route 
              path="/passo-6" 
              element={
                <StepRouteGuard stepNumber={6}>
                  <Step6OEspelho />
                </StepRouteGuard>
              } 
            />
            <Route 
              path="/passo-7" 
              element={
                <StepRouteGuard stepNumber={7}>
                  <Step7Proposito />
                </StepRouteGuard>
              } 
            />
            <Route 
              path="/passo-8" 
              element={
                <StepRouteGuard stepNumber={8}>
                  <Step8BancoHistorias />
                </StepRouteGuard>
              } 
            />
            <Route 
              path="/passo-9" 
              element={
                <StepRouteGuard stepNumber={9}>
                  <Step9CartaFuturo />
                </StepRouteGuard>
              } 
            />
            <Route 
              path="/conclusao" 
              element={
                <StepRouteGuard stepNumber={10}>
                  <Conclusao />
                </StepRouteGuard>
              } 
            />
            <Route path="/termos" element={<TermosDeUso />} />
          </Routes>
        </AppLayout>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
