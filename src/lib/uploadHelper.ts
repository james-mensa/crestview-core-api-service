import multer, { StorageEngine } from 'multer';
import { Request } from 'express';

const storage: StorageEngine = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: Function) => {
    cb(null, 'artifacts/');  
  },
  filename: (_req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, `${Date.now()}-${file.originalname}`);  
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: Function) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false); 
  }
};

export const uploadHelper = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },  
});
