"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { CalendarIcon, FileText, Plus, Search, Trash2, Edit, User, Building } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Define the schema for medical history entry
const medicalHistorySchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  date: z.date({ required_error: "Please select a date." }),
  doctor: z.string().min(2, { message: "Doctor name must be at least 2 characters." }),
  facility: z.string().min(2, { message: "Facility name must be at least 2 characters." }),
  type: z.string({ required_error: "Please select a record type." }),
  notes: z.string().optional(),
})

// Mock data for medical history
const initialMedicalHistory = [
  {
    id: 1,
    title: "Annual Physical Examination",
    date: new Date("2024-02-15"),
    doctor: "Dr. Smith",
    facility: "General Hospital",
    type: "Check-up",
    notes: "All vitals normal. Recommended more exercise and reducing salt intake.",
  },
  {
    id: 2,
    title: "Flu Vaccination",
    date: new Date("2024-01-10"),
    doctor: "Dr. Johnson",
    facility: "Community Clinic",
    type: "Vaccination",
    notes: "Seasonal flu vaccine administered. No adverse reactions.",
  },
  {
    id: 3,
    title: "Dental Cleaning",
    date: new Date("2023-12-05"),
    doctor: "Dr. Williams",
    facility: "Smile Dental Care",
    type: "Dental",
    notes: "Regular cleaning performed. No cavities found.",
  },
  {
    id: 4,
    title: "Eye Examination",
    date: new Date("2023-11-20"),
    doctor: "Dr. Brown",
    facility: "Vision Center",
    type: "Specialist",
    notes: "Vision unchanged. New prescription not needed.",
  },
  {
    id: 5,
    title: "Blood Test",
    date: new Date("2023-10-15"),
    doctor: "Dr. Davis",
    facility: "Medical Laboratory",
    type: "Test",
    notes: "Cholesterol slightly elevated. Follow-up in 3 months recommended.",
  },
]

const recordTypes = ["Check-up", "Vaccination", "Dental", "Specialist", "Test", "Surgery", "Emergency", "Other"]

