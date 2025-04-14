import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { processPdf } from "../api/index.js";
import { API_PREFIXES, environment } from "../config/api-config.js";
import {
  uploadsDir,
  initializeUploadDirectories,
} from "../config/upload-config.js";

console.log(`Server running in ${environment} environment`);

// Initialize upload directories with PDF route prefix
initializeUploadDirectories("PDF route: ");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Double-check the directory exists when handling the upload
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      cb(null, uploadsDir);
    } catch (err) {
      // Fallback to /tmp if the main directory fails
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
  router.get(`${prefix}/process-pdf`, (req, res) => {
    res.json({
      status: "ready",
      message:
        "PDF processing endpoint is available. Please send a POST request with a PDF file.",
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
        if (!pdfFile) {
          return res.status(400).json({ error: "No PDF file provided" });
        }

        // Set a longer timeout for the response
        res.setTimeout(30000, () => {
          console.log("Response timeout reached");
          // This will only execute if the response hasn't been sent yet
          if (!res.headersSent) {
            res.status(504).json({
              error: "Gateway timeout",
              message:
                "The request is taking too long to process. Please try with a smaller or less complex PDF.",
            });
          }
        });

        const result = await processPdf(pdfFile);
        res.json({
          result,
          environment,
        });
      } catch (error) {
        console.error("Error in processing PDF:", error);

        if (!res.headersSent) {
          if ((error as Error).message.includes("timeout")) {
            return res.status(504).json({
              error: "Gateway timeout",
              message:
                "The request is taking too long to process. Please try with a smaller or less complex PDF.",
            });
          }

          // Handle other errors
          res.status(500).json({
            error: "Failed to process the PDF",
            message: (error as Error).message || "Unknown error",
          });
        }
      }
    }
  );
});

export default router;
