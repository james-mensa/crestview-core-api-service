import { Request, Response } from "express";
import {
  UserSchema,
  UserDTO,
  UserQuerySchema,
  UserQueryDTO,
  UserParamSchema,
  UserParamDTO,
  UserAuthSchema,
} from "@db/dto/user.dto";
import { DbCRUD } from "../services/crud";
import { userModel } from "@models/user.schema";
import JwtService from "@services/jwt.service";
import emailService from "@services/email.service";
import { IUser } from "@db/types/schema.interface";
import { getInitials} from "@lib/common";
import mongoose from "mongoose";
import { httpStatusCodes } from "@utils/httpStatusCodes";
import { ResponseHandler } from "@utils/responseHandler";
import axios from "axios";
import { appConfig } from "@config/appConfig";

const PartialUserSchema = UserSchema.partial();
class UserController {

  private crudJob: DbCRUD<IUser>;
  private jwtService: JwtService;
  constructor() {
    this.crudJob = new DbCRUD<Omit<IUser, "password">>(
      "UserController",
      userModel
    );
   
    this.jwtService = new JwtService();
  }
  registerUser = async (req: Request, res: Response) => {
    const responseHandler = new ResponseHandler<IUser>(res,"User::register");
    try {
      console.log({response:req.body})
      const data: UserDTO = UserSchema.parse(req.body);
      const existingUser = await this.crudJob.findOne({ email: data.email });
      if (existingUser?.data) {
        responseHandler.send(httpStatusCodes.BAD_REQUEST,"Email already used");
        return;
      }
      const token = this.jwtService.generateToken(data);
      const emailSent = await emailService.registerUser(
        data.fullname,
        data.email,
        token
      );
      if (emailSent) { responseHandler.send(httpStatusCodes.OK,"Check email to verify"); return;
      }
    } catch (error: any) {
      responseHandler.handleError(error,httpStatusCodes.INTERNAL_SERVER_ERROR,"failed, try again");
    }
  };

  verifyUser = async (req: Request, res: Response) => {
    const responseHandler = new ResponseHandler<IUser>(res,"User::verify");
    try {
      const data: UserQueryDTO = UserQuerySchema.parse(req.query);
      const jwtPayload = this.jwtService.verifyToken(data.t);
      const existingUser = await this.crudJob.findOne({
        email: jwtPayload.email,
      });
      if (existingUser?.data) {
        responseHandler.send(httpStatusCodes.BAD_REQUEST,"Email already used" );
        return;
      }
      const userData: IUser = {
        ...(jwtPayload as UserDTO),
        alias: getInitials(jwtPayload.fullname),
        active: true,
      };
      const newUser = await this.crudJob.add(userData, {
        email: userData.email,
      });
      if(newUser?.data){
        responseHandler.send(httpStatusCodes.OK,"Verificaton successfull", newUser?.data );
      }
    } catch (error) {
      responseHandler.handleError(error,httpStatusCodes.BAD_REQUEST,"Token expired", );
    }
  };
  deleteUser = async () => {};

  loginUser = async (req: Request, res: Response) => {
    const responseHandler = new ResponseHandler<IUser>(res,"User::login");
    try {
      const credential = UserAuthSchema.parse(req.body);
      const _user  =await this.crudJob.findOne({ email: credential.email }).then((__res) => __res?.data);
      if (_user && _user.verifyPassword) {
        const isMatch = await _user.verifyPassword(credential.password);
        if (!isMatch) {
          responseHandler.send(httpStatusCodes.UNAUTHORIZED,"Invalid credentials")
          return;
        }
        const query = await this.crudJob.findOne({_id: _user._id },{ populate: "booking" }
        );
        responseHandler.send(httpStatusCodes.OK,"success",query?.data);
      } else {
        responseHandler.send(httpStatusCodes.BAD_REQUEST,"no account found");
      }
    } catch (error) {
      responseHandler.handleError(error,httpStatusCodes.INTERNAL_SERVER_ERROR,"error")
    }
  };
  authInit=async(req:Request,res:Response)=>{
    const responseHandler = new ResponseHandler<IUser>(res,"User::initAuth");
    try {
     
      const data =UserAuthSchema.omit({password:true}).parse(req.params)
      console.log({response:data})
      const query = await this.crudJob.findOne({email:data?.email})

      const _user=query?.data
      if (_user?._id) {
        if(_user.isSocialAuth) {
          res.status(200).json({path:'/new_password'});return;
        }
        res.status(200).json({path:'/login'});
        return;
      }
        res.status(200).json({path:'/signup'});
    } catch (error) {
      responseHandler.handleError(error,httpStatusCodes.BAD_REQUEST,'')
    }
  }
  socialAuth = async (req: Request, res: Response) => {
    const responseHandler = new ResponseHandler<IUser>(res,"User::login:googleAuth");
    try {
      const data = UserQuerySchema.parse(req.query)
      const authResponse=await fetchGoogleAccount(data.t)
      if(authResponse.status===200){
              const client=authResponse.data;
              const user = await this.crudJob.findOne({email:client.email})
              if(!user?.data){
                const _user:IUser ={
                  fullname:client.name,
                  email: client.email,
                  password:"",
                  picture:client.picture,
                  alias:getInitials(client.name),
                  isSocialAuth:true,
                  active:true
                }
              const saveQuery=await  this.crudJob.add(_user,{email:_user.email})
              responseHandler.send(httpStatusCodes.OK,'success',saveQuery?.data)
              console.log({saveQuery})
              return;
              }
              responseHandler.send(httpStatusCodes.OK,'success',user?.data)
        
      }
    } catch (error) {
      responseHandler.handleError(error,httpStatusCodes.BAD_REQUEST,'')
        
    }
  };

  updateUser = async (req: Request, res: Response) => {
    const response = new ResponseHandler<IUser>(res,"User::update");
    try {
      const param: UserParamDTO = UserParamSchema.parse(req.params);
      const userData = PartialUserSchema.parse(req.body);
      const updatedDocument = await this.crudJob.updateOne(
        { _id: param.id as unknown as mongoose.Types.ObjectId },
        userData
      );
      response.send(httpStatusCodes.OK,"success",updatedDocument.data);
    } catch (error) {
      response.handleError(error,httpStatusCodes.INTERNAL_SERVER_ERROR,"")
    }
  };
  getUsers = async (_: Request, res: Response) => {
    const response = new ResponseHandler<IUser>(res,"User::fetchList");
    try {
      const query = await this.crudJob.findAll();
      response.send(httpStatusCodes.OK,"success",query?.data)
    } catch (error) {
      response.handleError(error,httpStatusCodes.INTERNAL_SERVER_ERROR,"")
    }
  };
  getUser = async (req: Request, res: Response) => {
    const response = new ResponseHandler<IUser>(res,"User::fetch");
    try {
      const userId = req.params.id as unknown as mongoose.Types.ObjectId;
      const user = await this.crudJob.findOne({ _id: userId });
      if (user?.data) {
        response.send(httpStatusCodes.OK,'success',user?.data);
        return;
      } 
      response.send(httpStatusCodes.NOT_FOUND,'account not found');
    } catch (error) {
      res.status((error as any).status).json({ error: (error as any).message });
    }
  };
  userUserPasswordResetRequest = async () => {};
  userPasswordReset = async () => {};
}

const fetchGoogleAccount=async (token:string)=>{
  return await axios.get(`${appConfig.googAuthLink}?access_token=${token}`, {
    headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
    }
})


}

export const userController = new UserController();
