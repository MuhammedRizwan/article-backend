import { Schema, model } from 'mongoose';
import ContentBlock from '../../domain/entities/ContentBlock';

const ContentBlockSchema = new Schema<ContentBlock>({
  type: {
    type: String,
    enum: ['image', 'header', 'text', 'video'],
    required: true,
  },
  id: { type: String, required: true },
  content: { type: String },
  cloudinaryId: { type: String },
});

const ContentBlockModel = model<ContentBlock>('ContentBlock', ContentBlockSchema);
export default ContentBlockModel;
