
import  mongoose, { Schema } from 'mongoose';
import { ImageBodyInterface } from '../types/schema.interface';
const metaSchema = new Schema({
  mimeType: { type: String, required: true },
  publicId: { type: String, required: true },
  bytes: { type: Number, required: true },
});
const imageSchema =new Schema<ImageBodyInterface>({

  file:{type:String},
  suiteType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SuiteType",
  },
  meta: { type: metaSchema, required: false },

});
export const  ImageModel = mongoose.model<ImageBodyInterface>("images", imageSchema);