import { appConfig } from "@config/appConfig";
import { formatToMimeType } from "@utils/common";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: appConfig.cloudinaryName,
  api_key: appConfig.cloudinaryApiKey,
  api_secret: appConfig.cloudinaryApiSecret,
  secure: true,
});

class CloudinaryService {
  private client = cloudinary;

  async upload(
    filePath: string,
    options: Record<string, unknown> = {}
  ): Promise<
     {
        file: string;
        meta: {
          mimeType: string;
          publicId: string;
          bytes: number;
        };
      }
    | undefined
  > {
    try {
      const result = await this.client.uploader.upload(filePath, options);
      if (result.public_id) {
        return {
          file: result.secure_url,
          meta: {
            mimeType: formatToMimeType[result.format],
            publicId: result.public_id,
            bytes: result.bytes,
          },
        };
      }
      return undefined
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw new Error("Failed to upload image");
    }
  }

  async deleteResource(publicId: string): Promise<any> {
    try {
      const result = await this.client.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
      throw new Error("Failed to delete image");
    }
  }

  async getResourceDetails(publicId: string): Promise<any> {
    try {
      const result = await this.client.api.resource(publicId);
      return result;
    } catch (error) {
      console.error("Error fetching resource details from Cloudinary:", error);
      throw new Error("Failed to fetch resource details");
    }
  }
}

export const cloudinaryService = new CloudinaryService();
