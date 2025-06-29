
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
import { type UserData, type Tone } from "@/lib/user-data"
import { savePhoneNumberAndSendConfirmation } from "@/lib/actions"
import { useAuth } from "@/hooks/use-auth"

interface AppSettingsProps {
  userData: UserData;
  onUpdate: (updatedSettings: Partial<UserData>) => void;
}

export function AppSettings({ userData, onUpdate }: AppSettingsProps) {
  const { toast } = useToast()
  const user = useAuth();
  const [dailyGoal, setDailyGoal] = React.useState(userData.dailyGoal.toString());
  const [phone, setPhone] = React.useState(userData.bodyMetrics.phone || "");
  const [isSavingPhone, setIsSavingPhone] = React.useState(false);
  
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
        onUpdate({ bodyMetrics: { ...userData.bodyMetrics, phone } });
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
        <h3 className="text-lg font-medium text-foreground">Gamification</h3>
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
