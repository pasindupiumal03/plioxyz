import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url",
    });

    if (!response.data || !response.data[0]?.url) {
      throw new Error("No image URL in response");
    }

    return NextResponse.json(response.data[0]);
  } catch (error: any) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to generate image",
        details: error.response?.data || null,
      },
      { status: 500 }
    );
  }
}
