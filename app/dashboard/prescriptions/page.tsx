"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  CalendarIcon,
  Pill,
  Plus,
  Search,
  Trash2,
  Edit,
  CalendarIcon as CalendarLucide,
  User,
  Building,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Define the schema for prescription
const prescriptionSchema = z.object({
  name: z.string().min(2, { message: "Medication name must be at least 2 characters." }),
  dosage: z.string().min(1, { message: "Dosage is required." }),
  frequency: z.string().min(1, { message: "Frequency is required." }),
  startDate: z.date({ required_error: "Start date is required." }),
  endDate: z.date({ required_error: "End date is required." }).optional(),
  doctor: z.string().min(2, { message: "Doctor name must be at least 2 characters." }),
  pharmacy: z.string().min(2, { message: "Pharmacy name must be at least 2 characters." }),
  notes: z.string().optional(),
  refillReminder: z.boolean().default(false),
  isActive: z.boolean().default(true),
})

// Mock data for prescriptions
const initialPrescriptions = [
  {
    id: 1,
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-07-15"),
    doctor: "Dr. Smith",
    pharmacy: "City Pharmacy",
    notes: "Take in the morning with food.",
    refillReminder: true,
    isActive: true,
    refillsRemaining: 3,
    adherence: 95,
  },
  {
    id: 2,
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-08-01"),
    doctor: "Dr. Johnson",
    pharmacy: "MedPlus",
    notes: "Take in the evening.",
    refillReminder: true,
    isActive: true,
    refillsRemaining: 2,
    adherence: 88,
  },
  {
    id: 3,
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    startDate: new Date("2023-11-10"),
    endDate: new Date("2024-05-10"),
    doctor: "Dr. Williams",
    pharmacy: "Health Pharmacy",
    notes: "Take with meals.",
    refillReminder: false,
    isActive: true,
    refillsRemaining: 1,
    adherence: 92,
  },
  {
    id: 4,
    name: "Amoxicillin",
    dosage: "250mg",
    frequency: "Three times daily",
    startDate: new Date("2023-12-15"),
    endDate: new Date("2023-12-25"),
    doctor: "Dr. Brown",
    pharmacy: "Quick Meds",
    notes: "Complete the full course.",
    refillReminder: false,
    isActive: false,
    refillsRemaining: 0,
    adherence: 100,
  },
]

