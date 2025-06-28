"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", weight: 85.0, goal: 84 },
  { month: "February", weight: 84.2, goal: 83 },
  { month: "March", weight: 83.1, goal: 82 },
  { month: "April", weight: 82.5, goal: 81 },
  { month: "May", weight: 81.9, goal: 80 },
  { month: "June", weight: 81.2, goal: 79 },
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
}

export function WeightChart() {
  return (
    <Card className="bg-card/70 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle>Weight Progress</CardTitle>
        <CardDescription>Your weight journey over the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending down by 0.7kg this month <TrendingUp className="h-4 w-4 text-green-500 -scale-y-100" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              You are on the right track to hit your goals!
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
