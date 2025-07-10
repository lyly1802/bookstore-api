import express from 'express';
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    
} from '../controllers/category.controller.js';
import { isLogin, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();
// Tất cả route dưới đây đều yêu cầu phải đăng nhập và có quyền ADMIN
router.use(isLogin, isAdmin);

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);


export default router;
