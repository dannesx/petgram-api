import { Router } from 'express'
import {
	createPost,
	deletePost,
	getPostById,
	getPosts,
	updatePost,
} from '../controllers/post'
import { authenticateToken } from '../middlewares/auth'

const router = Router()

router.get('/', getPosts)
router.get('/:id', getPostById)
router.post('/', authenticateToken, createPost)
router.put('/:id', authenticateToken, updatePost)
router.delete('/:id', authenticateToken, deletePost)

export default router
