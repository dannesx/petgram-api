import { Router } from 'express'
import { authenticateToken } from '../middlewares/auth'
import { likePost, unlikePost } from '../controllers/like'

const router = Router()

router.post('/:postId', authenticateToken, likePost)
router.delete('/:postId', authenticateToken, unlikePost)

export default router
