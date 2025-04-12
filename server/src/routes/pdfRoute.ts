import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { pdfFileSchema } from '../functions/pdf/pdfSchema';
import { processPdf } from '../index';
import fs from 'fs';

const API_VERSION = process.env.API_VERSION;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Environment detection
export const isProduction = NODE_ENV === 'production';
export const environment = isProduction ? 'production' : 'local';
export const baseApiVersion = isProduction ? '' : API_VERSION;

console.log(`Server running in ${environment} environment`);

const uploadsDir = path.join(process.cwd(), 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (err) {
  console.error('Error creating uploads directory:', err);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

const router = Router();

router.post(
  `${baseApiVersion}/process-pdf`,
  upload.single('pdf'),
  async (req, res) => {
    try {
      const pdfFile = req.file as Express.Multer.File;
      const result = await processPdf(pdfFile);

      // Include environment information in the response
      res.json({
        result,
        environment,
      });
    } catch (error) {
      console.error('Error in processing pdf:', error);
      res.status(500).json({ error: 'Failed to process the pdf' });
    }
  }
);

export default router;
