import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="p-4 rounded-full bg-destructive/10 text-destructive mb-4">
        <AlertTriangle className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-display font-bold text-white">404 - Page Not Found</h1>
      <p className="text-muted-foreground max-w-md">
        The resource or page you are looking for might have been moved, deleted, or possibly never existed in this dimension.
      </p>
      <Link href="/">
        <Button className="glass-button mt-4">
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}
