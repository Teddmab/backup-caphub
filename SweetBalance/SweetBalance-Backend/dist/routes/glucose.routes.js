"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = require("../server");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../schemas/validation");
const router = (0, express_1.Router)();
// POST /readings - Create a new blood glucose reading
router.post('/readings', auth_1.authMiddleware, (0, validation_1.validate)(validation_1.bloodGlucoseSchema), async (req, res) => {
    try {
        const { value, mealBefore, activity, notes, photoUrl } = req.body;
        const userId = req.userId;
        const reading = await server_1.prisma.bloodGlucoseReading.create({
            data: {
                userId,
                value: parseInt(value),
                mealBefore,
                activity,
                notes,
                photoUrl
            }
        });
        res.status(201).json(reading);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create reading' });
    }
});
// GET /readings - Fetch user's last 30 readings
router.get('/readings', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const readings = await server_1.prisma.bloodGlucoseReading.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' },
            take: 30
        });
        res.json(readings);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch readings' });
    }
});
// GET /stats - Calculate glucose statistics
router.get('/stats', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const readings = await server_1.prisma.bloodGlucoseReading.findMany({
            where: { userId },
            select: { value: true }
        });
        if (readings.length === 0) {
            res.json({
                average: 0,
                min: 0,
                max: 0,
                count: 0
            });
            return;
        }
        const values = readings.map(r => r.value);
        const average = values.reduce((sum, val) => sum + val, 0) / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);
        res.json({
            average: Math.round(average),
            min,
            max,
            count: readings.length
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to calculate stats' });
    }
});
exports.default = router;
