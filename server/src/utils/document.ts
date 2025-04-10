import fs from "fs";

export class PdfUtil {
  /**
   *
   * @param areaOfInterest
   * @param pdfBuffer
   * @returns
   */
  static async documentToBase64(pdfPath: string) {
    const pdfBase64 = fs.readFileSync(pdfPath).toString("base64");

    return pdfBase64;
  }
}
