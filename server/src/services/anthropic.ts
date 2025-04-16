import { Anthropic } from "@anthropic-ai/sdk";
import {
  LLMResponse,
  IAIService,
  ImageMediaType,
  DocumentMediaType,
  FileMediaType,
} from "../types/types.js";
import { z } from "zod";

const MAX_TOKENS = 1024;
const DEFAULT_TEMPERATURE = 0;
// const DEFAULT_ANTHROPIC_MODEL_NAME = "claude-3-opus-20240229";
const DEFAULT_ANTHROPIC_MODEL_NAME = "claude-3-7-sonnet-20250219";
// const DEFAULT_ANTHROPIC_MODEL_NAME = "claude-3-5-haiku-20241022";
// Add timeout configuration for Anthropic API calls
const DEFAULT_API_TIMEOUT_MS = 15000;

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
        timeout: DEFAULT_API_TIMEOUT_MS,
      });
    this.modelName = modelName ?? DEFAULT_ANTHROPIC_MODEL_NAME;
  }

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
              cache_control: { type: "ephemeral" },
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

  async pdfToJSON<T>(
    pdfBase64: string,
    prompt: string
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
        },
      ],
    });

    return this.formatResponse<T>(msg);
  }

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

  async base64FileToJSON<T>(
    base64File: string,
    prompt: string,
    fileMediaType: FileMediaType
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
                media_type: fileMediaType,
                type: "base64",
                data: base64File,
              },
              cache_control: { type: "ephemeral" },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
    });

    return this.formatResponse<T>(msg);
  }

  async base64PDFToJSON<T>(
    base64File: string,
    prompt: string,
    schema: z.ZodType<T>,
    fileMediaType: DocumentMediaType
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
              type: "document",
              source: {
                media_type: fileMediaType,
                type: "base64",
                data: base64File,
              },
              cache_control: { type: "ephemeral" },
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

  private extractJSON(text: string): string {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return jsonMatch[0];
    }
    throw new Error("No JSON object found in response");
  }

  private formatResponse<T>(msg: any, schema?: z.ZodType<T>): LLMResponse<T> {
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
        const result = jsonData;
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
