import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // TODO: Send to error reporting service (Sentry, LogRocket, etc.)
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
          <h2 className="text-[16px] font-semibold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-[13px] text-gray-500 mb-4 text-center max-w-md">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="bg-brand-navy text-white rounded-md px-4 py-2 text-[13px] font-medium cursor-pointer hover:bg-brand-navy-light transition-colors"
          >
            Refresh page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}