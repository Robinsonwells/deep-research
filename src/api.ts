import cors from 'cors';
import express, { Request, Response } from 'express';

import { deepResearch, writeFinalAnswer, writeFinalReport } from './deep-research';

const app = express();
const port = process.env.PORT || 3051;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to run research
app.post('/api/research', async (req: Request, res: Response) => {
  try {
    const { query, depth = 3, breadth = 3, isReport = true } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log('\nStarting research...\n');

    const { learnings, visitedUrls } = await deepResearch({
      query,
      breadth,
      depth,
    });

    console.log(`\n\nLearnings:\n\n${learnings.join('\n')}`);
    console.log(`\n\nVisited URLs (${visitedUrls.length}):\n\n${visitedUrls.join('\n')}`);

    if (isReport) {
      const report = await writeFinalReport({
        prompt: query,
        learnings,
        visitedUrls,
      });
      return res.json({ answer: report });
    } else {
      const answer = await writeFinalAnswer({
        prompt: query,
        learnings,
      });
      return res.json({ exactAnswer: answer });
    }
  } catch (error: unknown) {
    console.error('Error in research API:', error);
    return res.status(500).json({
      error: 'An error occurred during research',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Deep Research API running on port ${port}`);
});

export default app;