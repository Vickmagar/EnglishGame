import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Cache para evitar frases repetidas
const phraseCache = new Map<number, Set<string>>();

const getPromptForLevel = (level: number) => {
  const prompts = [
    // Nivel 1-3: Frases básicas
    "Generate a simple English phrase using basic vocabulary. Keep it under 5 words. Make it different from common phrases.",
    "Create a short English sentence using everyday words. Keep it under 5 words. Make it unique.",
    "Write a basic English expression that a beginner would use. Keep it under 5 words. Make it different.",

    // Nivel 4-7: Frases intermedias
    "Generate an intermediate English phrase using common expressions. Use 6 to 8 words. Make it unique.",
    "Create an English sentence using everyday language. Use 6 to 8 words. Make it different.",
    "Write an intermediate English expression using casual language. Use 6 to 8 words. Make it unique.",

    // Nivel 8-10: Frases avanzadas
    "Generate an advanced English phrase using modern expressions and slang. Use 8 to 10 words. Make it unique.",
    "Create a complex English sentence using casual language and idioms. Use 8 to 10 words. Make it different.",
    "Write an advanced English expression using contemporary language. Use 8 to 10 words. Make it unique.",
  ];

  const index = Math.floor((level - 1) / 3);
  return prompts[Math.min(index, prompts.length - 1)];
};

const isPhraseUnique = (level: number, phrase: string): boolean => {
  if (!phraseCache.has(level)) {
    phraseCache.set(level, new Set());
  }
  const levelCache = phraseCache.get(level)!;

  if (levelCache.has(phrase)) {
    return false;
  }

  // Mantener solo las últimas 50 frases por nivel
  if (levelCache.size >= 50) {
    const firstItem = levelCache.values().next().value;
    if (firstItem) {
      levelCache.delete(firstItem);
    }
  }

  levelCache.add(phrase);
  return true;
};

export async function POST(request: Request) {
  try {
    const { level } = await request.json();
    const prompt = getPromptForLevel(level);

    let attempts = 0;
    let phrase = "";

    while (attempts < 3) {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that generates unique English phrases for a language learning game. Keep the phrases natural, commonly used, and different from each other.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 50,
        temperature: 0.8, // Aumentamos la temperatura para más variedad
      });

      const newPhrase = completion.choices[0].message.content?.trim() || "";

      if (isPhraseUnique(level, newPhrase)) {
        phrase = newPhrase;
        break;
      }

      attempts++;
    }

    if (!phrase) {
      // Si no se pudo generar una frase única después de 3 intentos,
      // limpiamos la caché y generamos una nueva
      phraseCache.delete(level);
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that generates unique English phrases for a language learning game. Keep the phrases natural, commonly used, and different from each other.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 50,
        temperature: 0.8,
      });

      phrase = completion.choices[0].message.content?.trim() || "";
    }

    return NextResponse.json({ phrase });
  } catch (error) {
    console.error("Error generating phrase:", error);
    return NextResponse.json(
      { error: "Error generating phrase" },
      { status: 500 }
    );
  }
}
