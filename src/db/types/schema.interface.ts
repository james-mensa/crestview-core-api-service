import mongoose, { Document ,Schema} from "mongoose";

export enum AmenitiesTypes {
    SwimmingPool = "swimmingPool",
    Gym = "gym",
    Spa = "spa",
    Shuttle = "shuttle",
    Wifi = "wifi",
    Breakfast = "breakfast",
    Safe = "safe",
    Pet = "pet",
  }
  export type AmenitiesType = keyof typeof AmenitiesTypes;

export enum PaymentMethods {
    Cash = "cash",
    CreditCard = "creditCard",
    MOMO= "momo",
}

export type PaymentMethod = keyof typeof AmenitiesTypes;

  export interface ISuiteType extends Document{
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
    amenities: AmenitiesType[];
    rooms: mongoose.Types.ObjectId[];
  }
  
  export interface ISuite extends Document{
    booking?: mongoose.Types.ObjectId[];
    suiteType: mongoose.Types.ObjectId;
    roomNumber: string;
  
  }


  export interface IUser {
    fullname: string;
    alias?: string;
    email: string;
    password?: string;
    picture?: string;
    isSocialAuth: boolean;
    bookings?: mongoose.Types.ObjectId[];
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  

  export interface IBooking extends Document {
    paymentMethod: PaymentMethods;
    clientId: Schema.Types.ObjectId;
    suiteId: Schema.Types.ObjectId;
    checkInDate: Date;
    checkOutDate: Date;
    ratingId?: Schema.Types.ObjectId;
    totalPrice: number;
  }