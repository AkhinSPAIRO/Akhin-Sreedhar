
import React, { useState, useRef, useCallback } from 'react';

interface PushToTalkProps {
  onAudioReady: (base64Audio: string) => void;
  isDisabled?: boolean;
}

const PushToTalk: React.FC<PushToTalkProps> = ({ onAudioReady, isDisabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          onAudioReady(base64Audio);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      if (window.navigator.vibrate) window.navigator.vibrate(50);
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <button
      onMouseDown={startRecording}
      onMouseUp={stopRecording}
      onMouseLeave={stopRecording}
      onTouchStart={(e) => { e.preventDefault(); startRecording(); }}
      onTouchEnd={(e) => { e.preventDefault(); stopRecording(); }}
      disabled={isDisabled}
      className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all active:scale-90 ${
        isRecording 
          ? 'bg-red-600 animate-pulse scale-110 shadow-[0_0_20px_rgba(220,38,38,0.6)]' 
          : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
      {isRecording && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">
          Recording
        </span>
      )}
    </button>
  );
};

export default PushToTalk;
