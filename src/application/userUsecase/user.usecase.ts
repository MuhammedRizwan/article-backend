import dayjs from "dayjs";
import ResponseMessages from "../../domain/constants/ResponseMessage";
import StatusCodes from "../../domain/constants/StatusCode";
import User from "../../domain/entities/User";
import AppError from "../../domain/error/AppError";
import password_service from "../../domain/Interfaces/services/password_services";
import user_repository from "../../domain/Interfaces/repository/user_repository";
import Token_service from "../../domain/Interfaces/services/token_service";
import { Types } from "mongoose";

interface Dependencies {
    repository: {
        userRepository: user_repository
    },
    service: {
        PasswordService: password_service,
        TokenService: Token_service
    }
}
export default class UserUseCase {
    private _userRepository: user_repository
    private _passwordService: password_service
    private _tokenService: Token_service
    constructor(dependencies: Dependencies) {
        this._userRepository = dependencies.repository.userRepository
        this._passwordService = dependencies.service.PasswordService
        this._tokenService = dependencies.service.TokenService
    }

    async registerUser(user: User) {
        try {
            const { firstName, lastName, phone, email, dob, password, confirmPassword, articlePreferences, } = user;

            const existEmail = await this._userRepository.findUserByEmail(email);
            if (existEmail) {
                throw new AppError(StatusCodes.CONFLICT, ResponseMessages.EMAIL_ALREADY_EXIST);
            }

            const existPhone = await this._userRepository.findUserByPhone(phone);
            if (existPhone) {
                throw new AppError(StatusCodes.CONFLICT, ResponseMessages.PHONE_ALREADY_EXIST);
            }

            if (!firstName || !lastName || !phone || !email || !dob || !password || !confirmPassword || !articlePreferences) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.ALL_REQUIRED);
            }

            const adjustedDob = dayjs(dob).add(5, "hour").add(30, "minute").toDate();

            if (password !== confirmPassword) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.PASSWORD_NOT_MATCH);
            }

            const hashedPassword = await this._passwordService.hashPassword(password);
            const userData = await this._userRepository.createUser({
                firstName,
                lastName,
                phone,
                email,
                dob: adjustedDob,
                password: hashedPassword,
                articlePreferences,
            });
            if (!userData) {

            }
        } catch (error) {
            throw error
        }
    }
    async loginUser(identifier: string, password: string) {
        try {
            if (!identifier || !password) {
                throw new AppError(StatusCodes.BAD_REQUEST, ResponseMessages.ALL_REQUIRED);
            }

            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

            let user;
            if (emailRegex.test(identifier)) {
                user = await this._userRepository.findUserByEmail(identifier);
            } else {
                user = await this._userRepository.findUserByPhone(identifier);
            }
            if (!user) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.INVALID_IDENTIFIER);
            }
            const isMatch = await this._passwordService.comparePassword(password, user.password);
            if (!isMatch) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.INVALID_PASSWORD);
            }

            const accessToken = this._tokenService.generateAccessToken(user._id);
            const refreshToken = this._tokenService.generateRefreshToken(user._id);

            if (!accessToken || !refreshToken) {
                throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, ResponseMessages.TOKEN_NOT_CREATED)
            }

            return { user, accessToken, refreshToken }
        } catch (error) {
            throw error
        }
    }
    async refreshToken(refreshToken: string) {
        try {
            if (!refreshToken) {
                throw new AppError(StatusCodes.BAD_REQUEST, ResponseMessages.REFRESH_TOKEN_MISSING);
            }

            const payload = this._tokenService.verifyRefreshToken(refreshToken);
            if (!payload) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.TOKEN_EXPIRED)
            }

            const newAccessToken = this._tokenService.generateAccessToken(payload.id);
            if (!newAccessToken) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.ACCESS_TOKEN_MISSING)
            }

            return newAccessToken
        } catch (error) {
            throw error
        }
    }
    async getUser(userId: string) {
        try {
            const user = await this._userRepository.findUserById(userId)
            if (!user) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.USER_NOT_FOUND);
            }
            return user
        } catch (error) {
            throw error
        }
    }
    async updateUser(userData: User) {
        try {
            const { articlePreferences } = userData;

            let preferences: Types.ObjectId[] = [];
            if (articlePreferences && Array.isArray(articlePreferences)) {
                preferences = articlePreferences.map((pref) => {
                    if (Types.ObjectId.isValid(pref)) {
                        return new Types.ObjectId(pref);
                    } else {
                        throw new Error(`Invalid ObjectId in articlePreferences: ${pref}`);
                    }
                });
            }
            userData.articlePreferences = preferences
            const user = await this._userRepository.findUserAndUpdate(userData)

            if (!user) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.USER_NOT_FOUND);
            }
            return user
        } catch (error) {
            throw error
        }
    }
    async changePassword(userId: string, currentPassword: string, newPassword: string, confirmPassword: string) {
        try {
            const user = await this._userRepository.findUserById(userId)
            if (!user) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.USER_NOT_FOUND);
            }
            const isMatch = await this._passwordService.comparePassword(currentPassword, user.password)
            if (!isMatch) {
                throw new AppError(StatusCodes.BAD_REQUEST, ResponseMessages.INCORRECT_PASSWORD);
            }
            if (newPassword !== confirmPassword) {
                throw new AppError(StatusCodes.BAD_REQUEST, ResponseMessages.CONFIRM_PASSWORD_NOT_MATCH);
            }
            user.password = await this._passwordService.hashPassword(newPassword);
            const userData = await this._userRepository.findUserAndUpdate(user)
            if (!userData) {
                throw new AppError(StatusCodes.NOT_FOUND, ResponseMessages.USER_NOT_FOUND);
            }
            return userData
        } catch (error) {
            throw error
        }
    }
}