import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, AlertCircle } from 'lucide-react';
import './AudioRecorder.css';

export default function AudioRecorder({ onAudioReady, onClear, initialAudioUrl = null }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(initialAudioUrl);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioElementRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    setErrorMsg('');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMsg('Gravação de áudio não suportada neste navegador.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        if (onAudioReady) {
          onAudioReady({ blob, url, duration: recordingTime });
        }
        // Parar faixas de áudio
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Erro ao acessar microfone:', err);
      setErrorMsg('Permissão de microfone negada ou indisponível.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const clearAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setIsPlaying(false);
    setRecordingTime(0);
    if (onClear) onClear();
  };

  const togglePlay = () => {
    if (!audioElementRef.current) return;
    if (isPlaying) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    } else {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <div className="audio-recorder-container">
      {errorMsg && (
        <div className="audio-error-msg flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {!audioUrl && !isRecording && (
        <button
          type="button"
          className="audio-record-btn flex items-center justify-center gap-2"
          onClick={startRecording}
        >
          <Mic size={18} />
          <span>Gravar por Áudio</span>
        </button>
      )}

      {isRecording && (
        <div className="audio-recording-active flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="recording-dot animate-pulse"></span>
            <span className="recording-timer font-semibold">{formatTime(recordingTime)}</span>
            <span className="recording-status text-sm">Gravando sua voz...</span>
          </div>
          <button
            type="button"
            className="audio-stop-btn flex items-center gap-2"
            onClick={stopRecording}
          >
            <Square size={16} />
            <span>Parar</span>
          </button>
        </div>
      )}

      {audioUrl && !isRecording && (
        <div className="audio-playback-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="audio-play-btn flex items-center justify-center"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <div className="audio-info">
              <span className="audio-label text-sm font-medium">Áudio gravado</span>
              <audio
                ref={audioElementRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>
          </div>
          <button
            type="button"
            className="audio-trash-btn text-danger"
            onClick={clearAudio}
            title="Remover áudio"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
