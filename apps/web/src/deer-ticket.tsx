import type React from "react"

import { format } from "date-fns"
import { CalendarIcon, CheckCircle, Clock, User } from "lucide-react"
import { useState } from "react"

import { Badge } from "./presentation/components/ui/badge"
import { Button } from "./presentation/components/ui/button"
import { Calendar } from "./presentation/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./presentation/components/ui/card"
import { Input } from "./presentation/components/ui/input"
import { Label } from "./presentation/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "./presentation/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./presentation/components/ui/select"
import { Textarea } from "./presentation/components/ui/textarea"
import { cn } from "./utils/cn"
// Team members data
const teamMembers = [
  { id: 1, name: "Alex Johnson", skills: ["UI/UX Design", "Frontend"] },
  { id: 2, name: "Sarah Miller", skills: ["Backend", "Database"] },
  { id: 3, name: "David Chen", skills: ["Project Management", "QA"] },
  { id: 4, name: "Maria Garcia", skills: ["Full Stack", "DevOps"] },
  { id: 5, name: "James Wilson", skills: ["Mobile Development", "API Integration"] },
]

// Sample tickets data
const initialTickets: Ticket[] = [
  {
    id: 1,
    title: "Website Redesign",
    description: "Complete overhaul of company website",
    deadline: "2025-04-15",
    assignee: "Alex Johnson",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Database Migration",
    description: "Migrate from MySQL to PostgreSQL",
    deadline: "2025-03-30",
    assignee: "Sarah Miller",
    status: "Pending",
  },
  {
    id: 3,
    title: "Mobile App Development",
    description: "Create iOS and Android versions",
    deadline: "2025-05-20",
    assignee: "James Wilson",
    status: "Completed",
  },
]

type Ticket = {
  id: number
  title: string
  description: string
  deadline: string
  assignee: string
  status: "Pending" | "In Progress" | "Completed"
}

export default function ClientRequestForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>()
  const [selectedMember, setSelectedMember] = useState("")
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || !date || !selectedMember) return

    const newTicket: Ticket = {
      id: tickets.length + 1,
      title,
      description,
      deadline: format(date, "yyyy-MM-dd"),
      assignee: selectedMember,
      status: "Pending",
    }

    setTickets([...tickets, newTicket])

    // Reset form
    setTitle("")
    setDescription("")
    setDate(undefined)
    setSelectedMember("")
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Card className="mb-8 border-green-100 bg-green-50/30">
        <CardHeader className="bg-green-100/50">
          <CardTitle className="text-green-800">New Client Request</CardTitle>
          <CardDescription>Submit a new request for your project</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  placeholder="Enter project title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-green-200 focus-visible:ring-green-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-green-200 hover:bg-green-100/50 hover:text-green-800",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="rounded-md border border-green-200"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your project requirements"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] border-green-200 focus-visible:ring-green-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-member">Assign Team Member</Label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger id="team-member" className="border-green-200 focus:ring-green-500">
                  <SelectValue placeholder="Select a team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.name}>
                      <div className="flex flex-col">
                        <span>{member.name}</span>
                        <span className="text-xs text-muted-foreground">{member.skills.join(", ")}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white">
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-green-100">
        <CardHeader className="bg-green-100/50">
          <CardTitle className="text-green-800">Current Tickets</CardTitle>
          <CardDescription>View and manage all client requests</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="overflow-hidden border-green-100">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-lg">{ticket.title}</h3>
                      <Badge
                        className={cn(
                          "ml-2",
                          ticket.status === "Completed"
                            ? "bg-green-500"
                            : ticket.status === "In Progress"
                              ? "bg-amber-500"
                              : "bg-blue-500",
                        )}
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{ticket.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center">
                        <User className="mr-1 h-4 w-4 text-green-600" />
                        <span>{ticket.assignee}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-green-600" />
                        <span>Due: {ticket.deadline}</span>
                      </div>
                      {ticket.status === "Completed" && (
                        <div className="flex items-center">
                          <CheckCircle className="mr-1 h-4 w-4 text-green-600" />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

