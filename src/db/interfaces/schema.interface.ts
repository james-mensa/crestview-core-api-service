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
    images: mongoose.Types.ObjectId[];
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
    _id?:mongoose.Types.ObjectId;
    discount?: number;
    reservationPolicy?: string;
  }


  export enum SuiteStatus {
    AVAILABLE = "available",
    OCCUPIED = "occupied",
    RESERVED = "reserved",
  }
  export enum SuiteHousekeepingStatus {
    CLEAN = "clean",
    DIRTY = "dirty",
    INSPECTION = "inspection",
  }
  export interface ISuite{
    bookings?: mongoose.Types.ObjectId[];
    suiteTypeId: mongoose.Types.ObjectId;
    roomNumber: string;
    status?:SuiteStatus,
    floorNumber?: number;
    housekeepingStatus?:SuiteHousekeepingStatus
    tags?: string[]; 
    _id?:mongoose.Types.ObjectId 
  }
  export interface ImageBodyInterface {
    suiteType?: mongoose.Types.ObjectId;
    file:string,
    _id?:mongoose.Types.ObjectId
    meta?:{
      mimeType:string,
      publicId:string,
      bytes:number
    }
  
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