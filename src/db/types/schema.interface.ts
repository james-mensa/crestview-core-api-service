import mongoose, { Document ,Schema} from "mongoose";

export const amenitiesTypes ={
    SwimmingPool : "swimmingPool",
    Gym : "gym",
    Spa : "spa",
    Shuttle : "shuttle",
    Wifi : "wifi",
    Breakfast : "breakfast",
    Safe : "safe",
    Pet : "pet",
  } as const
  export type AmenitiesType =
  (typeof amenitiesTypes)[keyof typeof amenitiesTypes];

export enum PaymentMethods {
    Cash = "cash",
    CreditCard = "creditCard",
    MOMO= "momo",
}

export type PaymentMethod = keyof typeof PaymentMethods;

  export interface ISuiteType{
    picture: string[];
    price: number;
    tax?: number;
    name: string;
    rating?: number; 
    description: string;
    capacity: {
      adult: number;
      children: number;
    };
    mattress?: string; 
    amenities?: AmenitiesType[];
    rooms?: any;
  }
  
  export interface ISuite extends Document{
    booking?: mongoose.Types.ObjectId[];
    suiteType: mongoose.Types.ObjectId;
    roomNumber: string;
  
  }


  export interface IUser {
    _id?: mongoose.Types.ObjectId; 
    fullname: string;
    alias?: string;
    email: string;
    password?: string;
    picture?: string;
    isSocialAuth?: boolean;
    booking?: mongoose.Types.ObjectId[];
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    verifyPassword?: (_key:string)=>Promise<boolean>
  }


export type PaymentStatus= "pending" | "completed" |"failed"
  export interface IBooking extends Document {
    paymentMethod: PaymentMethods;
    clientId: Schema.Types.ObjectId;
    suiteId: Schema.Types.ObjectId;
    checkInDate: Date;
    checkOutDate: Date;
    ratingId?: Schema.Types.ObjectId;
    totalPrice: number;
    taxAmount?: number;
    discount?: number;
    finalPrice?: number;
    paymentStatus?: PaymentStatus;
  }