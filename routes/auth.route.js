import express from 'express';
import { register, login,googleLogin,forgotPassword } from '../controllers/auth.controller.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/auth/google', googleLogin); 
router.post('/forgot-password', forgotPassword);


export default router;
