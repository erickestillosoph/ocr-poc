import { Router } from "express";
import { processImagePathBase64 } from "../api/index.js";
import multer from "multer";
import { API_PREFIXES, environment } from "../config/api-config.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

API_PREFIXES.forEach((prefix) => {
  router.get(`${prefix}/process-image`, (req, res) => {
    res.json({
      status: "ready",
      message:
        "Image Image processing endpoint is available. Please send a POST request with an image file in the 'Image' field.",
      environment,
      timestamp: new Date().toISOString(),
    });
  });

  router.post(
    `${prefix}/process-image`,
    upload.single("image"),
    async (req, res) => {
      try {
        const base64Image = req.body.image;
        const imageMediaType = req;
        console.log("imageMediaType", imageMediaType);

        // const result = await processImagePathBase64(base64Image);
        const result = await processImagePathBase64(base64Image);

        res.json({
          result,
          environment,
        });
      } catch (error) {
        console.error("Error in processing image:", error);
        if (!res.headersSent) {
          if ((error as Error).message.includes("timeout")) {
            return res.status(504).json({
              error: "Gateway timeout",
              message:
                "The request is taking too long to process. Please try with a smaller or less complex image.",
            });
          }

          res.status(500).json({
            error: "Failed to process the image",
            message: (error as Error).message || "Unknown error",
          });
        }
      }
    }
  );
});

export default router;
