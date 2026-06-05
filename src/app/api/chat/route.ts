import { NextResponse } from "next/server";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { prompt, agentId } = await req.json();

    if (!prompt || !agentId) {
      return NextResponse.json({ error: "Missing prompt or agentId" }, { status: 400 });
    }

    // Fetch agent instructions
    const [agent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, agentId));

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const provider = process.env.AI_PROVIDER || "openrouter";
    const model = process.env.MODEL_NAME || "deepseek/deepseek-r1:free";

    let responseText = "";

    if (provider === "openrouter") {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: agent.instruction },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenRouter Error: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      responseText = data.choices?.[0]?.message?.content || "No response from AI.";
    } 
    else if (provider === "gemini") {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model || "gemini-1.5-flash"}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: `Instructions: ${agent.instruction}\n\nUser: ${prompt}` }] }
            ],
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Gemini Error: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
    } 
    else if (provider === "groq") {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model || "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: agent.instruction },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Groq Error: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      responseText = data.choices?.[0]?.message?.content || "No response from AI.";
    } 
    else {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
