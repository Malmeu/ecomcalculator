import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch('http://www.forexalgerie.com');
    const parsedRate = await response.text();
    
    // Traitement des données...
    
    res.status(200).json({ rate: parsedRate });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exchange rate' });
  }
} 