import React from "react";

interface GameStatsProps {
  score: number;
  wordsGuessed: number;
}

export const GameStats: React.FC<GameStatsProps> = ({
  score,
  wordsGuessed,
}) => {
  return (
    <div className="flex gap-8 mb-6 justify-center text-xl">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="text-gray-600">Puntuación</div>
        <div className="text-2xl font-bold text-blue-600">{score}</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="text-gray-600">Palabras adivinadas</div>
        <div className="text-2xl font-bold text-green-600">{wordsGuessed}</div>
      </div>
    </div>
  );
};
