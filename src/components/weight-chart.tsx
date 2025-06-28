
"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { WeightReading } from "@/lib/user-data"
import { format } from "date-fns"

const chartConfig = {
  weight: {
    label: "Weight (kg)",
    color: "hsl(var(--chart-1))",
  },
}

interface WeightChartProps {
  data: WeightReading[];
}

export function WeightChart({ data }: WeightChartProps) {
  const formattedData = data.map(reading => ({
    ...reading,
    date: format(new Date(reading.timestamp as string), "MMM d")
  }));

  if (data.length < 2) {
    return <div className="text-center p-8 text-muted-foreground">Log at least two weight entries to see your progress chart.</div>;
  }
  
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <LineChart
        accessibilityLayer
        data={formattedData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
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
          type="monotone"
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
      </LineChart>
    </ChartContainer>
  )
}
