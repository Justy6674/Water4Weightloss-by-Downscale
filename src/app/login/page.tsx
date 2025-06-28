
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
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence, onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { User as UserIcon, Lock } from "lucide-react"

function LoginPageContents() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [checkingAuth, setCheckingAuth] = useState(true);
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setCheckingAuth(false);
        });
        return () => unsubscribe();
    }, []);

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
            if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password' || firebaseError.code === 'auth/invalid-credential') {
                description = "Invalid email or password.";
            } else if (firebaseError.code === 'auth/api-key-not-valid') {
                description = "The application is not configured correctly. Please copy your web app keys into your .env.local file.";
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
    
    if (checkingAuth) {
        return null; // or a loading spinner
    }

    if (user) {
        router.push('/dashboard');
        return null; // or a loading spinner
    }


  return (
    <div className="relative min-h-screen bg-[#0c1a2e] text-white flex items-center justify-center p-4 font-body">
        {/* Background Image & Spotlight */}
        <div className="absolute inset-0 z-0">
            <Image
                src="https://images.unsplash.com/photo-1561057160-b6c70de01399?q=80&w=1920&auto=format&fit=crop"
                alt="Brick wall background"
                fill
                priority
                className="object-cover opacity-30"
                data-ai-hint="dark brick wall"
            />
            <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[80%]"
                style={{
                    background: 'radial-gradient(circle at 50% 0, rgba(255, 215, 139, 0.25) 0%, transparent L, transparent 40%)'
                }}
            />
        </div>
        
        <Card className="w-full max-w-sm bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl z-10">
            <CardHeader className="p-8 pb-4">
                <CardTitle className="text-3xl font-bold text-center text-white">Login</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Username"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="bg-white/10 border-white/20 placeholder:text-white/50 pl-12 h-12 rounded-lg text-white"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                className="bg-white/10 border-white/20 placeholder:text-white/50 pl-12 h-12 rounded-lg text-white"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember-me"
                                checked={rememberMe}
                                onCheckedChange={(checked) => setRememberMe(!!checked)}
                                disabled={isLoading}
                                className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-black"
                            />
                            <label
                                htmlFor="remember-me"
                                className="font-medium text-white/80 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Remember me
                            </label>
                        </div>
                        <Link href="#" className="font-medium text-white/80 hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <Button type="submit" className="w-full bg-white text-black h-12 rounded-lg font-bold text-base hover:bg-white/90" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
                <div className="mt-6 text-center text-sm text-white/80">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="underline font-bold text-white">
                        Register
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
