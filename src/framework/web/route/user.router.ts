import { NextFunction, Request, Response, Router } from "express";
import JwtMiddleware from "../../../adapter/middleware/JwtHandle.middleware";
import UserController from "../../../adapter/controller/user.controller";
import UserDependencies from "../../dependencies/user.dependencies";

const router = Router();
const user=new UserController(UserDependencies)

router.post("/login", user.login.bind(user));
router.post("/register", user.Register.bind(user));
router.get("/logout", user.logout.bind(user));
router.get("/refresh-token",user.refreshToken.bind(user));
router.get('/user/:userId', JwtMiddleware, user.getUser.bind(user));
router.put('/update', JwtMiddleware, user.updateUser.bind(user));
router.put('/change-password/:userId', JwtMiddleware, user.changePassword.bind(user));

export default router;
