"use client";
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-[32px] p-8 shadow-xl text-center border border-gray-100 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              ขออภัย เกิดข้อผิดพลาดบางอย่างในระบบ โปรดลองโหลดหน้าใหม่อีกครั้ง หรือกลับไปที่หน้าหลัก
            </p>
            
            <div className="space-y-3">
              <Button 
                variant="primary" 
                className="w-full h-12 rounded-2xl gap-2 shadow-lg shadow-primary-500/20"
                onClick={() => window.location.reload()}
              >
                <RefreshCcw size={18} />
                ลองใหม่อีกครั้ง
              </Button>
              <Button 
                variant="ghost" 
                className="w-full h-12 rounded-2xl gap-2 text-gray-400 hover:text-gray-900"
                onClick={() => window.location.href = "/"}
              >
                <Home size={18} />
                กลับหน้าหลัก
              </Button>
            </div>
            
            {process.env.NODE_ENV === "development" && (
              <div className="mt-8 p-4 bg-gray-50 rounded-xl text-left overflow-auto max-h-[200px]">
                <p className="text-[10px] font-mono text-gray-400 uppercase mb-2">Debug Info:</p>
                <p className="text-xs font-mono text-red-500 whitespace-pre-wrap">
                  {this.state.error?.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
