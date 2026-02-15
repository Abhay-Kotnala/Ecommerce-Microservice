import { Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>E-Commerce</span>
            <span className="text-border">•</span>
            <span>Spring Boot + React</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Abhay-Kotnala/Ecommerce-Microservice"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">View on GitHub</span>
            </a>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              Made with <Heart className="h-4 w-4 text-destructive fill-destructive" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
