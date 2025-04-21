import { Router } from "express";
import { processPDFPathBase64 } from "../api/index.js";
import multer from "multer";
import { API_PREFIXES, environment } from "../config/api-config.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

API_PREFIXES.forEach((prefix) => {
  router.get(`${prefix}/process-pdf`, (req, res) => {
    res.json({
      status: "ready",
      message:
        "PDF processing endpoint is available. Please send a POST request with a PDF file in the 'PDF' field.",
      environment,
      timestamp: new Date().toISOString(),
    });
  });

  router.post(
    `${prefix}/process-pdf`,
    upload.single("pdf"),
    async (req, res) => {
      try {
        const base64PDF = req.body.pdf;
        const pdfMediaType = req;
        console.log("pdfMediaType", pdfMediaType);

        const result = await processPDFPathBase64(base64PDF);

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
                "The request is taking too long to process. Please try with a smaller or less complex pdf.",
            });
          }

          res.status(500).json({
            error: "Failed to process the pdf",
            message: (error as Error).message || "Unknown error",
          });
        }
      }
    }
  );
});

export default router;
