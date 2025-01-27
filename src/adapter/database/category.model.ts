import { Schema, model } from "mongoose";
import Category from "../../domain/entities/Category";

const CategorySchema = new Schema<Category>(
  {
    name: { type: String, required: true, unique: true },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CategoryModel = model<Category>("Category", CategorySchema);
export default CategoryModel;
