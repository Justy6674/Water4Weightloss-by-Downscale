
"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import type { BloodPressureReading } from "@/lib/user-data"
import { format } from "date-fns"

const chartConfig = {
  systolic: { label: "Systolic (mmHg)", color: "hsl(var(--chart-1))" },
  diastolic: { label: "Diastolic (mmHg)", color: "hsl(var(--chart-2))" },
  heartRate: { label: "Heart Rate (bpm)", color: "hsl(var(--chart-4))" },
}

interface BloodPressureChartProps {
  data: BloodPressureReading[];
}

export function BloodPressureChart({ data }: BloodPressureChartProps) {
    const formattedData = data.sort((a,b) => new Date(a.timestamp as string).getTime() - new Date(b.timestamp as string).getTime()).map(reading => ({
        ...reading,
        date: format(new Date(reading.timestamp as string), "MMM d, h:mm a")
    }));
    
  if (!data || data.length < 2) {
      return <div className="text-center p-8 text-muted-foreground">Log at least two readings to see your progress chart.</div>
  }

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <LineChart accessibilityLayer data={formattedData} margin={{ top: 20, left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.split(',')[0]} />
        <YAxis yAxisId="bp" tickLine={false} axisLine={false} tickMargin={8} domain={['dataMin - 10', 'dataMax + 10']} />
        <YAxis yAxisId="hr" orientation="right" tickLine={false} axisLine={false} tickMargin={8} domain={['dataMin - 10', 'dataMax + 10']} />
        <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
        <Legend content={<ChartLegendContent />} />
        <Line yAxisId="bp" dataKey="systolic" type="monotone" stroke="var(--color-systolic)" strokeWidth={2} dot={true} name="Systolic" />
        <Line yAxisId="bp" dataKey="diastolic" type="monotone" stroke="var(--color-diastolic)" strokeWidth={2} dot={true} name="Diastolic" />
        <Line yAxisId="hr" dataKey="heartRate" type="monotone" stroke="var(--color-heartRate)" strokeWidth={2} dot={true} name="Heart Rate" />
      </LineChart>
    </ChartContainer>
  )
}
