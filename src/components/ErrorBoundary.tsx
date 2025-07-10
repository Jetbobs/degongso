"use client";

import React, { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { AppError } from "@/types";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: Date.now().toString(),
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // 에러 로깅
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // 에러 정보를 localStorage에 저장 (개발용)
    if (process.env.NODE_ENV === "development") {
      localStorage.setItem(
        `error_${this.state.errorId}`,
        JSON.stringify({
          error: error.message,
          stack: error.stack,
          errorInfo,
          timestamp: new Date().toISOString(),
        })
      );
    }

    // 커스텀 에러 핸들러 호출
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: "",
    });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // 커스텀 폴백 UI가 있다면 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <Card className="max-w-md w-full shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-red-500" />
              </div>
              <CardTitle className="text-xl text-red-600">
                앱에서 오류가 발생했습니다
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">
                  죄송합니다. 예상치 못한 오류가 발생했습니다.
                </p>
                <p>문제가 지속되면 새로고침하거나 홈으로 이동해 주세요.</p>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-xs text-red-800 font-mono">
                    {this.state.error.message}
                  </p>
                  <details className="mt-2">
                    <summary className="text-xs text-red-600 cursor-pointer">
                      스택 트레이스 보기
                    </summary>
                    <pre className="text-xs text-red-700 mt-1 overflow-auto">
                      {this.state.error.stack}
                    </pre>
                  </details>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={this.handleRetry}
                  className="flex-1"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  다시 시도
                </Button>
                <Button onClick={this.handleGoHome} className="flex-1">
                  <Home className="h-4 w-4 mr-2" />
                  홈으로
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
