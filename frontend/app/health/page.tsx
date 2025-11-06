import { checkHealth } from "@/lib/health";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Server, Globe } from "lucide-react";

const HealthCheckPage = async () => {
  const { status, error } = await checkHealth();
  
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000";
  const isConnected = status === "healthy";
  const errorMessage = error ? String(error) : "";

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Backend Health Check</h1>
        <p className="text-muted-foreground">
          Verify connection between Vercel frontend and Render backend
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Connection Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Connection Status
            </CardTitle>
            <CardDescription>Backend API connectivity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Status:</span>
              {isConnected ? (
                <Badge className="bg-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  Disconnected
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">Response:</span>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {status || "No response"}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Backend URL Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Backend URL
            </CardTitle>
            <CardDescription>Current API endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="font-medium text-sm text-muted-foreground">Endpoint:</div>
              <code className="text-sm bg-muted px-3 py-2 rounded block break-all">
                {backendUrl}
              </code>
              
              <div className="pt-2">
                <Badge variant="outline">
                  {backendUrl.includes("localhost") ? "Development" : "Production"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Alert */}
      {!isConnected && errorMessage && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription className="mt-2">
            <p>{errorMessage}</p>
            
            <div className="mt-4 space-y-2 text-sm">
              <p className="font-semibold">Troubleshooting steps:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Check if Render backend is deployed and running</li>
                <li>Verify <code className="bg-destructive/20 px-1 rounded">NEXT_PUBLIC_BACKEND_URL</code> in Vercel environment variables</li>
                <li>Check CORS settings in backend allow your Vercel domain</li>
                <li>If using Render free tier, backend may be sleeping (first request takes 30-60s)</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Success Info */}
      {isConnected && (
        <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Connection Successful</AlertTitle>
          <AlertDescription className="text-green-900 dark:text-green-100">
            <p>Your Vercel frontend is successfully connected to the Render backend.</p>
            <p className="mt-2">You can now use all features of TextAnalytica!</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Test Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick API Tests</CardTitle>
          <CardDescription>Test various backend endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <a 
              href={`${backendUrl}/api/health`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-blue-600 hover:underline"
            >
              → /api/health
            </a>
            <a 
              href={`${backendUrl}/api/corpus-overview`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-blue-600 hover:underline"
            >
              → /api/corpus-overview
            </a>
            <a 
              href={`${backendUrl}/api/corpus-documents`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-blue-600 hover:underline"
            >
              → /api/corpus-documents
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthCheckPage;