export default function MedicalHistory() {
  const [medicalHistory, setMedicalHistory] = useState(initialMedicalHistory)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [recordToDelete, setRecordToDelete] = useState<number | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [recordToEdit, setRecordToEdit] = useState<number | null>(null)
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm<z.infer<typeof medicalHistorySchema>>({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: {
      title: "",
      doctor: "",
      facility: "",
      notes: "",
    },
  })

  const editForm = useForm<z.infer<typeof medicalHistorySchema>>({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: {
      title: "",
      doctor: "",
      facility: "",
      notes: "",
    },
  })

  useEffect(() => {
    if (recordToEdit !== null) {
      const record = medicalHistory.find((r) => r.id === recordToEdit)
      if (record) {
        editForm.reset({
          title: record.title,
          date: record.date,
          doctor: record.doctor,
          facility: record.facility,
          type: record.type,
          notes: record.notes || "",
        })
      }
    }
  }, [recordToEdit, medicalHistory, editForm])

  const handleAddRecord = (data: z.infer<typeof medicalHistorySchema>) => {
    const newRecord = {
      id: Math.max(0, ...medicalHistory.map((r) => r.id)) + 1,
      ...data,
    }

    setMedicalHistory([newRecord, ...medicalHistory])
    setIsAddDialogOpen(false)
    form.reset()

    toast({
      title: "Record added",
      description: "Medical record has been added successfully.",
    })
  }

  const handleEditRecord = (data: z.infer<typeof medicalHistorySchema>) => {
    if (recordToEdit === null) return

    setMedicalHistory(medicalHistory.map((record) => (record.id === recordToEdit ? { ...record, ...data } : record)))

    setIsEditDialogOpen(false)
    setRecordToEdit(null)

    toast({
      title: "Record updated",
      description: "Medical record has been updated successfully.",
    })
  }

  const handleDeleteRecord = () => {
    if (recordToDelete === null) return

    const recordToRemove = medicalHistory.find((record) => record.id === recordToDelete)
    const updatedRecords = medicalHistory.filter((record) => record.id !== recordToDelete)

    setMedicalHistory(updatedRecords)
    setIsDeleteDialogOpen(false)
    setRecordToDelete(null)

    toast({
      title: "Record deleted",
      description: "Medical record has been deleted successfully.",
      variant: "destructive",
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setMedicalHistory((prev) => [...prev, recordToRemove])
            toast({
              title: "Record restored",
              description: "Medical record has been restored successfully.",
            })
          }}
        >
          Undo
        </Button>
      ),
    })
  }

  const filteredRecords = medicalHistory.filter((record) => {
    const matchesSearch =
      searchTerm === "" ||
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.notes?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = !selectedType || record.type === selectedType

    return matchesSearch && matchesType
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
              placeholder="Search medical records..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select onValueChange={(value) => setSelectedType(value === "all" ? null : value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {recordTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add Medical Record</DialogTitle>
                <DialogDescription>Enter the details of the medical record below.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddRecord)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Annual check-up" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
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
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="doctor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Doctor</FormLabel>
                          <FormControl>
                            <Input placeholder="Dr. Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="facility"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facility</FormLabel>
                          <FormControl>
                            <Input placeholder="General Hospital" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Record Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select record type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {recordTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional notes here..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false)
                        form.reset()
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Record</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Records</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="important">Important</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {filteredRecords.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No medical records found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm || selectedType
                    ? "Try adjusting your search or filters"
                    : "Add your first medical record to get started"}
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Record
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <Card key={record.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{record.title}</CardTitle>
                        <CardDescription>
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary mt-1">
                            {record.type}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setRecordToEdit(record.id)
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
                            setRecordToDelete(record.id)
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
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Date: {format(record.date, "PPP")}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Doctor: {record.doctor}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Facility: {record.facility}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">Notes:</div>
                        <div className="text-sm text-muted-foreground break-words overflow-hidden">
                          {record.notes || "No notes available"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          {filteredRecords.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No recent records found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm || selectedType
                    ? "Try adjusting your search or filters"
                    : "Add your first medical record to get started"}
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Record
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRecords
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .slice(0, 3)
                .map((record) => (
                  <Card key={record.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{record.title}</CardTitle>
                          <CardDescription>
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary mt-1">
                              {record.type}
                            </span>
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setRecordToEdit(record.id)
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
                              setRecordToDelete(record.id)
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
                            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Date: {format(record.date, "PPP")}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Doctor: {record.doctor}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Facility: {record.facility}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-1">Notes:</div>
                          <div className="text-sm text-muted-foreground break-words overflow-hidden">
                            {record.notes || "No notes available"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="important" className="space-y-4">
          {filteredRecords.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No important records found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm || selectedType
                    ? "Try adjusting your search or filters"
                    : "Add your first medical record to get started"}
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Record
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRecords
                .filter((record) => ["Surgery", "Emergency", "Specialist"].includes(record.type))
                .map((record) => (
                  <Card key={record.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{record.title}</CardTitle>
                          <CardDescription>
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary mt-1">
                              {record.type}
                            </span>
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setRecordToEdit(record.id)
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
                              setRecordToDelete(record.id)
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
                            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Date: {format(record.date, "PPP")}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Doctor: {record.doctor}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>Facility: {record.facility}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-1">Notes:</div>
                          <div className="text-sm text-muted-foreground break-words overflow-hidden">
                            {record.notes || "No notes available"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Record Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Medical Record</DialogTitle>
            <DialogDescription>Update the details of the medical record.</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditRecord)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="doctor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctor</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="facility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility</FormLabel>
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Record Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select record type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {recordTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    editForm.reset()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Record</Button>
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
              This action cannot be undone. This will permanently delete the medical record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRecord} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

