// packages/frontend/pages/index.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface PortfolioData {
  assetName: string;
  quantity: number;
}

interface FormData {
  assetName: string;
  quantity: number;
}

const Myhome: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    assetName: '',
    quantity: 0,
  });

  useEffect(() => {
    // Fetch portfolio data when the component mounts
    axios.get<PortfolioData>('/api/portfolio')
      .then((response) => setPortfolioData(response.data))
      .catch((error) => console.error('Error fetching portfolio data:', error));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send form data to the server
      const response = await axios.post<PortfolioData>('/api/portfolio', formData);
      setPortfolioData(response.data);
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };

  return (
    <div>
      <h1>Portfolio Management App</h1>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <label>
          Asset Name:
          <input
            type="text"
            name="assetName"
            value={formData.assetName}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          Quantity:
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </label>
        <br />

        <button type="submit">Submit</button>
      </form>

      {/* Display Portfolio Data */}
      <div>
        <h2>Portfolio Data</h2>
        {portfolioData ? (
          <pre>{JSON.stringify(portfolioData, null, 2)}</pre>
        ) : (
          <p>Loading portfolio data...</p>
        )}
      </div>
    </div>
  );
};

export default Myhome;
