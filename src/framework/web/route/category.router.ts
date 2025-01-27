import { Router } from "express";
import CategoryController from "../../../adapter/controller/category.controller";
import CategoryDependencies from "../../dependencies/category.dependencies";

const router = Router();
const category=new CategoryController(CategoryDependencies)
router.get('/',category.all_category.bind(category));
router.post('/add',category.add_category.bind(category));
router.put('/update/:categoryId',category.update_category.bind(category));
router.delete('/delete/:categoryId',category.delete_category.bind(category));
router.get('/active',category.all_active_category.bind(category));
router.put('/activate/:categoryId',category.activateAndDeactivate_category.bind(category));

export default router;