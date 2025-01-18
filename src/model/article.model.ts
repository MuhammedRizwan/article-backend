import { Schema, model, Types } from 'mongoose'

const ContentBlockSchema = new Schema({
  type: {
    type: String,
    enum: ['image', 'header', 'text', 'video'],
    required: true,
  },
  id: { type: String, required: true },
  content: { type: String },
  cloudinaryId: { type: String },
})

const ArticleSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    contentBlocks: { type: [ContentBlockSchema], required: true },
    categoryIds: { type: [Types.ObjectId], ref: 'Category' },
    is_active: { type: Boolean, default: true },
    likes: { type: [Types.ObjectId], ref: 'User' },
    dislikes: { type: [Types.ObjectId], ref: 'User' },
  },
  { timestamps: true }
)

const Article = model('Article', ArticleSchema)
export default Article
