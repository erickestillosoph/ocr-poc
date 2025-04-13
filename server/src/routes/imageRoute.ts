import { Router } from "express";
import multer from "multer";
import path from "path";

import fs from "fs";
import { processImage } from "../api/index.js";

const API_VERSION = process.env.API_VERSION || "";
const NODE_ENV = process.env.NODE_ENV || "development";

// Environment detection
export const isProduction = NODE_ENV === "production";
export const environment = isProduction ? "production" : "local";
// export const baseApiVersion = isProduction ? "" : API_VERSION;

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

router.post(
  `/${API_VERSION}/process-image`,
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
