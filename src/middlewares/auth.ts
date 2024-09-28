import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	if (!token) {
		return res.status(401).json({ error: true, message: 'Access denied' })
	}

	jwt.verify(token, process.env.JWT_SECRET as string, (error, user) => {
		if (error) {
			return res.status(403).json({ error: true, message: 'Invalid token' })
		}

		(req as any).user = user
		console.log(user)
		next()
	})
}
