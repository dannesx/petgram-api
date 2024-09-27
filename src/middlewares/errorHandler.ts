import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { Request, Response, NextFunction } from 'express'
import { HTTPError } from '../utils/HttpError'

export function errorHandler(
	error: HTTPError,
	req: Request,
	res: Response,
	next: NextFunction
) {
	let message = error.message || 'Something went wrong'
	let status = error.status || 500

	if (error instanceof PrismaClientKnownRequestError) {
		switch (error.code) {
			case 'P2002':
				message = `Failed to create a new ${error.meta?.modelName}. This ${error.meta?.target} already exists`
				status = 400
				break
			case "P2025":
				message = `${error.meta?.modelName} not found. Failed to complete operation`
				status = 404
				break
		}
	}
	console.log('[ERROR]', error)
	res.status(status).json({
		error: true,
		message,
	})
}
