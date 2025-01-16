
import { Router } from "express";
import { activateAndDeactivate_article, add_article, delete_article, delete_cloudinary_data, dislikeAndUndislike_article, edit_article, get_all_articles, get_article_by_id, get_articles_by_user_id, likeAndUnlike_article } from "../../controller/article.controller";

const router=Router();
router.get("/prefered/:id",get_all_articles);
router.get("/:id",get_article_by_id);
router.get("/user/:id",get_articles_by_user_id);
router.post("/add/:id",add_article);
router.put("/edit/:id",edit_article);
router.delete("/delete/:id",delete_article);
router.put("/activate/:id",activateAndDeactivate_article);
router.put("/like/:id",likeAndUnlike_article);
router.put("/dislike/:id",dislikeAndUndislike_article);
router.post("/cloudinary/delete",delete_cloudinary_data);

export default router;