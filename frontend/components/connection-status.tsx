"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function ConnectionStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  const [backendUrl, setBackendUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const checkConnection = async () => {
      const url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000";
      setBackendUrl(url);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(`${url}/api/health`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Backend health check:", data);
          setStatus("connected");
          setError("");
        } else {
          setStatus("disconnected");
          setError(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err: any) {
        console.error("❌ Backend health check failed:", err);
        setStatus("disconnected");
        
        if (err.name === "AbortError") {
          setError("Request timeout - Backend may be sleeping (Render free tier)");
        } else {
          setError(err.message || "Failed to connect to backend");
        }
      }
    };

    checkConnection();
    
    // Recheck every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {status === "checking" && (
        <Badge variant="outline" className="flex items-center gap-2">
          <Loader2 className="h-3 w-3 animate-spin" />
          Checking backend...
        </Badge>
      )}

      {status === "connected" && (
        <Badge variant="default" className="flex items-center gap-2 bg-green-600">
          <CheckCircle2 className="h-3 w-3" />
          Backend Connected
        </Badge>
      )}

      {status === "disconnected" && (
        <Alert variant="destructive" className="max-w-sm">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold">Backend Disconnected</div>
            <div className="text-xs mt-1">URL: {backendUrl}</div>
            <div className="text-xs mt-1">Error: {error}</div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
