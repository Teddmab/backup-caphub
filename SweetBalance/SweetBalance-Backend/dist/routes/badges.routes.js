"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = require("../server");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /badges - Fetch all badges
router.get('/badges', async (req, res) => {
    try {
        const badges = await server_1.prisma.badge.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(badges);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch badges' });
    }
});
// GET /user/achievements - Fetch user's unlocked badges
router.get('/user/achievements', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const achievements = await server_1.prisma.userAchievement.findMany({
            where: { userId },
            include: {
                badge: true
            },
            orderBy: { unlockedAt: 'desc' }
        });
        res.json(achievements);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch achievements' });
    }
});
// POST /unlock - Unlock badge for user
router.post('/unlock', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { badgeId } = req.body;
        // Check if badge exists
        const badge = await server_1.prisma.badge.findUnique({
            where: { id: badgeId }
        });
        if (!badge) {
            res.status(404).json({ error: 'Badge not found' });
            return;
        }
        // Check if already unlocked
        const existingAchievement = await server_1.prisma.userAchievement.findUnique({
            where: {
                userId_badgeId: {
                    userId,
                    badgeId
                }
            }
        });
        if (existingAchievement) {
            res.status(400).json({ error: 'Badge already unlocked' });
            return;
        }
        // Unlock badge
        const achievement = await server_1.prisma.userAchievement.create({
            data: {
                userId,
                badgeId
            },
            include: {
                badge: true
            }
        });
        res.status(201).json(achievement);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to unlock badge' });
    }
});
exports.default = router;
