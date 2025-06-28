
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { UserData } from "@/lib/user-data"

interface MedicationTrackingProps {
  initialMedication: UserData['bodyMetrics'];
  onSave: (newMedication: Partial<UserData['bodyMetrics']>) => void;
}

export function MedicationTracking({ initialMedication, onSave }: MedicationTrackingProps) {
  const [medication, setMedication] = React.useState(initialMedication);

  React.useEffect(() => {
    setMedication(initialMedication);
  }, [initialMedication]);

  const handleChange = (field: keyof UserData['bodyMetrics'], value: any) => {
    setMedication(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveMedication = () => {
    onSave({
      medication: medication.medication,
      medicationFrequency: medication.medicationFrequency,
      medicationDose: medication.medicationDose,
      medicationReminder: medication.medicationReminder,
    });
  };

  return (
    <Card className="bg-card/70 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle>Medication Tracking</CardTitle>
        <CardDescription>
          Keep a log of your medication. This helps the AI provide more relevant advice.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Medication</Label>
            <Select value={medication.medication || ''} onValueChange={(v) => handleChange('medication', v)}>
              <SelectTrigger><SelectValue placeholder="Select Medication" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="semaglutide">Semaglutide</SelectItem>
                <SelectItem value="tirzepatide">Tirzepatide</SelectItem>
                <SelectItem value="phentermine">Phentermine</SelectItem>
                <SelectItem value="metformin">Metformin</SelectItem>
                <SelectItem value="custom">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select value={medication.medicationFrequency || ''} onValueChange={(v) => handleChange('medicationFrequency', v)}>
              <SelectTrigger><SelectValue placeholder="Select Frequency" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="twice-daily">Twice Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dose-input">Dose</Label>
          <Input id="dose-input" placeholder="e.g., 2.5 mg" value={medication.medicationDose} onChange={(e) => handleChange('medicationDose', e.target.value)} />
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
          <Label htmlFor="medication-reminder" className="font-medium">Enable Reminder</Label>
          <Switch id="medication-reminder" checked={medication.medicationReminder} onCheckedChange={(v) => handleChange('medicationReminder', v)} />
        </div>
        <Button className="mt-4" onClick={handleSaveMedication}>Save Medication</Button>
      </CardContent>
    </Card>
  )
}
