import { Router, Response } from 'express';
import { prisma } from '../server';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /markets - Fetch all markets
router.get('/markets', async (req, res): Promise<void> => {
  try {
    const markets = await prisma.localMarket.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    res.json(markets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch markets' });
  }
});

// GET /markets/:id - Fetch market details
router.get('/markets/:id', async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    const market = await prisma.localMarket.findUnique({
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market details' });
  }
});

// GET /markets/:id/products - Fetch products in market
router.get('/markets/:id/products', async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const { category } = req.query;

    const products = await prisma.localMarketProduct.findMany({
      where: {
        marketId: id,
        ...(category && { category: category as string })
      },
      orderBy: { name: 'asc' }
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /preferences - Save user market preference
router.post('/preferences', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { marketId, frequency, preferredDays } = req.body;

    // Check if preference already exists
    const existingPreference = await prisma.localMarketPreference.findFirst({
      where: { userId, marketId }
    });

    if (existingPreference) {
      // Update existing
      const preference = await prisma.localMarketPreference.update({
        where: { id: existingPreference.id },
        data: { frequency, preferredDays }
      });
      res.json(preference);
    } else {
      // Create new
      const preference = await prisma.localMarketPreference.create({
        data: {
          userId,
          marketId,
          frequency,
          preferredDays
        }
      });
      res.status(201).json(preference);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to save preference' });
  }
});

export default router;
