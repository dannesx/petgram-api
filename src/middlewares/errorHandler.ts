import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../utils/HTTPError';

export function errorHandler(
	error: HTTPError,
	req: Request,
	res: Response,
	next: NextFunction
) {
	let message = error.message || 'Something went wrong';
	let status = error.status || 500;

	if (error instanceof PrismaClientKnownRequestError) {
		const { code, meta } = error;
		switch (code) {
			case 'P2002':
				message = `Failed to create a new ${meta?.modelName}. This ${meta?.target} already exists`;
				status = 409;
				break;
			case 'P2025':
				message = `${meta?.modelName} not found. Failed to complete operation`;
				status = 404;
				break;
		}
	}

	console.error('[ERROR]', error);
	res.status(status).json({
		error: true,
		message,
	});
}
