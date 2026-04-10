"use client";

import React from "react";
import { logger } from "@/lib/logger";
import { AlertCircle } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    logger.error("Error caught by boundary:", {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="size-6 text-red-500" />
              <h1 className="text-xl font-bold text-red-600">
                Oops! Something went wrong
              </h1>
            </div>

            <p className="text-gray-600 mb-4">
              We encountered an unexpected error. Please try refreshing the page
              or contact support if the problem persists.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-4 p-3 bg-gray-100 rounded text-sm font-mono text-gray-800">
                <summary className="cursor-pointer font-bold mb-2">
                  Error Details (Development Only)
                </summary>
                <p className="mb-2">
                  <strong>Error:</strong> {this.state.error.toString()}
                </p>
                <p className="text-xs whitespace-pre-wrap overflow-auto max-h-32">
                  {this.state.errorInfo?.componentStack}
                </p>
              </details>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
