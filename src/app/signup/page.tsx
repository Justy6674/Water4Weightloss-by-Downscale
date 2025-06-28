
"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"

function SignupPageContents() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            router.push('/dashboard')
        } catch (error) {
            const firebaseError = error as { code?: string; message: string };
            console.error("Signup failed:", firebaseError);
            let description = "An unexpected error occurred.";
            if (firebaseError.code === 'auth/email-already-in-use') {
                description = "This email is already registered. Please log in instead.";
            } else if (firebaseError.message) {
                description = firebaseError.message;
            }
            toast({
              variant: "destructive",
              title: "Signup Failed",
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
          <CardTitle className="text-3xl font-bold text-center text-card-foreground">Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
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
              <div className="grid gap-2">
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
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create an account'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="underline text-primary">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SignupPage() {
    return <SignupPageContents />
}
