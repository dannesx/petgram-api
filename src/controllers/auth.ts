import { Request, Response, NextFunction } from 'express'
import prisma from '../config/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { HTTPError } from '../utils/HTTPError'

export async function login(req: Request, res: Response, next: NextFunction) {
	try {
		const { username, password } = req.body

		const user = await prisma.user.findUnique({ where: { username } })

		if (!user) {
			return next(new HTTPError('User not found', 404))
		}

		const isPasswordValid = await bcrypt.compare(password, user.password)

		if (!isPasswordValid) {
			return next(new HTTPError('Invalid credentials', 401))
		}

		const token = jwt.sign(
			{ userId: user.id },
			process.env.JWT_SECRET as string,
			{
				expiresIn: '24h',
			}
		)

		res.json({ token })
	} catch (error) {
		next(error)
	}
}
