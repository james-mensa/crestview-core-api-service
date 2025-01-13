import  mongoose, { Schema }  from 'mongoose';
import bcryt from 'bcrypt';
import jwt from  'jsonwebtoken';
import { appConfig } from '@config/appConfig';
import { IUser } from '../interfaces/schema.interface';
const userSchema =new Schema<IUser>(
 {
      fullname: {
        type: String,
        min: 4,
        max: 15,
      },
      alias: {
        type: String,
      },
      email: {
        type: String,
      },
      password: {
        type: String,
      },
      picture:{
        type:String
      },
      isSocialAuth:{
        type: Boolean,
        default: false
      },
  
      booking: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "booking",
        },
      ],
      active: {
        type: Boolean,
        default: true,
      },
    },
    {timestamps: true}
  );
  
  userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
      const salt = await bcryt.genSalt(10);
      user.password=await  bcryt.hash(user.password as string, salt);
    }
    next();
  });
  
  userSchema.methods.verifyPassword= async function(key:string){
    const user=this;
    return await bcryt.compare(key,user.password)
  }

  userSchema.methods.registerToken = function () {
    const user = this;
    const userId = { _id: user._id.toHexString(), email: user.email };
    const token = jwt.sign(userId, appConfig.db_scret??'', { expiresIn: "1d" });
    return token;
  };
  export const userModel= mongoose.model<IUser>("User", userSchema);