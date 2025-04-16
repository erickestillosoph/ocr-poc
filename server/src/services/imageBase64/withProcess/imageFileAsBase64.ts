import { ImageOutputResultAsBase64 } from "./imageOutputAsBase64.js";
import { complexImagePrompt } from "../../../utils/prompts.js";

export class ImageFeature {
  /**
   *
   * @param areaOfInterest
   * @param imageBuffer
   * @returns
   */
  static async imageFeature(imagePath: string) {
    const imagePathBase64 = imagePath.toString().split(",")[1];
    const output =
      await ImageOutputResultAsBase64.detectAndProcessImageAsBase64(
        imagePathBase64,
        complexImagePrompt
      );
    return output;
  }
}
export default ImageFeature;
