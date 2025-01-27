import { Types } from "mongoose"
import Article from "../../entities/Article"
import ContentBlock from "../../entities/ContentBlock"

export default interface article_respository{
    findArticleById(articleId: string): Promise<Article | null> 
    getArticleByUserPreference(articlePreferences: Types.ObjectId[]): Promise<Article[]> 
    getArticleByUsersId(userId: string): Promise<Article[] | null>
    getArticleById(articleId: string): Promise<Article | null> 
    getArticleByTitle(title: string): Promise<Article | null>
    createArticle(articleData:Partial<Article>):Promise<Article>
    findArticleByIdAndUpdate(articleData:Partial<Article>):Promise<Article|null>
    findArticleByIdAndDelete(articleId:string):Promise<Article>
    findArticleByIdAndUpdateIsActive(articleId:string,is_active:boolean):Promise<Article>
    findArticleUpdateLikes(article: Article): Promise<Article | null> 
    createContentBlocks(contentBlocks: ContentBlock): Promise<ContentBlock>
}