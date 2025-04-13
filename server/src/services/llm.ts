import {
  ImageMediaType,
  IAIService,
  DocumentMediaType,
} from "../types/types.js";
import { z } from "zod";

export class LLMService {
  private aiService: IAIService;

  constructor(aiService: IAIService) {
    this.aiService = aiService;
  }

  async imageToJSON<T>(
    imageBase64: string,
    prompt: string,
    schema: z.ZodType<T>,
    imageMediaType: ImageMediaType = ImageMediaType.JPEG
  ) {
    return this.aiService.imageToJSON(
      imageBase64,
      prompt,
      schema,
      imageMediaType
    );
  }

  async pdfToJSON<T>(
    pdfBase64: string,
    prompt: string,
    schema: z.ZodType<T>,
    documentMediaType: DocumentMediaType = DocumentMediaType.PDF
  ) {
    return this.aiService.pdfToJSON(
      pdfBase64,
      prompt,
      schema,
      documentMediaType
    );
  }
}
