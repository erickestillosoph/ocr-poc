import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { processImage } from "../api/index.js";
import {
  API_PREFIXES,
  environment,
  baseApiVersion,
} from "../config/api-config.js";
import {
  uploadsDir,
  initializeUploadDirectories,
} from "../config/upload-config.js";

// Initialize upload directories with Image route prefix
initializeUploadDirectories("Image route: ");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      cb(null, uploadsDir);
    } catch (err) {
      console.error(
        `Error accessing upload directory, falling back to /tmp:`,
        err
      );
      cb(null, "/tmp");
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

const router = Router();

// Create routes for each API prefix
API_PREFIXES.forEach((prefix) => {
  // Add GET handler for testing and debugging
  router.get(`${prefix}/process-image`, (req, res) => {
    res.json({
      status: "ready",
      message:
        "Image processing endpoint is available. Please send a POST request with an image file.",
      environment,
      timestamp: new Date().toISOString(),
    });
  });

  router.post(
    `${prefix}/process-image`,
    upload.single("image"),
    async (req, res) => {
      try {
        const imageFile = req.file as Express.Multer.File;
        if (!imageFile) {
          return res.status(400).json({ error: "No image file provided" });
        }

        // Set a longer timeout for the response
        res.setTimeout(7000, () => {
          console.log("Response timeout reached");
          // This will only execute if the response hasn't been sent yet
          if (!res.headersSent) {
            res.status(504).json({
              error: "Gateway timeout",
              message:
                "The request is taking too long to process. Please try with a smaller or less complex image.",
            });
          }
        });

        const result = await processImage(imageFile);
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

          // Handle other errors
          res.status(500).json({
            error: "Failed to process the image",
            message: (error as Error).message || "Unknown error",
          });
        }
      }
    }
  );
});

router.get(`${baseApiVersion}/process-image`, (req, res) => {
  res.json({
    status: "ready",
    message:
      "Image processing endpoint is available. Please send a POST request with an image file.",
    environment,
    timestamp: new Date().toISOString(),
  });
});

router.post(
  `${baseApiVersion}/process-image`,
  upload.single("image"),
  async (req, res) => {
    try {
      const imageFile = req.file as Express.Multer.File;
      if (!imageFile) {
        return res.status(400).json({ error: "No image file provided" });
      }

      // Set a longer timeout for the response
      res.setTimeout(7000, () => {
        console.log("Response timeout reached");
        // This will only execute if the response hasn't been sent yet
        if (!res.headersSent) {
          res.status(504).json({
            error: "Gateway timeout",
            message:
              "The request is taking too long to process. Please try with a smaller or less complex image.",
          });
        }
      });

      const result = await processImage(imageFile);
      res.json({
        result,
        environment,
      });
    } catch (error) {
      console.error("Error in processing image:", error);
      // Check if headers were already sent
      if (!res.headersSent) {
        // Handle timeout error specifically
        if ((error as Error).message.includes("timeout")) {
          return res.status(504).json({
            error: "Gateway timeout",
            message:
              "The request is taking too long to process. Please try with a smaller or less complex image.",
          });
        }

        // Handle other errors
        res.status(500).json({
          error: "Failed to process the image",
          message: (error as Error).message || "Unknown error",
        });
      }
    }
  }
);

export default router;
