import { NextFunction, Request, Response } from "express";
import Category from "../model/category.model";
import { CustomError } from "../util/custom_error";

export async function all_category(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const category = await Category.find({}).sort({ createdAt: -1 });
    if (!category) {
      throw new CustomError(404, "Category not found");
    }
    res.status(200).json({ success: true, data: category });
    return;
  } catch (error) {
    next(error);
  }
}

export async function add_category(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name } = req.body;
    if (!name) {
      throw new CustomError(400, "Name is required");
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      throw new CustomError(400, "Category already exists");
    }
    const category = await Category.create({ name });
    res.status(201).json({ success: true, data: category });
    return;
  } catch (error) {
    next(error);
  }
}
export async function delete_category(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new CustomError(404, "Category not found");
    }
    res.status(200).json({ success: true, data: category });
    return;
  } catch (error) {
    next(error);
  }
}
export async function update_category(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { name, is_active } = req.body;
  
      if (!name) {
        throw new CustomError(400, "Name is required");
      }

      const existingCategory = await Category.findOne({
        name,
        _id: { $ne: id },
      });
      if (existingCategory) {
        throw new CustomError(400, "Category with this name already exists");
      }
      const updateData: { name: string; is_active?: boolean } = { name };
      if (typeof is_active !== "undefined") {
        updateData.is_active = is_active;
      }
      const category = await Category.findByIdAndUpdate(id, updateData, {
        new: true,
      });
  
      if (!category) {
        throw new CustomError(404, "Category not found");
      }
      res.status(200).json({ success: true, data: category });
      return;
    } catch (error) {
      next(error);
    }
  }
  

export async function activateAndDeactivate_category(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      if (!category) {
        throw new CustomError(404, "Category not found");
      }
      category.is_active = !category.is_active;
      await category.save();
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }
  

export async function all_active_category(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const category = await Category.find({ is_active: true });
    if (!category) {
      throw new CustomError(404, "Category not found");
    }
    res.status(200).json({ success: true, data: category });
    return;
  } catch (error) {
    next(error);
  }
}
