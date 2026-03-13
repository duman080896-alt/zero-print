import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  image?: string;
}

export default function ServiceCard({ title, description, icon, href, image }: ServiceCardProps) {
  return (
    <Link href={href} className="block h-full group">
      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden border-none shadow-md">
        {image && (
          <div className="h-48 w-full overflow-hidden relative">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/0 transition-colors" />
          </div>
        )}
        <CardHeader>
          <div className="mb-4 text-accent p-3 bg-accent/10 w-fit rounded-lg group-hover:bg-accent group-hover:text-white transition-colors">
            {icon}
          </div>
          <CardTitle className="text-xl font-bold font-heading group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        </CardContent>
        <CardFooter>
          <span className="text-sm font-semibold text-accent flex items-center gap-2 group-hover:translate-x-2 transition-transform">
            Подробнее <ArrowRight className="h-4 w-4" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
