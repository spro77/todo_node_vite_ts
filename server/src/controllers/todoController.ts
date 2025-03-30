import type { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllTodos: RequestHandler = async (req, res) => {
    try {
        // Only show todos belonging to the authenticated user
        const todos = await prisma.todo.findMany({
            where: {
                userId: req.userId
            }
        });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
};

export const getTodosByUserId: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id, 10);

    try {
        // Security check: users can only access their own todos
        if (req.userId !== userId) {
            res.status(403).json({ error: 'Access denied: You can only view your own todos' });
            return;
        }

        const todos = await prisma.todo.findMany({
            where: {
                userId: userId
            }
        });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
};

export const getTodosByUserEmail: RequestHandler = async (req, res) => {
    const { email } = req.params;

    try {
        // First find the user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Security check: users can only access their own todos
        if (req.userId !== user.id) {
            res.status(403).json({ error: 'Access denied: You can only view your own todos' });
            return;
        }

        const todos = await prisma.todo.findMany({
            where: {
                userId: user.id
            }
        });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
};

export const createTodo: RequestHandler = async (req, res) => {
    try {
        const { description } = req.body;
        // Use the authenticated user's ID instead of passing it in the request
        const todo = await prisma.todo.create({
            data: { 
                description, 
                userId: req.userId as number 
            }
        });
        res.status(201).json(todo);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create todo' });
    }
};

export const deleteTodo: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const todoId = parseInt(id, 10);

    try {
        // Find the todo first to check ownership
        const todo = await prisma.todo.findUnique({
            where: { id: todoId }
        });

        if (!todo) {
            res.status(404).json({ error: 'Todo not found' });
            return;
        }

        // Security check: users can only delete their own todos
        if (todo.userId !== req.userId) {
            res.status(403).json({ error: 'Access denied: You can only delete your own todos' });
            return;
        }

        // Delete the todo
        const deletedTodo = await prisma.todo.delete({
            where: { id: todoId }
        });
        
        res.status(200).json(deletedTodo);
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete todo' });
    }
};
