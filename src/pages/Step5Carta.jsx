import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Mail, Camera, UploadCloud, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import './Step5Carta.css';

export default function Step5Carta() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create local preview
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveLetter = async () => {
    if (!file || !user) return;
    setLoading(true);

    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `letters/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('letters')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('letters')
        .getPublicUrl(filePath);

      // 3. Save URL to past_letters table
      const { error: dbError } = await supabase
        .from('past_letters')
        .insert([{
          user_id: user.id,
          image_url: publicUrl
        }]);

      if (dbError) throw dbError;

      setIsSaved(true);
      alert("Carta enviada com sucesso!");

    } catch (err) {
      alert("Erro ao salvar carta. Você criou o bucket 'letters' e a tabela 'past_letters' no Supabase?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <header className="page-header flex justify-between items-center w-full">
        <div className="flex gap-4">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            <span>Início</span>
          </button>
          <button className="back-btn" onClick={() => navigate('/passo-4')}>
            <ArrowLeft size={20} />
            <span>Voltar ao Passo 4</span>
          </button>
        </div>
      </header>

      <main className="step-content-wrapper">
        <span className="step-badge">PASSO 5 DE 9</span>
        <h1 className="page-title" style={{textAlign: 'left', marginTop: '1rem'}}>Carta ao Meu Eu do Passado</h1>
        <p className="page-subtitle" style={{textAlign: 'left', marginBottom: '2rem'}}>
          Um passo dedicado à compaixão e à ressignificação. Escolha um momento difícil e<br/>
          escreva uma carta para quem você foi.
        </p>

        {/* Instruções */}
        <div className="instructions-card mb-8">
          <h2 className="instructions-title flex items-center gap-2">
            <Edit3 size={20} className="text-primary"/> Instruções
          </h2>
          
          <ol className="instructions-list">
            <li>
              <span className="step-num">1</span>
              <p>Escolha um momento difícil mapeado na sua <strong>Linha do Tempo Emocional</strong>.</p>
            </li>
            <li>
              <span className="step-num">2</span>
              <p>Pegue <strong>papel e caneta</strong> e escolha um momento de tranquilidade para se concentrar.</p>
            </li>
            <li>
              <span className="step-num">3</span>
              <p>Escreva para a versão de si mesmo(a) daquela época: reconheça a dor vivida e conte o que aquela experiência acabou ensinando.</p>
            </li>
            <li>
              <span className="step-num">4</span>
              <p>Quando terminar, <strong>tire uma foto</strong> da carta e envie abaixo.</p>
            </li>
          </ol>

          <div className="handwriting-notice mt-6">
            <Mail size={24} className="notice-icon" />
            <p className="italic font-serif">"Escreva à mão. Não digite. A caligrafia conecta você à emoção de um jeito que o teclado não alcança."</p>
          </div>
        </div>

        {/* Upload Área */}
        <div className="upload-card">
          <h2 className="instructions-title flex items-center gap-2 mb-4">
            <Camera size={20} className="text-primary"/> Foto da Carta
          </h2>

          <div 
            className={`upload-dropzone ${preview ? 'has-image' : ''}`}
            onClick={!isSaved ? handleUploadClick : undefined}
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
            
            {/* Input escondido */}
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileSelect}
            />
          </div>
          
          {preview && !isSaved && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <button className="btn-text text-sm" onClick={() => { setFile(null); setPreview(null); }}>
                Remover foto
              </button>
              <button className="btn btn-primary flex items-center gap-2" onClick={handleSaveLetter} disabled={loading}>
                <UploadCloud size={18} />
                {loading ? 'Enviando...' : 'Salvar Carta'}
              </button>
            </div>
          )}

          {isSaved && (
            <div className="flex items-center gap-2 text-success mt-6 pt-4 border-t font-medium">
              <CheckCircle size={20} />
              Carta guardada com segurança.
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-end mt-8">
          <button className="btn btn-primary" onClick={() => navigate('/passo-6')}>
            Próximo Passo →
          </button>
        </div>
      </main>
    </div>
  );
}
