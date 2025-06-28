"use client"

import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { Flame, Droplets, Settings, Trophy, TrendingUp, Bot, Star, Sparkles, BellDot, Vibrate, MessageSquareText, Link, Watch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { WaterGlass } from "@/components/water-glass"
import { BodyMetrics } from "@/components/body-metrics"
import { generateMotivation, MotivationInput } from "@/ai/flows/personalized-motivation"
import { Confetti } from "@/components/confetti"

type Tone = "funny" | "supportive" | "sarcastic" | "crass" | "kind"

export default function Dashboard() {
  const { toast } = useToast()
  const [hydration, setHydration] = useState(1250)
  const [dailyGoal, setDailyGoal] = useState(3000)
  const [streak, setStreak] = useState(14)
  const [manualAmount, setManualAmount] = useState("")
  const [lastDrinkSize, setLastDrinkSize] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const [motivationTone, setMotivationTone] = useState<Tone>("supportive")
  const [motivation, setMotivation] = useState("Keep up the great work! Every sip counts.")
  const [isLoadingMotivation, setIsLoadingMotivation] = useState(false)

  const [appSettings, setAppSettings] = useState({
    dailyStreaks: true,
    achievementBadges: true,
    progressMilestones: true,
    confettiEffects: true,
    pushNotifications: true,
    smsReminders: false,
    notificationFrequency: "moderate",
    vibrationFeedback: "medium",
  });

  const handleSettingChange = (key: keyof typeof appSettings, value: string | boolean) => {
    setAppSettings(prev => ({ ...prev, [key]: value }));
  };

  const hydrationPercentage = useMemo(() => (hydration / dailyGoal) * 100, [hydration, dailyGoal])

  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "morning"
    if (hour < 18) return "afternoon"
    return "evening"
  }

  const fetchMotivation = async (drinkSize: number) => {
    setIsLoadingMotivation(true)
    try {
      const input: MotivationInput = {
        hydrationPercentage: Math.round(hydrationPercentage),
        streak,
        lastDrinkSizeMl: drinkSize,
        timeOfDay: getTimeOfDay(),
        preferredTone: motivationTone,
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
    if (amount <= 0) return
    const oldHydration = hydration;
    const newHydration = Math.min(dailyGoal, hydration + amount)
    setHydration(newHydration)
    setLastDrinkSize(amount)
    fetchMotivation(amount)

    if (appSettings.confettiEffects && newHydration >= dailyGoal && oldHydration < dailyGoal) {
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

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 font-body">
      {showConfetti && <Confetti onConfettiComplete={() => setShowConfetti(false)} />}
      <header className="mb-8 text-center">
        <h1 className="text-4xl lg:text-5xl font-headline font-bold text-secondary tracking-tight">Water4Weightloss</h1>
        <p className="text-muted-foreground mt-2 text-lg">Your personal hydration and weight loss companion.</p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Card className="bg-card/70 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Today's Hydration</span>
                <Droplets className="text-primary" />
              </CardTitle>
              <CardDescription>{hydration}ml / {dailyGoal}ml</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <WaterGlass percentage={hydrationPercentage} />
              <Progress value={hydrationPercentage} className="w-full h-3" />
              <div className="w-full space-y-2">
                <Label htmlFor="manual-add">Log Water (ml)</Label>
                <div className="flex gap-2">
                  <Input
                    id="manual-add"
                    type="number"
                    placeholder="e.g. 300"
                    value={manualAmount}
                    onChange={(e) => setManualAmount(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleManualAdd()}
                    className="font-code"
                  />
                  <Button onClick={handleManualAdd}>Add</Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full">
                <Button variant="secondary" onClick={() => handleAddWater(250)}>250ml</Button>
                <Button variant="secondary" onClick={() => handleAddWater(500)}>500ml</Button>
                <Button variant="secondary" onClick={() => handleAddWater(1000)}>1L</Button>
              </div>
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
          <Tabs defaultValue="gamification" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-card/80 backdrop-blur-xl">
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
                                <Switch id="daily-streaks" checked={appSettings.dailyStreaks} onCheckedChange={(v) => handleSettingChange('dailyStreaks', v)} />
                            </div>
                             <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                <Label htmlFor="achievement-badges" className="flex items-center gap-3 font-medium">
                                    <Trophy className="w-5 h-5 text-primary" />
                                    Achievement Badges
                                </Label>
                                <Switch id="achievement-badges" checked={appSettings.achievementBadges} onCheckedChange={(v) => handleSettingChange('achievementBadges', v)} />
                            </div>
                             <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                <Label htmlFor="progress-milestones" className="flex items-center gap-3 font-medium">
                                    <Star className="w-5 h-5 text-primary" />
                                    Progress Milestones
                                </Label>
                                <Switch id="progress-milestones" checked={appSettings.progressMilestones} onCheckedChange={(v) => handleSettingChange('progressMilestones', v)} />
                            </div>
                             <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                <Label htmlFor="confetti-effects" className="flex items-center gap-3 font-medium">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                    Confetti Effects
                                </Label>
                                <Switch id="confetti-effects" checked={appSettings.confettiEffects} onCheckedChange={(v) => handleSettingChange('confettiEffects', v)} />
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
                                <Switch id="push-notifications" checked={appSettings.pushNotifications} onCheckedChange={(v) => handleSettingChange('pushNotifications', v)} />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                <Label htmlFor="sms-reminders" className="flex items-center gap-3 font-medium">
                                   <MessageSquareText className="w-5 h-5 text-primary" />
                                   SMS Reminders
                                </Label>
                                <Switch id="sms-reminders" checked={appSettings.smsReminders} onCheckedChange={(v) => handleSettingChange('smsReminders', v)} />
                            </div>
                            <div className="p-3 rounded-lg bg-muted/30 space-y-3">
                                <Label className="flex items-center gap-3 font-medium"><Vibrate className="w-5 h-5 text-primary"/> Vibration Feedback</Label>
                                <RadioGroup value={appSettings.vibrationFeedback} onValueChange={(v) => handleSettingChange('vibrationFeedback', v)} className="flex space-x-4 pt-1">
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
                                <RadioGroup value={appSettings.notificationFrequency} onValueChange={(v) => handleSettingChange('notificationFrequency', v)} className="flex space-x-4 pt-1">
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
                <BodyMetrics />
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
                    <Select value={motivationTone} onValueChange={(value: Tone) => setMotivationTone(value)}>
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
                      value={dailyGoal} 
                      onChange={(e) => setDailyGoal(Number(e.target.value))}
                      className="font-code"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <Label htmlFor="link-devices" className="flex items-center gap-3 font-medium">
                       <Link className="w-5 h-5 text-primary" />
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
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
