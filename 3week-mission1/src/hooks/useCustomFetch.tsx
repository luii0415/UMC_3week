import { useEffect, useState } from "react";
import axios from "axios";

/**
 * GET 전용 커스텀 훅
 */
function useCustomFetch<T = unknown>(url: string | null | undefined) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return; // URL이 없으면 패스

    let cancelled = false;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await axios.get<T>(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_APP_API_KEY}`,
          },
        });

        if (!cancelled) setData(res.data);
      } catch (e) {
        if (!cancelled) setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true; // 컴포넌트 언마운트 시 응답 무시
    };
  }, [url]);

  return { data, isLoading, error };
}

export default useCustomFetch;
