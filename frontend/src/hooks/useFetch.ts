import { useState, useEffect } from 'react';
import api from '../utils/api';

interface UseFetchOptions {
  skip?: boolean;
}

export const useFetch = <T,>(url: string, options?: UseFetchOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (options?.skip) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(url);
        setData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching data');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options?.skip]);

  return { data, loading, error };
};
