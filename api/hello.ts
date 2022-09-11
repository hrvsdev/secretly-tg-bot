import { VercelRequest, VercelResponse } from '@vercel/node';

export default (req: VercelRequest, res: VercelResponse) => {
  return res.json({
    name: `Hello, from ${req.url} I'm now an Edge Function!`,
  });
};