import mongoose, { Schema, model, models, Document } from "mongoose";
//import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password?: string;
  googleId?: string;
  name?: string;
  image?: string;
  savedReels?: mongoose.Types.ObjectId[];
  _id: mongoose.Types.ObjectId; // Required, not optional
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth users
    googleId: { type: String, unique: true, sparse: true },
    name: { type: String },
    image: { type: String },
    savedReels: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reel" }],
      default: [],
    }
  },
  { timestamps: true }
);



const User = models?.User || model<IUser>("User", userSchema);
export default User;