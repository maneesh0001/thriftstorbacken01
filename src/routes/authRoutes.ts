import express, { type Request, type Response, type NextFunction } from 'express';
import { signup, login } from '../controllers/authcontrollers.js';

const router = express.Router();

router.post('/signup', signup as (req: Request, res: Response, next: NextFunction) => any);
router.post('/login', login as (req: Request, res: Response, next: NextFunction) => any);

export default router;
