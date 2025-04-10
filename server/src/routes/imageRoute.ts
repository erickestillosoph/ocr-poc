import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { processImage } from '../index';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

const router = Router();

router.post('/api/v1/process-image', upload.single('image'), async (req, res) => {
  try {
    const imageFile = req.file as Express.Multer.File;
    const result = await processImage(imageFile);
    res.json({ result });
  } catch (error) {
    console.error('Error in processing image:', error);
    res.status(500).json({ error: 'Failed to process the image' });
  }
});

export default router;
