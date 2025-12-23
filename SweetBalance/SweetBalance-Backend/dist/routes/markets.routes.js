"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = require("../server");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /markets - Fetch all markets
router.get('/markets', async (req, res) => {
    try {
        const markets = await server_1.prisma.localMarket.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
        res.json(markets);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch markets' });
    }
});
// GET /markets/:id - Fetch market details
router.get('/markets/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const market = await server_1.prisma.localMarket.findUnique({
            where: { id },
            include: {
                products: true
            }
        });
        if (!market) {
            res.status(404).json({ error: 'Market not found' });
            return;
        }
        res.json(market);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch market details' });
    }
});
// GET /markets/:id/products - Fetch products in market
router.get('/markets/:id/products', async (req, res) => {
    try {
        const { id } = req.params;
        const { category } = req.query;
        const products = await server_1.prisma.localMarketProduct.findMany({
            where: {
                marketId: id,
                ...(category && { category: category })
            },
            orderBy: { name: 'asc' }
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});
// POST /preferences - Save user market preference
router.post('/preferences', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { marketId, frequency, preferredDays } = req.body;
        // Check if preference already exists
        const existingPreference = await server_1.prisma.localMarketPreference.findFirst({
            where: { userId, marketId }
        });
        if (existingPreference) {
            // Update existing
            const preference = await server_1.prisma.localMarketPreference.update({
                where: { id: existingPreference.id },
                data: { frequency, preferredDays }
            });
            res.json(preference);
        }
        else {
            // Create new
            const preference = await server_1.prisma.localMarketPreference.create({
                data: {
                    userId,
                    marketId,
                    frequency,
                    preferredDays
                }
            });
            res.status(201).json(preference);
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to save preference' });
    }
});
exports.default = router;
