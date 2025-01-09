import { DbCRUD } from "../services/crud";
import { ImageBodyInterface } from "@db/types/schema.interface";
import { ImageModel } from "@models/image.Schema";
import mongoose from "mongoose";

class ImageService {
  private crudJob: DbCRUD<ImageBodyInterface>;
  constructor() {
    this.crudJob = new DbCRUD<ImageBodyInterface>(
      "ImageService",
      ImageModel
    );
  }
  add = async (resource: ImageBodyInterface) => {
    const saveQuery = await this.crudJob.add({ ...resource }, { file:resource.file });
    console.log({saveQuery})
    return saveQuery;
  };

  insertSuiteType = async (_id: mongoose.Types.ObjectId ,suite_id: mongoose.Types.ObjectId) => {
    const saveQuery = await this.crudJob.updateOne({ _id}, { suiteType:suite_id });
    console.log({saveQuery})
    return saveQuery;
  };
}

export const imageService = new ImageService();
