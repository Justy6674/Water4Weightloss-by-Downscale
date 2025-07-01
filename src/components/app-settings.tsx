
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { type UserData, type Tone } from '@/lib/user-data';
import { getMessaging, getToken } from 'firebase/messaging';
import { app } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { saveFcmToken, sendTestNotification, savePhoneNumberAndSendConfirmation } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Input } from './ui/input';
import { Separator } from './ui/separator';

interface AppSettingsProps {
  userData: UserData;
  onUpdate: (updatedSettings: Partial<UserData>, writeToDb?: boolean) => void;
}

export function AppSettings({ userData, onUpdate }: AppSettingsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const settings = userData.appSettings;
  const [phone, setPhone] = useState(userData.bodyMetrics.phone || '');
  const [isSavingPhone, setIsSavingPhone] = useState(false);

  const handleSettingChange = (key: keyof UserData['appSettings'], value: any, writeToDb: boolean = true) => {
    onUpdate({ appSettings: { ...settings, [key]: value } }, writeToDb);
  };
  
  const handleToneChange = (tone: Tone) => {
    onUpdate({ motivationTone: tone });
  }

  const handleRequestPermission = async () => {
    if (!user) {
      toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to enable notifications." });
      return;
    }
    
    try {
      const messaging = getMessaging(app);
      toast({ title: "Requesting Permission...", description: "Please grant notification permissions in your browser." });
      
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        toast({ title: "Permission Granted!", description: "Fetching your secure notification token..." });

        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
        if (!vapidKey) {
            console.error("VAPID key is missing. It should be in your .env.local file as NEXT_PUBLIC_FIREBASE_VAPID_KEY");
            toast({ variant: "destructive", title: "Configuration Error", description: "The VAPID key is not set. Notifications cannot be enabled." });
            return;
        }

        const token = await getToken(messaging, { vapidKey });
        
        if (token) {
          await saveFcmToken(user.uid, token);
          toast({ title: "Notifications Enabled", description: "Your device is now registered for push notifications." });
          handleSettingChange('pushNotifications', true);
        } else {
          toast({ variant: "destructive", title: "Token Error", description: "Could not get a notification token from Firebase." });
        }
      } else {
        toast({ variant: "destructive", title: "Permission Denied", description: "You did not grant permission for notifications." });
        handleSettingChange('pushNotifications', false, false);
      }
    } catch (error) {
      console.error('An error occurred while retrieving token:', error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({ variant: "destructive", title: "Error Enabling Notifications", description: errorMessage });
    }
  };

  const handleSendTest = async () => {
    if (!user) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to send a test." });
        return;
    }
    toast({ title: "Sending Test...", description: "Sending a test push notification to your device." });
    const result = await sendTestNotification(user.uid);
    if (result.success) {
        toast({ title: "Test Sent!", description: result.message });
    } else {
        toast({ variant: "destructive", title: "Test Failed", description: result.message });
    }
  };
  
  const handleSavePhone = async () => {
      if (!user) {
        toast({ variant: "destructive", title: "Not Logged In", description: "You must be logged in to save a phone number." });
        return;
      }
      if (!phone.match(/^\+[1-9]\d{1,14}$/)) {
        toast({ variant: "destructive", title: "Invalid Phone Number", description: "Please enter a valid phone number in E.164 format (e.g., +12223334444)." });
        return;
      }
      
      setIsSavingPhone(true);
      toast({ title: "Saving Phone Number", description: "We're saving your number and sending a confirmation text." });
      const result = await savePhoneNumberAndSendConfirmation(user.uid, phone);
      
      if (result.success) {
          onUpdate({ bodyMetrics: { ...userData.bodyMetrics, phone } }, false);
          toast({ title: "Success!", description: result.message });
      } else {
          toast({ variant: "destructive", title: "Failed to Save", description: result.message });
      }
      setIsSavingPhone(false);
  }

  return (
    <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">App Preferences</h3>
        <Card className="bg-muted/30">
            <CardHeader className="pb-4">
                <CardTitle className="text-base">AI Motivation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="tone" className="text-sm font-normal">Motivation Tone</Label>
                    <Select value={userData.motivationTone} onValueChange={handleToneChange}>
                        <SelectTrigger className="w-[150px]">
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
            </CardContent>
        </Card>
        
        <Separator />
        
        <h3 className="text-lg font-medium text-foreground">Notifications</h3>
        <Card className="bg-muted/30">
            <CardHeader className="pb-4">
                <CardTitle className="text-base">Push Notifications</CardTitle>
                <CardDescription className="text-sm">Receive reminders and motivation directly on your device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications" className="text-sm font-normal">
                        Enable Push Notifications
                    </Label>
                    <Switch
                        id="push-notifications"
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                handleRequestPermission();
                            } else {
                               handleSettingChange('pushNotifications', false);
                            }
                        }}
                    />
                </div>
                {settings.pushNotifications && (
                     <Button onClick={handleSendTest} variant="secondary" className="w-full">Send Test Notification</Button>
                )}
            </CardContent>
        </Card>
        <Card className="bg-muted/30">
            <CardHeader className="pb-4">
                <CardTitle className="text-base">SMS Reminders</CardTitle>
                <CardDescription className="text-sm">Get text message reminders. Standard rates may apply.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between">
                    <Label htmlFor="sms-reminders" className="text-sm font-normal">
                        Enable SMS Reminders
                    </Label>
                    <Switch
                        id="sms-reminders"
                        checked={settings.smsReminders}
                        onCheckedChange={(checked) => handleSettingChange('smsReminders', checked)}
                        disabled={!userData.bodyMetrics.phone}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone-number">Phone Number (E.164 format)</Label>
                    <div className="flex gap-2">
                        <Input 
                            id="phone-number" 
                            type="tel" 
                            placeholder="+12223334444" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={isSavingPhone}
                        />
                        <Button onClick={handleSavePhone} disabled={isSavingPhone}>Save</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-muted/30">
            <CardHeader className="pb-4">
                <CardTitle className="text-base">Reminder Frequency</CardTitle>
                 <CardDescription className="text-sm">How often should we check if you need a reminder?</CardDescription>
            </CardHeader>
            <CardContent>
                <Select
                    value={settings.notificationFrequency}
                    onValueChange={(value) => handleSettingChange('notificationFrequency', value)}
                    disabled={!settings.pushNotifications && !settings.smsReminders}
                >
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="off">Off</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="four-hours">Every 4 hours</SelectItem>
                        <SelectItem value="intelligent">Intelligent</SelectItem>
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>
    </div>
  );
}
