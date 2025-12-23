import { Router, Response } from 'express';
import { prisma } from '../server';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { validate, goalSchema } from '../schemas/validation';

const router = Router();

// POST /goals - Create a new diabetes goal
router.post('/goals', authMiddleware, validate(goalSchema), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, targetValue } = req.body;
    const userId = req.userId!;

    const goal = await prisma.diabetesGoal.create({
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// GET /goals - Fetch all user goals
router.get('/goals', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const goals = await prisma.diabetesGoal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// PUT /goals/:id - Update a goal
router.put('/goals/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const { title, description, targetValue, currentValue, status } = req.body;

    // Verify goal belongs to user
    const existingGoal = await prisma.diabetesGoal.findFirst({
      where: { id, userId }
    });

    if (!existingGoal) {
      res.status(404).json({ error: 'Goal not found' });
      return;
    }

    const goal = await prisma.diabetesGoal.update({
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// DELETE /goals/:id - Delete a goal
router.delete('/goals/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    // Verify goal belongs to user
    const existingGoal = await prisma.diabetesGoal.findFirst({
      where: { id, userId }
    });

    if (!existingGoal) {
      res.status(404).json({ error: 'Goal not found' });
      return;
    }

    await prisma.diabetesGoal.delete({
      where: { id }
    });

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

export default router;
