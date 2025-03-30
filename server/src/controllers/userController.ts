import type { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { hashSync, compareSync } from 'bcrypt';

const prisma = new PrismaClient();

export const signup: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.create({
            data: {
                email,
                password: hashSync(password, 10)
            }
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create user' });
    }
};

export const login: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !compareSync(password, user.password)) {
            res.status(400).json({ error: 'Invalid email or password' });
            return;
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);

        res.status(200).json({ user, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
};
