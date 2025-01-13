import { DbCRUD } from "../services/crud";
import { ImageBodyInterface } from "@db/interfaces/schema.interface";
import { ImageModel } from "@models/image.Schema";
import mongoose from "mongoose";
import { cloudinaryService } from "./cloudinary.services";

class ImageService {
  private crudJob: DbCRUD<ImageBodyInterface>;
  constructor() {
    this.crudJob = new DbCRUD<ImageBodyInterface>("ImageService", ImageModel);
  }
  add = async (resource: ImageBodyInterface) => {
    const saveQuery = await this.crudJob.add(
      { ...resource },
      { file: resource.file }
    );
    return saveQuery;
  };

  insertSuiteType = async (
    _id: mongoose.Types.ObjectId,
    suite_id: mongoose.Types.ObjectId
  ) => {
    const saveQuery = await this.crudJob.updateOne(
      { _id },
      { suiteType: suite_id }
    );
    return saveQuery;
  };
  delete = async (_id: mongoose.Types.ObjectId) => {
    try {
      const query = await this.crudJob.removeDocument({
        _id,
      });
      if (query?.data) {
        const publicId = query.data.meta?.publicId;
        if (publicId) {
          cloudinaryService.deleteResource(publicId);
        }
      }
    } catch (error) {}
  };
}

export const imageService = new ImageService();
