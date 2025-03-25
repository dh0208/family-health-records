"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Phone, Plus, Search, Trash2, Edit, MapPin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"

// Define the schema for emergency contact
const emergencyContactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  relationship: z.string().min(1, { message: "Relationship is required." }),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  alternatePhone: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal("")),
  address: z.string().optional(),
  notes: z.string().optional(),
  isPrimary: z.boolean().default(false),
})

// Mock data for emergency contacts
const initialEmergencyContacts = [
  {
    id: 1,
    name: "Jane Doe",
    relationship: "Spouse",
    phoneNumber: "555-123-4567",
    alternatePhone: "555-987-6543",
    email: "jane.doe@example.com",
    address: "123 Main St, Anytown, USA",
    notes: "Has keys to the house. Knows medical history.",
    isPrimary: true,
  },
  {
    id: 2,
    name: "John Smith",
    relationship: "Brother",
    phoneNumber: "555-234-5678",
    alternatePhone: "",
    email: "john.smith@example.com",
    address: "456 Oak Ave, Somewhere, USA",
    notes: "Doctor - can provide medical advice if needed.",
    isPrimary: false,
  },
  {
    id: 3,
    name: "Sarah Johnson",
    relationship: "Friend",
    phoneNumber: "555-345-6789",
    alternatePhone: "555-456-7890",
    email: "sarah.j@example.com",
    address: "789 Pine St, Elsewhere, USA",
    notes: "Lives nearby. Can respond quickly in emergencies.",
    isPrimary: false,
  },
  {
    id: 4,
    name: "Dr. Williams",
    relationship: "Primary Physician",
    phoneNumber: "555-456-7890",
    alternatePhone: "555-567-8901",
    email: "dr.williams@example.com",
    address: "Medical Center, 101 Health Blvd, Anytown, USA",
    notes: "Primary care physician. Call for medical emergencies.",
    isPrimary: false,
  },
  {
    id: 5,
    name: "Michael Brown",
    relationship: "Neighbor",
    phoneNumber: "555-567-8901",
    alternatePhone: "",
    email: "michael.b@example.com",
    address: "125 Main St, Anytown, USA",
    notes: "Has spare key. Can check on house/pets if needed.",
    isPrimary: false,
  },
]

const relationshipOptions = [
  "Spouse",
  "Parent",
  "Child",
  "Sibling",
  "Friend",
  "Neighbor",
  "Relative",
  "Caregiver",
  "Doctor",
  "Primary Physician",
  "Other",
]

