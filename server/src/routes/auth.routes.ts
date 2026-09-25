import { Router } from 'express'
import { loginRules, registerRules } from '../validators/auth.validator'
import { login, me, register } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { validateRequest } from '../middleware/validate'

const router = Router()

router.post('/register', registerRules, validateRequest, register)
router.post('/login', loginRules, validateRequest, login)
router.get('/me', authMiddleware, me)

export default router
