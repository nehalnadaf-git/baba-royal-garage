import Link from "next/link";
import { Home, Wrench } from "lucide-react";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <Wrench className="h-10 w-10 text-primary" />
        </div>
        <h1 className="font-display text-6xl sm:text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="font-heading text-2xl font-bold text-foreground uppercase tracking-wider mb-4">Page Not Found</h2>
        <p className="text-body text-muted-foreground max-w-md mx-auto mb-8">
          The page you&apos;re looking for doesn&apos;t exist. It might have been moved or you may have typed the wrong address.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-3 rounded-xl text-cta transition-all hover:shadow-hover">
            <Home className="h-4 w-4" /> Go Home
          </Link>
          <Link href="/services" className="flex items-center justify-center gap-2 glass border border-primary/30 text-foreground hover:text-primary px-8 py-3 rounded-xl text-cta transition-all">
            View Services
          </Link>
        </div>
      </div>
    </section>
  );
}
