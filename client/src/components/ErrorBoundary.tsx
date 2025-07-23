import React, {  Component, type ErrorInfo } from "react";

    class ErrorBoundary extends Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
  > {
    constructor(props: { children: React.ReactNode }) {
      super(props);
      this.state = { hasError: false, error: null };
    }
  
    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }
  
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error("Error caught by boundary:", error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        return (
          <div className="p-4 text-red-700 text-center">
            Something went wrong. Check the console for details.
          </div>
        );
      }
      return this.props.children;
    }
  }


export default ErrorBoundary