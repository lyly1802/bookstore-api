import express from 'express';
import { getAllBooks,createBook,deleteBook,updateBook } from '../controllers/book.controller.js';
const router = express.Router();

router.get('/', getAllBooks);
router.post('/', createBook); 
router.delete("/:book_id", deleteBook);
router.patch("/:book_id", updateBook);




export default router;