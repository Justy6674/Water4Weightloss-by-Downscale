
"use client"

import * as React from "react"
import { Flame, Trophy, Star, Sparkles, BellDot, MessageSquareText, Vibrate, Save, Link as LinkIcon, Watch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { type UserData, type Tone, type NotificationFrequency } from "@/lib/user-data"
import { savePhoneNumberAndSendConfirmation, saveFcmToken, sendTestNotification } from "@/lib/actions"
import { useAuth } from "@/hooks/use-auth"
import { messaging } from "@/lib/firebase"
import { getToken } from "firebase/messaging"


interface AppSettingsProps {
  userData: UserData;
  onUpdate: (updatedSettings: Partial<UserData>, writeToDb?: boolean) => void;
}

export function AppSettings({ userData, onUpdate }: AppSettingsProps) {
  const { toast } = useToast()
  const user = useAuth();
  const [dailyGoal, setDailyGoal] = React.useState(userData.dailyGoal.toString());
  const [phone, setPhone] = React.useState(userData.bodyMetrics.phone || "");
  const [isSavingPhone, setIsSavingPhone] = React.useState(false);
  const [isTestingPush, setIsTestingPush] = React.useState(false);
  
  React.useEffect(() => {
    const handler = setTimeout(() => {
        const goalNumber = Number(dailyGoal);
        if (!isNaN(goalNumber) && goalNumber > 0 && goalNumber !== userData.dailyGoal) {
            onUpdate({ dailyGoal: goalNumber });
            toast({
                title: "Daily Goal Updated",
                description: `Your new daily hydration goal is ${goalNumber}ml.`,
            });
        }
    }, 1000); // 1-second debounce

    return () => {
        clearTimeout(handler);
    };
  }, [dailyGoal, userData.dailyGoal, onUpdate, toast]);

  const handleSettingChange = (key: keyof UserData['appSettings'] | 'motivationTone', value: any) => {
    if (key === 'motivationTone') {
      onUpdate({ [key]: value });
      toast({
        title: "AI Tone Updated",
        description: `Your motivational messages will now have a ${value} tone.`,
      });
      return;
    }

    onUpdate({ appSettings: { ...userData.appSettings, [key as keyof UserData['appSettings']]: value } });
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
        onUpdate({ bodyMetrics: { ...userData.bodyMetrics, phone } }, false);
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

  const handlePushToggle = async (enabled: boolean) => {
    handleSettingChange('pushNotifications', enabled);
    if (enabled && messaging && user) {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('Notification permission granted.');
                
                // This is a public key for browser push notifications.
                const vapidKey = "BP0d5qhNgVDDBcWwbUdgaeZayuZGTW2-aZdlCPJ-l0ziEk_3sfWWsYT_YTMR4-5CYsM6vUUyZbGBmkC876LjA94";

                const fcmToken = await getToken(messaging, { vapidKey });

                if (fcmToken) {
                    await saveFcmToken(user.uid, fcmToken);
                    toast({ title: "Notifications Enabled", description: "You're all set up for push notifications." });
                } else {
                    console.log('No registration token available. Request permission to generate one.');
                    toast({ variant: "destructive", title: "Could not get token", description: "Failed to get notification token. Ensure firebase-messaging-sw.js is set up." });
                    handleSettingChange('pushNotifications', false);
                }
            } else {
                console.log('Unable to get permission to notify.');
                 toast({ variant: "destructive", title: "Permission Denied", description: "You will not receive notifications." });
                 handleSettingChange('pushNotifications', false);
            }
        } catch (error) {
            console.error('An error occurred while getting token. ', error);
            toast({ variant: "destructive", title: "Setup Error", description: "An error occurred while setting up notifications. Check console for details." });
            handleSettingChange('pushNotifications', false);
        }
    }
  };

  const handleTestPush = async () => {
    if (!user) return;
    setIsTestingPush(true);
    try {
        const result = await sendTestNotification(user.uid);
        if(result.success) {
            toast({ title: "Request Sent", description: result.message });
        } else {
            toast({ variant: "destructive", title: "Request Failed", description: result.message });
        }
    } catch(error) {
        const desc = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ variant: "destructive", title: "Error", description: desc });
    } finally {
        setIsTestingPush(false);
    }
  }


  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">App Preferences</h3>
         <div className="space-y-2">
            <Label>AI Motivation Tone</Label>
            <Select value={userData.motivationTone} onValueChange={(v: Tone) => handleSettingChange('motivationTone', v)}>
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
              onChange={(e) => setDailyGoal(e.target.value)}
              className="font-code"
            />
          </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Achievements</h3>
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
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Notifications</h3>
        <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <Label htmlFor="push-notifications" className="flex items-center gap-3 font-medium">
                    <BellDot className="w-5 h-5 text-primary" />
                    Push Notifications
                    </Label>
                <Switch id="push-notifications" checked={userData.appSettings.pushNotifications} onCheckedChange={handlePushToggle} />
            </div>
            {userData.appSettings.pushNotifications && (
                <div className="p-3 rounded-lg bg-muted/30">
                    <Button onClick={handleTestPush} disabled={isTestingPush}>
                        <BellDot className="mr-2 h-4 w-4" />
                        {isTestingPush ? 'Sending...' : 'Send Test Notification'}
                    </Button>
                </div>
            )}
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
                 <p className="text-sm text-muted-foreground">Choose how often you want to receive reminders.</p>
                <RadioGroup 
                    value={userData.appSettings.notificationFrequency} 
                    onValueChange={(v) => handleSettingChange('notificationFrequency', v as NotificationFrequency)} 
                    className="space-y-3 pt-2"
                >
                    <div className="flex items-start space-x-3">
                        <RadioGroupItem value="intelligent" id="freq-intelligent" className="mt-1" />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="freq-intelligent" className="font-semibold">Intelligent</Label>
                            <p className="text-xs text-muted-foreground">
                                Let our AI remind you only when you're falling behind schedule. (Recommended)
                            </p>
                        </div>
                    </div>
                     <div className="flex items-start space-x-3">
                        <RadioGroupItem value="hourly" id="freq-hourly" className="mt-1" />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="freq-hourly" className="font-semibold">Hourly</Label>
                            <p className="text-xs text-muted-foreground">
                                Receive a reminder every hour during your typical waking hours.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <RadioGroupItem value="four-hours" id="freq-four" className="mt-1" />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="freq-four" className="font-semibold">Infrequent</Label>
                            <p className="text-xs text-muted-foreground">
                                Only get a reminder if you haven't logged any water for 4 hours.
                            </p>
                        </div>
                    </div>
                     <div className="flex items-start space-x-3">
                        <RadioGroupItem value="off" id="freq-off" className="mt-1" />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="freq-off" className="font-semibold">Off</Label>
                            <p className="text-xs text-muted-foreground">
                                You will not receive any push or SMS notifications.
                            </p>
                        </div>
                    </div>
                </RadioGroup>
            </div>
        </div>
      </div>
       <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Device Sync</h3>
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
      </div>
    </>
  )
}
