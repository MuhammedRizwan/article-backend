import { Router } from "express";
import authRouter from "./Routers/auth.router";
import categoryRouter from "./Routers/category.router";
import articleRouter from "./Routers/article.router";
import JwtMiddleware from "../middleware/jwt.middleware";
const router = Router();

router.use('/',authRouter);
router.use('/category',JwtMiddleware,categoryRouter);
router.use('/article',JwtMiddleware,articleRouter);

export default router;