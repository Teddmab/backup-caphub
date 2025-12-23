import { Router, Response } from 'express';
import { prisma } from '../server';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// POST / - Create a new family with current user as parent
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const userId = req.userId!;

    const family = await prisma.family.create({
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to create family' });
  }
});

// GET / - Get all families user is member of
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const families = await prisma.family.findMany({
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch families' });
  }
});

export default router;
