import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Camera, UploadCloud, CheckCircle, CheckSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import './Step9CartaFuturo.css';

const CHECKLIST_ITEMS = [
  { id: 'theme', label: 'Tenho o meu tema central definido' },
  { id: 'purpose', label: 'Tenho a minha Declaração de Propósito' },
  { id: 'stories', label: 'Tenho pelo menos 5 micro-histórias no Banco de Histórias' },
  { id: 'patterns', label: 'Compreendo os meus padrões emocionais e crenças' },
  { id: 'past_letter', label: 'Escrevi a Carta ao Meu Eu do Passado' }
];

export default function Step9CartaFuturo() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [checklist, setChecklist] = useState({
    theme: false,
    purpose: false,
    stories: false,
    patterns: false,
    past_letter: false
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('future_letters')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        if (data.checklist) setChecklist(data.checklist);
        if (data.image_url) {
          setPreview(data.image_url);
          setIsSaved(true);
        }
      }
    } catch (err) {
      console.error("Erro ao buscar dados do passo 9:", err);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setIsSaved(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleChecklistChange = (id) => {
    setChecklist(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    setIsSaved(false); // require save again
  };

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);

    try {
      let finalImageUrl = preview;

      // Se houver um novo arquivo para subir
      if (file && !isSaved) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-future-${Date.now()}.${fileExt}`;
        const filePath = `letters/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('letters')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('letters')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }

      // Salva no banco de dados
      const { error: dbError } = await supabase
        .from('future_letters')
        .upsert({
          user_id: user.id,
          image_url: finalImageUrl,
          checklist: checklist,
          updated_at: new Date()
        }, { onConflict: 'user_id' });

      if (dbError) throw dbError;

      setIsSaved(true);
      navigate('/conclusao');

    } catch (err) {
      alert("Erro ao salvar. Verifique se a tabela 'future_letters' existe no Supabase.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const allChecked = Object.values(checklist).every(Boolean);

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header flex justify-between items-center w-full">
        <div className="flex gap-4">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            <span>Início</span>
          </button>
          <button className="back-btn" onClick={() => navigate('/passo-8')}>
            <ArrowLeft size={20} />
            <span>Voltar ao Passo 8</span>
          </button>
        </div>
      </header>

      <main className="step-content-wrapper">
        <span className="step-badge">PASSO 9 DE 9</span>
        <h1 className="page-title" style={{textAlign: 'left', marginTop: '1rem'}}>Carta ao Futuro Contador de Histórias</h1>
        <p className="page-subtitle" style={{textAlign: 'left', marginBottom: '2rem'}}>
          Sele o compromisso, celebre as suas descobertas e prepare-se para o próximo módulo.
        </p>

        {/* Instruções */}
        <div className="instructions-card mb-8">
          <h2 className="instructions-title flex items-center gap-2">
            <Edit3 size={20} className="text-primary"/> Instruções
          </h2>
          
          <ol className="instructions-list">
            <li>
              <span className="step-num">1</span>
              <p>Pegue <strong>papel e caneta</strong>.</p>
            </li>
            <li>
              <span className="step-num">2</span>
              <p>Escreva uma carta celebrando as suas descobertas ao longo desta jornada.</p>
            </li>
            <li>
              <span className="step-num">3</span>
              <p>Declare o que você quer que aconteça quando compartilhar a sua mensagem com o mundo.</p>
            </li>
            <li>
              <span className="step-num">4</span>
              <p>Finalize com a frase:</p>
            </li>
          </ol>

          <div className="handwriting-notice mt-6">
            <p className="italic font-serif font-semibold text-lg text-primary">"Minha história importa. Minha voz importa. E eu vou compartilhá-la."</p>
          </div>
        </div>

        {/* Upload Área */}
        <div className="upload-card mb-8">
          <h2 className="instructions-title flex items-center gap-2 mb-4">
            <Camera size={20} className="text-primary"/> Foto da Carta
          </h2>

          <div 
            className={`upload-dropzone ${preview ? 'has-image' : ''}`}
            onClick={(!isSaved || file) ? handleUploadClick : undefined} // Allow click to change file before save
          >
            {preview ? (
              <img src={preview} alt="Pré-visualização da carta" className="preview-image" />
            ) : (
              <div className="upload-placeholder">
                <Camera size={32} className="mb-2 text-muted" />
                <span className="font-medium text-primary">Clique para enviar a foto da sua carta</span>
                <span className="text-sm text-secondary">JPG, PNG ou HEIC</span>
              </div>
            )}
            
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileSelect}
            />
          </div>
          
          {preview && !isSaved && file && (
            <div className="flex justify-start items-center mt-4">
              <button className="btn-text text-sm text-danger" onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}>
                Remover foto
              </button>
            </div>
          )}
        </div>

        {/* Checklist */}
        <div className="checklist-card mb-12">
          <h2 className="instructions-title flex items-center gap-2 mb-6">
            <CheckSquare size={20} className="text-primary"/> Checklist de Encerramento
          </h2>

          <div className="checklist-items">
            {CHECKLIST_ITEMS.map((item) => (
              <label key={item.id} className="checklist-item">
                <div className="checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    checked={checklist[item.id]} 
                    onChange={() => handleChecklistChange(item.id)}
                  />
                  <span className="checkmark"></span>
                </div>
                <span className="checklist-label">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="step-footer mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2" style={{color: (allChecked && isSaved) ? 'var(--success-color)' : 'var(--text-muted)'}}>
            {allChecked && isSaved ? <CheckCircle size={20} /> : <div className="w-5" />}
            <span className="font-medium">
              {allChecked && isSaved ? 'Jornada Finalizada!' : 'Complete o checklist e anexe a foto'}
            </span>
          </div>
          
          <button 
            className="btn btn-primary btn-lg" 
            onClick={handleFinish}
            disabled={loading || !allChecked || (!file && !preview)}
          >
            {loading ? 'Salvando...' : 'Finalizar Módulo Voz'}
          </button>
        </div>

      </main>
    </div>
  );
}
