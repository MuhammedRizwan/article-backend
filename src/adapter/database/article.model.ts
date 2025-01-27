import { Schema, model, Types } from 'mongoose';
import ContentBlockModel from './contentBlock.model';


const ArticleSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    contentBlocks: { type: [ContentBlockModel.schema], required: true },
    categoryIds: { type: [Types.ObjectId], ref: 'Category' },
    is_active: { type: Boolean, default: true },
    likes: { type: [Types.ObjectId], ref: 'User' },
    dislikes: { type: [Types.ObjectId], ref: 'User' },
  },
  { timestamps: true }
);

const ArticleModel = model('Article', ArticleSchema);
export default ArticleModel;
