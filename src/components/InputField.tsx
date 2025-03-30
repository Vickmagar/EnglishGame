"use client";

import { useState, useEffect, useRef } from "react";

interface InputFieldProps {
  onSubmit: (input: string) => void;
  isActive: boolean;
  timeLeft: number;
}

export default function InputField({
  onSubmit,
  isActive,
  timeLeft,
}: InputFieldProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe lo que escuchaste..."
          className="w-full px-6 py-4 text-xl bg-white/10 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 text-gray-900 placeholder-gray-500 backdrop-blur-sm shadow-sm transition-all duration-200"
          disabled={!isActive}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <span className="text-sm font-semibold text-gray-700 bg-white/80 px-4 py-1 rounded-full">
            {timeLeft}s
          </span>
        </div>
      </div>
      <button
        type="submit"
        disabled={!isActive || !input.trim()}
        className="w-full py-4 px-6 bg-white text-blue-600 rounded-xl font-bold text-xl shadow-lg hover:bg-white/90 disabled:bg-white/30 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Enviar Respuesta
      </button>
    </form>
  );
}
