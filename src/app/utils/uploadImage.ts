/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import AppError from './AppError';
import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';
import { Buffer } from 'buffer';

const filePath = './public/uploads/images/';

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer?: Buffer;
}

const fileUpload = (fileDirectory: string) => {
  if (!fs.existsSync(fileDirectory)) {
    fs.mkdirSync(filePath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, fileDirectory);
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + '_' + Date.now() + path.extname(file.originalname),
      );
    },
  });

  const upload = multer({
    storage,
    // limits: { fileSize: 2 * 1024 * 1024 },
  });

  return upload;
};

export const resizeImage = async (
  filePath: string,
  filename: string,
  width: number,
  height: number,
): Promise<{ filename: string; path: string }> => {
  const resizedFilename = `resized-${filename}`;
  const outputPath = path.join(path.dirname(filePath), resizedFilename);

  await sharp(filePath).resize(width, height).toFile(outputPath);

  // Delete original file
  fs.unlinkSync(filePath);

  return { filename: resizedFilename, path: outputPath };
};

export const resizeImageMiddleware =
  (width: number, height: number) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Handle single image
      if (req.file) {
        const { filename, path: resizedPath } = await resizeImage(
          req.file.path,
          req.file.filename,
          width,
          height,
        );
        req.file.filename = filename;
        req.file.path = resizedPath;
      }

      // Handle multiple images (req.files can be an object or array depending on upload type)
      if (req.files) {
        const filesArray: MulterFile[] = Array.isArray(req.files)
          ? req.files
          : Object.values(req.files).flat();

        for (const file of filesArray) {
          const { filename, path: resizedPath } = await resizeImage(
            file.path,
            file.filename,
            width,
            height,
          );
          file.filename = filename;
          file.path = resizedPath;
        }
      }

      next();
    } catch (error: any) {
      console.error('Image resize failed:', error);
      throw new AppError(httpStatus.BAD_REQUEST, error.message);
    }
  };
export default fileUpload;
