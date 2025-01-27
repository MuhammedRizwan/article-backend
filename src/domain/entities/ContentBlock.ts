export default interface ContentBlock {
  _id?: string;
  type: 'image' | 'header' | 'text' | 'video';
  id?: string;
  content?: string;
  cloudinaryId?: string;
}
