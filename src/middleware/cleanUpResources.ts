import fs from 'fs';
import path from 'path';


const clearUploadFolder = (): void => {
  const uploadDir = path.join(process.cwd(), 'uploads');


  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error('Error reading uploads folder:', err);
      return;
    }


    files.forEach((file) => {
      const filePath = path.join(uploadDir, file);


      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error checking file stats for ${filePath}:`, err);
          return;
        }

        if (stats.isFile()) {

          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting file ${filePath}:`, err);
            } else {
              console.log(`File deleted: ${filePath}`);
            }
          });
        }
      });
    });
  });
};

export default clearUploadFolder;
