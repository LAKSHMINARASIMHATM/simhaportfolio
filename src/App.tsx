import React, { lazy, Suspense, useEffect, Component, ErrorInfo } from "react";
import "./App.css";
import { LoadingProvider, useLoading } from "./context/LoadingProvider";

// Lazy load components with retry logic
const lazyWithRetry = (componentImport: any) =>
  lazy(async () => {
    const pageHasRefreshed = JSON.parse(
      window.sessionStorage.getItem('pageRefreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('pageRefreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasRefreshed) {
        window.sessionStorage.setItem('pageRefreshed', 'true');
        return window.location.reload();
      }
      throw error;
    }
  });

const CharacterModel = lazyWithRetry(() => import("./components/Character"));
const MainContainer = lazyWithRetry(() => import("./components/MainContainer"));

// Error boundary component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Import the Loading component
import Loading from "./components/Loading";

// Loading component
const Loader = () => {
  const { loadingProgress } = useLoading();
  return <Loading percent={loadingProgress} />;
};

const AppContent = () => {
  const { setLoading, isLoading } = useLoading();

  // Simulate loading progress
  useEffect(() => {
    if (!isLoading) return;
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress <= 100) {
        setLoading(progress);
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [setLoading, isLoading]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <MainContainer>
          <CharacterModel />
        </MainContainer>
      </Suspense>
    </ErrorBoundary>
  );
};

const App = () => {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
};

export default App;
