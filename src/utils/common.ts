import fs from 'fs';
import { Types } from "mongoose";

// Utility function to convert image file to Base64 (for Node.js)
export const imageFileToBase64 = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'base64' }, (err, data) => {
      if (err) {
        reject(new Error(`Error reading file: ${err.message}`));
      } else {
        resolve(data);
      }
    });
  });
};


export const base64Image = async (filePath: string): Promise<{file:string}> => {
  try {

    const base64String = await imageFileToBase64(filePath);
    
    return {file:`data:image/png;base64,${base64String}`};
  } catch (error) {
    throw new Error(`Failed to convert image to Base64: ${(error as Error).message}`);
  }
};

export const parseObjectId = (id: string): Types.ObjectId => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ObjectId");
  }
  return new Types.ObjectId(id);
};


export const formatToMimeType: Record<string, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  mp4: 'video/mp4',
  gif: 'image/gif',
};