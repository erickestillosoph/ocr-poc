import { AnthropicService } from "../services/anthropic.js";
import { IAIService } from "../types/types.js";

export function createAIService(): IAIService {
  if (process.env.ANTHROPIC_API_KEY) {
    return new AnthropicService();
  } else {
    throw new Error("No valid API key found for Anthropic.");
  }
}
