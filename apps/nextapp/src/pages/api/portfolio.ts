// packages/backend/pages/api/portfolio.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

// Replace `your_postgres_url` with the actual PostgreSQL connection URL
const pool = new Pool({
  connectionString: process.env.YOUR_POSTGRES_URL || 'your_postgres_url',
  ssl: {
    rejectUnauthorized: false, // Use this if connecting to a PostgreSQL database with SSL enabled
  },
});

type PortfolioData = {
  assetName: string;
  quantity: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PortfolioData>
) {
  if (req.method === 'POST') {
    try {
      const { assetName, quantity } = req.body;

      // Insert the form data into the PostgreSQL database
      const result = await pool.query(
        'INSERT INTO portfolio (asset_name, quantity) VALUES ($1, $2) RETURNING *',
        [assetName, quantity]
      );

      const insertedData: PortfolioData = result.rows[0];
      res.status(201).json(insertedData);
    } catch (error) {
      console.error('Error inserting data into PostgreSQL:', error);
      res.status(500)
    }
  } else {
    res.status(405)
  }
}
