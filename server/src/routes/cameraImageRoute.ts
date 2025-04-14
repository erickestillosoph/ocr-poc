import { Router } from "express";
import { processCameraImage } from "../api/index.js";
import multer from "multer";
import { API_PREFIXES, environment } from "../config/api-config.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Create routes for each API prefix
API_PREFIXES.forEach((prefix) => {
  router.get(`${prefix}/process-camera-image`, (req, res) => {
    res.json({
      status: "ready",
      message:
        "Camera Image processing endpoint is available. Please send a POST request with an image file in the 'cameraImage' field.",
      environment,
      timestamp: new Date().toISOString(),
    });
  });

  router.post(`${prefix}/process-string-header`, async (req, res) => {
    try {
      res.json({
        status: "success",
        message: "Successfully processed header string",
        environment,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error processing header string:", error);
      res.status(500).json({
        error: "Failed to process header string",
        message: (error as Error).message || "Unknown error",
      });
    }
  });

  router.post(`${prefix}/process-camera-image`, async (req, res) => {
    try {
      const base64Image = req.body.cameraImage as string;

      const result = await processCameraImage(base64Image);

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
  });
});

export default router;
