"use server";

import Anthropic from "@anthropic-ai/sdk";
import { revalidatePath } from "next/cache";
import { env } from "~/env";

const SYSTEM_PROMPT =
  "You are a creative writing assistant that generates short, evocative daily art prompts for artists experiencing art block. Respond with ONLY the prompt itself: one sentence, no preamble, no quotation marks.";

export async function generateArtPrompt(): Promise<string> {
  if (!env.AI_GATEWAY_API_KEY) {
    return "Add an AI_GATEWAY_API_KEY to enable daily prompts.";
  }

  const client = new Anthropic({
    apiKey: env.AI_GATEWAY_API_KEY,
    baseURL: "https://ai-gateway.vercel.sh",
  });

  try {
    const response = await client.messages.create({
      model: "anthropic/claude-haiku-4-5",
      max_tokens: 100,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: "Give me a fresh, unusual art prompt for today.",
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock?.type === "text"
      ? textBlock.text.trim()
      : "Paint something that reminds you of home.";
  } catch {
    return "Couldn't reach the prompt generator — try again in a moment.";
  }
}

export async function refreshPrompt() {
  revalidatePath("/daily-challenges");
}
