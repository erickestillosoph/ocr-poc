import fs from "fs";
import { ImageOutputResult } from "./imageOutput.js";
import { complexImagePrompt } from "../../utils/prompts.js";

export class ImageFeature {
  /**
   *
   * @param areaOfInterest
   * @param imageBuffer
   * @returns
   */
  static async imageFeature(imagePath: string) {
    const imageBase64 = fs.readFileSync(imagePath).toString("base64");

    const output = await ImageOutputResult.detectAndProcessImage(
      imageBase64,
      complexImagePrompt
    );
    return output;
  }
}
export default ImageFeature;
