import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HTTPError } from '../utils/HTTPError';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers['authorization'];
	const token = authHeader?.split(' ')[1];

	if (!token) {
		return next(new HTTPError("Access denied", 401));
	}

	jwt.verify(token, process.env.JWT_SECRET as string, (error, decoded) => {
		if (error) {
			return next(new HTTPError("Invalid token", 403));
		}

		(req as any).user = decoded;
		next();
	});
}
