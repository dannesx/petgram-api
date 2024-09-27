import { Router } from 'express'
import {
	createUser,
	deleteUser,
	getUserByUsername,
	getUsers,
	updateUser,
} from '../controllers/user'

const router = Router()

router.get('/', getUsers)
router.get('/:username', getUserByUsername)
router.post('/', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router
