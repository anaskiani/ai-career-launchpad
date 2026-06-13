import { buildFallbackReply, topicPromptMap } from './chatPrompts.js';
import Groq from 'groq-sdk';

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

export const generateChatReply = async ({ topic, message, history = [] }) => {
  if (!groq) {
    console.warn("GROQ_API_KEY is missing. Using offline fallback mode.");
    return {
      reply: buildFallbackReply({ topic, message }),
      provider: 'local-fallback',
      fallbackUsed: true,
    };
  }

  try {
    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: `You are a concise AI career coach. ${topicPromptMap[topic]}`,
        },
        ...history.slice(-6).map((item) => ({
          role: item.role,
          content: item.content,
        })),
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return {
      reply: response.choices[0]?.message?.content || buildFallbackReply({ topic, message }),
      provider: 'groq-cloud',
      fallbackUsed: false,
    };
  } catch (error) {
    console.error("Ollama API Error:", error.message);
    return {
      reply: buildFallbackReply({ topic, message }),
      provider: 'local-fallback',
      fallbackUsed: true,
    };
  }
};
