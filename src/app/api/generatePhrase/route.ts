import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Cache para evitar frases repetidas
const phraseCache = new Set<string>();

const getPrompt = () => {
  return "Generate either a single English word or a short phrase (maximum 15 characters). Choose something common but not too basic. Make it different from common words. The word/phrase should be a noun, verb, or adjective. Return ONLY the word/phrase, no explanations or additional text.";
};

const isPhraseUnique = (phrase: string): boolean => {
  if (phraseCache.has(phrase)) {
    return false;
  }

  // Mantener solo las últimas 50 frases
  if (phraseCache.size >= 50) {
    const firstItem = phraseCache.values().next().value;
    if (firstItem) {
      phraseCache.delete(firstItem);
    }
  }

  phraseCache.add(phrase);
  return true;
};

export async function POST(request: Request) {
  try {
    const prompt = getPrompt();

    let attempts = 0;
    let phrase = "";

    while (attempts < 3) {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that generates English words or short phrases for a language learning game. Generate only the word/phrase without any explanations.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 20,
        temperature: 0.7,
      });

      const newPhrase = completion.choices[0].message.content?.trim() || "";

      if (isPhraseUnique(newPhrase)) {
        phrase = newPhrase;
        break;
      }

      attempts++;
    }

    if (!phrase) {
      // Si no se pudo generar una frase única después de 3 intentos,
      // limpiamos la caché y generamos una nueva
      phraseCache.clear();
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that generates English words or short phrases for a language learning game. Generate only the word/phrase without any explanations.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 20,
        temperature: 0.7,
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
