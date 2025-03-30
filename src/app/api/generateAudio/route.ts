import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });

    // Convertir el buffer a base64
    const buffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(buffer).toString("base64");
    const audioUrl = `data:audio/mp3;base64,${base64Audio}`;

    return NextResponse.json({ audioUrl });
  } catch (error) {
    console.error("Error generating audio:", error);
    return NextResponse.json(
      { error: "Error generating audio" },
      { status: 500 }
    );
  }
}
