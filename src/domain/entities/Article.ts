import ContentBlock from "./ContentBlock";

export default interface Article {
  _id?: string;
  userId: string;
  title: string;
  description: string;
  contentBlocks: ContentBlock[];
  categoryIds: string[];
  is_active: boolean;
  likes: string[];
  dislikes: string[];
}
