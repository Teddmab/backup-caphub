import { Router, Response } from 'express';
import { prisma } from '../server';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /badges - Fetch all badges
router.get('/badges', async (req, res): Promise<void> => {
  try {
    const badges = await prisma.badge.findMany({
      orderBy: { name: 'asc' }
    });

    res.json(badges);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch badges' });
  }
});

// GET /user/achievements - Fetch user's unlocked badges
router.get('/user/achievements', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const achievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        badge: true
      },
      orderBy: { unlockedAt: 'desc' }
    });

    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// POST /unlock - Unlock badge for user
router.post('/unlock', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { badgeId } = req.body;

    // Check if badge exists
    const badge = await prisma.badge.findUnique({
      where: { id: badgeId }
    });

    if (!badge) {
      res.status(404).json({ error: 'Badge not found' });
      return;
    }

    // Check if already unlocked
    const existingAchievement = await prisma.userAchievement.findUnique({
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
    const achievement = await prisma.userAchievement.create({
      data: {
        userId,
        badgeId
      },
      include: {
        badge: true
      }
    });

    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to unlock badge' });
  }
});

export default router;
