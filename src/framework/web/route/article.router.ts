import { Router } from "express";
import ArticleController from "../../../adapter/controller/article.controller";
import ArticleDependencies from "../../dependencies/article.dependencies";


const  article= new ArticleController(ArticleDependencies)

const router=Router();
router.get("/prefered/:userId",article.get_all_articles.bind(article));
router.get("/:articleId",article.get_article_by_id.bind(article));
router.get("/user/:userId",article.get_articles_by_user_id.bind(article));
router.post("/add/:userId",article.add_article.bind(article));
router.put("/edit",article.edit_article.bind(article));
router.delete("/delete/:articleId",article.delete_article.bind(article));
router.put("/activate/:articleId",article.activateAndDeactivate_article.bind(article));
router.put("/like/:articleId",article.likeAndUnlike_article.bind(article));
router.put("/dislike/:articleId",article.dislikeAndUndislike_article.bind(article));
router.post("/cloudinary/delete",article.deleteCloudinaryData.bind(article));

export default router;