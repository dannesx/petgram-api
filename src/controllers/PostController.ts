import { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/prismaConfig.ts'

export const getPosts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const posts = await prisma.post.findMany({
			select: {
				id: true,
				imageUrl: true,
				caption: true,
				likes: true,
				User: {
					select: {
						id: true,
						username: true,
					},
				},
				comments: true,
				createdAt: true,
				updatedAt: true,
			},
		})
		res.json(posts)
	} catch (error) {
		next(error)
	}
}

export const getPostById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params

	try {
		const post = await prisma.post.findUnique({
			where: { id },
			select: {
				id: true,
				imageUrl: true,
				caption: true,
				likes: true,
				User: {
					select: {
						id: true,
						username: true,
					},
				},
				comments: true,
				createdAt: true,
				updatedAt: true,
			},
		})

		if (post) {
			res.json(post)
		} else {
			res.status(404).json({ error: 'Post not found' })
		}
	} catch (error) {
		next(error)
	}
}

export const createPost = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { caption, imageUrl } = req.body
	const userId = req.jwt?.userId

	if (!userId) {
		return res.status(400).json({ error: 'User ID is required' })
	}

	if (!imageUrl) {
		return res.status(400).json({ error: 'Image is required' })
	}

	try {
		const newPost = await prisma.post.create({
			data: { caption, userId, imageUrl },
		})
		res.status(201).json(newPost)
	} catch (error) {
		next(error)
	}
}

export const updatePost = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params
	const { caption } = req.body
	const userId = req.jwt?.userId

	try {
		const post = await prisma.post.findUnique({ where: { id } })

		if (!post) {
			return res.status(404).json({ error: 'Post not found' })
		}

		if (post.userId != userId) {
			return res.status(403).json({ error: 'You cannot edit this post' })
		}

		const updatedPost = await prisma.post.update({
			where: { id },
			data: { caption },
		})

		res.json(updatedPost)
	} catch (error) {
		next(error)
	}
}

export const deletePost = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params
	const userId = req.jwt?.userId

	try {
		const post = await prisma.post.findUnique({ where: { id } })

		if (!post) {
			return res.status(404).json({ error: 'Post not found' })
		}

		if (post.userId != userId) {
			return res.status(403).json({ error: 'You cannot delete this post' })
		}

		await prisma.post.delete({ where: { id } })
		res.status(204).send()
	} catch (error) {
		next(error)
	}
}

export const likePost = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params

	try {
		let post = await prisma.post.findUnique({ where: { id } })

		if (!post) {
			return res.status(404).json({ error: 'Post not found' })
		}

		post = await prisma.post.update({
			where: { id },
			data: {
				likes: { increment: 1 },
			},
		})

		return res.json(post)
	} catch (error) {
		next(error)
	}
}
