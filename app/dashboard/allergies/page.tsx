"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { CalendarIcon, AlertTriangle, Plus, Search, Trash2, Edit, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"

// Define the schema for allergy
const allergySchema = z.object({
  name: z.string().min(2, { message: "Allergy name must be at least 2 characters." }),
  type: z.string().min(1, { message: "Type is required." }),
  severity: z.enum(["Mild", "Moderate", "Severe"], {
    required_error: "Please select a severity level.",
  }),
  symptoms: z.string().min(1, { message: "Symptoms are required." }),
  dateIdentified: z.date({ required_error: "Date identified is required." }),
  diagnosedBy: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
})

// Mock data for allergies
const initialAllergies = [
  {
    id: 1,
    name: "Peanuts",
    type: "Food",
    severity: "Severe",
    symptoms: "Hives, swelling, difficulty breathing",
    dateIdentified: new Date("2020-05-15"),
    diagnosedBy: "Dr. Smith",
    treatment: "Avoid all peanut products. Carry EpiPen at all times.",
    notes: "Had severe reaction requiring hospitalization in 2020.",
  },
  {
    id: 2,
    name: "Penicillin",
    type: "Medication",
    severity: "Moderate",
    symptoms: "Rash, itching, fever",
    dateIdentified: new Date("2018-10-22"),
    diagnosedBy: "Dr. Johnson",
    treatment: "Avoid penicillin and related antibiotics.",
    notes: "Alternative antibiotics must be used.",
  },
  {
    id: 3,
    name: "Dust Mites",
    type: "Environmental",
    severity: "Mild",
    symptoms: "Sneezing, runny nose, itchy eyes",
    dateIdentified: new Date("2019-03-10"),
    diagnosedBy: "Dr. Williams",
    treatment: "Antihistamines as needed. Use allergen-proof bedding.",
    notes: "Symptoms worse during spring cleaning.",
  },
  {
    id: 4,
    name: "Latex",
    type: "Other",
    severity: "Moderate",
    symptoms: "Contact dermatitis, itching, redness",
    dateIdentified: new Date("2021-01-05"),
    diagnosedBy: "Dr. Brown",
    treatment: "Avoid latex products. Use latex-free alternatives.",
    notes: "Inform healthcare providers before procedures.",
  },
]

const allergyTypes = ["Food", "Medication", "Environmental", "Insect", "Animal", "Other"]

