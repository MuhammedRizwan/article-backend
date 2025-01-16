import { Router } from "express";
import authRouter from "./Routers/auth.router";
import categoryRouter from "./Routers/category.router";
import articleRouter from "./Routers/article.router";
const router = Router();

router.use('/',authRouter);
router.use('/category',categoryRouter);
router.use('/article',articleRouter);

export default router;