export default function EmergencyContacts() {
  const [emergencyContacts, setEmergencyContacts] = useState(initialEmergencyContacts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<number | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [contactToEdit, setContactToEdit] = useState<number | null>(null)
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm<z.infer<typeof emergencyContactSchema>>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: {
      name: "",
      relationship: "",
      phoneNumber: "",
      alternatePhone: "",
      email: "",
      address: "",
      notes: "",
      isPrimary: false,
    },
  })

  const editForm = useForm<z.infer<typeof emergencyContactSchema>>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: {
      name: "",
      relationship: "",
      phoneNumber: "",
      alternatePhone: "",
      email: "",
      address: "",
      notes: "",
      isPrimary: false,
    },
  })

  useEffect(() => {
    if (contactToEdit !== null) {
      const contact = emergencyContacts.find((c) => c.id === contactToEdit)
      if (contact) {
        editForm.reset({
          name: contact.name,
          relationship: contact.relationship,
          phoneNumber: contact.phoneNumber,
          alternatePhone: contact.alternatePhone || "",
          email: contact.email || "",
          address: contact.address || "",
          notes: contact.notes || "",
          isPrimary: contact.isPrimary,
        })
      }
    }
  }, [contactToEdit, emergencyContacts, editForm])

  const handleAddContact = (data: z.infer<typeof emergencyContactSchema>) => {
    // If the new contact is primary, update all other contacts to not be primary
    let updatedContacts = [...emergencyContacts]
    if (data.isPrimary) {
      updatedContacts = updatedContacts.map((contact) => ({
        ...contact,
        isPrimary: false,
      }))
    }

    const newContact = {
      id: Math.max(0, ...emergencyContacts.map((c) => c.id)) + 1,
      ...data,
    }

    setEmergencyContacts([newContact, ...updatedContacts])
    setIsAddDialogOpen(false)
    form.reset()

    toast({
      title: "Contact added",
      description: "Emergency contact has been added successfully.",
    })
  }

  const handleEditContact = (data: z.infer<typeof emergencyContactSchema>) => {
    if (contactToEdit === null) return

    // If the edited contact is being set as primary, update all other contacts
    let updatedContacts = [...emergencyContacts]
    if (data.isPrimary) {
      updatedContacts = updatedContacts.map((contact) => ({
        ...contact,
        isPrimary: contact.id === contactToEdit ? true : false,
      }))
    } else {
      // If this was the primary and is being unset, we need to handle that
      const wasThisPrimary = emergencyContacts.find((c) => c.id === contactToEdit)?.isPrimary
      updatedContacts = updatedContacts.map((contact) => ({
        ...contact,
        isPrimary: contact.id === contactToEdit ? data.isPrimary : contact.isPrimary,
      }))
    }

    setEmergencyContacts(
      updatedContacts.map((contact) => (contact.id === contactToEdit ? { ...contact, ...data } : contact)),
    )

    setIsEditDialogOpen(false)
    setContactToEdit(null)

    toast({
      title: "Contact updated",
      description: "Emergency contact has been updated successfully.",
    })
  }

  const handleDeleteContact = () => {
    if (contactToDelete === null) return

    setEmergencyContacts(emergencyContacts.filter((contact) => contact.id !== contactToDelete))
    setIsDeleteDialogOpen(false)
    setContactToDelete(null)

    toast({
      title: "Contact deleted",
      description: "Emergency contact has been deleted successfully.",
      variant: "destructive",
    })
  }

  const filteredContacts = emergencyContacts.filter((contact) => {
    return (
      searchTerm === "" ||
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.relationship.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    )
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
              placeholder="Search emergency contacts..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add Emergency Contact</DialogTitle>
              <DialogDescription>Enter the details of the emergency contact below.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddContact)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {relationshipOptions.map((option) => (
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
                  <FormField
                    control={form.control}
                    name="isPrimary"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-7">
                        <div className="space-y-0.5">
                          <FormLabel>Primary Contact</FormLabel>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="555-123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="alternatePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternate Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="555-987-6543" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, Anytown, USA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Any additional information" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Save Contact</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {filteredContacts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Phone className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No emergency contacts found</p>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm ? "Try adjusting your search" : "Add your first emergency contact to get started"}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className={contact.isPrimary ? "border-primary" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        {contact.name}
                        {contact.isPrimary && <Badge className="ml-2">Primary</Badge>}
                      </CardTitle>
                      <CardDescription>{contact.relationship}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setContactToEdit(contact.id)
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
                          setContactToDelete(contact.id)
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
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{contact.phoneNumber}</span>
                    </div>
                    {contact.alternatePhone && (
                      <div className="flex items-center text-sm">
                        <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{contact.alternatePhone} (Alternate)</span>
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-center text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2 h-4 w-4 text-muted-foreground"
                        >
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        <span>{contact.email}</span>
                      </div>
                    )}
                    {contact.address && (
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{contact.address}</span>
                      </div>
                    )}
                    {contact.notes && (
                      <div className="flex items-start text-sm mt-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0 mt-1"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span>{contact.notes}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" asChild>
                    <a href={`tel:${contact.phoneNumber.replace(/[^0-9]/g, "")}`}>
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Contact Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Emergency Contact</DialogTitle>
            <DialogDescription>Update the details of the emergency contact.</DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditContact)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
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
                  name="relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {relationshipOptions.map((option) => (
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
                <FormField
                  control={editForm.control}
                  name="isPrimary"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-7">
                      <div className="space-y-0.5">
                        <FormLabel>Primary Contact</FormLabel>
                      </div>
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="alternatePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternate Phone (Optional)</FormLabel>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update Contact</Button>
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
              This action cannot be undone. This will permanently delete the emergency contact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteContact} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

