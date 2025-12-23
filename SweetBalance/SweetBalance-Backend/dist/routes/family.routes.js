"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = require("../server");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// POST / - Create a new family with current user as parent
router.post('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.userId;
        const family = await server_1.prisma.family.create({
            data: {
                name,
                members: {
                    create: {
                        userId,
                        role: 'parent'
                    }
                }
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                username: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                }
            }
        });
        res.status(201).json(family);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create family' });
    }
});
// GET / - Get all families user is member of
router.get('/', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const families = await server_1.prisma.family.findMany({
            where: {
                members: {
                    some: {
                        userId
                    }
                }
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                username: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                }
            }
        });
        res.json(families);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch families' });
    }
});
exports.default = router;
