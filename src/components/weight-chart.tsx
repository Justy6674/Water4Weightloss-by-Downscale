"use client"

import { TrendingUp, Droplets, Pill } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Bar, BarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const chartData = [
  { month: "January", weight: 85.0, goal: 84, hydration: 2.8, medication: 1.0 },
  { month: "February", weight: 84.2, goal: 83, hydration: 3.0, medication: 1.0 },
  { month: "March", weight: 83.1, goal: 82, hydration: 3.2, medication: 1.75 },
  { month: "April", weight: 82.5, goal: 81, hydration: 3.1, medication: 1.75 },
  { month: "May", weight: 81.9, goal: 80, hydration: 3.4, medication: 2.4 },
  { month: "June", weight: 81.2, goal: 79, hydration: 3.5, medication: 2.4 },
]

const chartConfig = {
  weight: {
    label: "Weight (kg)",
    color: "hsl(var(--chart-1))",
  },
  goal: {
    label: "Goal (kg)",
    color: "hsl(var(--chart-2))",
  },
  hydration: {
    label: "Hydration (L)",
    color: "hsl(var(--chart-3))",
  },
  medication: {
    label: "Dose (mg)",
    color: "hsl(var(--chart-4))",
  },
}

export function WeightChart() {
  return (
    <Card className="bg-card/70 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle>Progress Visualisation</CardTitle>
        <CardDescription>Track your weight, hydration, and medication over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weight" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="hydration">Hydration</TabsTrigger>
            <TabsTrigger value="medication">Medication</TabsTrigger>
          </TabsList>
          <TabsContent value="weight" className="pt-4">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={['dataMin - 2', 'dataMax + 2']}
                  tickFormatter={(value) => `${value}kg`}
                />
                <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
                <Line
                  dataKey="weight"
                  type="natural"
                  stroke="var(--color-weight)"
                  strokeWidth={3}
                  dot={{
                    fill: "var(--color-weight)",
                    r: 5,
                  }}
                  activeDot={{
                    r: 7,
                  }}
                />
                 <Line
                  dataKey="goal"
                  type="natural"
                  stroke="var(--color-goal)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
            <div className="flex w-full items-start gap-2 text-sm pt-4">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending down by 0.7kg this month <TrendingUp className="h-4 w-4 text-green-500 -scale-y-100" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  You are on the right track to hit your goals!
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="hydration" className="pt-4">
             <ChartContainer config={chartConfig} className="h-[250px] w-full">
               <BarChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={[0, 'dataMax + 1']}
                  tickFormatter={(value) => `${value}L`}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar
                  dataKey="hydration"
                  fill="var(--color-hydration)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
             <div className="flex w-full items-start gap-2 text-sm pt-4">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Average daily intake: 3.2L <Droplets className="h-4 w-4 text-primary" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  Your hydration is consistent and strong.
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="medication" className="pt-4">
             <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={[0, 'dataMax + 1']}
                  tickFormatter={(value) => `${value}mg`}
                />
                <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
                <Line
                  dataKey="medication"
                  type="step"
                  stroke="var(--color-medication)"
                  strokeWidth={3}
                  dot={{
                    fill: "var(--color-medication)",
                    r: 5,
                  }}
                  activeDot={{
                    r: 7,
                  }}
                />
              </LineChart>
            </ChartContainer>
            <div className="flex w-full items-start gap-2 text-sm pt-4">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Current dose: 2.4mg <Pill className="h-4 w-4 text-rose-500" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  Medication dosage has been adjusted as planned.
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
