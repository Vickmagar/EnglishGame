"use client";

import { useState, useEffect } from "react";
import { GameControls } from "./components/GameControls";
import { GameStats } from "./components/GameStats";

export default function Home() {
  const [score, setScore] = useState(0);
  const [wordsGuessed, setWordsGuessed] = useState(0);
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [userInput, setUserInput] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPhrase, setShowPhrase] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);

  const generateNewPhrase = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generatePhrase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      if (data.phrase) {
        setCurrentPhrase(data.phrase);
        setUserInput("");
        setMessage("");
        setShowPhrase(false);
        setTranslation(null);
        // Generar URL de audio
        const audioResponse = await fetch("/api/generateAudio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: data.phrase }),
        });
        const audioData = await audioResponse.json();
        setAudioUrl(audioData.audioUrl);
      }
    } catch (error) {
      console.error("Error generating phrase:", error);
      setMessage("Error al generar la frase");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateNewPhrase();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect =
      userInput.toLowerCase().trim() === currentPhrase.toLowerCase().trim();

    if (isCorrect) {
      setMessage("¡Correcto! +10 puntos");
      setScore((prev) => prev + 10);
      setWordsGuessed((prev) => prev + 1);
      setShowPhrase(true);
      getTranslation();
      setTimeout(() => {
        generateNewPhrase();
      }, 2000);
    } else {
      setMessage("Incorrecto. Intenta de nuevo.");
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const getTranslation = async () => {
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: currentPhrase }),
      });
      const data = await response.json();
      if (data.translation) {
        setTranslation(data.translation);
      }
    } catch (error) {
      console.error("Error getting translation:", error);
    }
  };

  const handleShowPhrase = async () => {
    setShowPhrase(true);
    await getTranslation();
  };

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <GameControls />

        <GameStats score={score} wordsGuessed={wordsGuessed} />

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Palabra o frase actual:
            </h2>
            <p className="text-2xl font-bold text-blue-600">
              {showPhrase ? currentPhrase : "?????"}
            </p>
            {showPhrase && translation && (
              <p className="text-xl text-gray-600 mt-2">
                Traducción: <span className="font-semibold">{translation}</span>
              </p>
            )}
          </div>

          <div className="flex gap-4 mb-4">
            <button
              onClick={playAudio}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              disabled={isLoading || !audioUrl}
            >
              🔊 Escuchar
            </button>
            <button
              onClick={handleShowPhrase}
              className="flex-1 bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
              disabled={isLoading || showPhrase}
            >
              👁️ Ver palabra
            </button>
            <button
              onClick={generateNewPhrase}
              className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              ⏭️ Siguiente
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Escribe tu respuesta..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || showPhrase}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isLoading || showPhrase}
            >
              Verificar
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 text-center font-semibold ${
                message.includes("Correcto") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
