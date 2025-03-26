"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Chart, ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendItem } from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"

// Mock data for health analytics
const monthlyHealthMetrics = [
  { month: "Jan", weight: 70, bloodPressure: 120, cholesterol: 180, heartRate: 72, steps: 8500 },
  { month: "Feb", weight: 71, bloodPressure: 122, cholesterol: 175, heartRate: 74, steps: 9200 },
  { month: "Mar", weight: 70.5, bloodPressure: 118, cholesterol: 172, heartRate: 71, steps: 10100 },
  { month: "Apr", weight: 70.2, bloodPressure: 121, cholesterol: 170, heartRate: 73, steps: 9800 },
  { month: "May", weight: 69.8, bloodPressure: 119, cholesterol: 168, heartRate: 70, steps: 10500 },
  { month: "Jun", weight: 69.5, bloodPressure: 118, cholesterol: 165, heartRate: 69, steps: 11200 },
  { month: "Jul", weight: 69.2, bloodPressure: 117, cholesterol: 163, heartRate: 68, steps: 11800 },
  { month: "Aug", weight: 69.0, bloodPressure: 116, cholesterol: 160, heartRate: 67, steps: 12300 },
  { month: "Sep", weight: 68.8, bloodPressure: 115, cholesterol: 158, heartRate: 66, steps: 11500 },
  { month: "Oct", weight: 68.5, bloodPressure: 114, cholesterol: 155, heartRate: 65, steps: 10800 },
  { month: "Nov", weight: 68.2, bloodPressure: 113, cholesterol: 153, heartRate: 64, steps: 9500 },
  { month: "Dec", weight: 68.0, bloodPressure: 112, cholesterol: 150, heartRate: 63, steps: 8800 },
]

const medicationAdherence = [
  { name: "Medication A", adherence: 95 },
  { name: "Medication B", adherence: 88 },
  { name: "Medication C", adherence: 76 },
  { name: "Medication D", adherence: 92 },
]

const sleepData = [
  { day: "Mon", deepSleep: 2.5, lightSleep: 4.5, remSleep: 1.5 },
  { day: "Tue", deepSleep: 2.2, lightSleep: 4.8, remSleep: 1.3 },
  { day: "Wed", deepSleep: 2.7, lightSleep: 4.3, remSleep: 1.6 },
  { day: "Thu", deepSleep: 2.3, lightSleep: 4.7, remSleep: 1.4 },
  { day: "Fri", deepSleep: 2.1, lightSleep: 4.9, remSleep: 1.2 },
  { day: "Sat", deepSleep: 3.0, lightSleep: 4.0, remSleep: 1.8 },
  { day: "Sun", deepSleep: 2.8, lightSleep: 4.2, remSleep: 1.7 },
]

