import { NextFunction, Request, Response } from 'express'
import prisma from '../config/prisma'
import { HTTPError } from '../utils/HTTPError'

export async function createComment(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { postId } = req.params
		const { text } = req.body
		const userId = (req as any).user.id

		if (!text) {
			throw new HTTPError('Text is required', 400)
		}

		if (!userId) {
			throw new HTTPError('User not found', 404)
		}

		const post = await prisma.post.findUnique({
			where: { id: postId },
			select: { id: true },
		})

		if (!post) {
			throw new HTTPError('Post not found', 404)
		}

		const comment = await prisma.comment.create({
			data: {
				text,
				userId,
				postId,
			},
		})

		res.status(201).json(comment)
	} catch (error) {
		next(error)
	}
}

export async function updateComment(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { id } = req.params
		const { text } = req.body
		const userId = (req as any).user.id

		if (!text) {
			throw new HTTPError('Text is required', 400)
		}

		const comment = await prisma.comment.findUnique({
			where: { id },
			select: { userId: true },
		})

		if (!comment) {
			throw new HTTPError('Comment not found', 404)
		}

		if (userId !== comment.userId) {
			throw new HTTPError('Unauthorized', 401)
		}

		const updatedComment = await prisma.comment.update({
			where: { id },
			data: { text },
		})

		res.json(updatedComment)
	} catch (error) {
		next(error)
	}
}

export async function deleteComment(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { id } = req.params
		const userId = (req as any).user.id

		const comment = await prisma.comment.findUnique({
			where: { id },
			select: { userId: true },
		})

		if (!comment) {
			throw new HTTPError('Comment not found', 404)
		}

		if (userId !== comment.userId) {
			throw new HTTPError('Unauthorized', 401)
		}

		await prisma.comment.delete({
			where: { id },
		})

		res.status(204).send()
	} catch (error) {
		next(error)
	}
}
