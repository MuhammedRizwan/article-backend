import UserRepository from "../../adapter/repository/user.repository"
import UserUseCase from "../../application/userUsecase/user.usecase"
import TokenService from "../service/JwtService"
import PasswordService from "../service/PasswordService"

const service={
    PasswordService:new PasswordService(),
    TokenService:new TokenService()
}

const repository = {
    userRepository:new UserRepository()
}
const usecase = {
    UserUseCase:new UserUseCase({repository,service})
}

const UserDependencies = usecase

export default UserDependencies