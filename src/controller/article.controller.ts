import { Request, Response, NextFunction } from "express";
import { CustomError } from "../util/custom_error";
import Article from "../model/article.model";
import User from "../model/user.model";
import { v2 as cloudinary } from "cloudinary";

interface ContentBlock {
  _id?: string;
  type: "image" | "header" | "text" | "video";
  id: string;
  content?: string;
  cloudinaryId?: string;
}
export async function get_all_articles(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    const { articlePreferences } = user;

    const articles = await Article.find({
      categoryIds: { $in: articlePreferences },
      is_active: true,
    }).populate("categoryIds");

    res.status(200).json({ success: true, data: articles });
    return;
  } catch (error) {
    next(error);
  }
}

export async function get_articles_by_user_id(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const articles = await Article.find({ userId: id }).populate("categoryIds");
    res.status(200).json({ success: true, data: articles });
  } catch (error) {
    next(error);
  }
}

export async function get_article_by_id(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) {
      throw new CustomError(404, "Article not found");
    }
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
}

export async function add_article(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.params.id;
    const { title, description, contentBlocks, categoryIds } = req.body;
    if (!title || !description || !contentBlocks || !categoryIds || !userId) {
      throw new CustomError(400, "All fields are required");
    }

    if (!Array.isArray(contentBlocks) || contentBlocks.length === 0) {
      throw new CustomError(400, "Content blocks must be a non-empty array");
    }

    const existingArticle = await Article.findOne({ title });
    if (existingArticle) {
      throw new CustomError(400, "An article with this title already exists");
    }

    const article = await Article.create({
      userId,
      title,
      description,
      contentBlocks,
      categoryIds,
    });

    res.status(201).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
}

export async function edit_article(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const article = await Article.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({ success: true, data: article });
    return;
  } catch (error) {
    next(error);
  }
}

export async function delete_article(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const article = await Article.findByIdAndDelete(id);
    if (!article) {
      throw new CustomError(404, "Article not found");
    }
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
}

export async function activateAndDeactivate_article(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    const article = await Article.findById(id);
    if (!article) {
      throw new CustomError(404, "Article not found");
    }
    article.is_active = is_active;
    await article.save();
    const articleData = await Article.findById(id).populate("categoryIds");
    res.status(200).json({ success: true, data: articleData });
  } catch (error) {
    next(error);
  }
}
export async function likeAndUnlike_article(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) {
      throw new CustomError(400, "User id is required");
    }
    const article = await Article.findById(id);
    if (!article) {
      throw new CustomError(404, "Article not found");
    }
    const likedBy = article.likes.some((like) => like == userId);
    if (likedBy) {
      article.likes.pull(userId);
    } else {
      article.likes.push(userId);
      article.dislikes.pull(userId);
    }
    const articleData = await article.save();

    res.status(200).json({ success: true, data: articleData });
    return;
  } catch (error) {
    next(error);
  }
}

export async function dislikeAndUndislike_article(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) {
      throw new CustomError(400, "User id is required");
    }
    const article = await Article.findById(id);
    if (!article) {
      throw new CustomError(404, "Article not found");
    }
    const dislikedBy = article.dislikes.some((dislike) => dislike == userId);
    if (dislikedBy) {
      article.dislikes.pull(userId);
    } else {
      article.dislikes.push(userId);
      article.likes.pull(userId);
    }
    const articleData = await article.save();
    res.status(200).json({ success: true, data: articleData });
  } catch (error) {
    next(error);
  }
}

export async function delete_cloudinary_data(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log(req.body);
  const { publicId, resourceType } = req.body;
  if (!publicId || !resourceType) {
    res.status(400).json({ error: "Missing required parameters" });
    return;
  }
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok") {
      res
        .status(200)
        .json({ success: true, message: "Resource deleted successfully" });
      return;
    } else {
      res
        .status(400)
        .json({ success: false, error: "Failed to delete resource" });
      return;
    }
  } catch (error) {
    next(error);
  }
}
