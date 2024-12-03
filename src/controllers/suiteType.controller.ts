import { Request, Response } from "express";

import { DbCRUD } from "../services/crud";
import { httpStatusCodes } from "@utils/httpStatusCodes";
import { ResponseHandler } from "@utils/responseHandler";
import { ISuiteType } from "@db/types/schema.interface";
import { base64Image } from "@utils/common";
import { SuiteTypeModel } from "@models/suiteType.schema";
import {  parseBody, SuiteTypeDTOType, SuiteTypeSchema } from "@db/dto/suiteType.dto";


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
      const {body,files} = req;
      const filesArray = files ? Object.values(files).flat() : [];
      const base64Images = await Promise.all(
        filesArray.map(async (file) => await base64Image(file.path))
      );
      const formData=parseBody(body)
    
      const data: SuiteTypeDTOType = SuiteTypeSchema.parse(formData);
      const saveQuery= await this.crudJob.add({...data,images:base64Images},{name:data.name})
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
