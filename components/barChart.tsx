"use client"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
    { month: "Janvier", commande: 186 },
    { month: "Février", commande: 305 },
    { month: "Mars", commande: 237 },
    { month: "Avril", commande: 73 },
    { month: "Mai", commande: 209 },
    { month: "Juin", commande: 214 },
]

const chartConfig = {
    desktop: {
        label: "Commande",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export default function BarCharts() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Nombre de commande de</CardTitle>
                <CardDescription>Janvier - Juin 2025</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 20,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="commande" fill="var(--color-desktop)" radius={8}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Montre les commandes durant ces 6 derniers mois
                </div>
            </CardFooter>
        </Card>
    )
}
