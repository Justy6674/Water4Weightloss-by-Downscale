
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
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signInWithPopup,
  GoogleAuthProvider,
  type User 
} from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { auth } from "@/lib/firebase"
import { User as UserIcon, Lock, Terminal, Phone } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.223,0-9.655-3.357-11.303-8H6.306C9.656,39.663,16.318,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.447-2.275,4.485-4.124,5.992l6.19,5.238C39.712,34.466,44,28.756,44,20C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
);


function LoginPageContents() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);
    const router = useRouter()
    const { toast } = useToast()
    
    useEffect(() => {
        // This effect runs once on component mount
        const savedPreference = JSON.parse(localStorage.getItem('rememberMe') || 'true');
        setRememberMe(savedPreference);
    }, []);

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

    const handleRememberMeChange = (checked: boolean) => {
        setRememberMe(checked);
        localStorage.setItem('rememberMe', JSON.stringify(checked));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setAuthError(null);
        try {
            // Persistence is now set globally in firebase.ts, so we just sign in.
            await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
            let description = "An unexpected error occurred. Please try again.";
            if (error instanceof FirebaseError) {
                console.warn("Login Failed:", error.code);
                if (error.code === 'auth/invalid-credential') {
                    description = "Invalid email or password. Please try again.";
                } else if (error.code.includes('requests-to-this-api-are-blocked')) {
                    description = "Email/Password sign-in is not enabled for this project. Please enable it in the Firebase console.";
                } else {
                    description = "An unexpected error occurred. Please check the console for details.";
                }
            } else {
                console.error("An unexpected error occurred during login:", error);
            }
            setAuthError(description);
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        setAuthError(null);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            let description = "Could not sign in with Google. Please try again.";
            if (error instanceof FirebaseError) {
                console.warn("Google login failed:", error.code);
                 if (error.code === 'auth/popup-closed-by-user') {
                    description = "Sign-in popup was closed. Please try again.";
                } else if (error.code === 'auth/account-exists-with-different-credential') {
                    description = "An account already exists with the same email address but different sign-in credentials. Please sign in using the original method."
                }
            } else {
                 console.error("An unexpected error occurred during Google login:", error);
            }
            setAuthError(description);
        } finally {
            setIsGoogleLoading(false);
        }
    };
    
    if (checkingAuth || user) {
        return null; 
    }

  return (
    <div className="relative min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4 font-body">
        <div className="absolute inset-0 z-0">
            <Image
                src="/brick wall background login.png"
                alt="Brick wall background"
                fill
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
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember-me"
                                checked={rememberMe}
                                onCheckedChange={(checked) => handleRememberMeChange(!!checked)}
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

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-orange-200/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-800/50 px-2 text-orange-200/80">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-12 bg-transparent border-[#6a5349] text-white hover:bg-[#6a5349]" onClick={handleGoogleLogin} disabled={isGoogleLoading || isLoading}>
                    <GoogleIcon />
                    <span className="ml-2">Google</span>
                  </Button>
                  <Button asChild variant="outline" className="h-12 bg-transparent border-[#6a5349] text-white hover:bg-[#6a5349]">
                    <Link href="/phone-signin">
                        <Phone />
                        <span className="ml-2">Phone</span>
                    </Link>
                  </Button>
                </div>

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
