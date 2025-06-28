
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
import type { UserData } from "@/lib/user-data"

const calculateBmi = (weightKg?: number, heightCm?: number) => {
  if (!weightKg || !heightCm || heightCm === 0) return null
  const heightM = heightCm / 100
  return (weightKg / (heightM * heightM)).toFixed(1)
}

interface BodyMetricsProps {
  initialMetrics: UserData['bodyMetrics'];
  onSave: (newMetrics: Partial<UserData['bodyMetrics']>) => void;
}

export function BodyMetrics({ initialMetrics, onSave }: BodyMetricsProps) {
  const [metrics, setMetrics] = React.useState(initialMetrics);
  const [showBmi, setShowBmi] = React.useState(false);

  React.useEffect(() => {
    setMetrics(initialMetrics);
  }, [initialMetrics]);

  const handleChange = (field: keyof UserData['bodyMetrics'], value: any) => {
    setMetrics(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveMetrics = () => {
    onSave({
      weight: metrics.weight,
      waist: metrics.waist,
      height: metrics.height,
      gender: metrics.gender
    });
  };
  
  const bmi = React.useMemo(() => {
      if (!showBmi) return null;
      return calculateBmi(parseFloat(metrics.weight), parseFloat(metrics.height));
  }, [metrics.weight, metrics.height, showBmi]);

  return (
    <Card className="bg-card/70 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle>Body Metrics</CardTitle>
        <CardDescription>Log and track your physical progress. All tracking is optional.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-medium">Log Your Metrics</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight-input">Weight (kg)</Label>
                  <Input id="weight-input" type="number" placeholder="e.g., 80.5" value={metrics.weight} onChange={(e) => handleChange('weight', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waist-input">Waist (cm)</Label>
                  <Input id="waist-input" type="number" placeholder="e.g., 90" value={metrics.waist} onChange={(e) => handleChange('waist', e.target.value)} />
                </div>
              </div>
              <Button className="mt-4" onClick={handleSaveMetrics}>Save Metrics</Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-medium">Progress Visualisation</AccordionTrigger>
            <AccordionContent className="pt-4">
              <WeightChart />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-medium">Optional: BMI Analysis</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <Label htmlFor="show-bmi" className="font-medium">Calculate and Show BMI</Label>
                  <Switch id="show-bmi" checked={showBmi} onCheckedChange={setShowBmi} />
              </div>
              {showBmi && (
                <div className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground">Please provide your height and gender for BMI calculation.</p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height-input">Height (cm)</Label>
                      <Input id="height-input" type="number" placeholder="e.g., 175" value={metrics.height} onChange={(e) => handleChange('height', e.target.value)}/>
                    </div>
                     <div className="space-y-2">
                        <Label>Gender for BMI</Label>
                        <Select value={metrics.gender || ''} onValueChange={(v) => handleChange('gender', v)}>
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
                          Understanding BMI is one tool among many to help understand your health. Focus on healthy habits like balanced nutrition, regular movement, and consistent hydration.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
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
