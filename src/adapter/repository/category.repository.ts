import Category from "../../domain/entities/Category";
import CategoryModel from "../database/category.model";


export default class CategoryRepository {
    async allCategory(): Promise<Category[]> {
        try {
            const category = await CategoryModel.find({}).sort({ createdAt: -1 });
            return category
        } catch (error) {
            throw error
        }
    }
    async allActiveCategory(): Promise<Category[]> {
        try {
            const category = await CategoryModel.find({ is_active: true });
            return category
        } catch (error) {
            throw error
        }
    }
    async findByCategoryName(name: string): Promise<Category | null> {
        try {
            const category = await CategoryModel.findOne({ name });
            return category
        } catch (error) {
            throw error
        }
    }
    async findByCategoryId(categoryId: string): Promise<Category | null> {
        try {
            const category = await CategoryModel.findById(categoryId);
            return category
        } catch (error) {
            throw error
        }
    }
    async createCategory(name: string): Promise<Category> {
        try {
            const category = await CategoryModel.create({ name });
            return category
        } catch (error) {
            throw error
        }
    }
    async findCategoryAndDelete(categoryId: string): Promise<Category | null> {
        try {
            const category = await CategoryModel.findByIdAndDelete(categoryId);
            return category
        } catch (error) {
            throw error
        }
    }
    async existingCategory(categoryId: string, name: string): Promise<Category | null> {
        try {
            const category = await CategoryModel.findOne({
                name,
                _id: { $ne: categoryId },
            });
            return category
        } catch (error) {
            throw error
        }
    }
    async updateCategory(categoryId: string, category: Partial<Category>): Promise<Category | null> {
        try {
            const categoryData = await CategoryModel.findByIdAndUpdate(categoryId, category, {
                new: true,
            });
            return categoryData
        } catch (error) {
            throw error
        }
    }
} 