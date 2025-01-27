import { NextFunction, Request, Response } from "express";
import User from "../../domain/entities/User";
import UserUseCase from "../../application/userUsecase/user.usecase";
import { ApiResponse } from "../../domain/response/response";
import StatusCodes from "../../domain/constants/StatusCode";
import ResponseMessages from "../../domain/constants/ResponseMessage";


interface Dependencies {
    UserUseCase: UserUseCase
}
export default class UserController {
    private _userUseCase: UserUseCase
    constructor(dependecies: Dependencies) {
        this._userUseCase = dependecies.UserUseCase
    }

    async Register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const reqBody: User = req.body
            const data = await this._userUseCase.registerUser(reqBody)
            const response = new ApiResponse(true, ResponseMessages.USER_REGISTERED, data)
            res.status(StatusCodes.CREATED).json(response)
            return
        } catch (error) {
            next(error)
            return
        }
    }
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { identifier, password } = req.body;
            const { user, accessToken, refreshToken } = await this._userUseCase.loginUser(identifier, password)
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                // domain: process.env.CORS_ORIGIN,
                maxAge: 15 * 60 * 1000,
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                // domain: process.env.CORS_ORIGIN,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            const response = new ApiResponse(true, ResponseMessages.USER_LOGIN, user)
            res.status(StatusCodes.OK).json(response)
            return;
        } catch (error) {
            next(error)
            return;
        }
    }
    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            const response = new ApiResponse(true,ResponseMessages.USER_LOGOUT)
            res.status(StatusCodes.OK).json(response);
            return
        } catch (error) {
            next(error)
            return
        }
    }
    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refreshToken } = req.cookies;
            const accessToken = await this._userUseCase.refreshToken(refreshToken)
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 15 * 60 * 1000,
            });
            const response = new ApiResponse(true,ResponseMessages.TOKEN_REFRESHED)
            res.status(StatusCodes.OK).json(response)
            return
        } catch (error) {
            next(error)
            return
        }
    }
    async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.userId
            const user = await this._userUseCase.getUser(userId)
            const response = new ApiResponse(true,ResponseMessages.USER_DATA, user)
            res.status(StatusCodes.OK).json(response)
            return
        } catch (error) {
            next(error)
            return
        }
    }
    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userData = req.body;
            const user = await this._userUseCase.updateUser(userData)
            const response = new ApiResponse(true,ResponseMessages.USER_UPDATED, user)
            res.status(StatusCodes.OK).json(response)
            return
        } catch (error) {
            next(error)
            return
        }
    }
    async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.userId;
            const { currentPassword, newPassword, confirmPassword } = req.body;
            const user = await this._userUseCase.changePassword(userId, currentPassword, newPassword, confirmPassword)

            const response = new ApiResponse(true,ResponseMessages.PASSWORD_CHANGED, user)
            res.status(StatusCodes.OK).json(response)
            return
        } catch (error) {
            next(error)
            return
        }
    }
}