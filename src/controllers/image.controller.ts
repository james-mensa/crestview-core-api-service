import { Request, Response } from "express";
import { DbCRUD } from "../services/crud";
import { httpStatusCodes } from "@utils/httpStatusCodes";
import { ResponseHandler } from "@utils/responseHandler";
import { ImageBodyInterface } from "@db/interfaces/schema.interface";
import { parseObjectId } from "@utils/common";

import { ImageModel } from "@models/image.Schema";

class ImageController {
  private crudJob: DbCRUD<ImageBodyInterface>;
  constructor() {
    this.crudJob = new DbCRUD<ImageBodyInterface>(
      "ImageController",
      ImageModel
    );
  }

  delete = async (req: Request, res: Response) => {
    const responseHandler = new ResponseHandler<ImageBodyInterface>(
      res,
      "IMAGE ::DELETE IMAGE"
    );
    try {
      const query = await this.crudJob.removeDocument({
        _id: parseObjectId(req.params.id),
      });
      if (query?.data) {
        responseHandler.send(
          httpStatusCodes.OK,
          "deleted successfully",
          query.data
        );
        return;
      } else {
        responseHandler.send(httpStatusCodes.NOT_FOUND, "NOT FOUND");
      }
    } catch (error) {
      responseHandler.handleError(
        error,
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        ""
      );
    }
  };
}

export const suiteTypeController = new ImageController();
