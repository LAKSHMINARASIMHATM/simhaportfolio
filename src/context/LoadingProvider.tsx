import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import Loading from "../components/Loading";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
  loadingProgress: number;
}

export const LoadingContext = createContext<LoadingType | null>(null);

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(0);

  const handleSetLoading = useCallback((percent: number) => {
    setLoading(Math.max(0, Math.min(100, percent)));
  }, []);

  const handleSetIsLoading = useCallback((state: boolean) => {
    setIsLoading(state);
    if (!state) {
      setLoading(100);
    }
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      setIsLoading: handleSetIsLoading,
      setLoading: handleSetLoading,
      loadingProgress: loading,
    }),
    [isLoading, loading, handleSetLoading, handleSetIsLoading]
  );

  // Auto-complete loading after 10 seconds to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn('Loading timed out after 10 seconds');
        handleSetLoading(100);
        handleSetIsLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isLoading, handleSetLoading, handleSetIsLoading]);

  return (
    <LoadingContext.Provider value={value}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
