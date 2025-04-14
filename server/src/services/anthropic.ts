import { Anthropic } from "@anthropic-ai/sdk";
import {
  LLMResponse,
  IAIService,
  ImageMediaType,
  DocumentMediaType,
} from "../types/types.js";
import { z } from "zod";

// Add type for text content block
interface TextContent {
  type: "text";
  text: string;
}

const MAX_TOKENS = 1024;
const DEFAULT_TEMPERATURE = 0;
// const DEFAULT_ANTHROPIC_MODEL_NAME = "claude-3-opus-20240229";
const DEFAULT_ANTHROPIC_MODEL_NAME = "claude-3-7-sonnet-20250219";
// Add timeout configuration for Anthropic API calls
const DEFAULT_API_TIMEOUT_MS = 25000;

export class AnthropicService implements IAIService {
  private aiService: Anthropic;
  private modelName: string;

  constructor(modelName?: string, anthropic?: Anthropic) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("No valid API key found for Anthropic.");
    }
    this.aiService =
      anthropic ??
      new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
        timeout: DEFAULT_API_TIMEOUT_MS, // Set API call timeout
      });
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

    return this.formatResponse<T>(msg, schema);
  }

  /**
   *s
   * @param pdfBase64
   * @param prompt
   * @param schema
   * @returns
   */
  async pdfToJSON<T>(
    pdfBase64: string,
    prompt: string,
    schema: z.ZodType<T>,
    documentMediaType: DocumentMediaType
  ): Promise<LLMResponse<T>> {
    // Note: The current SDK version doesn't support PDF directly
    // This implementation will need to be updated when the SDK supports PDF
    const msg = await this.aiService.messages.create({
      model: this.modelName,
      max_tokens: MAX_TOKENS,
      temperature: DEFAULT_TEMPERATURE,
      messages: [
        {
          content: [
            {
              type: "document",
              source: {
                media_type: DocumentMediaType.PDF,
                type: "base64",
                data: pdfBase64,
              },
              cache_control: { type: "ephemeral" },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
          role: "user",
        },
      ],
    });

    return this.formatResponse<T>(msg, schema);
  }

  /**
   *s
   * @param pdfBase64
   * @param prompt
   * @param schema
   * @returns
   */
  async cameraImageToJSON<T>(
    cameraImageStringBase64: string,
    prompt: string,
    schema: z.ZodType<T>
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
              type: "text",
              text: `${cameraImageStringBase64} is the string base64 image file please process it. ${prompt} follow this prompt`,
            },
          ],
        },
      ],
    });

    return this.formatResponse<T>(msg, schema);
  }

  private extractJSON(text: string): string {
    // Try to find JSON-like content using regex
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return jsonMatch[0];
    }
    throw new Error("No JSON object found in response");
  }

  /**
   * Format the response from the Anthropic API call
   */
  private formatResponse<T>(
    msg: any, // Changed from Anthropic.Messages.Message to any
    schema: z.ZodType<T>
  ): LLMResponse<T> {
    // Get the text content from the message
    const content = msg.content[0];
    if (content.type !== "text") {
      throw new Error("Expected text content in the response");
    }

    try {
      let jsonData;
      try {
        const jsonText = this.extractJSON(content.text);
        jsonData = JSON.parse(jsonText);
      } catch (error) {
        console.error("Failed to parse JSON response:", error);
        console.error("Raw response:", content.text);
        throw new Error("Invalid JSON response from LLM");
      }

      try {
        const result = schema.parse(jsonData);
        return {
          result,
          id: msg.id,
          role: msg.role,
          usage: {
            input_tokens: msg.usage?.input_tokens,
            output_tokens: msg.usage?.output_tokens,
          },
        };
      } catch (error) {
        console.error("Schema validation failed:", error);
        throw new Error("Response does not match expected schema");
      }
    } catch (error) {
      console.error("Error processing LLM response:", error);
      throw error;
    }
  }
}
