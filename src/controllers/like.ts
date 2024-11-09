import { Request, Response, NextFunction } from 'express'
import prisma from '../config/prisma'
import { HTTPError } from '../utils/HTTPError'

export async function likePost(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { postId } = req.params
		const userId = (req as any).user.id

		const post = await prisma.post.findUnique({
			where: { id: postId },
			select: { id: true },
		})

		if (!post) {
			throw new HTTPError('Post not found', 404)
		}

		const like = await prisma.like.findFirst({
			where: {
				userId,
				postId,
			},
		})

		if (like) {
			throw new HTTPError('You already liked this post', 400)
		}

		await prisma.like.create({
			data: {
				userId,
				postId,
			},
		})

		const updatedPost = await prisma.post.update({
			where: { id: postId },
			data: { likeCount: { increment: 1 } },
		})

		res.status(201).json(updatedPost)
	} catch (error) {
		next(error)
	}
}

export async function unlikePost(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { postId } = req.params
		const userId = (req as any).user.id

		const post = await prisma.post.findUnique({
			where: { id: postId },
			select: { id: true },
		})

		if (!post) {
			throw new HTTPError('Post not found', 404)
		}

		const like = await prisma.like.findFirst({
			where: {
				userId,
				postId,
			},
		})

		if (!like) {
			throw new HTTPError('You have not liked this post', 400)
		}

		await prisma.like.deleteMany({
			where: {
				userId,
				postId,
			},
		})

		const updatedPost = await prisma.post.update({
			where: { id: postId },
			data: { likeCount: { decrement: 1 } },
		})

		res.json(updatedPost)
	} catch (error) {
		next(error)
	}
}
