import prisma from '../models/prismaClient.js';

export const getAllCategories = async (req, res) => {
    try {
        const data = await prisma.category.findMany({
            //lấy danh mục có những quyển sách tiêu biểu
           include: { book: { include: { publisher: true } } }
        });
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const getCategoryById = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await prisma.category.findUnique({
            where: { cat_id: id },
            include: { book: true }
        });
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const createCategory = async (req, res) => {
    const { cat_id, cat_name } = req.body;
    try {
        const data = await prisma.category.create({
            data: { cat_id, cat_name }
        });
        res.json({ message: 'Created', data });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const updateCategory = async (req, res) => {
    const id = req.params.id;
    const { cat_name } = req.body;
    try {
        const data = await prisma.category.update({
            where: { cat_id: id },
            data: { cat_name }
        });
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const deleteCategory = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await prisma.category.delete({
            where: { cat_id: id }
        });
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error });
    }
};


