import ArticleRepository from "../../adapter/repository/article.repository"
import UserRepository from "../../adapter/repository/user.repository"
import ArticleUsecase from "../../application/articleUsecase/article.usecase"
import CloudinaryService from "../service/cloudinaryService"


const repository = {
    UserRepository: new UserRepository(),
    ArticleRepository: new ArticleRepository()
}
const service={
    CloudinaryService:new CloudinaryService()
}
const usecase = {
    articleUsecase: new ArticleUsecase({ repository,service })
}

const ArticleDependencies = usecase

export default ArticleDependencies