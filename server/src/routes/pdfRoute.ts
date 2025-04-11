import { Router } from "express";
import multer from "multer";
import path from "path";
import { processPdf } from "../index";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

const router = Router();

router.post("/process-pdf", upload.single("pdf"), async (req, res) => {
  try {
    const pdfFile = req.file as Express.Multer.File;
    const result = await processPdf(pdfFile);
    res.json({ result });
  } catch (error) {
    console.error("Error in processing pdf:", error);
    res.status(500).json({ error: "Failed to process the pdf" });
  }
});

export default router;
