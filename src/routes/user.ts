import { Router } from 'express'
import {
	createUser,
	deleteUser,
	getUserByUsername,
	getUsers,
	updateUser,
} from '../controllers/user'
import { authenticateToken } from '../middlewares/auth'

const router = Router()

router.get('/', getUsers)
router.get('/:username', authenticateToken, getUserByUsername)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router
