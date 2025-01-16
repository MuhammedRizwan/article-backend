import { Schema, Types, model } from "mongoose";

const userSchema = new Schema(
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

const User = model("User", userSchema);
export default User;
