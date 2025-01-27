import ResponseMessages from "../../domain/constants/ResponseMessage"
import StatusCodes from "../../domain/constants/StatusCode"
import AppError from "../../domain/error/AppError"
import category_repository from "../../domain/Interfaces/repository/category_repository"

interface Dependencies {
    repository: {
        CategoryRepository: category_repository
    }
}
export default class CategoryUsecase {
    private _categoryRepository: category_repository
    constructor(dependencies: Dependencies) {
        this._categoryRepository = dependencies.repository.CategoryRepository
    }
    async all_category() {
        try {
            const category = await this._categoryRepository.allCategory()
            if (!category) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.CATEGORY_NOT_FOUND);
            }
            return category
        } catch (error) {
            throw error
        }
    }
    async create_category(name: string) {
        try {
            if (!name) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.CATEGORY_NAME_REQUIRED);
            }
            const existingCategory = await this._categoryRepository.findByCategoryName(name);
            if (existingCategory) {
                throw new AppError(StatusCodes.CONFLICT, ResponseMessages.CATEGORY_EXIST);
            }
            const category = await this._categoryRepository.createCategory(name);
            if (!category) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.CATEGORY_NOT_FOUND)
            }
            return category
        } catch (error) {
            throw error
        }
    }
    async delete_category(categoryId: string) {
        try {
            const category = await this._categoryRepository.findCategoryAndDelete(categoryId)
            if (!category) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.CATEGORY_NOT_FOUND);
            }
            return category
        } catch (error) {
            throw error
        }
    }
    async update_category(categoryId: string, name: string, is_active: boolean) {
        try {
            if (!name) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.CATEGORY_NAME_REQUIRED);
            }

            const existingCategory = await this._categoryRepository.existingCategory(categoryId, name)
            if (existingCategory) {
                throw new AppError(StatusCodes.BAD_REQUEST, ResponseMessages.CATEGORY_EXIST);
            }
            const updateData: { name: string; is_active?: boolean } = { name };
            if (typeof is_active !== "undefined") {
                updateData.is_active = is_active;
            }
            const category = await this._categoryRepository.updateCategory(categoryId, updateData)

            if (!category) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.CATEGORY_NAME_REQUIRED);
            }
            return category
        } catch (error) {
            throw error
        }
    }
    async activateAndDeactivate_category(categoryId: string) {
        try {

            const category = await this._categoryRepository.findByCategoryId(categoryId)
            if (!category) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.CATEGORY_NOT_FOUND);
            }
            category.is_active = !category.is_active;
            const updatedCategory = await this._categoryRepository.updateCategory(categoryId, category);
            if (!updatedCategory) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.CATEGORY_NOT_FOUND);
            }
            return updatedCategory
        } catch (error) {
            throw error
        }
    }
    async all_active_category() {
        try {
            const category = await this._categoryRepository.allActiveCategory()
            if (!category) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.CATEGORY_NOT_FOUND);
            }
            return category
        } catch (error) {
            throw error
        }
    }
}