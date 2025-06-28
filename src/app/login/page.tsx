
"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth"
import { auth } from "@/lib/firebase"

function LoginPageContents() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
            await setPersistence(auth, persistence)
            await signInWithEmailAndPassword(auth, email, password)
            router.push('/dashboard')
        } catch (error) {
            const firebaseError = error as { code?: string; message: string };
            console.error("Login failed:", firebaseError);
            let description = "An unexpected error occurred. Please check your credentials.";
            if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
                description = "Invalid email or password.";
            } else if (firebaseError.message) {
                description = firebaseError.message;
            }
            toast({
              variant: "destructive",
              title: "Login Failed",
              description: description,
            });
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm bg-card text-card-foreground p-8 rounded-2xl shadow-2xl">
        <CardHeader className="p-0 mb-6">
            <div className="flex justify-center mb-4">
               <Image src="/logo.png" alt="Water4Weightloss Logo" width={60} height={60} className="rounded-lg border-4 border-primary" />
            </div>
          <CardTitle className="text-3xl text-center font-bold text-card-foreground">Login</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="sr-only">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-input border-border placeholder:text-muted-foreground focus:bg-slate-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="sr-only">Password</Label>
                <Input 
                    id="password" 
                    type="password" 
                    placeholder="Password"
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="bg-input border-border placeholder:text-muted-foreground focus:bg-slate-900"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember-me" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="remember-me"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-card-foreground"
                  >
                    Remember me
                  </label>
                </div>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline text-primary">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return <LoginPageContents />
}
