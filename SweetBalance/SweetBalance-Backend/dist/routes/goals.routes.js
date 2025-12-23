"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = require("../server");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../schemas/validation");
const router = (0, express_1.Router)();
// POST /goals - Create a new diabetes goal
router.post('/goals', auth_1.authMiddleware, (0, validation_1.validate)(validation_1.goalSchema), async (req, res) => {
    try {
        const { title, description, targetValue } = req.body;
        const userId = req.userId;
        const goal = await server_1.prisma.diabetesGoal.create({
            data: {
                userId,
                title,
                description,
                targetValue: parseInt(targetValue),
                currentValue: 0,
                status: 'active'
            }
        });
        res.status(201).json(goal);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create goal' });
    }
});
// GET /goals - Fetch all user goals
router.get('/goals', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const goals = await server_1.prisma.diabetesGoal.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(goals);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch goals' });
    }
});
// PUT /goals/:id - Update a goal
router.put('/goals/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { title, description, targetValue, currentValue, status } = req.body;
        // Verify goal belongs to user
        const existingGoal = await server_1.prisma.diabetesGoal.findFirst({
            where: { id, userId }
        });
        if (!existingGoal) {
            res.status(404).json({ error: 'Goal not found' });
            return;
        }
        const goal = await server_1.prisma.diabetesGoal.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(targetValue && { targetValue: parseInt(targetValue) }),
                ...(currentValue !== undefined && { currentValue: parseInt(currentValue) }),
                ...(status && { status })
            }
        });
        res.json(goal);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update goal' });
    }
});
// DELETE /goals/:id - Delete a goal
router.delete('/goals/:id', auth_1.authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        // Verify goal belongs to user
        const existingGoal = await server_1.prisma.diabetesGoal.findFirst({
            where: { id, userId }
        });
        if (!existingGoal) {
            res.status(404).json({ error: 'Goal not found' });
            return;
        }
        await server_1.prisma.diabetesGoal.delete({
            where: { id }
        });
        res.json({ message: 'Goal deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete goal' });
    }
});
exports.default = router;
