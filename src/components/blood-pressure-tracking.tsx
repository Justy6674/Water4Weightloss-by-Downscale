
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { BloodPressureReading } from "@/lib/user-data"
import { BloodPressureChart } from "./blood-pressure-chart"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface BloodPressureTrackingProps {
  log: BloodPressureReading[];
  onSave: (newReading: Omit<BloodPressureReading, 'timestamp'>) => void;
}

export function BloodPressureTracking({ log, onSave }: BloodPressureTrackingProps) {
  const [systolic, setSystolic] = React.useState('');
  const [diastolic, setDiastolic] = React.useState('');
  const [heartRate, setHeartRate] = React.useState('');
  const { toast } = useToast();

  const handleSave = () => {
    const newReading = {
      systolic: parseInt(systolic, 10),
      diastolic: parseInt(diastolic, 10),
      heartRate: parseInt(heartRate, 10),
    };
    if (isNaN(newReading.systolic) || isNaN(newReading.diastolic) || isNaN(newReading.heartRate) || newReading.systolic <= 0 || newReading.diastolic <= 0 || newReading.heartRate <= 0) {
      toast({
          variant: "destructive",
          title: "Invalid Input",
          description: "Please enter valid, positive numbers for all fields.",
      });
      return;
    }
    onSave(newReading);
    setSystolic('');
    setDiastolic('');
    setHeartRate('');
  };

  const sortedLog = React.useMemo(() => {
    return [...log].sort((a, b) => new Date(b.timestamp as string).getTime() - new Date(a.timestamp as string).getTime());
  }, [log]);

  return (
    <Card className="bg-card/70 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle>Blood Pressure & Heart Rate</CardTitle>
        <CardDescription>Log and track your cardiovascular health.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']} className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-medium">Log New Reading</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systolic-input">Systolic (mmHg)</Label>
                  <Input id="systolic-input" type="number" placeholder="e.g., 120" value={systolic} onChange={(e) => setSystolic(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diastolic-input">Diastolic (mmHg)</Label>
                  <Input id="diastolic-input" type="number" placeholder="e.g., 80" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hr-input">Heart Rate (bpm)</Label>
                  <Input id="hr-input" type="number" placeholder="e.g., 65" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} />
                </div>
              </div>
              <Button className="mt-4" onClick={handleSave}>Save Reading</Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-medium">Progress Chart</AccordionTrigger>
            <AccordionContent className="pt-4">
              <BloodPressureChart data={sortedLog} />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-medium">Reading History</AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-card">
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="text-right">Systolic</TableHead>
                      <TableHead className="text-right">Diastolic</TableHead>
                      <TableHead className="text-right">Heart Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedLog.length > 0 ? sortedLog.map((reading, index) => (
                      <TableRow key={index}>
                        <TableCell>{format(new Date(reading.timestamp as string), "MMM d, yyyy")}</TableCell>
                        <TableCell>{format(new Date(reading.timestamp as string), "h:mm a")}</TableCell>
                        <TableCell className="text-right">{reading.systolic}</TableCell>
                        <TableCell className="text-right">{reading.diastolic}</TableCell>
                        <TableCell className="text-right">{reading.heartRate}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">No readings logged yet.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  )
}
