import { Router } from "express";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { login, register } from "../controllers/auth.controller";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

const router = Router();


router.post('/register', validate(registerSchema), register);
router.post('/login',validate(loginSchema), login);
router.get('/me', authMiddleware, (req: AuthRequest, res) => {
    res.status(200).json({
      success: true,
      message: 'Authenticated user',
      data: { userId: req.userId },
    })
  })


export default router;