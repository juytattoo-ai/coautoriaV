import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import './TriggerWarning.css';

export default function TriggerWarning() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="trigger-warning-container animate-fade-in">
      <div className="trigger-icon-wrapper">
        <AlertTriangle size={24} className="trigger-icon" />
      </div>
      <div className="trigger-content">
        <h4 className="trigger-title">Aviso de Gatilho Emocional</h4>
        <p className="trigger-text">
          Esta jornada de autoconhecimento pode acessar memórias profundas e gerar fortes emoções. 
          Se você sentir desconforto intenso ou precisar de apoio, recomendamos pausar a atividade e 
          <strong> buscar ajuda médica ou psicológica profissional</strong>. Cuide de você em primeiro lugar.
        </p>
      </div>
      <button 
        className="trigger-close-btn" 
        onClick={() => setIsVisible(false)}
        aria-label="Fechar aviso"
      >
        <X size={20} />
      </button>
    </div>
  );
}
