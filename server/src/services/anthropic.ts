import Anthropic from "@anthropic-ai/sdk";
import { LLMResponse, IAIService, ImageMediaType } from "../types.js";
import { z } from "zod";

// Add type for text content block
interface TextContent {
  type: "text";
  text: string;
}

const MAX_TOKENS = 1024;
const DEFAULT_TEMPERATURE = 0;
const DEFAULT_ANTHROPIC_MODEL_NAME = "claude-3-opus-20240229";

export class AnthropicService implements IAIService {
  private aiService: Anthropic;
  private modelName: string;

  constructor(modelName?: string, anthropic?: Anthropic) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("No valid API key found for Anthropic.");
    }
    this.aiService =
      anthropic ?? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    this.modelName = modelName ?? DEFAULT_ANTHROPIC_MODEL_NAME;
  }

  /**
   *
   * @param imageBase64
   * @param prompt
   * @param schema
   * @param imageMediaType
   * @returns
   */
  async imageToJSON<T>(
    imageBase64: string,
    prompt: string,
    schema: z.ZodType<T>,
    imageMediaType: ImageMediaType
  ): Promise<LLMResponse<T>> {
    const msg = await this.aiService.messages.create({
      model: this.modelName,
      max_tokens: MAX_TOKENS,
      temperature: DEFAULT_TEMPERATURE,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: imageMediaType,
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });

    // Assuming a similar formatResponse method exists or is adapted for this class
    return this.formatResponse<T>(msg, schema);
  }

  /**
   *
   * @param msg
   * @param schema
   * @returns
   */
  private formatResponse<T>(
    msg: Anthropic.Messages.Message,
    schema: z.ZodType<T>
  ): LLMResponse<T> {
    // Get the text content from the message
    const content = msg.content[0];
    if (content.type !== "text") {
      throw new Error("Expected text content in the response");
    }

    // Parse the text content as JSON
    const result = schema.parse(JSON.parse(content.text));
    return {
      result,
      id: msg.id,
      role: msg.role,
      usage: {
        input_tokens: msg.usage?.input_tokens,
        output_tokens: msg.usage?.output_tokens,
      },
    };
  }
}
