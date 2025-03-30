"use client";

import { useState, useEffect, useCallback } from "react";
import PhraseAudio from "./PhraseAudio";
import InputField from "./InputField";

interface GameState {
  currentPhrase: string;
  score: number;
  level: number;
  timeLeft: number;
  isPlaying: boolean;
}

export default function GameBoard() {
  const [gameState, setGameState] = useState<GameState>({
    currentPhrase: "",
    score: 0,
    level: 1,
    timeLeft: 30,
    isPlaying: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [showCorrectPhrase, setShowCorrectPhrase] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const generateNewPhrase = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/generatePhrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: gameState.level }),
      });
      const data = await response.json();
      setGameState((prev) => ({
        ...prev,
        currentPhrase: data.phrase,
        timeLeft: 30,
        isPlaying: false,
      }));
    } catch (error) {
      console.error("Error generating phrase:", error);
    } finally {
      setIsLoading(false);
    }
  }, [gameState.level]);

  const calculateSimilarity = (str1: string, str2: string): number => {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();

    // Si son exactamente iguales
    if (s1 === s2) return 1;

    // Si uno contiene al otro
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;

    // Contar palabras correctas
    const words1 = s1.split(" ");
    const words2 = s2.split(" ");
    const correctWords = words1.filter((word) => words2.includes(word));

    return correctWords.length / Math.max(words1.length, words2.length);
  };

  const handleSubmit = async (input: string) => {
    const similarity = calculateSimilarity(input, gameState.currentPhrase);
    const isCorrect = similarity >= 0.7; // 70% de similitud es suficiente

    if (isCorrect) {
      const newScore = gameState.score + 10;
      const newLevel =
        newScore >= 100 ? Math.min(gameState.level + 1, 10) : gameState.level;
      const finalScore = newScore >= 100 ? 0 : newScore;

      setGameState((prev) => ({
        ...prev,
        score: finalScore,
        level: newLevel,
        timeLeft: 30,
        isPlaying: false,
      }));

      await generateNewPhrase();
    } else {
      setGameState((prev) => ({
        ...prev,
        timeLeft: 30,
        isPlaying: false,
      }));
    }
  };

  const handleTimeUp = useCallback(() => {
    setShowCorrectPhrase(true);
    setTimeout(() => {
      setShowCorrectPhrase(false);
      generateNewPhrase();
    }, 3000);
  }, [generateNewPhrase]);

  const handleShowHint = () => {
    setShowHint(true);
    setGameState((prev) => ({ ...prev, isPlaying: false }));
    setTimeout(() => {
      setShowHint(false);
      generateNewPhrase();
    }, 5000);
  };

  const handleSkipPhrase = () => {
    setGameState((prev) => ({ ...prev, isPlaying: false }));
    generateNewPhrase();
  };

  useEffect(() => {
    generateNewPhrase();
  }, [generateNewPhrase]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (gameState.timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearInterval(timer);
  }, [gameState.isPlaying, gameState.timeLeft, handleTimeUp]);

  const handlePlay = () => {
    setGameState((prev) => ({ ...prev, isPlaying: true }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 transform hover:scale-[1.01] transition-all duration-300 border border-white/20">
          <div className="flex justify-between items-center mb-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 bg-white rounded-full"></span>
                <h2 className="text-3xl font-bold text-gray-900">
                  Nivel {gameState.level}
                </h2>
              </div>
              <p className="text-gray-800 text-xl ml-6">
                Puntuación: {gameState.score}
              </p>
            </div>
            <div className="text-right bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <p className="text-lg text-gray-800 font-medium">
                Tiempo restante
              </p>
              <p className="text-5xl font-bold text-gray-900">
                {gameState.timeLeft}s
              </p>
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex justify-center">
              <PhraseAudio
                phrase={gameState.currentPhrase}
                level={gameState.level}
                onPlay={handlePlay}
              />
            </div>

            {showCorrectPhrase && (
              <div className="text-center p-4 bg-red-500/20 rounded-xl border border-red-500/30">
                <p className="text-xl text-red-100 font-medium">
                  La frase correcta era:
                </p>
                <p className="text-2xl text-white font-bold mt-2">
                  &quot;{gameState.currentPhrase}&quot;
                </p>
              </div>
            )}

            {showHint && (
              <div className="text-center p-4 bg-blue-500/20 rounded-xl border border-blue-500/30">
                <p className="text-xl text-blue-100 font-medium">
                  La frase es:
                </p>
                <p className="text-2xl text-white font-bold mt-2">
                  &quot;{gameState.currentPhrase}&quot;
                </p>
                <p className="text-blue-100 mt-2">
                  Nueva frase en 5 segundos...
                </p>
              </div>
            )}

            <div className="flex justify-center gap-4">
              <button
                onClick={handleShowHint}
                disabled={showHint || !gameState.isPlaying}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all duration-200"
              >
                Ver Frase
              </button>
              <button
                onClick={handleSkipPhrase}
                disabled={showHint}
                className="px-6 py-3 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 disabled:bg-yellow-300 disabled:cursor-not-allowed transition-all duration-200"
              >
                Siguiente Frase
              </button>
              <InputField
                onSubmit={handleSubmit}
                isActive={gameState.isPlaying}
                timeLeft={gameState.timeLeft}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
