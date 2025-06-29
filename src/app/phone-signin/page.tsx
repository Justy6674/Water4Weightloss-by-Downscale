
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
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, type User, type ConfirmationResult } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Phone, MessageSquare, Terminal } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Firebase requires `window.recaptchaVerifier` to be available.
// We need to declare it on the window object type.
declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
    }
}

function PhoneSignInPageContents() {
    const [phoneNumber, setPhoneNumber] = useState("")
    const [otp, setOtp] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const router = useRouter()
    const { toast } = useToast()
    const recaptchaContainerRef = useRef<HTMLDivElement>(null)

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
    
    // Initialize reCAPTCHA
    useEffect(() => {
        if (!recaptchaContainerRef.current) return;
        
        try {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
                'size': 'invisible',
                'callback': (response: any) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                }
            });
        } catch(error) {
            console.error("Error initializing reCAPTCHA", error);
            setAuthError("Could not initialize reCAPTCHA. Please refresh the page.")
        }

        return () => {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
            }
        };
    }, []);

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!window.recaptchaVerifier) {
            setAuthError("reCAPTCHA not ready. Please wait a moment and try again.");
            return;
        }
        setIsLoading(true);
        setAuthError(null);
        try {
            const result = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
            setConfirmationResult(result);
            toast({
                title: "Verification Code Sent",
                description: "Please check your phone for the code.",
            });
        } catch (error) {
            console.error("SMS send failed:", error);
            setAuthError("Failed to send verification code. Please check the phone number and try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirmationResult) {
            setAuthError("Please request a verification code first.");
            return;
        }
        setIsLoading(true);
        setAuthError(null);
        try {
            await confirmationResult.confirm(otp);
            // User is signed in. The onAuthStateChanged listener will handle the redirect.
        } catch (error) {
            console.error("OTP verification failed:", error);
            setAuthError("Invalid verification code. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }
    
    if (checkingAuth || user) {
        return null; // or a loading spinner
    }

  return (
    <div className="relative min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4 font-body">
      <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
      <div className="absolute inset-0 z-0">
        <Image
          src="/brick wall background login.png"
          alt="Brick wall background"
          layout="fill"
          objectFit="cover"
          objectPosition="top"
          priority
          className="opacity-100"
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
          <CardTitle className="text-3xl font-bold text-center text-[#f7f2d3] [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">Sign In with Phone</CardTitle>
          <CardDescription className="text-center text-orange-200/80 pt-2">
            {!confirmationResult ? "Enter your phone number to receive a verification code." : "Enter the code sent to your phone."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          {authError && (
            <Alert variant="destructive" className="mb-6 bg-destructive/20 border-destructive/50 text-destructive-foreground">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription className="text-destructive-foreground/90">{authError}</AlertDescription>
            </Alert>
          )}

          {!confirmationResult ? (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-200/80" />
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="e.g. +16505551234"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isLoading}
                  className="bg-[#6a5349] border-[#6a5349] placeholder:text-orange-200/70 pl-12 h-12 rounded-lg text-white"
                />
              </div>
              <Button type="submit" className="w-full bg-white text-black h-12 rounded-lg font-bold text-base hover:bg-gray-200" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Code'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="relative">
                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-200/80" />
                <Input
                  id="otp"
                  type="text"
                  placeholder="6-digit code"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isLoading}
                  className="bg-[#6a5349] border-[#6a5349] placeholder:text-orange-200/70 pl-12 h-12 rounded-lg text-white"
                />
              </div>
              <Button type="submit" className="w-full bg-white text-black h-12 rounded-lg font-bold text-base hover:bg-gray-200" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify & Sign In'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-[#f7f2d3] [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
            <Link href="/login" className="underline font-bold text-[#f7f2d3] [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
              &larr; Back to all login options
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PhoneSignInPage() {
    return <PhoneSignInPageContents />
}
