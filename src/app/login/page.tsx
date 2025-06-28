
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
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence, onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { User as UserIcon, Lock, Terminal } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ensureUserDocument } from "@/lib/actions"

function LoginPageContents() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setCheckingAuth(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
      if (user) {
        router.push('/dashboard');
      }
    }, [user, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setAuthError(null);
        try {
            const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
            await setPersistence(auth, persistence)
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            
            // Explicitly create the user document if it doesn't exist.
            await ensureUserDocument(userCredential.user.uid);

        } catch (error) {
            const firebaseError = error as { code?: string; message: string };
            console.error("Login failed:", firebaseError);
            let description = "An unexpected error occurred. Please check your credentials.";
            
            if (firebaseError.code === 'auth/invalid-credential') {
                description = "Invalid email or password. Please try again.";
            } else if (firebaseError.code === 'auth/requests-to-this-api-identitytoolkit-method-google.cloud.identitytoolkit.v1.authenticationservice.signinwithpassword-are-blocked') {
                description = "Email/Password sign-in is not enabled for your Firebase project. Please go to the Firebase console, navigate to Authentication > Sign-in method, and enable the Email/Password provider.";
            } else if (firebaseError.message) {
                description = firebaseError.message;
            }
            
            setAuthError(description);
        } finally {
            setIsLoading(false)
        }
    }
    
    if (checkingAuth || user) {
        return null; // or a loading spinner while auth state is being checked or redirecting
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
        
        <Card className="w-full max-w-sm bg-slate-900/30 border-slate-700/0 rounded-2xl shadow-2xl z-10">
            <CardHeader className="p-8 pb-4">
                <CardTitle className="text-3xl font-bold text-center text-[#f7f2d3] [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">Login</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
                {authError && (
                    <Alert variant="destructive" className="mb-6 bg-destructive/20 border-destructive/50 text-destructive-foreground">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Login Error</AlertTitle>
                        <AlertDescription className="text-destructive-foreground/90">
                            {authError}
                        </AlertDescription>
                    </Alert>
                )}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-200/80" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Username"
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
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember-me"
                                checked={rememberMe}
                                onCheckedChange={(checked) => setRememberMe(!!checked)}
                                disabled={isLoading}
                                className="border-[#6a5349] data-[state=checked]:bg-[#6a5349] data-[state=checked]:text-[#f7f2d3]"
                            />
                            <label
                                htmlFor="remember-me"
                                className="font-medium text-[#f7f2d3] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]"
                            >
                                Stay logged in
                            </label>
                        </div>
                        <Link href="#" className="font-medium text-[#f7f2d3] hover:underline [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                            Forgot password?
                        </Link>
                    </div>
                    <Button type="submit" className="w-full bg-white text-black h-12 rounded-lg font-bold text-base hover:bg-gray-200" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
                <div className="mt-6 text-center text-sm text-[#f7f2d3] [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="underline font-bold text-[#f7f2d3] [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
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
