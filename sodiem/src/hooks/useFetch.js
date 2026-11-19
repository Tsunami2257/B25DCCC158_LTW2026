import { useEffect, useState } from 'react';

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = await res.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err);
        setLoading(false);
      }
    };

    loadData();

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
};