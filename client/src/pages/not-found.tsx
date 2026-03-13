import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md mx-auto text-center border-none shadow-lg">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 justify-center">
            <AlertCircle className="h-12 w-12 text-accent" />
          </div>
          <h1 className="text-3xl font-bold font-heading text-primary mb-4">404 Page Not Found</h1>
          <p className="mt-4 text-sm text-gray-500 mb-8">
            The page you are looking for does not exist.
          </p>
          <Link href="/">
            <Button className="w-full bg-accent hover:bg-accent/90 text-white font-bold">Return Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
