import { Request, Response } from "express";

import { DbCRUD } from "./crud";
import { httpStatusCodes } from "@utils/httpStatusCodes";
import { ResponseHandler } from "@utils/responseHandler";
import { ISuiteType } from "@db/types/schema.interface";
import { SuiteTypeModel } from "@models/suiteType.schema";
import {  SuiteTypeDTOType, SuiteTypeSchema } from "@db/dto/suiteType.dto";


class SuiteTypeController {
  private crudJob: DbCRUD<ISuiteType>;
  constructor() {
    this.crudJob = new DbCRUD<ISuiteType>(
      "SuiteTypeController",
      SuiteTypeModel
    );
  
  }
  add = async (req: Request, res: Response) => {
    const responseHandler = new ResponseHandler<ISuiteType>(res,"SUITE::ADD");
    try {
      const data: SuiteTypeDTOType = SuiteTypeSchema.parse(req.body);
      const saveQuery= await this.crudJob.add(data,{name:data.name})
      if (saveQuery?.data) {
        responseHandler.send(httpStatusCodes.OK,"success",saveQuery.data);
        return;
      }

    } catch (error: any) {
      responseHandler.handleError(error,httpStatusCodes.INTERNAL_SERVER_ERROR,"");
    }
  };

}


export const suiteTypeController = new SuiteTypeController();
