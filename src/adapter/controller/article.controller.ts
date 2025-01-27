import { NextFunction, Request, Response } from "express"
import ArticleUsecase from "../../application/articleUsecase/article.usecase"
import { ApiResponse } from "../../domain/response/response"
import StatusCodes from "../../domain/constants/StatusCode"
import ResponseMessages from "../../domain/constants/ResponseMessage"

interface Dependencies {
    articleUsecase: ArticleUsecase
}

export default class ArticleController {
    private _articleUsecase: ArticleUsecase
    constructor(dependencies: Dependencies) {
        this._articleUsecase = dependencies.articleUsecase
    }
    async get_all_articles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.params;
            const articles = await this._articleUsecase.get_all_articles(userId)
            const response = new ApiResponse(true, ResponseMessages.FETCHED_PREFERED_ARTICLE, articles)
            res.status(StatusCodes.OK,).json(response)
            return
        } catch (error) {
            return next(error)

        }
    }
    async get_articles_by_user_id(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.params
            const articles = await this._articleUsecase.get_articles_by_user_id(userId)
            const response = new ApiResponse(true, ResponseMessages.FETCHED_USER_ARTICLE, articles)
            res.status(StatusCodes.OK).json(response)
            return
        } catch (error) {
            return next(error)
        }
    }
    async get_article_by_id(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { articleId } = req.params;
            const article = await this._articleUsecase.get_article_by_id(articleId)
            const response = new ApiResponse(true, ResponseMessages.FETCHED_ARTICLE, article)
            res.status(StatusCodes.OK).json(response)
            return
        } catch (error) {
            return next(error)
        }
    }
    async add_article(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.params;
            const articleData = req.body
            const article = await this._articleUsecase.add_article(userId, articleData)
            console.log(article)
            const response = new ApiResponse(true, ResponseMessages.ARTICLE_CREATED, article)
            res.status(StatusCodes.CREATED).json(response)
            return
        } catch (error) {
            return next(error)
        }
    }
    async edit_article(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const articleData = req.body
            const article = await this._articleUsecase.edit_article(articleData)
            const response = new ApiResponse(true, ResponseMessages.ARTICLE_UPDATED, article)
            res.status(StatusCodes.OK).json(response)
            return
        } catch (error) {
            return next(error)
        }
    }
    async delete_article(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { articleId } = req.params;
            const article = await this._articleUsecase.delete_article(articleId)
            const response = new ApiResponse(true, ResponseMessages.ARTICLE_DELETED, article)
            res.status(StatusCodes.OK).json(response)
            return
        } catch (error) {
            return next(error)
        }
    }
    async activateAndDeactivate_article(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { articleId } = req.params;
            const { is_active } = req.body;
            const article = await this._articleUsecase.activateAndDeactivate_article(articleId, is_active)
            const response = new ApiResponse(true, ResponseMessages.ARTICLE_UPDATED, article)
            res.status(StatusCodes.OK).json(response)
            return
        } catch (error) {
            return next(error)
        }
    }
    async likeAndUnlike_article(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { articleId } = req.params;
            const { userId } = req.body;
            const article = await this._articleUsecase.likeAndUnlike_article(articleId, userId)
            const response = new ApiResponse(true, ResponseMessages.ARTICLE_UPDATED, article)
            res.status(StatusCodes.OK).json(response)
            return
        } catch (error) {
            return next(error)
        }
    }
    async dislikeAndUndislike_article(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { articleId } = req.params;
            const { userId } = req.body;
            console.log(articleId, userId)
            const article = await this._articleUsecase.dislikeAndUndislike_article(articleId, userId)
            const response = new ApiResponse(true, ResponseMessages.ARTICLE_UPDATED, article)
            res.status(StatusCodes.OK).json(response)
            return
        } catch (error) {
            return next(error)
        }
    }
    async deleteCloudinaryData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { publicId, resourceType } = req.body;
            const result = await this._articleUsecase.deleteCloudinaryData(publicId, resourceType)
            if (result == "ok") {
                const response = new ApiResponse(true, ResponseMessages.CLOUDINARY_DATA_DELETED)
                res.status(StatusCodes.OK).json(response)
            }
            return
        } catch (error) {
            return next(error)
        }
    }
}
