import { Router } from "express";
import { activateAndDeactivate_category, add_category, all_active_category, all_category,delete_category, update_category } from "../../controller/category.controller";


const router = Router();

router.get('/',all_category);
router.post('/add',add_category);
router.put('/update/:id',update_category);
router.delete('/delete/:id',delete_category);
router.get('/active',all_active_category);
router.put('/activate/:id',activateAndDeactivate_category);

export default router;