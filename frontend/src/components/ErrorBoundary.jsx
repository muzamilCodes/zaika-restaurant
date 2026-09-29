import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-900 text-white">
          <div className="max-w-lg p-6 text-center">
            <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-sm mb-4">An unexpected error occurred. Try refreshing the page.</p>
            <pre className="text-xs text-left max-h-48 overflow-auto bg-black/30 p-2 rounded">{String(this.state.error)}</pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
