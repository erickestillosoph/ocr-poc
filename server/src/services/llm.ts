import {
  ImageMediaType,
  IAIService,
  DocumentMediaType,
  FileMediaType,
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
    documentMediaType: DocumentMediaType = DocumentMediaType.PDF
  ) {
    return this.aiService.pdfToJSON(pdfBase64, prompt, documentMediaType);
  }

  async cameraImageToJSON<T>(
    cameraImageStringBase64: string,
    prompt: string,
    schema: z.ZodType<T>
  ) {
    return this.aiService.cameraImageToJSON(
      cameraImageStringBase64,
      prompt,
      schema
    );
  }
  async base64FileToJSON<T>(
    base64File: string,
    prompt: string,
    fileMediaType: FileMediaType = FileMediaType.JPEG
  ) {
    return this.aiService.base64FileToJSON(base64File, prompt, fileMediaType);
  }
}
