
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
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { createUserWithEmailAndPassword, type User } from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/contexts/AuthContext"
import { Mail, Lock } from "lucide-react"
import { ErrorBoundaryWrapper } from "@/components/ErrorBoundary"

function SignupPageContents() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()
    const { user, loading: checkingAuth } = useAuth()

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            let description = "An unexpected error occurred.";
            if (error instanceof FirebaseError) {
                console.warn("Signup failed:", error.code);
                if (error.code === 'auth/email-already-in-use') {
                    description = "This email is already registered. Please log in instead.";
                } else if (error.code === 'auth/weak-password') {
                    description = "Password is too weak. It should be at least 6 characters.";
                } else {
                    description = "An unexpected error occurred during signup. Please check the console.";
                }
            } else {
                 console.error("An unexpected error occurred during signup:", error);
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

    if (checkingAuth || user) {
        return null;
    }

  return (
     <div className="relative min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4 font-body">
        <div className="absolute inset-0 z-0">
            <Image
                src="/brick wall background login.png"
                alt="Brick wall background"
                layout="fill"
                objectFit="cover"
                objectPosition="top"
                priority
                className="opacity-100"
                data-ai-hint="brick wall"
            />
            <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[60%]"
                style={{
                    background: 'radial-gradient(circle at 50% 0, rgba(247, 242, 211, 0.2) 0%, transparent 70%)'
                }}
            />
        </div>
        
        <Card className="w-full max-w-sm bg-slate-900/30 border border-slate-700 rounded-2xl shadow-2xl z-10">
            <CardHeader className="p-8 pb-4">
                <CardTitle className="text-3xl font-bold text-center text-[#f7f2d3]">Sign Up</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
                <form onSubmit={handleSignup} className="space-y-6">
                    <div className="space-y-4">
                       <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-200/80" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="bg-[#6a5349] border-[#6a5349] placeholder:text-orange-200/70 pl-12 h-12 rounded-lg text-white"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-200/80" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="bg-[#6a5349] border-[#6a5349] placeholder:text-orange-200/70 pl-12 h-12 rounded-lg text-white"
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-white text-black h-12 rounded-lg font-bold text-base hover:bg-gray-200" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Create an account'}
                    </Button>
                </form>
                <div className="mt-6 text-center text-sm text-[#f7f2d3]">
                    Already have an account?{" "}
                    <Link href="/login" className="underline font-bold text-[#f7f2d3]">
                        Login
                    </Link>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}

export default function SignupPage() {
    return (
        <ErrorBoundaryWrapper name="SignupPage">
            <SignupPageContents />
        </ErrorBoundaryWrapper>
    );
}
