import { Request, Response, NextFunction } from "express"
import prisma from "../config/prisma"
import { HTTPError } from "../utils/HTTPError"

const select = {
  id: true,
  imageUrl: true,
  caption: true,
  likeCount: true,
  user: {
    select: {
      id: true,
      username: true,
    },
  },
  comments: {
    select: {
      id: true,
      text: true,
      user: {
        select: {
          id: true,
          username: true,
        },
      },
      createdAt: true,
    },
  },
  createdAt: true,
}

export async function getPosts(_: Request, res: Response, next: NextFunction) {
  try {
    const posts = await prisma.post.findMany({
      select,
      orderBy: { createdAt: "desc" },
    })
    res.json(posts)
  } catch (error) {
    next(error)
  }
}

export async function getPostById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params
    const post = await prisma.post.findUnique({ where: { id }, select })

    if (!post) {
      return next(new HTTPError(`Post ${id} not found`, 404))
    }

    res.json(post)
  } catch (error) {
    next(error)
  }
}

export async function getPostsByUsername(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { username } = req.params
    const posts = await prisma.post.findMany({
      where: { user: { username } },
      select,
    })

    res.json(posts)
  } catch (error) {
    next(error)
  }
}

export async function createPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { imageUrl, caption } = req.body
    const userId = (req as any).user.id

    if (!imageUrl || !caption || !userId) {
      throw new HTTPError("Image URL, caption, and user ID are required", 400)
    }

    const newPost = await prisma.post.create({
      data: { imageUrl, caption, userId },
      select,
    })

    res.status(201).json(newPost)
  } catch (error) {
    next(error)
  }
}

export async function updatePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { imageUrl, caption } = req.body
    const { id } = req.params
    const userId = (req as any).user.id

    const post = await prisma.post.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!post) {
      return next(new HTTPError(`Post ${id} not found`, 404))
    }

    if (post.userId !== userId) {
      return next(
        new HTTPError("You are not authorized to update this post", 403)
      )
    }

    if (!imageUrl && !caption) {
      return next(
        new HTTPError(
          "Operation denied. Please provide at least image URL or caption",
          400
        )
      )
    }

    const updateData: Partial<{ imageUrl: string; caption: string }> = {}
    if (imageUrl) updateData.imageUrl = imageUrl
    if (caption) updateData.caption = caption

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
      select,
    })

    res.json(updatedPost)
  } catch (error) {
    next(error)
  }
}

export async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params
    const userId = (req as any).user.id

    const post = await prisma.post.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!post) {
      return next(new HTTPError(`Post ${id} not found`, 404))
    }

    if (post.userId !== userId) {
      return next(
        new HTTPError("You are not authorized to delete this post", 403)
      )
    }

    await prisma.post.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    next(error)
  }
}

export async function likePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params
    const userId = (req as any).user.id

    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) return next(new HTTPError("Post não encontrado", 404))

    const like = await prisma.like.findFirst({
      where: { postId: id, userId },
    })

    if (like) {
      await Promise.all([
        prisma.like.delete({ where: { id: like.id } }),
        prisma.post.update({
          where: { id },
          data: { likeCount: { decrement: 1 } },
        }),
      ])
    } else {
      await Promise.all([
        prisma.like.create({ data: { postId: id, userId } }),
        prisma.post.update({
          where: { id },
          data: { likeCount: { increment: 1 } },
        }),
      ])
    }

    res.status(200).json({ message: "Post liked" })
  } catch (error) {
    next(error)
  }
}
