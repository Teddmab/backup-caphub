"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = require("../server");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// POST /lists - Create a new shopping list
router.post('/lists', auth_1.authMiddleware, async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.userId;
        const shoppingList = await server_1.prisma.shoppingList.create({
            data: {
                userId,
                title
            },
            include: {
                items: true
            }
        });
        res.status(201).json(shoppingList);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create shopping list' });
    }
});
// GET /lists - Fetch user's shopping lists with items
router.get('/lists', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const lists = await server_1.prisma.shoppingList.findMany({
            where: { userId },
            include: {
                items: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(lists);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch shopping lists' });
    }
});
exports.default = router;
