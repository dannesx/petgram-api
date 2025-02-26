import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { HTTPError } from '../utils/HTTPError';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

const select = {
	id: true,
	username: true,
	email: true,
	createdAt: true,
};

export async function getUsers(_: Request, res: Response, next: NextFunction) {
	try {
		const users = await prisma.user.findMany({ select });
		res.json(users);
	} catch (error) {
		next(error);
	}
}

export async function getUserByUsername(req: Request, res: Response, next: NextFunction) {
	try {
		const { username } = req.params;
		const user = await prisma.user.findUnique({ where: { username }, select });

		if (!user) {
			return next(new HTTPError(`User ${username} not found`, 404));
		}

		res.json(user);
	} catch (error) {
		next(error);
	}
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
	try {
		const { username, email, password } = req.body;

		if (!username || !email || !password) {
			throw new HTTPError('Username, email and password are required', 400);
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await prisma.user.create({
			data: { username, email, password: hashedPassword },
			select,
		});

		res.status(201).json(newUser);
	} catch (error) {
		next(error);
	}
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
	try {
		const { username, email, password } = req.body;
		const { id } = req.params;

		if (!username && !email && !password) {
			return next(new HTTPError('Operation denied. Please provide at least username, email or password', 400));
		}

		const updateData: Partial<User> = {};
		if (username) updateData.username = username;
		if (email) updateData.email = email;
		if (password) updateData.password = await bcrypt.hash(password, 10);

		const updatedUser = await prisma.user.update({
			where: { id },
			data: updateData,
			select,
		});

		res.json(updatedUser);
	} catch (error) {
		next(error);
	}
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;
		await prisma.user.delete({ where: { id } });
		res.status(204).send();
	} catch (error) {
		next(error);
	}
}
