import { NextFunction, Request, Response } from 'express'
import { prisma } from '../config/prismaConfig.ts'

export const createComment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { postId } = req.params
	const { text } = req.body
	const userId = req.jwt?.userId

	try {
		const post = await prisma.post.findUnique({ where: { id: postId } })

		if (!post) {
			return res.status(404).json({ error: 'Post not found' })
		}

		const comment = await prisma.comment.create({
			data: {
				postId,
				userId,
				text,
			},
		})

		res.status(201).json(comment)
	} catch (error) {
		next(error)
	}
}

export const updateComment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params
	const { text } = req.body
	const userId = req.jwt?.userId

	try {
		let comment = await prisma.comment.findUnique({ where: { id } })

		if (!comment) {
			return res.status(404).json({ error: 'Comment not found' })
		}

		if (comment.userId != userId) {
			return res.status(403).json({ error: 'You cannot edit this comment' })
		}

		comment = await prisma.comment.update({ where: { id }, data: { text } })

		return res.json(comment)
	} catch (error) {
		next(error)
	}
}

export const deleteComment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params
	const userId = req.jwt?.userId

	try {
		const comment = await prisma.comment.findUnique({ where: { id } })

		if (!comment) {
			return res.status(404).json({ error: 'Comment not found' })
		}

		if (comment.userId != userId) {
			return res.status(403).json({ error: 'You cannot delete this comment' })
		}

		await prisma.comment.delete({ where: { id } })
		res.status(204).send()
	} catch (error) {
		next(error)
	}
}
