"use client"

import * as React from "react"
import { Apple, Scale, Waves } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { WeightChart } from "@/components/weight-chart"

// A simple BMI calculation for demo purposes
const calculateBmi = (weightKg?: number, heightCm?: number) => {
  if (!weightKg || !heightCm || heightCm === 0) return null
  const heightM = heightCm / 100
  return (weightKg / (heightM * heightM)).toFixed(1)
}

export function BodyMetrics() {
  const [weight, setWeight] = React.useState("81.2")
  const [waist, setWaist] = React.useState("85")
  const [height, setHeight] = React.useState("175")
  const [gender, setGender] = React.useState<string>()

  const [medication, setMedication] = React.useState<string>()
  const [medicationFrequency, setMedicationFrequency] = React.useState<string>()
  const [medicationDose, setMedicationDose] = React.useState("")
  const [medicationReminder, setMedicationReminder] = React.useState(false)

  const [showBmi, setShowBmi] = React.useState(false)

  const bmi = React.useMemo(() => {
      if (!showBmi) return null;
      return calculateBmi(parseFloat(weight), parseFloat(height))
  }, [weight, height, showBmi])

  return (
    <Card className="bg-card/70 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle>Body Metrics &amp; Medication</CardTitle>
        <CardDescription>Log and track your progress. All tracking is optional.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Accordion type="multiple" defaultValue={['item-1', 'item-3']} className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-medium">Log Your Metrics</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight-input">Weight (kg)</Label>
                  <Input id="weight-input" type="number" placeholder="e.g., 80.5" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waist-input">Waist (cm)</Label>
                  <Input id="waist-input" type="number" placeholder="e.g., 90" value={waist} onChange={(e) => setWaist(e.target.value)} />
                </div>
              </div>
              <Button className="mt-4">Save Metrics</Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-medium">Medication Tracking</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Medication</Label>
                   <Select value={medication} onValueChange={setMedication}>
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
                   <Select value={medicationFrequency} onValueChange={setMedicationFrequency}>
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
                  <Input id="dose-input" placeholder="e.g., 2.5 mg" value={medicationDose} onChange={(e) => setMedicationDose(e.target.value)}/>
                </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <Label htmlFor="medication-reminder" className="font-medium">Enable Reminder</Label>
                <Switch id="medication-reminder" checked={medicationReminder} onCheckedChange={setMedicationReminder} />
              </div>
              <Button className="mt-4">Save Medication</Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-medium">Progress Visualisation</AccordionTrigger>
            <AccordionContent className="pt-4">
              <WeightChart />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-medium">Optional: BMI Analysis</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <Label htmlFor="show-bmi" className="font-medium">Calculate and Show BMI</Label>
                  <Switch id="show-bmi" checked={showBmi} onCheckedChange={setShowBmi} />
              </div>
              {showBmi && (
                <div className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground">Please provide your height and gender for BMI calculation. This information is used solely for this purpose and is optional.</p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height-input">Height (cm)</Label>
                      <Input id="height-input" type="number" placeholder="e.g., 175" value={height} onChange={(e) => setHeight(e.target.value)}/>
                    </div>
                     <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select value={gender} onValueChange={setGender}>
                            <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Prefer not to say</SelectItem>
                            </SelectContent>
                        </Select>
                      </div>
                  </div>
                  {bmi && (
                    <Card className="mt-4 bg-muted/50">
                      <CardHeader>
                        <CardTitle>Your BMI: {bmi}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">
                          Understanding BMI is one tool among many to help understand your health. It's a general guide and doesn't tell the whole story of your body composition or wellbeing. Focus on healthy habits like balanced nutrition, regular movement, and consistent hydration.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
             <AccordionTrigger className="text-lg font-medium">Device &amp; App Integration</AccordionTrigger>
             <AccordionContent className="space-y-4 pt-4">
                 <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                        <Scale className="w-5 h-5 text-primary" />
                        <Label htmlFor="bt-scale-sync" className="font-medium">Sync with Bluetooth Scale</Label>
                    </div>
                    <Switch id="bt-scale-sync" disabled />
                 </div>
                 <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                        <Apple className="w-5 h-5 text-primary" />
                        <Label htmlFor="apple-health-sync" className="font-medium">Sync with Apple Health</Label>
                    </div>
                    <Switch id="apple-health-sync" disabled />
                 </div>
                 <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                        <Waves className="w-5 h-5 text-primary" />
                        <Label htmlFor="myfitnesspal-sync" className="font-medium">Sync with MyFitnessPal</Label>
                    </div>
                    <Switch id="myfitnesspal-sync" disabled />
                 </div>
             </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
