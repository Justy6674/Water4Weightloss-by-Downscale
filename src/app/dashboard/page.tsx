
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore"
import { Droplets, Settings, Trash2, LogOut, ExternalLink, Cog, Flame, Star, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { WaterGlass } from "@/components/water-glass"
import { BodyMetrics } from "@/components/body-metrics"
import { MedicationTracking } from "@/components/medication-tracking"
import { BloodPressureTracking } from "@/components/blood-pressure-tracking"
import { InfoContent } from "@/components/info-content"
import { generateMotivation, MotivationInput } from "@/ai/flows/personalized-motivation"
import { Confetti } from "@/components/confetti"
import { updateUserData, deleteUserData, addWeightReading, addBloodPressureReading } from "@/lib/actions"
import { type UserData, type Tone, defaultUserData, type WeightReading, type BloodPressureReading } from "@/lib/user-data"
import { AppSettings } from "@/components/app-settings"
import { isSameDay, isYesterday, parseISO } from 'date-fns';
import { Separator } from "@/components/ui/separator"

type MilestoneStatus = MotivationInput['milestoneStatus'];
type MilestoneInfo = { milestoneStatus: MilestoneStatus, nextMilestoneInfo: string };

function DashboardContents() {
  const { toast } = useToast()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loadingError, setLoadingError] = useState<{title: string, description: React.ReactNode} | null>(null);
  const [manualAmount, setManualAmount] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [motivation, setMotivation] = useState("Let's get hydrated!")
  const [isLoadingMotivation, setIsLoadingMotivation] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard");
  const [milestone, setMilestone] = useState<MilestoneInfo>({ milestoneStatus: 'none', nextMilestoneInfo: '' });
  const initialMotivationFetched = useRef(false);

  const getSecurityRuleInstructions = () => (
    <>
      <div className="bg-background/80 p-4 rounded-md text-foreground">
        <h3 className="font-bold">How to Fix This:</h3>
        <ol className="list-decimal list-inside space-y-2 mt-2">
          <li>Go to the <strong>Firestore Database</strong> section in your Firebase Console.</li>
          <li>Make sure you are in the correct project. The project ID this app is using is: <strong className="font-mono bg-muted p-1 rounded">{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "Not Set"}</strong></li>
          <li>Click the <strong>Rules</strong> tab at the top.</li>
          <li>Delete all the existing text in the editor.</li>
          <li>Paste in this complete, secure ruleset:
            <pre className="mt-2 p-2 bg-muted/50 rounded-md text-xs whitespace-pre-wrap font-code">
              {`rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`}
            </pre>
          </li>
          <li>Click the <strong>Publish</strong> button.</li>
        </ol>
      </div>
      <p className="text-sm text-destructive-foreground/80">
        This new rule allows any logged-in user to access their own data, which is a standard and secure setup for this type of application. After publishing the rule, please refresh this page.
      </p>
    </>
);

const getCreateDbInstructions = () => (
     <>
      <div className="bg-background/80 p-4 rounded-md text-foreground">
        <h3 className="font-bold">How to Fix This:</h3>
        <ol className="list-decimal list-inside space-y-2 mt-2">
          <li>Go to the <strong>Firestore Database</strong> section in your Firebase Console.</li>
           <li>Make sure you are in the correct project: <strong className="font-mono bg-muted p-1 rounded">{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "Not Set"}</strong></li>
          <li>Click the <strong>Create database</strong> button.</li>
          <li>Choose <strong>Start in production mode</strong>, then click Next.</li>
          <li>Select a Cloud Firestore location (choose one close to your users), then click <strong>Enable</strong>.</li>
        </ol>
      </div>
      <p className="text-sm text-destructive-foreground/80">
        After the database is created, please refresh this page.
      </p>
    </>
);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const loadData = async (userId: string) => {
      setLoadingError(null);
      const userDocRef = doc(db, 'users', userId);

      try {
        let userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          console.log("User document not found, creating one now for user:", userId);
          const newUserData = {
            ...defaultUserData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(userDocRef, newUserData, { merge: true });
          userDocSnap = await getDoc(userDocRef);

          if (!userDocSnap.exists()) {
            throw new Error("DATABASE ACCESS DENIED. Could not create user profile. This is a security rules issue.");
          }
        }

        const firestoreData = userDocSnap.data() || {};
        let data: UserData = {
            ...(defaultUserData as UserData),
            ...firestoreData,
            appSettings: {
                ...defaultUserData.appSettings,
                ...(firestoreData.appSettings || {}),
            },
            bodyMetrics: {
                ...defaultUserData.bodyMetrics,
                ...(firestoreData.bodyMetrics || {}),
            },
            weightLog: firestoreData.weightLog || [],
            bloodPressureLog: firestoreData.bloodPressureLog || [],
            lastGoalMetDate: firestoreData.lastGoalMetDate || null,
        };
        
        const today = new Date();
        const lastGoalDate = data.lastGoalMetDate ? parseISO(data.lastGoalMetDate as string) : null;
        let streakWasReset = false;
        
        if (data.streak > 0 && lastGoalDate && !isSameDay(lastGoalDate, today) && !isYesterday(lastGoalDate)) {
            console.log("Streak broken. Resetting to 0.");
            data.streak = 0;
            streakWasReset = true;
        }

        const serializableData: any = { ...data };
        
        Object.keys(serializableData).forEach(key => {
            const value = serializableData[key];
            if (value instanceof Timestamp) {
                serializableData[key] = value.toDate().toISOString();
            } else if (key === 'lastGoalMetDate' && value instanceof Timestamp) {
                serializableData[key] = value.toDate().toISOString();
            } else if (Array.isArray(value)) {
                serializableData[key] = value.map(item => {
                    if (item && item.timestamp instanceof Timestamp) {
                        return { ...item, timestamp: item.timestamp.toDate().toISOString() };
                    }
                    return item;
                });
            }
        });
        
        setUserData(serializableData as UserData);
        if (streakWasReset) {
          if(user) {
            updateUserData(user.uid, { streak: 0 });
          }
        }

      } catch (error) {
        console.error("Failed to load user data:", error);
        
        let errorDetails: {title: string, description: React.ReactNode} = {
            title: "An Unexpected Error Occurred",
            description: "An unexpected error occurred while loading your data. Check the browser console for more details."
        };

        if (error instanceof Error) {
            if (error.message.includes('DATABASE ACCESS DENIED')) {
                 errorDetails = {
                    title: "Action Required: Database Security Rules",
                    description: getSecurityRuleInstructions()
                 };
            } else if ('code' in error) {
                const firebaseError = error as { code: string; message: string };
                if (firebaseError.code === 'permission-denied' || firebaseError.code === 'unauthenticated') {
                    errorDetails = {
                        title: "Action Required: Database Security Rules",
                        description: getSecurityRuleInstructions()
                    };
                } else if (firebaseError.code === 'failed-precondition') {
                    errorDetails = {
                        title: "Action Required: Create Firestore Database",
                        description: getCreateDbInstructions()
                    };
                } else {
                    errorDetails = {
                        title: "A Firebase Error Occurred",
                        description: `Error: ${firebaseError.message} (Code: ${firebaseError.code}). Please check your Firebase setup and console for more details.`
                    };
                }
            } else {
                 errorDetails.description = error.message;
            }
        }
        setLoadingError(errorDetails);
      }
    };

    if (user) {
      loadData(user.uid);
    }
  }, [user]);
  
  const hydrationPercentage = useMemo(() => {
    if (!userData) return 0;
    return (userData.hydration / userData.dailyGoal) * 100;
  }, [userData]);

  const getTimeOfDay = useCallback(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "morning"
    if (hour < 18) return "afternoon"
    return "evening"
  }, []);
  
  const getMilestoneContext = useCallback((): MilestoneInfo => {
    if (!userData) return { milestoneStatus: 'none', nextMilestoneInfo: '' };
    const now = new Date();
    const hour = now.getHours();

    if (userData.hydration >= userData.dailyGoal) {
      return { milestoneStatus: 'goalMet', nextMilestoneInfo: 'Daily goal achieved!' };
    }
    const milestones = [
      { time: 10, goal: 1000 },
      { time: 15, goal: 2000 },
      { time: 20, goal: userData.dailyGoal }
    ];
    for (const milestone of milestones) {
      if (hour < milestone.time) {
        const status = userData.hydration >= milestone.goal ? 'ahead' : 'onTrack';
        const nextMilestoneInfo = `${milestone.goal}ml by ${milestone.time}:00`;
        return { milestoneStatus: status, nextMilestoneInfo };
      }
    }
    return { milestoneStatus: 'none', nextMilestoneInfo: 'All daily milestones passed.' };
  }, [userData]);

  useEffect(() => {
    if (userData) {
      setMilestone(getMilestoneContext());
    }
  }, [userData, getMilestoneContext]);

  const fetchMotivation = useCallback(async (drinkSize: number) => {
    if (!userData) return;
    setIsLoadingMotivation(true)
    try {
      const { milestoneStatus, nextMilestoneInfo } = getMilestoneContext();
      
      const input: MotivationInput = {
        hydrationPercentage: Math.round(hydrationPercentage),
        streak: userData.streak,
        lastDrinkSizeMl: drinkSize,
        timeOfDay: getTimeOfDay(),
        preferredTone: userData.motivationTone,
        milestoneStatus,
        nextMilestoneInfo,
        isOnMedication: !!userData.bodyMetrics.medication,
      }
      const result = await generateMotivation(input)
      setMotivation(result.message)
    } catch (error) {
      console.error("Failed to generate motivation:", error)
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not get a motivational message.",
      })
    } finally {
      setIsLoadingMotivation(false)
    }
  }, [userData, hydrationPercentage, getMilestoneContext, getTimeOfDay, toast]);

  useEffect(() => {
    if (userData && !initialMotivationFetched.current) {
      fetchMotivation(userData.lastDrinkSize || 0);
      initialMotivationFetched.current = true;
    }
  }, [userData, fetchMotivation]);


  const handleAddWater = (amount: number) => {
    if (!userData || !user || amount <= 0) return;
    const oldHydration = userData.hydration;
    const newHydration = Math.min(userData.dailyGoal, userData.hydration + amount);
    
    const updates: Partial<UserData> = {
      hydration: newHydration,
      lastDrinkSize: amount,
    };

    const goalJustMet = newHydration >= userData.dailyGoal && oldHydration < userData.dailyGoal;

    if (goalJustMet) {
      const today = new Date();
      const lastGoalDate = userData.lastGoalMetDate ? parseISO(userData.lastGoalMetDate as string) : null;
      let newStreak = 1;
      
      if (lastGoalDate && isYesterday(lastGoalDate)) {
          newStreak = (userData.streak || 0) + 1;
          toast({ title: "Streak Extended!", description: `You're now on a ${newStreak}-day streak!` });
      } else {
         toast({ title: "Streak Started!", description: "You've started a new hydration streak. Keep it up!" });
      }

      updates.streak = newStreak;
      updates.lastGoalMetDate = today.toISOString();

      if (userData.appSettings.confettiEffects) {
        setShowConfetti(true);
      }
    }
    
    setUserData(prevData => ({ ...prevData!, ...updates }));
    updateUserData(user.uid, updates);
    fetchMotivation(amount);
  }

  const handleManualAdd = () => {
    const amount = parseInt(manualAmount, 10)
    if (!isNaN(amount) && amount > 0) {
      handleAddWater(amount)
      setManualAmount("")
    }
  }
  
  const handleSettingsUpdate = (updatedSettings: Partial<UserData>, writeToDb: boolean = true) => {
    if (!userData || !user) return;
    const newUserData = { ...userData, ...updatedSettings };
    if (updatedSettings.appSettings) {
      newUserData.appSettings = { ...userData.appSettings, ...updatedSettings.appSettings };
    }
    if (updatedSettings.bodyMetrics) {
      newUserData.bodyMetrics = { ...userData.bodyMetrics, ...updatedSettings.bodyMetrics };
    }
    setUserData(newUserData);
    if (writeToDb) {
      updateUserData(user.uid, updatedSettings);
    }
  };

  const handleMetricsSave = async (metrics: Partial<UserData['bodyMetrics']>, newWeightReading?: Omit<WeightReading, 'timestamp'>) => {
    if (!userData || !user) return;
    
    const updatedBodyMetrics = { ...userData.bodyMetrics, ...metrics };
    const newUserData = { ...userData, bodyMetrics: updatedBodyMetrics };
    
    if (newWeightReading) {
      const readingForUI: WeightReading = {
        ...newWeightReading,
        timestamp: new Date().toISOString()
      };
      newUserData.weightLog = [...userData.weightLog, readingForUI];
    }
    setUserData(newUserData);

    try {
      if (newWeightReading) {
        await addWeightReading(user.uid, newWeightReading);
      }
      const otherMetrics = { waist: metrics.waist, height: metrics.height, gender: metrics.gender };
      if(user) {
        await updateUserData(user.uid, { bodyMetrics: otherMetrics });
      }

      toast({ title: "Metrics Saved", description: "Your body metrics have been updated." });
    } catch(error) {
      setUserData({ ...userData });
      console.error("Failed to save metrics:", error);
      toast({ variant: "destructive", title: "Save Failed", description: "Could not save your metrics." });
    }
  };

  const handleMedicationSave = (medication: Partial<UserData['bodyMetrics']>) => {
    if (!userData || !user) return;
    const updatedBodyMetrics = { ...userData.bodyMetrics, ...medication };
    setUserData({ ...userData, bodyMetrics: updatedBodyMetrics });
    updateUserData(user.uid, { bodyMetrics: updatedBodyMetrics });
    toast({ title: "Medication Saved", description: "Your medication details have been updated." });
  };
  
  const handleSaveBloodPressure = async (newReading: Omit<BloodPressureReading, 'timestamp'>) => {
    if (!userData || !user) return;
    
    const readingForUI: BloodPressureReading = {
      ...newReading,
      timestamp: new Date().toISOString()
    };
    const updatedLog = [...userData.bloodPressureLog, readingForUI];
    setUserData({ ...userData, bloodPressureLog: updatedLog });

    try {
        await addBloodPressureReading(user.uid, newReading);
        toast({ title: "Blood Pressure Saved", description: "Your new reading has been logged." });
    } catch (error) {
        setUserData({ ...userData }); 
        console.error("Failed to save BP reading:", error);
        toast({ variant: "destructive", title: "Save Failed", description: "Could not save your reading." });
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
  };

  const handleDeleteAccount = async () => {
    if (!user) return
    try {
      await deleteUserData(user.uid)
      await auth.signOut()
      toast({ title: "Account Data Deleted", description: "All your data has been successfully removed." })
    } catch (error) {
      console.warn("Failed to delete account:", error)
      const description = error instanceof Error ? error.message : "Could not delete your account data. Please try again."
      toast({ variant: "destructive", title: "Deletion Error", description })
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  if (loadingError) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 font-body flex items-center justify-center">
        <Card className="max-w-2xl bg-destructive/10 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive-foreground">{loadingError.title}</CardTitle>
            <CardDescription className="text-destructive-foreground/80">
             There is a configuration issue with your Firebase project.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingError.description}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loadingUser || !userData) {
    return (
       <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 font-body flex items-center justify-center">
        <div className="text-center space-y-4">
          <Droplets className="mx-auto h-12 w-12 animate-pulse text-primary" />
          <h2 className="text-2xl font-headline">Loading Your Dashboard...</h2>
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 font-body">
      {showConfetti && <Confetti onConfettiComplete={() => setShowConfetti(false)} />}
      <header className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-4">
            <Image src="/logo.png" alt="Water4Weightloss Logo" width={40} height={40} className="sm:w-[50px] sm:h-[50px]" data-ai-hint="water droplet" />
            <div>
              <h1 className="text-xl sm:text-2xl font-headline font-bold text-secondary tracking-tight">Water4Weightloss</h1>
              <p className="text-muted-foreground text-xs sm:text-sm">Welcome, {user.email}</p>
            </div>
        </div>
        
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <Settings className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
                <SheetHeader className="p-6 pb-4 border-b">
                  <SheetTitle>Settings &amp; Account</SheetTitle>
                </SheetHeader>
                <div className="flex-grow overflow-y-auto p-6 space-y-8">
                   <AppSettings userData={userData} onUpdate={handleSettingsUpdate} />
                   
                   <div className="space-y-4">
                      <h3 className="text-lg font-medium text-foreground">Account Management</h3>
                       <Button asChild variant="outline" className="w-full justify-start gap-2">
                           <Link href="https://buy.stripe.com/fZu5kvexV0Mf3Qr3Dsf3a03" target="_blank" rel="noopener noreferrer">
                             <ExternalLink className="h-4 w-4" />
                             Manage Subscription
                           </Link>
                       </Button>
                       <SheetClose asChild>
                         <Button variant="outline" onClick={handleLogout} className="w-full justify-start gap-2">
                             <LogOut className="h-4 w-4" />
                             Logout
                         </Button>
                       </SheetClose>
                       <Button variant="destructive" className="w-full justify-start gap-2" onClick={() => setIsDeleteDialogOpen(true)}>
                          <Trash2 className="h-4 w-4" />
                          Delete Account
                       </Button>
                  </div>
                </div>
            </SheetContent>
        </Sheet>
      </header>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 sm:grid-cols-5 mb-4 h-auto">
              <TabsTrigger value="dashboard" className="py-2">Water</TabsTrigger>
              <TabsTrigger value="body-metrics" className="py-2">Body Metrics</TabsTrigger>
              <TabsTrigger value="medication" className="py-2">Medication</TabsTrigger>
              <TabsTrigger value="blood-pressure" className="py-2">Blood Pressure</TabsTrigger>
              <TabsTrigger value="information" className="py-2">Information</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <Card className="bg-card/70 backdrop-blur-xl border border-white/10">
                        <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Today's Hydration</span>
                            <Droplets className="text-primary" />
                        </CardTitle>
                        <CardDescription>{userData.hydration}ml / {userData.dailyGoal}ml</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                          <WaterGlass percentage={hydrationPercentage} />
                          <Progress value={hydrationPercentage} className="w-full h-3" />
                           <Separator className="my-4" />
                            <div className="w-full space-y-2">
                                <p className="text-sm font-medium text-muted-foreground text-center">Quick Add</p>
                                <div className="grid grid-cols-3 gap-2 w-full">
                                    <Button variant="secondary" onClick={() => handleAddWater(50)} className="h-auto flex-col py-2 gap-0">
                                    <span className="font-semibold">Sip</span>
                                    <span className="text-xs text-muted-foreground">50ml</span>
                                    </Button>
                                    <Button variant="secondary" onClick={() => handleAddWater(150)} className="h-auto flex-col py-2 gap-0">
                                    <span className="font-semibold">Small</span>
                                    <span className="text-xs text-muted-foreground">150ml</span>
                                    </Button>
                                    <Button variant="secondary" onClick={() => handleAddWater(300)} className="h-auto flex-col py-2 gap-0">
                                    <span className="font-semibold">Large</span>
                                    <span className="text-xs text-muted-foreground">300ml</span>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/70 backdrop-blur-xl border border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="text-primary" />
                                <span>Gamification</span>
                            </CardTitle>
                            <CardDescription>Your progress and milestones.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {userData.appSettings.dailyStreaks && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Flame className="w-5 h-5 text-amber-500" />
                                        <p className="font-medium text-sm sm:text-base">Daily Hydration Streak</p>
                                    </div>
                                    <p className="font-bold text-lg sm:text-xl text-primary">{userData.streak} <span className="text-sm font-medium text-muted-foreground">{userData.streak === 1 ? 'day' : 'days'}</span></p>
                                </div>
                            )}
                            {userData.appSettings.progressMilestones && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-5 h-5 text-yellow-500" />
                                        <p className="font-medium text-sm sm:text-base">Next Milestone</p>
                                    </div>
                                    <p className="text-xs sm:text-sm text-right text-muted-foreground font-semibold">{milestone.nextMilestoneInfo}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-card/70 backdrop-blur-xl border border-white/10">
                        <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Cog className="text-primary" />
                            AI Motivation
                        </CardTitle>
                        </CardHeader>
                        <CardContent>
                        {isLoadingMotivation ? (
                            <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            </div>
                        ) : (
                            <blockquote className="border-l-2 border-primary pl-4 italic text-card-foreground">
                            {motivation}
                            </blockquote>
                        )}
                        </CardContent>
                    </Card>
                </div>

                 <div className="lg:col-span-3">
                     <Card className="bg-card/70 backdrop-blur-xl border border-white/10">
                        <CardHeader>
                            <CardTitle>Log Your Intake</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Tabs defaultValue="bottles" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="bottles">Bottles</TabsTrigger>
                                <TabsTrigger value="custom">Custom</TabsTrigger>
                                </TabsList>
                                <TabsContent value="bottles" className="pt-4">
                                <div className="grid grid-cols-3 gap-2 w-full">
                                    <Button variant="secondary" onClick={() => handleAddWater(600)} className="h-auto flex-col py-2 gap-0">
                                    <span className="font-semibold">Bottle</span>
                                    <span className="text-xs text-muted-foreground">600ml</span>
                                    </Button>
                                    <Button variant="secondary" onClick={() => handleAddWater(750)} className="h-auto flex-col py-2 gap-0">
                                    <span className="font-semibold">Bottle</span>
                                    <span className="text-xs text-muted-foreground">750ml</span>
                                    </Button>
                                    <Button variant="secondary" onClick={() => handleAddWater(1000)} className="h-auto flex-col py-2 gap-0">
                                    <span className="font-semibold">Bottle</span>
                                    <span className="text-xs text-muted-foreground">1L</span>
                                    </Button>
                                </div>
                                </TabsContent>
                                <TabsContent value="custom" className="pt-4 space-y-4">
                                <div className="w-full space-y-2">
                                    <Label htmlFor="manual-add">Log Custom Amount (ml)</Label>
                                    <div className="flex gap-2">
                                    <Input
                                        id="manual-add"
                                        type="number"
                                        placeholder="e.g. 187"
                                        value={manualAmount}
                                        onChange={(e) => setManualAmount(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleManualAdd()}
                                        className="font-code"
                                    />
                                    <Button onClick={handleManualAdd}>Add</Button>
                                    </div>
                                </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                     </Card>
                 </div>
              </div>
            </TabsContent>
            
            <TabsContent value="body-metrics">
                <BodyMetrics 
                  initialMetrics={userData.bodyMetrics} 
                  weightLog={userData.weightLog}
                  onSave={handleMetricsSave} />
            </TabsContent>
            
            <TabsContent value="medication">
                <MedicationTracking initialMedication={userData.bodyMetrics} onSave={handleMedicationSave} />
            </TabsContent>
            
            <TabsContent value="blood-pressure">
                <BloodPressureTracking log={userData.bloodPressureLog} onSave={handleSaveBloodPressure} />
            </TabsContent>

            <TabsContent value="information">
                <Card className="bg-card/70 backdrop-blur-xl border border-white/10">
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline">Health & Hydration Information</CardTitle>
                        <CardDescription>Expand the topics below to learn more.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <InfoContent />
                    </CardContent>
                </Card>
            </TabsContent>
      </Tabs>

      <footer className="mt-auto pt-8 text-muted-foreground text-xs sm:text-sm border-t">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
           <p className="flex-1">&copy; 2024 Water4Weightloss. All rights reserved.</p>
           <p className="flex-1">This is a demo application. Please consult a healthcare professional for medical advice.</p>
        </div>
      </footer>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all of your account data from our servers. Your authentication account will remain, but all hydration and body metric history will be lost.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className={Button.toString({ variant: "destructive" })}>Delete Data</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function Dashboard() {
  return <DashboardContents />
}

    