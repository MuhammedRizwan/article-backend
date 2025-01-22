import { Router } from "express";
import { login, register, logout, refreshToken, getUser, updateUser, changePassword } from "../../controller/auth.controller";
import JwtMiddleware from "../../middleware/jwt.middleware";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);
router.get("/refresh-token", refreshToken);
router.get('/user/:id', JwtMiddleware, getUser);
router.put('/update/:id', JwtMiddleware, updateUser);
router.put('/change-password/:id', JwtMiddleware, changePassword);

export default router;
