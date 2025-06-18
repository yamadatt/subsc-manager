import { useEffect, useState } from 'react';

const API_URL = 'https://open.er-api.com/v6/latest/USD';

function useExchangeRate() {
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setRate(data.rates.JPY);
      } catch (e) {
        console.error('Failed to fetch exchange rate', e);
      } finally {
        setLoading(false);
      }
    }
    fetchRate();
  }, []);

  return { rate, loading };
}

export default useExchangeRate;
