import { Router } from "express";
import { login, register, logout, refreshToken, getUser, updateUser, changePassword } from "../../controller/auth.controller";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get('/user/:id',getUser);
router.put('/update/:id',updateUser);
router.put('/change-password/:id',changePassword);

export default router;