export default function Allergies() {
  const [allergies, setAllergies] = useState(initialAllergies)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [allergyToDelete, setAllergyToDelete] = useState<number | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [allergyToEdit, setAllergyToEdit] = useState<number | null>(null)
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm<z.infer<typeof allergySchema>>({
    resolver: zodResolver(allergySchema),
    defaultValues: {
      name: "",
      type: "",
      severity: "Mild",
      symptoms: "",
      diagnosedBy: "",
      treatment: "",
      notes: "",
    },
  })

  const editForm = useForm<z.infer<typeof allergySchema>>({
    resolver: zodResolver(allergySchema),
    defaultValues: {
      name: "",
      type: "",
      severity: "Mild",
      symptoms: "",
      diagnosedBy: "",
      treatment: "",
      notes: "",
    },
  })

  useEffect(() => {
    if (allergyToEdit !== null) {
      const allergy = allergies.find((a) => a.id === allergyToEdit)
      if (allergy) {
        editForm.reset({
          name: allergy.name,
          type: allergy.type,
          severity: allergy.severity as "Mild" | "Moderate" | "Severe",
          symptoms: allergy.symptoms,
          dateIdentified: allergy.dateIdentified,
          diagnosedBy: allergy.diagnosedBy || "",
          treatment: allergy.treatment || "",
          notes: allergy.notes || "",
        })
      }
    }
  }, [allergyToEdit, allergies, editForm])

  const handleAddAllergy = (data: z.infer<typeof allergySchema>) => {
    const newAllergy = {
      id: Math.max(0, ...allergies.map((a) => a.id)) + 1,
      ...data,
    }

    setAllergies([newAllergy, ...allergies])
    setIsAddDialogOpen(false)
    form.reset()

    toast({
      title: "Allergy added",
      description: "Allergy has been added successfully.",
    })
  }

  const handleEditAllergy = (data: z.infer<typeof allergySchema>) => {
    if (allergyToEdit === null) return

    setAllergies(allergies.map((allergy) => (allergy.id === allergyToEdit ? { ...allergy, ...data } : allergy)))

    setIsEditDialogOpen(false)
    setAllergyToEdit(null)

    toast({
      title: "Allergy updated",
      description: "Allergy has been updated successfully.",
    })
  }

  const handleDeleteAllergy = () => {
    if (allergyToDelete === null) return

    setAllergies(allergies.filter((allergy) => allergy.id !== allergyToDelete))
    setIsDeleteDialogOpen(false)
    setAllergyToDelete(null)

    toast({
      title: "Allergy deleted",
      description: "Allergy has been deleted successfully.",
      variant: "destructive",
    })
  }

  const filteredAllergies = allergies.filter((allergy) => {
    const matchesSearch =
      searchTerm === "" ||
      allergy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allergy.symptoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allergy.treatment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allergy.notes?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedType === null || allergy.type === selectedType
    const matchesSeverity = selectedSeverity === null || allergy.severity === selectedSeverity

    return matchesSearch && matchesType && matchesSeverity
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Mild":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Severe":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

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
              placeholder="Search allergies..."
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
              {allergyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setSelectedSeverity(value === "all" ? null : value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="Mild">Mild</SelectItem>
              <SelectItem value="Moderate">Moderate</SelectItem>
              <SelectItem value="Severe">Severe</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Allergy
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add Allergy</DialogTitle>
                <DialogDescription>Enter the details of the allergy below.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddAllergy)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allergy Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Peanuts" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {allergyTypes.map((type) => (
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
                      name="severity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Severity</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select severity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Mild">Mild</SelectItem>
                              <SelectItem value="Moderate">Moderate</SelectItem>
                              <SelectItem value="Severe">Severe</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="symptoms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symptoms</FormLabel>
                        <FormControl>
                          <Input placeholder="Hives, swelling, difficulty breathing" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateIdentified"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date Identified</FormLabel>
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
                              disabled={(date) => date > new Date()}
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
                      name="diagnosedBy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Diagnosed By (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Dr. Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="treatment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Treatment (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Avoid all peanut products" {...field} />
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
                        <FormLabel>Notes (Optional)</FormLabel>
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
                  <DialogFooter>
                    <Button type="submit">Save Allergy</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredAllergies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No allergies found</p>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm || selectedType || selectedSeverity
                ? "Try adjusting your search or filters"
                : "Add your first allergy to get started"}
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Allergy
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAllergies.map((allergy) => (
            <Card
              key={allergy.id}
              className={allergy.severity === "Severe" ? "border-red-500 dark:border-red-700" : ""}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      {allergy.name}
                      <Badge className={`ml-2 ${getSeverityColor(allergy.severity)}`}>{allergy.severity}</Badge>
                    </CardTitle>
                    <CardDescription>
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary mt-1">
                        {allergy.type}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setAllergyToEdit(allergy.id)
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
                        setAllergyToDelete(allergy.id)
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
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium mb-1">Symptoms:</div>
                    <div className="text-sm text-muted-foreground">{allergy.symptoms}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Identified: {format(allergy.dateIdentified, "PPP")}</span>
                      </div>
                      {allergy.diagnosedBy && (
                        <div className="flex items-center text-sm">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>Diagnosed by: {allergy.diagnosedBy}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      {allergy.treatment && (
                        <div>
                          <div className="text-sm font-medium mb-1">Treatment:</div>
                          <div className="text-sm text-muted-foreground">{allergy.treatment}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  {allergy.notes && (
                    <div>
                      <div className="text-sm font-medium mb-1">Notes:</div>
                      <div className="text-sm text-muted-foreground">{allergy.notes}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Allergy Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Allergy</DialogTitle>
            <DialogDescription>Update the details of the allergy.</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditAllergy)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergy Name</FormLabel>
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {allergyTypes.map((type) => (
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
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Mild">Mild</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Severe">Severe</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptoms</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="dateIdentified"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date Identified</FormLabel>
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
                          disabled={(date) => date > new Date()}
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
                  name="diagnosedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnosed By (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="treatment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treatment (Optional)</FormLabel>
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
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update Allergy</Button>
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
              This action cannot be undone. This will permanently delete the allergy record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAllergy} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

