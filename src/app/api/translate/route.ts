import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that translates English text to Spanish. Provide ONLY the translation, no explanations or additional text. If the word is slang, translate it to its closest Spanish equivalent or most common usage.",
        },
        {
          role: "user",
          content: `Translate this to Spanish: "${text}"`,
        },
      ],
      max_tokens: 20,
      temperature: 0.3,
    });

    const translation = completion.choices[0].message.content?.trim() || "";

    return NextResponse.json({ translation });
  } catch (error) {
    console.error("Error translating text:", error);
    return NextResponse.json(
      { error: "Error translating text" },
      { status: 500 }
    );
  }
}
