
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, setDoc, serverTimestamp, type Timestamp } from "firebase/firestore"
import { Flame, Droplets, Settings, Trophy, TrendingUp, Bot, Star, Sparkles, BellDot, Vibrate, MessageSquareText, Link as LinkIcon, Watch, Mic, BookUser, Info, LogOut, Trash2, ExternalLink, Save, Menu } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Sheet, SheetContent, SheetClose, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { WaterGlass } from "@/components/water-glass"
import { BodyMetrics } from "@/components/body-metrics"
import { generateMotivation, MotivationInput } from "@/ai/flows/personalized-motivation"
import { Confetti } from "@/components/confetti"
import { updateUserData, deleteUserData, savePhoneNumberAndSendConfirmation } from "@/lib/actions"
import { type UserData, type Tone, defaultUserData } from "@/lib/user-data"

type MilestoneStatus = MotivationInput['milestoneStatus'];

function DashboardContents() {
  const { toast } = useToast()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loadingError, setLoadingError] = useState<string | null>(null)
  const [manualAmount, setManualAmount] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [motivation, setMotivation] = useState("Let's get hydrated!")
  const [isLoadingMotivation, setIsLoadingMotivation] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [phone, setPhone] = useState("");
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [activeTab, setActiveTab] = useState("gamification");


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
    const makeDataSerializable = (data: any): UserData => {
        const sanitizedData = { ...data };
        for (const key in sanitizedData) {
            const value = (sanitizedData as any)[key];
            if (value && typeof value === 'object' && 'toDate' in value) {
                (sanitizedData as any)[key] = (value as Timestamp).toDate().toISOString();
            }
        }
        return sanitizedData as UserData;
    }
    
    const loadData = async (userId: string) => {
      setLoadingError(null);
      const userDocRef = doc(db, 'users', userId);

      try {
        let userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          console.log("User document not found, creating one now for user:", userId);
          // Create the document with default data and server timestamps
          await setDoc(userDocRef, {
            ...defaultUserData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          // Re-fetch the document to get the created data
          userDocSnap = await getDoc(userDocRef);

          if (!userDocSnap.exists()) {
            // This should now only happen if the rules are wrong
            throw new Error("DATABASE ACCESS DENIED. Could not create user profile. This is a security rules issue.");
          }
        }

        const data = makeDataSerializable(userDocSnap.data() as UserData);
        setUserData(data);
        if (data.bodyMetrics?.phone) {
          setPhone(data.bodyMetrics.phone);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        
        let errorMessage = "An unexpected error occurred while loading your data.";
        if (error instanceof Error) {
            if (error.message.includes('DATABASE ACCESS DENIED')) {
                 errorMessage = error.message;
            } else if ('code' in error) {
                const firebaseError = error as { code: string; message: string };
                if (firebaseError.code === 'permission-denied' || firebaseError.code === 'unauthenticated') {
                    errorMessage = `DATABASE ACCESS DENIED. Could not read or create user profile. Please check your Firestore security rules.`;
                } else if (firebaseError.code === 'failed-precondition') {
                    errorMessage = "Firestore database has not been created or is misconfigured. Please go to the Firestore Database section of your Firebase Console and ensure a database exists by clicking 'Create database'.";
                } else {
                    errorMessage = `A Firebase error occurred: ${firebaseError.message} (Code: ${firebaseError.code}). Please check your Firebase setup.`;
                }
            } else {
                 errorMessage = error.message;
            }
        }
        
        setLoadingError(errorMessage);
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

  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "morning"
    if (hour < 18) return "afternoon"
    return "evening"
  }
  
  const getMilestoneContext = (): { milestoneStatus: MilestoneStatus, nextMilestoneInfo: string } => {
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
  }

  const fetchMotivation = async (drinkSize: number) => {
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
  }

  const handleAddWater = (amount: number) => {
    if (!userData || !user || amount <= 0) return
    const oldHydration = userData.hydration;
    const newHydration = Math.min(userData.dailyGoal, userData.hydration + amount)
    
    const updatedData = { ...userData, hydration: newHydration, lastDrinkSize: amount };
    setUserData(updatedData);
    updateUserData(user.uid, { hydration: newHydration, lastDrinkSize: amount });

    fetchMotivation(amount);

    if (userData.appSettings.confettiEffects && newHydration >= userData.dailyGoal && oldHydration < userData.dailyGoal) {
      setShowConfetti(true)
    }
  }

  const handleManualAdd = () => {
    const amount = parseInt(manualAmount, 10)
    if (!isNaN(amount) && amount > 0) {
      handleAddWater(amount)
      setManualAmount("")
    }
  }

  const handleSettingChange = (key: keyof UserData['appSettings'], value: string | boolean) => {
    if (!userData || !user) return;
    const newAppSettings = { ...userData.appSettings, [key]: value };
    setUserData({ ...userData, appSettings: newAppSettings });
    updateUserData(user.uid, { appSettings: newAppSettings });
  };
  
  const handleToneChange = (value: Tone) => {
    if (!userData || !user) return;
    setUserData({ ...userData, motivationTone: value });
    updateUserData(user.uid, { motivationTone: value });
  };
  
  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userData || !user) return;
    const newGoal = Number(e.target.value);
    setUserData({ ...userData, dailyGoal: newGoal });
    // This could be debounced in a real app
    updateUserData(user.uid, { dailyGoal: newGoal });
  };

  const handleMetricsSave = (metrics: UserData['bodyMetrics']) => {
    if (!userData || !user) return;
    setUserData({ ...userData, bodyMetrics: metrics });
    updateUserData(user.uid, { bodyMetrics: metrics });
    toast({ title: "Metrics Saved", description: "Your body metrics have been updated." });
  };

  const handleSavePhone = async () => {
    if (!user || !phone) {
      toast({ variant: "destructive", title: "Error", description: "Please enter a valid phone number." });
      return;
    }
    setIsSavingPhone(true);
    try {
      const result = await savePhoneNumberAndSendConfirmation(user.uid, phone);
      if (result.success) {
        toast({ title: "Success", description: result.message });
      } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
      }
    } catch (error) {
      const description = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast({ variant: "destructive", title: "Failed to Save", description });
    } finally {
      setIsSavingPhone(false);
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
      console.error("Failed to delete account:", error)
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
            <CardTitle className="text-destructive-foreground">Action Required: Database Configuration Error</CardTitle>
            <CardDescription className="text-destructive-foreground/80">
             The application is being blocked by your database security rules.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
        <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Water4Weightloss Logo" width={60} height={60} data-ai-hint="water droplet" />
            <div>
              <h1 className="text-3xl lg:text-4xl font-headline font-bold text-secondary tracking-tight">Water4Weightloss</h1>
              <p className="text-muted-foreground text-md">Welcome, {user.email}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleLogout} className="hidden md:inline-flex">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <div className="flex flex-col gap-4 py-8">
                            <SheetClose asChild>
                                <Button variant={activeTab === 'gamification' ? 'default' : 'secondary'} onClick={() => setActiveTab('gamification')} className="justify-start">
                                    <Trophy className="mr-2 h-4 w-4" /> Gamification
                                </Button>
                            </SheetClose>
                             <SheetClose asChild>
                                <Button variant={activeTab === 'weight' ? 'default' : 'secondary'} onClick={() => setActiveTab('weight')} className="justify-start">
                                    <TrendingUp className="mr-2 h-4 w-4" /> Body Metrics
                                </Button>
                            </SheetClose>
                             <SheetClose asChild>
                                <Button variant={activeTab === 'settings' ? 'default' : 'secondary'} onClick={() => setActiveTab('settings')} className="justify-start">
                                    <Settings className="mr-2 h-4 w-4" /> Settings
                                </Button>
                            </SheetClose>
                            <Separator className="my-4" />
                            <Button variant="outline" onClick={handleLogout} className="justify-start">
                                 <LogOut className="mr-2 h-4 w-4" />
                                 Logout
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
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
              
              <Tabs defaultValue="quick" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="quick">Quick Add</TabsTrigger>
                  <TabsTrigger value="bottles">Bottles</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>
                <TabsContent value="quick" className="pt-4">
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
                </TabsContent>
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
                   <div className="space-y-2">
                    <Label>Log Other Drinks</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a drink type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="herbal-tea">Herbal Tea</SelectItem>
                        <SelectItem value="fruit-infused">Fruit-Infused Water</SelectItem>
                        <SelectItem value="electrolyte">Electrolyte Water</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" className="w-full" disabled>
                    <Mic className="mr-2 h-4 w-4" />
                    Voice Logging (Coming Soon)
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="bg-card/70 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="text-primary" />
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="hidden md:grid w-full grid-cols-3 bg-card/80 backdrop-blur-xl">
              <TabsTrigger value="gamification"><Trophy className="mr-2 h-4 w-4" />Gamification</TabsTrigger>
              <TabsTrigger value="weight"><TrendingUp className="mr-2 h-4 w-4" />Body Metrics</TabsTrigger>
              <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" />Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="gamification">
               <Card className="bg-card/70 backdrop-blur-xl border border-white/10">
                <CardHeader>
                    <CardTitle>Gamification &amp; Notifications</CardTitle>
                    <CardDescription>Customize your motivational experience and reminders.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="mb-4 font-medium text-foreground">Gamification Features</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                <Label htmlFor="daily-streaks" className="flex items-center gap-3 font-medium">
                                    <Flame className="w-5 h-5 text-primary" />
                                    Daily Streaks
                                 </Label>
                                <Switch id="daily-streaks" checked={userData.appSettings.dailyStreaks} onCheckedChange={(v) => handleSettingChange('dailyStreaks', v)} />
                            </div>
                             <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                <Label htmlFor="achievement-badges" className="flex items-center gap-3 font-medium">
                                    <Trophy className="w-5 h-5 text-primary" />
                                    Achievement Badges
                                 </Label>
                                <Switch id="achievement-badges" checked={userData.appSettings.achievementBadges} onCheckedChange={(v) => handleSettingChange('achievementBadges', v)} />
                            </div>
                             <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                <Label htmlFor="progress-milestones" className="flex items-center gap-3 font-medium">
                                    <Star className="w-5 h-5 text-primary" />
                                    Progress Milestones
                                 </Label>
                                <Switch id="progress-milestones" checked={userData.appSettings.progressMilestones} onCheckedChange={(v) => handleSettingChange('progressMilestones', v)} />
                            </div>
                             <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                <Label htmlFor="confetti-effects" className="flex items-center gap-3 font-medium">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                    Confetti Effects
                                 </Label>
                                <Switch id="confetti-effects" checked={userData.appSettings.confettiEffects} onCheckedChange={(v) => handleSettingChange('confettiEffects', v)} />
                            </div>
                        </div>
                    </div>
                     <div>
                        <h3 className="mb-4 font-medium text-foreground">Notifications</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                <Label htmlFor="push-notifications" className="flex items-center gap-3 font-medium">
                                   <BellDot className="w-5 h-5 text-primary" />
                                   Push Notifications
                                 </Label>
                                <Switch id="push-notifications" checked={userData.appSettings.pushNotifications} onCheckedChange={(v) => handleSettingChange('pushNotifications', v)} />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                <Label htmlFor="sms-reminders" className="flex items-center gap-3 font-medium">
                                   <MessageSquareText className="w-5 h-5 text-primary" />
                                   SMS Reminders
                                 </Label>
                                <Switch id="sms-reminders" checked={userData.appSettings.smsReminders} onCheckedChange={(v) => handleSettingChange('smsReminders', v)} />
                            </div>
                             {userData.appSettings.smsReminders && (
                              <div className="p-3 rounded-lg bg-muted/30 space-y-2">
                                <Label htmlFor="phone-number">Phone Number for SMS</Label>
                                <div className="flex gap-2">
                                  <Input 
                                    id="phone-number" 
                                    type="tel" 
                                    placeholder="e.g. +15551234567" 
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={isSavingPhone}
                                  />
                                  <Button onClick={handleSavePhone} disabled={isSavingPhone}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isSavingPhone ? "Saving..." : "Save"}
                                  </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">Please use E.164 format. A confirmation text will be sent.</p>
                              </div>
                            )}
                            <div className="p-3 rounded-lg bg-muted/30 space-y-3">
                                <Label className="flex items-center gap-3 font-medium"><Vibrate className="w-5 h-5 text-primary"/> Vibration Feedback</Label>
                                <RadioGroup value={userData.appSettings.vibrationFeedback} onValueChange={(v) => handleSettingChange('vibrationFeedback', v)} className="flex space-x-4 pt-1">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="light" id="v1" />
                                        <Label htmlFor="v1">Light</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="medium" id="v2" />
                                        <Label htmlFor="v2">Medium</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="heavy" id="v3" />
                                        <Label htmlFor="v3">Heavy</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/30 space-y-3">
                                <Label className="font-medium">Notification Frequency</Label>
                                <RadioGroup value={userData.appSettings.notificationFrequency} onValueChange={(v) => handleSettingChange('notificationFrequency', v)} className="flex space-x-4 pt-1">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="minimal" id="r1" />
                                        <Label htmlFor="r1">Minimal</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="moderate" id="r2" />
                                        <Label htmlFor="r2">Moderate</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="frequent" id="r3" />
                                        <Label htmlFor="r3">Frequent</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            </TabsContent>
            <TabsContent value="weight">
                <BodyMetrics initialMetrics={userData.bodyMetrics} onSave={handleMetricsSave} />
            </TabsContent>
            <TabsContent value="settings">
              <Card className="bg-card/70 backdrop-blur-xl border border-white/10">
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Customize your experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>AI Motivation Tone</Label>
                    <Select value={userData.motivationTone} onValueChange={handleToneChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="supportive">Supportive</SelectItem>
                        <SelectItem value="funny">Funny</SelectItem>
                        <SelectItem value="sarcastic">Sarcastic</SelectItem>
                        <SelectItem value="crass">Crass</SelectItem>
                        <SelectItem value="kind">Kind</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Daily Hydration Goal (ml)</Label>
                    <Input 
                      type="number" 
                      value={userData.dailyGoal} 
                      onChange={handleGoalChange}
                      className="font-code"
                    />
                  </div>
                  <div className="space-y-2">
                     <Button asChild variant="outline" className="w-full">
                       <Link href="/info">
                         <Info className="mr-2 h-4 w-4" />
                         Learn More About Hydration
                       </Link>
                     </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <Label htmlFor="link-devices" className="flex items-center gap-3 font-medium">
                       <LinkIcon className="w-5 h-5 text-primary" />
                       Link with other devices
                    </Label>
                    <Switch id="link-devices" disabled />
                  </div>
                   <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <Label htmlFor="wearable-mode" className="flex items-center gap-3 font-medium">
                       <Watch className="w-5 h-5 text-primary" />
                       Optimise for wearable devices
                    </Label>
                    <Switch id="wearable-mode" disabled />
                  </div>
                  <Separator className="my-6" />
                  <div className="space-y-4">
                      <h3 className="text-lg font-medium">Account Management</h3>
                       <Button asChild variant="outline" className="w-full justify-start gap-2">
                           <Link href="https://buy.stripe.com/fZu5kvexV0Mf3Qr3Dsf3a03" target="_blank" rel="noopener noreferrer">
                             <ExternalLink />
                             Manage Subscription
                           </Link>
                       </Button>
                       <Button variant="destructive" className="w-full justify-start gap-2" onClick={() => setIsDeleteDialogOpen(true)}>
                          <Trash2 />
                          Delete Account
                       </Button>
                       <p className="text-xs text-muted-foreground">Note: 'Manage Subscription' should link to your Stripe Customer Portal. Account deletion removes your data but does not cancel your subscription via Stripe.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
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
                <AlertDialogAction onClick={handleDeleteAccount} className={buttonVariants({ variant: "destructive" })}>Delete Data</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function Dashboard() {
  return <DashboardContents />
}

    