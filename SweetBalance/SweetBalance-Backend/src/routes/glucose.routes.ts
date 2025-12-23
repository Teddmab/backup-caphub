import { Router, Response } from 'express';
import { prisma } from '../server';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { validate, bloodGlucoseSchema } from '../schemas/validation';

const router = Router();

// POST /readings - Create a new blood glucose reading
router.post('/readings', authMiddleware, validate(bloodGlucoseSchema), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { value, mealBefore, activity, notes, photoUrl } = req.body;
    const userId = req.userId!;

    const reading = await prisma.bloodGlucoseReading.create({
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reading' });
  }
});

// GET /readings - Fetch user's last 30 readings
router.get('/readings', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const readings = await prisma.bloodGlucoseReading.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 30
    });

    res.json(readings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch readings' });
  }
});

// GET /stats - Calculate glucose statistics
router.get('/stats', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const readings = await prisma.bloodGlucoseReading.findMany({
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate stats' });
  }
});

export default router;
