import { Request, Response } from "express";

import { DbCRUD } from "../services/crud";
import { httpStatusCodes } from "@utils/httpStatusCodes";
import { ResponseHandler } from "@utils/responseHandler";
import { ISuiteType } from "@db/types/schema.interface";
import { base64Image } from "@utils/common";
import { SuiteTypeModel } from "@models/suiteType.schema";
import {  parseBody, SuiteTypeDTOType, SuiteTypeSchema } from "@db/dto/suiteType.dto";
import mongoose from "mongoose";


class SuiteTypeController {
  private crudJob: DbCRUD<ISuiteType>;
  constructor() {
    this.crudJob = new DbCRUD<ISuiteType>(
      "SuiteTypeController",
      SuiteTypeModel
    );
  
  }
  add = async (req: Request, res: Response) => {
    console.log("adding request")
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
        responseHandler.send(httpStatusCodes.OK,`suite type${data.name} added successfully`,saveQuery.data);
        return;
      }
 
    } catch (error: any) {
      responseHandler.handleError(error,httpStatusCodes.INTERNAL_SERVER_ERROR,"");
    }
   
  };
  getAll=async (_req:Request, res:Response) =>{
    const responseHandler = new ResponseHandler<ISuiteType>(res,"SUITE TYPE::GET ALL");
    try {
      const query= await this.crudJob.findAll();
      if (query?.data) {
        responseHandler.send(httpStatusCodes.OK,"success",query.data);
        return;
      }
    } catch (error) {
      responseHandler.handleError(error,httpStatusCodes.INTERNAL_SERVER_ERROR,"");
    }

  }

  getOne=async (req:Request, res:Response) =>{
    const responseHandler = new ResponseHandler<ISuiteType>(res,"SUITE TYPE::GET A SUITE TYPE");
    try {
      const query= await this.crudJob.findOne({_id:req.params.id as unknown as mongoose.Types.ObjectId});
      if (query?.data) {
        responseHandler.send(httpStatusCodes.OK,"retrieved success",query.data);
        return;
      }
    } catch (error) {
      responseHandler.handleError(error,httpStatusCodes.INTERNAL_SERVER_ERROR,"");
    }

  }
  delete=async (req:Request, res:Response) =>{
    const responseHandler = new ResponseHandler<ISuiteType>(res,"SUITE TYPE::DELETE SUITE TYPE");
    try {
      const query= await this.crudJob.removeDocument({_id:req.params.id as unknown as mongoose.Types.ObjectId});
      if (query?.data) {
        responseHandler.send(httpStatusCodes.OK,"deleted successfully",query.data);
        return;
      }else{
        responseHandler.send(httpStatusCodes.NOT_FOUND,"NOT FOUND");
      }
    } catch (error) {
      responseHandler.handleError(error,httpStatusCodes.INTERNAL_SERVER_ERROR,"");
    }

  }

  update=async (req:Request, res:Response) =>{
    const responseHandler = new ResponseHandler<ISuiteType>(res,"SUITE TYPE::UPDATE SUITE TYPE");
    try {
      const query= await this.crudJob.updateOne({_id:req.params.id as unknown as mongoose.Types.ObjectId},req.body);
      if (query?.data) {
        responseHandler.send(httpStatusCodes.OK,"updated successfully",query.data);
        return;
      }
    } catch (error) {
      responseHandler.handleError(error,httpStatusCodes.INTERNAL_SERVER_ERROR,"");
    }
  }
}


export const suiteTypeController = new SuiteTypeController();
