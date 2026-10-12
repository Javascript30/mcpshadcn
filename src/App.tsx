import { useMemo, useState } from 'react'
import {
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Columns3,
  Filter,
  LayoutGrid,
  List,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Settings,
  Share2,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

type Priority = 'High' | 'Medium' | 'Low'
type ColumnId = 'backlog' | 'progress' | 'review' | 'done'

type Task = {
  id: number
  title: string
  category: string
  priority: Priority
  due: string
  comments: number
  attachments: number
  assignees: string[]
  accent?: string
  completed?: boolean
}

type Column = {
  id: ColumnId
  title: string
  tasks: Task[]
}

const initialColumns: Column[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    tasks: [
      {
        id: 101,
        title: 'Prototype the main handle bracket',
        category: 'Fabrication',
        priority: 'High',
        due: 'Sep 2',
        comments: 4,
        attachments: 2,
        assignees: ['MP', 'JL'],
      },
      {
        id: 102,
        title: 'Map the packaging foam layout',
        category: 'Packaging',
        priority: 'Medium',
        due: 'Sep 5',
        comments: 7,
        attachments: 1,
        assignees: ['AK'],
        accent: 'note',
      },
      {
        id: 103,
        title: 'Inspect the first cast housing',
        category: 'Assembly',
        priority: 'Low',
        due: 'Sep 8',
        comments: 2,
        attachments: 0,
        assignees: ['RB'],
      },
    ],
  },
  {
    id: 'progress',
    title: 'In progress',
    tasks: [
      {
        id: 201,
        title: 'Test the wheel axle rotation',
        category: 'Testing',
        priority: 'High',
        due: 'Today',
        comments: 12,
        attachments: 5,
        assignees: ['AK', 'MP', 'JL'],
        accent: 'feature',
      },
      {
        id: 202,
        title: 'Pre-fit the rubber grip ring',
        category: 'Materials',
        priority: 'Medium',
        due: 'Sep 4',
        comments: 5,
        attachments: 3,
        assignees: ['TD', 'RB'],
      },
      {
        id: 203,
        title: 'Measure vibration on the frame',
        category: 'Engineering',
        priority: 'Medium',
        due: 'Sep 6',
        comments: 9,
        attachments: 4,
        assignees: ['JL'],
      },
    ],
  },
  {
    id: 'review',
    title: 'In review',
    tasks: [
      {
        id: 301,
        title: 'Review final shell tolerances',
        category: 'Quality',
        priority: 'High',
        due: 'Tomorrow',
        comments: 16,
        attachments: 8,
        assignees: ['MP', 'AK'],
        accent: 'prototype',
      },
      {
        id: 302,
        title: 'Check the bolt torque guide',
        category: 'Assembly',
        priority: 'Low',
        due: 'Sep 7',
        comments: 3,
        attachments: 2,
        assignees: ['TD'],
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      {
        id: 401,
        title: 'Finish the first prototype run',
        category: 'Production',
        priority: 'High',
        due: 'Jul 28',
        comments: 8,
        attachments: 6,
        assignees: ['RB', 'TD'],
        completed: true,
      },
      {
        id: 402,
        title: 'Label the tool trays',
        category: 'Workshop',
        priority: 'Medium',
        due: 'Jul 26',
        comments: 4,
        attachments: 9,
        assignees: ['AK'],
        completed: true,
      },
      {
        id: 403,
        title: 'Log the test stand feedback',
        category: 'Research',
        priority: 'Low',
        due: 'Jul 24',
        comments: 11,
        attachments: 2,
        assignees: ['JL', 'MP'],
        completed: true,
      },
    ],
  },
]

const avatarColors: Record<string, string> = {
  MP: '#f3a46b',
  JL: '#6457e8',
  AK: '#ea6d8c',
  RB: '#1ba59c',
  TD: '#437bc1',
}

const priorityTone: Record<Priority, string> = {
  High: 'border-red-200 bg-red-50 text-red-700',
  Medium: 'border-amber-200 bg-amber-50 text-amber-700',
  Low: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

const columnTone: Record<ColumnId, string> = {
  backlog: 'bg-slate-500',
  progress: 'bg-blue-500',
  review: 'bg-amber-500',
  done: 'bg-emerald-500',
}

function Avatar({ initials, large = false }: { initials: string; large?: boolean }) {
  return (
    <span
      className={cn('avatar', large && 'avatar-large')}
      style={{ backgroundColor: avatarColors[initials] }}
      title={initials}
    >
      {initials}
    </span>
  )
}

function MoreMenu({ label = 'Options' }: { label?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={label} />}>
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>No actions available</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function App() {
  const [columns, setColumns] = useState(initialColumns)
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<Priority | 'All'>('All')
  const [toast, setToast] = useState('')
  const [showNewTask, setShowNewTask] = useState(false)

  const totalTasks = columns.reduce((total, column) => total + column.tasks.length, 0)
  const completed = columns.find((column) => column.id === 'done')?.tasks.length ?? 0

  const visibleColumns = useMemo(
    () =>
      columns.map((column) => ({
        ...column,
        tasks: column.tasks.filter(
          (task) =>
            (activeFilter === 'All' || task.priority === activeFilter) &&
            (task.title.toLowerCase().includes(query.toLowerCase()) ||
              task.category.toLowerCase().includes(query.toLowerCase())),
        ),
      })),
    [activeFilter, columns, query],
  )

  function notify(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  function addTask() {
    setColumns((current) =>
      current.map((column) =>
        column.id === 'backlog'
          ? {
              ...column,
              tasks: [
                ...column.tasks,
                {
                  id: Date.now(),
                  title: 'Untitled build task',
                  category: 'Planning',
                  priority: 'Medium',
                  due: 'Aug 12',
                  comments: 0,
                  attachments: 0,
                  assignees: ['MP'],
                },
              ],
            }
          : column,
      ),
    )
    setShowNewTask(false)
    notify('New task added to Backlog')
  }

  return (
    <div className="min-h-svh bg-muted/30 text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r bg-background/95 p-4 lg:flex lg:flex-col">
        <div className="mb-8 flex items-center gap-3 px-2">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Columns3 size={18} strokeWidth={2.8} />
          </span>
          <span className="text-lg font-semibold">Buildflow</span>
        </div>

        <nav className="grid gap-1" aria-label="Main navigation">
          <Button className="justify-start" variant="secondary">
            <LayoutGrid /> My tasks
          </Button>
          <Button className="justify-start" variant="ghost">
            <Bell /> Inbox <Badge className="ml-auto">4</Badge>
          </Button>
          <Button className="justify-start" variant="ghost">
            <CalendarDays /> Calendar
          </Button>
        </nav>

        <div className="mt-8 space-y-3">
          <p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Workspace</p>
          <Button className="w-full justify-start" variant="outline">
            <span className="grid size-7 place-items-center rounded-md bg-foreground text-xs font-bold text-background">A</span>
            Acme Inc.
            <ChevronDown className="ml-auto" />
          </Button>
        </div>

        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between px-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Projects</p>
            <Button aria-label="Add project" size="icon-xs" variant="ghost">
              <Plus />
            </Button>
          </div>
          <div className="grid gap-1">
            <Button className="justify-start bg-muted text-foreground" variant="secondary">
              <span className="size-2.5 rounded-full bg-violet-500" /> Prototype build <MoreHorizontal className="ml-auto" />
            </Button>
            <Button className="justify-start" variant="ghost">
              <span className="size-2.5 rounded-full bg-red-400" /> Packing line
            </Button>
            <Button className="justify-start" variant="ghost">
              <span className="size-2.5 rounded-full bg-emerald-500" /> Workshop tools
            </Button>
            <Button className="justify-start" variant="ghost">
              <span className="size-2.5 rounded-full bg-amber-500" /> Field test
            </Button>
          </div>
        </div>

        <div className="mt-auto space-y-2">
          <Button className="justify-start" variant="ghost">
            <CircleHelp /> Help & support
          </Button>
          <Button className="justify-start" variant="ghost">
            <Settings /> Settings
          </Button>
          <Separator />
          <div className="flex items-center gap-3 px-2 pt-2">
            <Avatar initials="MP" large />
            <div className="min-w-0 flex-1">
              <strong className="block truncate text-sm">Maya Patel</strong>
              <span className="block truncate text-xs text-muted-foreground">maya@acme.co</span>
            </div>
            <MoreMenu label="Profile options" />
          </div>
        </div>
      </aside>

      <main className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b bg-background/90 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Label className="relative block w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-10 pl-9 pr-16"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search anything..."
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                Ctrl K
              </kbd>
            </Label>
            <div className="flex items-center gap-2">
              <Button onClick={() => notify('No new notifications')} aria-label="Notifications" size="icon-lg" variant="outline">
                <Bell />
              </Button>
              <Button onClick={() => notify('Invite link copied')} variant="outline">
                <Users /> Invite
              </Button>
              <Avatar initials="MP" large />
            </div>
          </div>
        </header>

        <section className="space-y-6 p-4 md:p-6">
          <Card>
            <CardHeader className="gap-4 md:flex md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <CardDescription>Projects / Prototype build</CardDescription>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl font-semibold md:text-3xl">Prototype build</CardTitle>
                  <Button aria-label="Favorite project" size="icon-sm" variant="ghost">
                    <Star className="text-amber-500" />
                  </Button>
                </div>
                <CardDescription>Track the hardware prototype from bench to packaging.</CardDescription>
              </div>
              <CardAction className="static col-auto row-auto flex flex-wrap items-center gap-2 self-auto justify-self-auto">
                <div className="avatar-stack">
                  {['MP', 'AK', 'JL', 'TD'].map((person) => (
                    <Avatar key={person} initials={person} />
                  ))}
                  <span className="avatar-more">+3</span>
                </div>
                <Button onClick={() => notify('Project link copied')} variant="outline">
                  <Share2 /> Share
                </Button>
                <Button onClick={() => setShowNewTask(true)}>
                  <Plus /> New task
                </Button>
              </CardAction>
            </CardHeader>
          </Card>

          <div className="flex flex-col gap-3 border-b pb-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex gap-2 overflow-x-auto">
              <Button variant="secondary">
                <LayoutGrid /> Board
              </Button>
              <Button variant="ghost">
                <List /> List
              </Button>
              <Button variant="ghost">
                <CalendarDays /> Timeline
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {completed} of {totalTasks} complete
              </span>
              <Select
                value={activeFilter}
                onValueChange={(value) => {
                  if (value) {
                    setActiveFilter(value as Priority | 'All')
                  }
                }}
              >
                <SelectTrigger aria-label="Filter by priority" className="w-36">
                  <Filter className="size-4 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <MoreMenu label="Board options" />
            </div>
          </div>

          <div className="grid gap-4 overflow-x-auto pb-2 xl:grid-cols-4">
            {visibleColumns.map((column) => (
              <section className="min-w-[18rem] space-y-3" key={column.id}>
                <div className="flex h-10 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn('size-2.5 rounded-full', columnTone[column.id])} />
                    <h2 className="text-sm font-semibold">{column.title}</h2>
                    <Badge variant="secondary">{column.tasks.length}</Badge>
                  </div>
                  <div className="flex items-center">
                    <Button aria-label={`Add to ${column.title}`} onClick={() => setShowNewTask(true)} size="icon-sm" variant="ghost">
                      <Plus />
                    </Button>
                    <MoreMenu label={`${column.title} options`} />
                  </div>
                </div>
                <div className="grid gap-3 rounded-xl border bg-muted/40 p-3">
                  {column.tasks.map((task) => (
                    <Card className="bg-background shadow-sm" key={task.id} size="sm">
                      {task.accent === 'feature' && (
                        <div className="mx-3 -mt-1 flex h-20 items-end justify-between rounded-lg bg-primary p-3 text-primary-foreground">
                          <Sparkles size={24} />
                          <span className="text-xs font-medium">Prototype bench</span>
                        </div>
                      )}
                      {task.accent === 'prototype' && (
                        <div className="mx-3 -mt-1 flex h-14 items-end gap-2 rounded-lg bg-foreground p-3">
                          <span className="h-1/2 flex-1 rounded-sm bg-violet-400" />
                          <span className="h-full flex-1 rounded-sm bg-amber-400" />
                          <span className="h-3/4 flex-1 rounded-sm bg-red-300" />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <Badge variant="outline">{task.category}</Badge>
                          <MoreMenu label="Task options" />
                        </div>
                        <CardTitle>{task.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {task.accent === 'note' && (
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            Compare hinge spacing, foam inserts, and mounting points.
                          </p>
                        )}
                        <div className="flex items-center justify-between gap-2">
                          <Badge className={priorityTone[task.priority]} variant="outline">
                            {task.priority}
                          </Badge>
                          <Badge className={cn(task.due === 'Today' && 'border-red-200 bg-red-50 text-red-700')} variant="outline">
                            {task.completed ? <Check /> : <Clock3 />}
                            {task.due}
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="justify-between">
                        <div className="mini-avatars">
                          {task.assignees.map((person) => (
                            <Avatar key={person} initials={person} />
                          ))}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {task.attachments > 0 && (
                            <span className="flex items-center gap-1">
                              <Paperclip size={14} />
                              {task.attachments}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <MessageCircle size={14} />
                            {task.comments}
                          </span>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                  <Button className="border-dashed" onClick={() => setShowNewTask(true)} variant="outline">
                    <Plus /> Add task
                  </Button>
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>

      <Dialog open={showNewTask} onOpenChange={setShowNewTask}>
        <DialogContent>
          <DialogHeader>
            <Badge className="w-fit" variant="secondary">Quick capture</Badge>
            <DialogTitle>Create a build step</DialogTitle>
            <DialogDescription>This demo adds a hardcoded task to the backlog.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="build-item">Build item</Label>
            <Input id="build-item" defaultValue="Untitled build task" />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowNewTask(false)} variant="outline">Cancel</Button>
            <Button onClick={addTask}>
              <Plus /> Create task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-foreground px-4 py-3 text-sm text-background shadow-lg">
          <Check size={17} />
          {toast}
        </div>
      )}
    </div>
  )
}

export default App