const nutritionData = [
  { name: "Protein", value: 30 },
  { name: "Carbs", value: 45 },
  { name: "Fat", value: 20 },
  { name: "Fiber", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const exerciseData = [
  { day: "Mon", cardio: 30, strength: 15, flexibility: 10 },
  { day: "Tue", cardio: 0, strength: 45, flexibility: 15 },
  { day: "Wed", cardio: 45, strength: 0, flexibility: 10 },
  { day: "Thu", cardio: 20, strength: 30, flexibility: 5 },
  { day: "Fri", cardio: 0, strength: 60, flexibility: 0 },
  { day: "Sat", cardio: 60, strength: 0, flexibility: 20 },
  { day: "Sun", cardio: 0, strength: 0, flexibility: 0 },
]

export default function HealthAnalytics() {
  const [timeRange, setTimeRange] = useState("year")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Health Analytics Dashboard</h2>
        <Select defaultValue={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="vitals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="exercise">Exercise</TabsTrigger>
        </TabsList>

        <TabsContent value="vitals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold break-words">68.0 kg</div>
                <p className="text-xs text-muted-foreground break-words">-2.0 kg from last year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold break-words">112/75 mmHg</div>
                <p className="text-xs text-muted-foreground break-words">-8 mmHg from last year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cholesterol</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold break-words">150 mg/dL</div>
                <p className="text-xs text-muted-foreground break-words">-30 mg/dL from last year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resting Heart Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold break-words">63 bpm</div>
                <p className="text-xs text-muted-foreground break-words">-9 bpm from last year</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="break-words">Vital Signs Trends</CardTitle>
              <CardDescription className="break-words">Track your key health metrics over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer>
                <Chart>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={monthlyHealthMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="weight"
                        stroke="#8884d8"
                        strokeWidth={2}
                        name="Weight (kg)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="bloodPressure"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        name="Blood Pressure (systolic)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="cholesterol"
                        stroke="#ffc658"
                        strokeWidth={2}
                        name="Cholesterol (mg/dL)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="heartRate"
                        stroke="#ff8042"
                        strokeWidth={2}
                        name="Heart Rate (bpm)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Chart>
                <ChartLegend className="flex flex-wrap justify-center gap-4">
                  <ChartLegendItem name="Weight (kg)" color="#8884d8" className="whitespace-nowrap" />
                  <ChartLegendItem name="Blood Pressure (systolic)" color="#82ca9d" className="whitespace-nowrap" />
                  <ChartLegendItem name="Cholesterol (mg/dL)" color="#ffc658" className="whitespace-nowrap" />
                  <ChartLegendItem name="Heart Rate (bpm)" color="#ff8042" className="whitespace-nowrap" />
                </ChartLegend>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medication Adherence</CardTitle>
              <CardDescription>Track how well you're following your medication schedule</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer>
                <Chart>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={medicationAdherence}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="adherence" fill="#8884d8" name="Adherence (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </Chart>
                <ChartLegend className="flex flex-wrap justify-center gap-4">
                  <ChartLegendItem name="Adherence (%)" color="#8884d8" className="whitespace-nowrap" />
                </ChartLegend>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sleep" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Analysis</CardTitle>
              <CardDescription>Track your sleep patterns and quality</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer>
                <Chart>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={sleepData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="deepSleep"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                        name="Deep Sleep (hrs)"
                      />
                      <Area
                        type="monotone"
                        dataKey="lightSleep"
                        stackId="1"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        name="Light Sleep (hrs)"
                      />
                      <Area
                        type="monotone"
                        dataKey="remSleep"
                        stackId="1"
                        stroke="#ffc658"
                        fill="#ffc658"
                        name="REM Sleep (hrs)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Chart>
                <ChartLegend className="flex flex-wrap justify-center gap-4">
                  <ChartLegendItem name="Deep Sleep (hrs)" color="#8884d8" className="whitespace-nowrap" />
                  <ChartLegendItem name="Light Sleep (hrs)" color="#82ca9d" className="whitespace-nowrap" />
                  <ChartLegendItem name="REM Sleep (hrs)" color="#ffc658" className="whitespace-nowrap" />
                </ChartLegend>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Macronutrient Distribution</CardTitle>
                <CardDescription>Breakdown of your daily macronutrient intake</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ChartContainer>
                  <Chart>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={nutritionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {nutritionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Chart>
                  <ChartLegend className="flex flex-wrap justify-center gap-4">
                    {nutritionData.map((entry, index) => (
                      <ChartLegendItem
                        key={`legend-${index}`}
                        name={entry.name}
                        color={COLORS[index % COLORS.length]}
                        className="whitespace-nowrap"
                      />
                    ))}
                  </ChartLegend>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Steps</CardTitle>
                <CardDescription>Track your daily activity level</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ChartContainer>
                  <Chart>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={monthlyHealthMetrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="steps"
                          stroke="#8884d8"
                          strokeWidth={2}
                          name="Daily Steps"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Chart>
                  <ChartLegend className="flex flex-wrap justify-center gap-4">
                    <ChartLegendItem name="Daily Steps" color="#8884d8" className="whitespace-nowrap" />
                  </ChartLegend>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exercise" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Exercise Distribution</CardTitle>
              <CardDescription>Breakdown of your exercise activities by type</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer>
                <Chart>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={exerciseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis label={{ value: "Minutes", angle: -90, position: "insideLeft" }} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="cardio" stackId="a" fill="#8884d8" name="Cardio" />
                      <Bar dataKey="strength" stackId="a" fill="#82ca9d" name="Strength" />
                      <Bar dataKey="flexibility" stackId="a" fill="#ffc658" name="Flexibility" />
                    </BarChart>
                  </ResponsiveContainer>
                </Chart>
                <ChartLegend className="flex flex-wrap justify-center gap-4">
                  <ChartLegendItem name="Cardio" color="#8884d8" className="whitespace-nowrap" />
                  <ChartLegendItem name="Strength" color="#82ca9d" className="whitespace-nowrap" />
                  <ChartLegendItem name="Flexibility" color="#ffc658" className="whitespace-nowrap" />
                </ChartLegend>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

