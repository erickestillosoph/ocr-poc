import { createAIService } from '../../factories/aiService';
import { LLMService } from '../../services/llm';
import { RekognitionService } from '../../services/rekognition';
import { ImageUtil } from '../../utils/image';
import { z } from 'zod';
import { IAIService } from '../../types';

const aiService: IAIService = createAIService();
const rekognitionService = new RekognitionService();
const llmService = new LLMService(aiService);

/**
 *
 * @param imageData
 * @param prompt
 * @param schema
 * @returns
 */
async function detectAndProcessImage<T>(
  imageData: string,
  prompt: string,
  schema: z.ZodType<T>
) {
  try {
    const imageBuffer = Buffer.from(imageData, 'base64');
    const areaOfInterest = await rekognitionService.findTextAreaOfInterest(
      imageBuffer
    );
    const processedImage = await ImageUtil.extractAndProcessImage(
      areaOfInterest,
      imageBuffer
    );
    return llmService.imageToJSON<T>(processedImage, prompt, schema);
  } catch (error) {
    console.error('Error detecting labels:', error);
  }
}
export default detectAndProcessImage;
