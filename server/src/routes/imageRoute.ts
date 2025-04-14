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

const uploadsDir = path.join(process.cwd(), "uploads");
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (err) {
  console.error("Error creating uploads directory:", err);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
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
        const result = await processImage(imageFile);
        res.json({
          result,
          environment,
        });
      } catch (error) {
        console.error("Error in processing image:", error);
        res.status(500).json({ error: "Failed to process the image" });
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
      const result = await processImage(imageFile);
      res.json({
        result,
        environment,
      });
    } catch (error) {
      console.error("Error in processing image:", error);
      res.status(500).json({ error: "Failed to process the image" });
    }
  }
);

export default router;
