import { Router } from 'express'
import {
	getUserByID,
	createUser,
	updateUser,
	deleteUser,
	login,
} from '../controllers/UserController.ts'
import { authenticateToken } from '../middlewares/auth.ts'

const router = Router()

router.post('/register', createUser)
router.post('/login', login)

router.get('/:id', authenticateToken, getUserByID)
router.put('/:id', authenticateToken, updateUser)
router.delete('/:id', authenticateToken, deleteUser)

export default router
