import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure fetch is always writable in the window environment
try {
  const originalFetch = window.fetch;
  let currentFetch = originalFetch;
  Object.defineProperty(window, 'fetch', {
    get() {
      return currentFetch;
    },
    set(val) {
      currentFetch = val;
    },
    configurable: true,
    enumerable: true,
  });
} catch {
  // Ignore
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Recovered from error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7E7CE] p-6">
          <div className="max-w-md w-full bg-[#FFFDF9] border border-[#DFC7A0] rounded-2xl p-6 shadow-lg text-center space-y-4">
            <div className="w-12 h-12 bg-[#FBF2E3] border border-[#D4B483] text-amber-800 rounded-xl flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-lg font-bold text-stone-900">
              Something unexpected happened
            </h2>
            <p className="text-xs text-stone-700">
              The application recovered. Click below to reload and continue generating your QR codes.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 border border-amber-700/25 text-stone-950 rounded-xl text-xs font-extrabold cursor-pointer shadow-xs transition-colors"
            >
              Reload Studio
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
