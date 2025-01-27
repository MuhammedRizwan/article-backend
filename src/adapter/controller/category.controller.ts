import { NextFunction, Request, Response } from "express";
import CategoryUsecase from "../../application/categoryUsecase/category.usecase";
import { ApiResponse } from "../../domain/response/response";
import StatusCodes from "../../domain/constants/StatusCode";
import ResponseMessages from "../../domain/constants/ResponseMessage";

interface Dependencies {
    CategoryUsecase: CategoryUsecase
}
export default class CategoryController {
    private _categoryUsecase: CategoryUsecase
    constructor(dependencies: Dependencies) {
        this._categoryUsecase = dependencies.CategoryUsecase
    }
    async all_category(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const category = await this._categoryUsecase.all_category()
            const response = new ApiResponse(true,ResponseMessages.All_CATEGORY_FETCHED, category)
            res.status(StatusCodes.OK).json(response)
            return
        } catch (error) {
            next(error)
            return
        }
    }
    async add_category(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name } = req.body;
            const category = await this._categoryUsecase.create_category(name)
            const response = new ApiResponse(true, ResponseMessages.CATEGORY_CREATED, category)
            res.status(StatusCodes.CREATED).json(response)
            return
        } catch (error) {
            return next(error)
        }
    }
    async delete_category(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { categoryId } = req.params;
            const category = await this._categoryUsecase.delete_category(categoryId)
            const response = new ApiResponse(true,ResponseMessages.CATEGORY_DELETED, category)
            res.status(StatusCodes.OK).json(response)
            return
        } catch (error) {
            return next(error)
        }
    }
    async update_category(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { categoryId } = req.params;
            const { name, is_active } = req.body;
            const category = await this._categoryUsecase.update_category(categoryId, name, is_active)
            const response = new ApiResponse(true,ResponseMessages.CATEGORY_UPDATED, category)
            res.status(StatusCodes.OK).json(response)
            return
        } catch (error) {
            return next(error)
        }
    }
    async activateAndDeactivate_category(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { categoryId } = req.params;
            const category = await this._categoryUsecase.activateAndDeactivate_category(categoryId)
            const response = new ApiResponse(true,ResponseMessages.CATEGORY_UPDATED, category)
            res.status(StatusCodes.OK).json(response)
            return
        } catch (error) {
            return next(error)
        }
    }
    async all_active_category(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const category = await this._categoryUsecase.all_active_category()
            const response = new ApiResponse(true,ResponseMessages.All_CATEGORY_FETCHED, category)
            res.status(StatusCodes.OK).json(response)
            return
        } catch (error) {
            return next(error)
        }
    }
}