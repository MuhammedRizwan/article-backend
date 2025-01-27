import { Types } from "mongoose";

export default interface User {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    dob: Date;
    password: string;
    confirmPassword?:string;
    is_verified: boolean;
    articlePreferences: Types.ObjectId[]; 
  }
  