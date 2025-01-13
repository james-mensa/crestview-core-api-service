import { SuiteDTO, SuiteSchema } from "@db/dto/suite.dto";
import { ISuite, ISuiteType } from "@db/interfaces/schema.interface";
import { suiteModel } from "@models/suite.schema";
import { SuiteTypeModel } from "@models/suiteType.schema";
import { DbCRUD } from "@services/crud";
import { httpStatusCodes } from "@utils/httpStatusCodes";
import { ResponseHandler } from "@utils/responseHandler";
import { Request, Response } from "express";

class RoomController {
  private crudJob: DbCRUD<ISuite>;
  private suiteTypeCrudJob: DbCRUD<ISuiteType>;
  constructor() {
    this.crudJob = new DbCRUD<ISuite>("RoomController", suiteModel);
    this.suiteTypeCrudJob = new DbCRUD<ISuiteType>(
      "SuiteTypeController",
      SuiteTypeModel
    );
  }
  add = async (req: Request, res: Response) => {
    const responseHandler = new ResponseHandler<any>(res, "SUITE::ADD");
    try {
      const requestBody:SuiteDTO = SuiteSchema.parse(req.body);
     
      const suiteTypeExits = await this.suiteTypeCrudJob.findOne({
        _id:  requestBody.suiteTypeId,
      });
      if (!suiteTypeExits?.data?._id) {
        responseHandler.send(
          httpStatusCodes.NOT_FOUND,
          `suite type not found `
        );
        return;
      }
      const roomNumberExits = await this.crudJob.findOne({
        roomNumber: requestBody.roomNumber,
      });
      if (roomNumberExits?.data?._id) {
        responseHandler.send(
          httpStatusCodes.BAD_REQUEST,
          `Room room number ${requestBody.roomNumber} already exits`
        );
        return;
      }

      const addRoomRes = await this.crudJob.add(requestBody, {
        roomNumber: requestBody.roomNumber,
      });
      if (addRoomRes?.data?._id) {
        await this.suiteTypeCrudJob.updateOne(
          { _id: requestBody.suiteTypeId },
          { rooms: [...suiteTypeExits.data.rooms, addRoomRes.data._id] }
        );
        const updatedSuiteType = await this.suiteTypeCrudJob.findOne(
          {
            _id: requestBody.suiteTypeId,
          },
          { populate: ["images", "rooms"] }
        );
        responseHandler.send(
          updatedSuiteType?.data?._id
            ? httpStatusCodes.OK
            : httpStatusCodes.BAD_REQUEST,
          updatedSuiteType?.data?._id
            ? `Room room number ${requestBody.roomNumber} added to  ${updatedSuiteType?.data?.name} successfully`
            : "Request failed",updatedSuiteType?.data
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

export const roomController = new RoomController();
