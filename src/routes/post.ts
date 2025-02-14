import { Router } from "express"
import {
  createPost,
  deletePost,
  getPostById,
  getPostsByUsername,
  getPosts,
  updatePost,
  likePost,
} from "../controllers/post"
import { authenticateToken } from "../middlewares/auth"

const router = Router()

router.get("/", getPosts)
router.get("/:id", getPostById)
router.get("/user/:username", getPostsByUsername)
router.post("/", authenticateToken, createPost)
router.post("/:id/like", authenticateToken, likePost)
router.put("/:id", authenticateToken, updatePost)
router.delete("/:id", authenticateToken, deletePost)

export default router
