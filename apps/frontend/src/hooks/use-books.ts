import { Book } from "@/components/Booklist/columns";
import { getAllBooks } from "@/lib/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";

interface UseBookOptions {
  initialInterval?: number;
  maxInterval?: number;
  onError?: (error: Error) => void;
}

export function useBooks({
  initialInterval = 5000,
  maxInterval = 30000,
  onError,
}: UseBookOptions = {}) {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshInterval, setRefreshInterval] =
    useState<number>(initialInterval);

  const isMounted = useRef(false);
  const fetchTimeoutRef = useRef<NodeJS.Timeout>();
  const initialFetchDone = useRef(false);

  const fetchBooks = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      setIsLoading(true);
      const data = await getAllBooks();
      setBooks(data);

      if (refreshInterval !== initialInterval) {
        setRefreshInterval(initialInterval);
        toast({
          title: "Connection restored",
          description: "Successfully reconnected to the server",
          duration: initialInterval,
        });
      }
      setError(null);
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("An unknown error occurred");
      setError(err);
      onError?.(err);

      const newInterval = Math.min(refreshInterval * 2, maxInterval);
      setRefreshInterval(newInterval);
      console.log(err.message);
      if (err.message.includes("Network Error")) {
        toast({
          title: "Server unavailable",
          description: `Unable to connect to the server. Retrying in ${newInterval / 1000} seconds.`,
          duration: newInterval,
        });
      } else {
        toast({
          title: "Error fetching books",
          description: `Connection failed. Retrying in ${Math.round(newInterval / 1000)} seconds`,
          duration: newInterval,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [refreshInterval, initialInterval, maxInterval, onError]);

  useEffect(() => {
    isMounted.current = true;

    if (!initialFetchDone.current) {
      fetchBooks();
      initialFetchDone.current = true;
    }

    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    fetchTimeoutRef.current = setInterval(fetchBooks, refreshInterval);

    return () => {
      isMounted.current = false;
      if (fetchTimeoutRef.current) {
        clearInterval(fetchTimeoutRef.current);
      }
    };
  }, [fetchBooks, refreshInterval]);

  return { books, isLoading, error, refreshInterval, refetch: fetchBooks };
}
