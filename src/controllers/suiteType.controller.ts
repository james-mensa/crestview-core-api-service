import { Request, Response } from "express";

import { DbCRUD } from "../services/crud";
import { httpStatusCodes } from "@utils/httpStatusCodes";
import { ResponseHandler } from "@utils/responseHandler";
import { ISuiteType } from "@db/interfaces/schema.interface";
import { base64Image, parseObjectId } from "@utils/common";
import { SuiteTypeModel } from "@models/suiteType.schema";
import {
  parseBody,
  SuiteTypeDTOType,
  SuiteTypeSchema,
} from "@db/dto/suiteType.dto";
import { imageService } from "@services/image.service";
import { cloudinaryService } from "@services/cloudinary.services";
import { appConfig } from "@config/appConfig";

class SuiteTypeController {
  private crudJob: DbCRUD<ISuiteType>;
  constructor() {
    this.crudJob = new DbCRUD<ISuiteType>(
      "SuiteTypeController",
      SuiteTypeModel
    );
  }
  add = async (req: Request, res: Response) => {
    const responseHandler = new ResponseHandler<ISuiteType>(res, "SUITE::ADD");
    try {
      const { body, files } = req;
      const filesArray = files ? Object.values(files).flat() : [];
      const base64Images = await Promise.all(
        filesArray.map(async (file) => {
          const processedResource = appConfig.cloudinaryForStorageEnabled
            ? await cloudinaryService.upload(file.path)
            : await base64Image(file.path);
          if (processedResource) {
            const response = await imageService.add(processedResource);
            return response?.data?._id;
          }
          return undefined;
        })
      );
      const formData = parseBody(body);

      const validImageIds = base64Images.filter((id) => id !== undefined);

      const data: SuiteTypeDTOType = SuiteTypeSchema.parse(formData);

      const saveQuery = await this.crudJob.add(
        { ...data, images: validImageIds },
        { name: data.name }
      );
      if (saveQuery?.data) {
        await Promise.all(
          validImageIds.map(async (id) => {
            if (saveQuery.data?._id) {
              await imageService.insertSuiteType(id, saveQuery.data._id);
            }
          })
        );
        responseHandler.send(
          httpStatusCodes.OK,
          `suite type${data.name} added successfully`,
          saveQuery.data
        );
        return;
      }
    } catch (error: any) {
      console.log({ errorA: error });
      responseHandler.handleError(
        error,
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        ""
      );
    }
  };
  getAll = async (_req: Request, res: Response) => {
    const responseHandler = new ResponseHandler<ISuiteType>(
      res,
      "SUITE TYPE::GET ALL"
    );
    try {
      const query = await this.crudJob.findAll({ populate: ["images","rooms"] });
      if (query?.data) {
        responseHandler.send(httpStatusCodes.OK, "success", query.data);
        return;
      }
    } catch (error) {
      responseHandler.handleError(
        error,
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        ""
      );
    }
  };

  getOne = async (req: Request, res: Response) => {
    const responseHandler = new ResponseHandler<ISuiteType>(
      res,
      "SUITE TYPE::GET A SUITE TYPE"
    );
    try {
      const query = await this.crudJob.findOne(
        {
          _id: parseObjectId(req.params.id),
        },
        { populate: ["images","rooms"] }
      );
      if (query?.data) {
        responseHandler.send(
          httpStatusCodes.OK,
          "retrieved success",
          query.data
        );
        return;
      }
    } catch (error) {
      responseHandler.handleError(
        error,
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        ""
      );
    }
  };
  delete = async (req: Request, res: Response) => {
    const responseHandler = new ResponseHandler<ISuiteType>(
      res,
      "SUITE TYPE::DELETE SUITE TYPE"
    );
    try {
      const query = await this.crudJob.removeDocument({
        _id: parseObjectId(req.params.id),
      });
      if (query?.data) {
        const images = query.data.images;
        await Promise.all(
          images.map(async (id) => {
            await imageService.delete(id);
          })
        );
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

  update = async (req: Request, res: Response) => {
    const responseHandler = new ResponseHandler<ISuiteType>(
      res,
      "SUITE TYPE::UPDATE SUITE TYPE"
    );
    try {
      const query = await this.crudJob.updateOne(
        { _id: parseObjectId(req.params.id) },
        req.body
      );
      if (query?.data) {
        responseHandler.send(
          httpStatusCodes.OK,
          "updated successfully",
          query.data
        );
        return;
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

export const suiteTypeController = new SuiteTypeController();
