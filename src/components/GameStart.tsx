"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GameStart() {
  const [playerName, setPlayerName] = useState("");
  const router = useRouter();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      localStorage.setItem("playerName", playerName);
      router.push("/game");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex flex-col items-center justify-center p-4 text-black">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-lg w-full transform hover:scale-[1.02] transition-all duration-300 border border-white/20">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-4">
            English Learning Game
          </h1>
          <p className="text-white/80 text-xl">
            ¡Mejora tu inglés de forma divertida!
          </p>
        </div>

        <form onSubmit={handleStart} className="space-y-8">
          <div className="space-y-3">
            <label
              htmlFor="playerName"
              className="block text-lg font-semibold text-white/90"
            >
              Tu Nombre
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-6 py-4 text-lg bg-white/10 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 text-gray-900 placeholder-gray-500 backdrop-blur-sm shadow-sm transition-all duration-200"
              placeholder="Ingresa tu nombre"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-white text-blue-600 rounded-xl font-bold text-xl shadow-lg hover:bg-white/90 disabled:bg-white/30 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Comenzar Juego
          </button>
        </form>

        <div className="mt-10 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Reglas del Juego
          </h2>
          <ul className="space-y-4 text-white/80 text-lg">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Escucha la frase en inglés
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Escribe lo que escuchaste
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Gana puntos por respuestas correctas
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Alcanza 100 puntos para subir de nivel
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              ¡Hay 10 niveles para completar!
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