const frequencyOptions = [
  "Once daily",
  "Twice daily",
  "Three times daily",
  "Four times daily",
  "Every 4 hours",
  "Every 6 hours",
  "Every 8 hours",
  "Every 12 hours",
  "As needed",
  "Weekly",
  "Monthly",
  "Other",
]

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<number | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [prescriptionToEdit, setPrescriptionToEdit] = useState<number | null>(null)
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm<z.infer<typeof prescriptionSchema>>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "",
      doctor: "",
      pharmacy: "",
      notes: "",
      refillReminder: false,
      isActive: true,
    },
  })

  const editForm = useForm<z.infer<typeof prescriptionSchema>>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "",
      doctor: "",
      pharmacy: "",
      notes: "",
      refillReminder: false,
      isActive: true,
    },
  })

  useEffect(() => {
    if (prescriptionToEdit !== null) {
      const prescription = prescriptions.find((p) => p.id === prescriptionToEdit)
      if (prescription) {
        editForm.reset({
          name: prescription.name,
          dosage: prescription.dosage,
          frequency: prescription.frequency,
          startDate: prescription.startDate,
          endDate: prescription.endDate,
          doctor: prescription.doctor,
          pharmacy: prescription.pharmacy,
          notes: prescription.notes || "",
          refillReminder: prescription.refillReminder,
          isActive: prescription.isActive,
        })
      }
    }
  }, [prescriptionToEdit, prescriptions, editForm])

  const handleAddPrescription = (data: z.infer<typeof prescriptionSchema>) => {
    const newPrescription = {
      id: Math.max(0, ...prescriptions.map((p) => p.id)) + 1,
      ...data,
      refillsRemaining: 3,
      adherence: 100,
    }

    setPrescriptions([newPrescription, ...prescriptions])
    setIsAddDialogOpen(false)
    form.reset()

    toast({
      title: "Prescription added",
      description: "Prescription has been added successfully.",
    })
  }

  const handleEditPrescription = (data: z.infer<typeof prescriptionSchema>) => {
    if (prescriptionToEdit === null) return

    setPrescriptions(
      prescriptions.map((prescription) =>
        prescription.id === prescriptionToEdit
          ? {
              ...prescription,
              ...data,
            }
          : prescription,
      ),
    )

    setIsEditDialogOpen(false)
    setPrescriptionToEdit(null)

    toast({
      title: "Prescription updated",
      description: "Prescription has been updated successfully.",
    })
  }

  const handleDeletePrescription = () => {
    if (prescriptionToDelete === null) return

    setPrescriptions(prescriptions.filter((prescription) => prescription.id !== prescriptionToDelete))
    setIsDeleteDialogOpen(false)
    setPrescriptionToDelete(null)

    toast({
      title: "Prescription deleted",
      description: "Prescription has been deleted successfully.",
      variant: "destructive",
    })
  }

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      searchTerm === "" ||
      prescription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.pharmacy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.notes?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesActive = activeFilter === null || prescription.isActive === activeFilter

    return matchesSearch && matchesActive
  })

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full sm:max-w-sm">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prescriptions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select onValueChange={(value) => setActiveFilter(value === "" ? null : value === "active")}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prescriptions</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Prescription
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add Prescription</DialogTitle>
                <DialogDescription>Enter the details of the prescription below.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddPrescription)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medication Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Lisinopril" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dosage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dosage</FormLabel>
                          <FormControl>
                            <Input placeholder="10mg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {frequencyOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date (Optional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="doctor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prescribing Doctor</FormLabel>
                          <FormControl>
                            <Input placeholder="Dr. Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pharmacy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pharmacy</FormLabel>
                          <FormControl>
                            <Input placeholder="City Pharmacy" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional notes here..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="refillReminder"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Refill Reminder</FormLabel>
                            <FormDescription>Get notifications when refill is needed</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Active Status</FormLabel>
                            <FormDescription>Is this prescription currently active?</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save Prescription</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Prescriptions</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="refill">Needs Refill</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {filteredPrescriptions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Pill className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No prescriptions found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm || activeFilter !== null
                    ? "Try adjusting your search or filters"
                    : "Add your first prescription to get started"}
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Prescription
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredPrescriptions.map((prescription) => (
                <Card key={prescription.id} className={cn(!prescription.isActive && "opacity-70")}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {prescription.name}
                          {!prescription.isActive && (
                            <Badge variant="outline" className="ml-2">
                              Inactive
                            </Badge>
                          )}
                          {prescription.refillsRemaining <= 1 && prescription.isActive && (
                            <Badge variant="destructive" className="ml-2">
                              Refill Soon
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {prescription.dosage} - {prescription.frequency}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setPrescriptionToEdit(prescription.id)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setPrescriptionToDelete(prescription.id)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <CalendarLucide className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Start: {format(prescription.startDate, "PPP")}</span>
                        </div>
                        {prescription.endDate && (
                          <div className="flex items-center text-sm">
                            <CalendarLucide className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>End: {format(prescription.endDate, "PPP")}</span>
                          </div>
                        )}
                        <div className="flex items-center text-sm">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Doctor: {prescription.doctor}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Pharmacy: {prescription.pharmacy}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium mb-1">Notes:</div>
                          <div className="text-sm text-muted-foreground">
                            {prescription.notes || "No notes available"}
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center text-sm font-medium mb-1">
                            <span>Refills Remaining:</span>
                            <span>{prescription.refillsRemaining}</span>
                          </div>
                          <Progress value={prescription.refillsRemaining * 33.33} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center text-sm font-medium mb-1">
                            <span>Adherence:</span>
                            <span>{prescription.adherence}%</span>
                          </div>
                          <Progress value={prescription.adherence} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          {filteredPrescriptions.filter((p) => p.isActive).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Pill className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No active prescriptions found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm ? "Try adjusting your search" : "Add your first prescription to get started"}
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Prescription
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredPrescriptions
                .filter((p) => p.isActive)
                .map((prescription) => (
                  <Card key={prescription.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center">
                            {prescription.name}
                            {prescription.refillsRemaining <= 1 && (
                              <Badge variant="destructive" className="ml-2">
                                Refill Soon
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription>
                            {prescription.dosage} - {prescription.frequency}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setPrescriptionToEdit(prescription.id)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setPrescriptionToDelete(prescription.id)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <CalendarLucide className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Start: {format(prescription.startDate, "PPP")}</span>
                          </div>
                          {prescription.endDate && (
                            <div className="flex items-center text-sm">
                              <CalendarLucide className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>End: {format(prescription.endDate, "PPP")}</span>
                            </div>
                          )}
                          <div className="flex items-center text-sm">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Doctor: {prescription.doctor}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Pharmacy: {prescription.pharmacy}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm font-medium mb-1">Notes:</div>
                            <div className="text-sm text-muted-foreground">
                              {prescription.notes || "No notes available"}
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between items-center text-sm font-medium mb-1">
                              <span>Refills Remaining:</span>
                              <span>{prescription.refillsRemaining}</span>
                            </div>
                            <Progress value={prescription.refillsRemaining * 33.33} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center text-sm font-medium mb-1">
                              <span>Adherence:</span>
                              <span>{prescription.adherence}%</span>
                            </div>
                            <Progress value={prescription.adherence} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="refill" className="space-y-4">
          {filteredPrescriptions.filter((p) => p.isActive && p.refillsRemaining <= 1).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Pill className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No prescriptions need refill</p>
                <p className="text-sm text-muted-foreground mb-4">
                  All your active prescriptions have sufficient refills
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredPrescriptions
                .filter((p) => p.isActive && p.refillsRemaining <= 1)
                .map((prescription) => (
                  <Card key={prescription.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center">
                            {prescription.name}
                            <Badge variant="destructive" className="ml-2">
                              Refill Soon
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            {prescription.dosage} - {prescription.frequency}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setPrescriptionToEdit(prescription.id)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setPrescriptionToDelete(prescription.id)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <CalendarLucide className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Start: {format(prescription.startDate, "PPP")}</span>
                          </div>
                          {prescription.endDate && (
                            <div className="flex items-center text-sm">
                              <CalendarLucide className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>End: {format(prescription.endDate, "PPP")}</span>
                            </div>
                          )}
                          <div className="flex items-center text-sm">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Doctor: {prescription.doctor}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Pharmacy: {prescription.pharmacy}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm font-medium mb-1">Notes:</div>
                            <div className="text-sm text-muted-foreground">
                              {prescription.notes || "No notes available"}
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between items-center text-sm font-medium mb-1">
                              <span>Refills Remaining:</span>
                              <span>{prescription.refillsRemaining}</span>
                            </div>
                            <Progress value={prescription.refillsRemaining * 33.33} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center text-sm font-medium mb-1">
                              <span>Adherence:</span>
                              <span>{prescription.adherence}%</span>
                            </div>
                            <Progress value={prescription.adherence} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline">
                        Request Refill
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Prescription Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Prescription</DialogTitle>
            <DialogDescription>Update the details of the prescription.</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditPrescription)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medication Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {frequencyOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="doctor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prescribing Doctor</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="pharmacy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pharmacy</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="refillReminder"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Refill Reminder</FormLabel>
                        <FormDescription>Get notifications when refill is needed</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription>Is this prescription currently active?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Update Prescription</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the prescription.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePrescription}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

