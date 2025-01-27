import { Router } from "express";
import authRouter from "./user.router";
import categoryRouter from "./category.router";
import articleRouter from "./article.router";
import JwtMiddleware from "../../../adapter/middleware/JwtHandle.middleware";
const router = Router();

router.use('/',authRouter);
router.use('/category',JwtMiddleware,categoryRouter);
router.use('/article',JwtMiddleware,articleRouter);

export default router;