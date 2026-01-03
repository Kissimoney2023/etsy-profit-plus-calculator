import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
        // You can also log the error to an error reporting service here
    }

    private handleReload = () => {
        window.location.reload();
    };

    private handleGoHome = () => {
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] p-8 md:p-12 max-w-lg w-full text-center shadow-2xl border border-gray-100">
                        <div className="mb-6 inline-flex p-4 bg-red-50 text-red-500 rounded-full">
                            <AlertTriangle className="w-12 h-12" />
                        </div>

                        <h1 className="text-3xl font-black text-secondary mb-4">Oops! Something went wrong.</h1>
                        <p className="text-gray-400 font-medium mb-8">
                            Don't worry, your data is safe. It looks like we hit an unexpected snag.
                        </p>

                        <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left overflow-hidden">
                            <p className="text-xs font-mono text-red-500 break-words">
                                {this.state.error?.toString()}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={this.handleReload}
                                className="flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-opacity-90 transition-all"
                            >
                                <RefreshCcw className="w-4 h-4 mr-2" />
                                Reload Page
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-100 text-gray-500 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-all"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
