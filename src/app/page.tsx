
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets } from "lucide-react";
import EnvDebug from "@/components/EnvDebug";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <EnvDebug />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Image src="/logo.png" alt="Water4Weightloss Logo" width={32} height={32} />
            Water4Weightloss
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-secondary">
                    Unlock Your Weight Loss Journey with Hydration
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our app helps you track water intake, stay motivated with AI-powered coaching, and understand the science behind hydration for effective weight loss.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/signup">Create Account</Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/login">Login</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="/hero-w4w.png"
                width={600}
                height={400}
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                priority
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
