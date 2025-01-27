import ResponseMessages from "../../domain/constants/ResponseMessage"
import StatusCodes from "../../domain/constants/StatusCode"
import Article from "../../domain/entities/Article"
import ContentBlock from "../../domain/entities/ContentBlock"
import AppError from "../../domain/error/AppError"
import article_respository from "../../domain/Interfaces/repository/article_repository"
import user_repository from "../../domain/Interfaces/repository/user_repository"
import CloudinaryService from "../../domain/Interfaces/services/cloudinary_service"

interface Dependencies {
    repository: {
        UserRepository: user_repository
        ArticleRepository: article_respository
    },
    service: {
        CloudinaryService: CloudinaryService
    }
}
export default class ArticleUsecase {
    private _userRepository: user_repository
    private _articleRepository: article_respository
    private _cloudinaryService: CloudinaryService
    constructor(dependencies: Dependencies) {
        this._userRepository = dependencies.repository.UserRepository
        this._articleRepository = dependencies.repository.ArticleRepository
        this._cloudinaryService = dependencies.service.CloudinaryService
    }
    async get_all_articles(userId: string) {
        try {
            const user = await this._userRepository.findUserById(userId);
            if (!user) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.USER_NOT_FOUND);
            }
            const { articlePreferences } = user;

            const articles = await this._articleRepository.getArticleByUserPreference(articlePreferences)
            if (!articles) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.ARTICLE_NOT_FOUND)
            }
            return articles
        } catch (error) {
            throw error
        }
    }
    async get_articles_by_user_id(userId: string) {
        try {
            const articles = await this._articleRepository.getArticleByUsersId(userId)
            if (!articles) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.ARTICLE_NOT_FOUND)
            }
            return articles
        } catch (error) {
            throw error
        }
    }
    async get_article_by_id(articleId: string) {
        try {
            const article = await this._articleRepository.findArticleById(articleId)
            if (!article) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.ARTICLE_NOT_FOUND)
            }
            return article
        } catch (error) {
            throw error
        }
    }
    async add_article(userId: string, articleData: Article) {
        try {
            const { title, description, contentBlocks, categoryIds } = articleData;
            if (!title || !description || !contentBlocks || !categoryIds || !userId) {
                throw new AppError(StatusCodes.BAD_REQUEST, ResponseMessages.ALL_REQUIRED);
            }
            
            if (!Array.isArray(contentBlocks) || contentBlocks.length === 0) {
                throw new AppError(StatusCodes.BAD_REQUEST, ResponseMessages.CONTENT_BLOCK_MUST_ARRAY);
            }
            
            const existingArticle = await this._articleRepository.getArticleByTitle(title);
            if (existingArticle) {
                throw new AppError(StatusCodes.CONFLICT, ResponseMessages.ARTICLE_ALREADY_EXIST);
            }
            console.log(contentBlocks)
            const savedContentBlocks =await Promise.all(contentBlocks.map(async(block) =>await this._articleRepository.createContentBlocks(block)))
            console.log(savedContentBlocks)
            const articleDatas = {
                userId,
                title,
                description,
                contentBlocks: savedContentBlocks.map((block) => block), 
                categoryIds,
            };
            const article = await this._articleRepository.createArticle(articleDatas)
            if (!article) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.ARTICLE_NOT_FOUND)
            }
            return article
        } catch (error) {
            throw error
        }
    }
    async edit_article(articleData: Partial<Article>) {
        try {
            const article = await this._articleRepository.findArticleByIdAndUpdate(articleData)
            if (!article) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.ARTICLE_NOT_FOUND)
            }
            return article
        } catch (error) {
            throw error
        }
    }
    async delete_article(articleId: string) {
        try {
            const article = await this._articleRepository.findArticleByIdAndDelete(articleId)
            if (!article) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.ARTICLE_NOT_FOUND)
            }
            return article
        } catch (error) {
            throw error
        }
    }
    async activateAndDeactivate_article(articleId: string, is_active: boolean) {
        try {

            if (typeof is_active !== "boolean") {
                throw new AppError(400, "Invalid value for 'is_active'. Must be a boolean.");
            }
            const article = await this._articleRepository.findArticleByIdAndUpdateIsActive(articleId, is_active)

            if (!article) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.ARTICLE_NOT_FOUND)
            }
            return article
        } catch (error) {
            throw error
        }
    }
    async likeAndUnlike_article(articleId: string, userId: string) {
        try {
            if (!userId || !articleId) {
                throw new AppError(StatusCodes.BAD_REQUEST, ResponseMessages.ALL_REQUIRED);
            }
            console.log(articleId, userId)

            const article = await this._articleRepository.findArticleById(articleId);
            if (!article) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.ARTICLE_NOT_FOUND)
            }

            const alreadyLiked = article.likes.includes(userId);
            if (alreadyLiked) {
                article.likes = article.likes.filter((id) => id.toString() !== userId);
            } else {
                article.likes.push(userId);
                article.dislikes = article.dislikes.filter((id) => id.toString() !== userId);
            }

            const updatedArticle = await this._articleRepository.findArticleUpdateLikes(article)
            if (!updatedArticle) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.ARTICLE_NOT_FOUND)
            }
            return updatedArticle
        } catch (error) {
            throw error
        }
    }
    async dislikeAndUndislike_article(articleId: string, userId: string) {
        try {
            if (!userId || !articleId) {
                throw new AppError(StatusCodes.BAD_REQUEST, ResponseMessages.ALL_REQUIRED);
            }

            const article = await this._articleRepository.findArticleById(articleId);
            if (!article) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.ARTICLE_NOT_FOUND)
            }

            const alreadyDisliked = article.dislikes.includes(userId);
            if (alreadyDisliked) {
                article.dislikes = article.dislikes.filter((id) => id.toString() !== userId);
            } else {
                article.dislikes.push(userId);
                article.likes = article.likes.filter((id) => id.toString() !== userId);
            }

            const updatedArticle = await this._articleRepository.findArticleUpdateLikes(article)
            if (!updatedArticle) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.ARTICLE_NOT_FOUND)
            }
            return updatedArticle
        } catch (error) {
            throw error
        }
    }
    async deleteCloudinaryData(publicId: string, resourceType: string) {
        try {
            if (!publicId || !resourceType) {
                throw new AppError(StatusCodes.BAD_REQUEST, ResponseMessages.ALL_REQUIRED);
            }

            const result = await this._cloudinaryService.deleteResource(publicId);
            if (result !== "ok") {
                throw new AppError(StatusCodes.BAD_REQUEST, ResponseMessages.CLOUDINARY_FAILED_TO_DELETE);
            }
            return result
        } catch (error) {
            throw error
        }
    }
}