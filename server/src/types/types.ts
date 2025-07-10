import { z } from "zod";

export type AreaOfInterest = {
  Left: number;
  Top: number;
  Width: number;
  Height: number;
};

export enum ImageMediaType {
  JPEG = "image/jpeg",
  PNG = "image/png",
  WEBP = "image/webp",
}

export enum FileMediaType {
  JPEG = "image/jpeg",
  PNG = "image/png",
  WEBP = "image/webp",
}

export enum DocumentMediaType {
  PDF = "application/pdf",
}

export type LLMResponse<T> = {
  result: T;
  id: string;
  role: string;
  usage: {
    completion_tokens?: number;
    prompt_tokens?: number;
    total_tokens?: number;
    input_tokens?: number;
    output_tokens?: number;
  };
};

export type IAIService = {
  imageToJSON<T>(
    imageBase64: string,
    prompt: string,
    schema: z.ZodType<T>,
    imageMediaType: ImageMediaType
  ): Promise<LLMResponse<T>>;

  pdfToJSON<T>(
    pdfBase64: string,
    prompt: string,
    documentMediaType: DocumentMediaType
  ): Promise<LLMResponse<T>>;

  cameraImageToJSON<T>(
    imageBase64: string,
    prompt: string,
    schema: z.ZodType<T>
  ): Promise<LLMResponse<T>>;

  base64FileToJSON<T>(
    base64File: string,
    prompt: string,
    fileMediaType: FileMediaType
  ): Promise<LLMResponse<T>>;
};
