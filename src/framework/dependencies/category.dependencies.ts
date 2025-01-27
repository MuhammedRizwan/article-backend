import CategoryRepository from "../../adapter/repository/category.repository"
import CategoryUsecase from "../../application/categoryUsecase/category.usecase"


const repository = {
    CategoryRepository: new CategoryRepository()
}
const usecase = {
    CategoryUsecase: new CategoryUsecase({ repository })
}

const CategoryDependencies = usecase

export default CategoryDependencies