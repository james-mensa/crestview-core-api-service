import fs from 'fs';

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


export const base64Image = async (filePath: string): Promise<string> => {
  try {

    const base64String = await imageFileToBase64(filePath);
    
    return `data:image/png;base64,${base64String}`;
  } catch (error) {
    throw new Error(`Failed to convert image to Base64: ${(error as Error).message}`);
  }
};
