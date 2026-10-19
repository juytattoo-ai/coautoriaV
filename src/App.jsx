import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AppLayout from './components/AppLayout';
import Hub from './pages/Hub';
import MetodoVoar from './pages/MetodoVoar';
import MinhasHistorias from './pages/MinhasHistorias';
import RodaHistorias from './pages/RodaHistorias';
import Novidades from './pages/Novidades';
import Perfil from './pages/Perfil';
import Home from './pages/Home';
import StepRouteGuard from './components/StepRouteGuard';

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

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppLayout>
          <Routes>
            {/* Hub Inicial */}
            <Route path="/" element={<Hub />} />

            {/* Módulos & Recursos Principais */}
            <Route path="/voar" element={<MetodoVoar />} />
            <Route path="/voar/voz" element={<Home />} />
            <Route path="/minhas-historias" element={<MinhasHistorias />} />
            <Route path="/roda-de-historias" element={<RodaHistorias />} />
            <Route path="/novidades" element={<Novidades />} />
            <Route path="/perfil" element={<Perfil />} />

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
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
