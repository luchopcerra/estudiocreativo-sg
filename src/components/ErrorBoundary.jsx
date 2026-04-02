import { Component } from "react";
import PropTypes from "prop-types";

/**
 * ErrorBoundary Component
 * Catches JavaScript errors in child components and displays a fallback UI
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

function DefaultErrorFallback({ error }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "var(--ivory)" }}>
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-medium mb-4">Algo salió mal</h1>
        <p className="opacity-80 mb-6">
          Hubo un error al cargar esta página. Por favor, intentá recargar.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-sage border border-[var(--charcoal)] px-6 py-2 rounded-full hover:bg-[var(--charcoal)] hover:text-white transition-colors"
        >
          Recargar página
        </button>
        {import.meta.env.DEV && error && (
          <pre className="mt-6 text-left text-xs opacity-60 overflow-auto bg-black/5 p-4 rounded-xl">
            {error.message}
          </pre>
        )}
      </div>
    </div>
  );
}

DefaultErrorFallback.propTypes = {
  error: PropTypes.object,
};
