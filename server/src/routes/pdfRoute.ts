import { Router } from "express";
import multer from "multer";
import path from "path";

import fs from "fs";
import { processPdf } from "../api/index.js";
import {
  API_PREFIXES,
  environment,
  baseApiVersion,
} from "../config/api-config.js";

console.log(`Server running in ${environment} environment`);

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
  router.get(`${prefix}/process-pdf`, (req, res) => {
    res.json({
      status: "ready",
      message:
        "PDF processing endpoint is available. Please send a POST request with an pdf file.",
      environment,
      timestamp: new Date().toISOString(),
    });
  });

  router.post(
    `${prefix}/process-pdf`,
    upload.single("pdf"),
    async (req, res) => {
      try {
        const pdfFile = req.file as Express.Multer.File;
        const result = await processPdf(pdfFile);

        res.json({
          result,
          environment,
        });
      } catch (error) {
        console.error("Error in processing pdf:", error);
        res.status(500).json({ error: "Failed to process the pdf" });
      }
    }
  );
});

router.get(`${baseApiVersion}/process-pdf`, (req, res) => {
  res.json({
    status: "ready",
    message:
      "PDF processing endpoint is available. Please send a POST request with an pdf file.",
    environment,
    timestamp: new Date().toISOString(),
  });
});

router.post(
  `${baseApiVersion}/process-pdf`,
  upload.single("pdf"),
  async (req, res) => {
    try {
      const pdfFile = req.file as Express.Multer.File;
      const result = await processPdf(pdfFile);

      res.json({
        result,
        environment,
      });
    } catch (error) {
      console.error("Error in processing pdf:", error);
      res.status(500).json({ error: "Failed to process the pdf" });
    }
  }
);

export default router;
