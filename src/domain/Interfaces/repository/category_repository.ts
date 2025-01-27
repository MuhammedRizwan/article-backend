import Category from "../../entities/Category"

export default interface category_repository{
    allCategory(): Promise<Category[]>
    allActiveCategory():Promise<Category[]>
    findByCategoryName(name: string): Promise<Category | null>
    findByCategoryId(categoryId: string): Promise<Category | null> 
    createCategory(name: string): Promise<Category>   
    findCategoryAndDelete(categoryId: string): Promise<Category | null>
    existingCategory(categoryId: string, name: string): Promise<Category | null> 
    updateCategory(categoryId:string,category: Partial<Category>): Promise<Category|null>
}