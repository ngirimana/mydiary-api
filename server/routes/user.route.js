import express from 'express';
import usercontrol from '../controllers/userController';
import { signUpValidation, signInValidation } from '../middlewares/userValidator';


const router = express.Router();


router.post('/signup', signUpValidation, usercontrol.UserController.signUp);
router.post('/signin', signInValidation, usercontrol.UserController.signIn);

export default router;
