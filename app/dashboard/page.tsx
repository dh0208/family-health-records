"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Pill, Phone, AlertTriangle, Activity, Calendar, Clock, User } from "lucide-react"
import Link from "next/link"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

// Mock data for the dashboard
const healthMetrics = [
  { month: "Jan", weight: 70, bloodPressure: 120, cholesterol: 180 },
  { month: "Feb", weight: 71, bloodPressure: 122, cholesterol: 175 },
  { month: "Mar", weight: 70.5, bloodPressure: 118, cholesterol: 172 },
  { month: "Apr", weight: 70.2, bloodPressure: 121, cholesterol: 170 },
  { month: "May", weight: 69.8, bloodPressure: 119, cholesterol: 168 },
  { month: "Jun", weight: 69.5, bloodPressure: 118, cholesterol: 165 },
]

const medicationData = [
  { name: "Medication A", adherence: 95 },
  { name: "Medication B", adherence: 88 },
  { name: "Medication C", adherence: 76 },
  { name: "Medication D", adherence: 92 },
]

const recentActivities = [
  {
    id: 1,
    type: "Medical Record",
    description: "Added new doctor visit record",
    date: "2024-03-20",
    time: "10:30 AM",
    icon: FileText,
  },
  {
    id: 2,
    type: "Prescription",
    description: "Updated medication dosage",
    date: "2024-03-18",
    time: "2:15 PM",
    icon: Pill,
  },
  {
    id: 3,
    type: "Emergency Contact",
    description: "Added new emergency contact",
    date: "2024-03-15",
    time: "11:45 AM",
    icon: Phone,
  },
  {
    id: 4,
    type: "Allergy",
    description: "Recorded new food allergy",
    date: "2024-03-10",
    time: "9:20 AM",
    icon: AlertTriangle,
  },
]

const upcomingAppointments = [
  {
    id: 1,
    doctor: "Dr. Smith",
    specialty: "General Practitioner",
    date: "2024-04-05",
    time: "10:00 AM",
    location: "Medical Center",
  },
  {
    id: 2,
    doctor: "Dr. Johnson",
    specialty: "Cardiologist",
    date: "2024-04-12",
    time: "2:30 PM",
    location: "Heart Clinic",
  },
  {
    id: 3,
    doctor: "Dr. Williams",
    specialty: "Dermatologist",
    date: "2024-04-20",
    time: "11:15 AM",
    location: "Skin Care Center",
  },
]

const familyMembers = [
  { id: 1, name: "John Doe", relation: "Self", age: 42 },
  { id: 2, name: "Jane Doe", relation: "Spouse", age: 40 },
  { id: 3, name: "Emily Doe", relation: "Daughter", age: 15 },
  { id: 4, name: "Michael Doe", relation: "Son", age: 12 },
]

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 added this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">1 expiring soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Contacts</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Last updated 2 weeks ago</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Allergies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 high severity</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="health" className="space-y-4">
        <TabsList>
          <TabsTrigger value="health">Health Metrics</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="activities">Recent Activities</TabsTrigger>
        </TabsList>
        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="break-words">Health Metrics Overview</CardTitle>
              <CardDescription className="break-words">Track your key health metrics over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] overflow-hidden">
              <ChartContainer>
                <Chart>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={healthMetrics}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} name="Weight (kg)" />
                      <Line
                        type="monotone"
                        dataKey="bloodPressure"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        name="Blood Pressure (systolic)"
                      />
                      <Line
                        type="monotone"
                        dataKey="cholesterol"
                        stroke="#ffc658"
                        strokeWidth={2}
                        name="Cholesterol (mg/dL)"
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </LineChart>
                  </ResponsiveContainer>
                </Chart>
                <ChartLegend className="flex flex-wrap justify-center gap-4">
                  <ChartLegendItem name="Weight (kg)" color="#8884d8" className="whitespace-nowrap" />
                  <ChartLegendItem name="Blood Pressure (systolic)" color="#82ca9d" className="whitespace-nowrap" />
                  <ChartLegendItem name="Cholesterol (mg/dL)" color="#ffc658" className="whitespace-nowrap" />
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
            <CardContent className="h-[300px]">
              <ChartContainer>
                <Chart>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={medicationData}>
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Bar dataKey="adherence" fill="#8884d8" name="Adherence (%)" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ResponsiveContainer>
                </Chart>
                <ChartLegend>
                  <ChartLegendItem name="Adherence (%)" color="#8884d8" />
                </ChartLegend>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your latest health record activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <activity.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{activity.type}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {activity.date}
                        <Clock className="ml-2 mr-1 h-3 w-3" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled medical appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex flex-col space-y-2 rounded-lg border p-3">
                  <div className="flex justify-between">
                    <div className="font-medium">{appointment.doctor}</div>
                    <div className="text-sm text-muted-foreground">{appointment.specialty}</div>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                    {appointment.date}
                    <Clock className="ml-2 mr-1 h-4 w-4 text-muted-foreground" />
                    {appointment.time}
                  </div>
                  <div className="text-sm text-muted-foreground">{appointment.location}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Family Members</CardTitle>
            <CardDescription>People whose health records you manage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {familyMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.relation}</div>
                    </div>
                  </div>
                  <div className="text-sm">Age: {member.age}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-2">
        <Button asChild variant="outline">
          <Link href="/dashboard/medical-history">
            <FileText className="mr-2 h-4 w-4" />
            Medical Records
          </Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard/analytics">
            <Activity className="mr-2 h-4 w-4" />
            View Full Analytics
          </Link>
        </Button>
      </div>
    </div>
  )
}

