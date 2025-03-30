"use client";

import { useEffect, useRef } from "react";

interface PhraseAudioProps {
  phrase: string;
  level: number;
  onPlay: () => void;
}

export default function PhraseAudio({
  phrase,
  level,
  onPlay,
}: PhraseAudioProps) {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(phrase);

      // Ajustar velocidad según el nivel
      const baseRate = 0.8;
      const rateIncrement = 0.1;
      utterance.rate = baseRate + (level - 1) * rateIncrement;

      utterance.lang = "en-US";
      utterance.onend = onPlay;

      utteranceRef.current = utterance;
    }
  }, [phrase, level, onPlay]);

  const playAudio = () => {
    if (utteranceRef.current) {
      window.speechSynthesis.speak(utteranceRef.current);
    }
  };

  return (
    <button
      onClick={playAudio}
      className="group relative bg-gradient-to-r from-primary to-primary/80 text-white px-8 py-4 rounded-xl hover:from-primary/90 hover:to-primary/70 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center gap-3"
    >
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
            clipRule="evenodd"
          />
        </svg>
        <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-200"></div>
      </div>
      <span className="font-semibold text-lg">Escuchar Frase</span>
    </button>
  );
}
