import { Router, Response } from 'express';
import { prisma } from '../server';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /lists - Create a new shopping list
router.post('/lists', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title } = req.body;
    const userId = req.userId!;

    const shoppingList = await prisma.shoppingList.create({
      data: {
        userId,
        title
      },
      include: {
        items: true
      }
    });

    res.status(201).json(shoppingList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create shopping list' });
  }
});

// GET /lists - Fetch user's shopping lists with items
router.get('/lists', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const lists = await prisma.shoppingList.findMany({
      where: { userId },
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shopping lists' });
  }
});

export default router;
