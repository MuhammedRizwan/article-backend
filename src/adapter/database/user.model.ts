import { Schema, model, Types } from "mongoose";
import User from "../../domain/entities/User";

const userSchema = new Schema<User>(
  {
    firstName: { type: String, required: true, minlength: 2 },
    lastName: { type: String, required: true, minlength: 2 },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    password: { type: String, required: true, minlength: 8 },
    is_verified: { type: Boolean, default: false },
    articlePreferences: { type: [Types.ObjectId], ref: "Category" },
  },
  {
    timestamps: true,
  }
);

const UserModel = model<User>("User", userSchema);
export default UserModel;
