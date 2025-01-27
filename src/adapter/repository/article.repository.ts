import { Types } from "mongoose";
import Article from "../../domain/entities/Article";
import ArticleModel from "../database/article.model";
import ContentBlockModel from "../database/contentBlock.model";
import ContentBlock from "../../domain/entities/ContentBlock";


export default class ArticleRepository {
    async findArticleById(articleId: string): Promise<Article | null> {
        try {
            const article = await ArticleModel.findById(articleId)
            return article as unknown as Article
        } catch (error) {
            throw error
        }
    }
    async getArticleByUserPreference(articlePreferences: Types.ObjectId[]): Promise<Article[]> {
        try {
            const articles = await ArticleModel.find({
                categoryIds: { $in: articlePreferences },
                is_active: true,
            }).populate("categoryIds");
            return articles as unknown as Article[]
        } catch (error) {
            throw error
        }
    }
    async getArticleByUsersId(userId: string): Promise<Article[] | null> {
        try {
            const articles = await ArticleModel.find({ userId }).populate("categoryIds").sort({ createdAt: -1 });
            return articles as unknown as Article[]
        } catch (error) {
            throw error
        }
    }
    async getArticleById(articleId: string): Promise<Article | null> {
        try {
            const article = await ArticleModel.findById(articleId).populate('categoryIds')
            return article as unknown as Article
        } catch (error) {
            throw error
        }
    }
    async getArticleByTitle(title: string): Promise<Article | null> {
        try {
            const article = await ArticleModel.findOne({ title })
            return article as unknown as Article
        } catch (error) {
            throw error
        }
    }
    async createArticle(articleData: Partial<Article>): Promise<Article> {
        try {
            const article = await ArticleModel.create(articleData)
            return article as unknown as Article
        } catch (error) {
            throw error
        }
    }
    async findArticleByIdAndUpdate(articleData: Partial<Article>): Promise<Article | null> {
        try {
            const article = await ArticleModel.findByIdAndUpdate(articleData._id, articleData, {
                new: true,
            }).populate("categoryIds");
            return article as unknown as Article
        } catch (error) {
            throw error
        }
    }
    async findArticleByIdAndDelete(articleId: string): Promise<Article> {
        try {
            const article = await ArticleModel.findByIdAndDelete(articleId);
            return article as unknown as Article
        } catch (error) {
            throw error
        }
    }
    async findArticleByIdAndUpdateIsActive(articleId: string, is_active: boolean): Promise<Article> {
        try {
            const article = await ArticleModel.findByIdAndUpdate(
                articleId,
                { is_active },
                { new: true }
            ).populate("categoryIds");
            return article as unknown as Article
        } catch (error) {
            throw error
        }
    }
    async findArticleUpdateLikes(article: Article): Promise<Article | null> {
        try {
          const updatedArticle = await ArticleModel.findByIdAndUpdate(
            article._id,
            {
              $set: {
                likes: article.likes,
                dislikes: article.dislikes,
              },
            },
            { new: true } 
          );
          return updatedArticle as unknown as Article;
        } catch (error) {
          throw new Error("Failed to update article");
        }
      }
      async createContentBlocks(contentBlocks: ContentBlock): Promise<ContentBlock> {
        try {
            const content=await ContentBlockModel.create(contentBlocks)
            console.log(content)
           return content as unknown as ContentBlock;
        } catch (error) {
          throw error;
        }
      }
}