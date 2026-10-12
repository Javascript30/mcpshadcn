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
  X,
} from 'lucide-react'

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

function Avatar({ initials, large = false }: { initials: string; large?: boolean }) {
  return (
    <span
      className={`avatar ${large ? 'avatar-large' : ''}`}
      style={{ backgroundColor: avatarColors[initials] }}
      title={initials}
    >
      {initials}
    </span>
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
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark"><Columns3 size={18} strokeWidth={2.8} /></span>
          <span>Buildflow</span>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <button className="nav-item active"><LayoutGrid size={18} /> My tasks</button>
          <button className="nav-item"><Bell size={18} /> Inbox <span className="nav-count">4</span></button>
          <button className="nav-item"><CalendarDays size={18} /> Calendar</button>
        </nav>

        <div className="nav-section">
          <p>Workspace</p>
          <button className="workspace-row"><span className="workspace-icon">A</span> Acme Inc. <ChevronDown size={14} /></button>
        </div>

        <div className="nav-section projects">
          <div className="section-heading"><p>Projects</p><button aria-label="Add project"><Plus size={15} /></button></div>
          <button className="project-row selected"><span className="project-dot violet" /> Prototype build <MoreHorizontal size={15} /></button>
          <button className="project-row"><span className="project-dot coral" /> Packing line</button>
          <button className="project-row"><span className="project-dot mint" /> Workshop tools</button>
          <button className="project-row"><span className="project-dot amber" /> Field test</button>
        </div>

        <div className="sidebar-bottom">
          <button className="nav-item"><CircleHelp size={18} /> Help & support</button>
          <button className="nav-item"><Settings size={18} /> Settings</button>
          <div className="profile">
            <Avatar initials="MP" large />
            <div><strong>Maya Patel</strong><span>maya@acme.co</span></div>
            <MoreHorizontal size={17} />
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <label className="search">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search anything..." />
            <kbd>⌘ K</kbd>
          </label>
          <div className="top-actions">
            <button className="icon-button" onClick={() => notify('No new notifications')} aria-label="Notifications"><Bell size={19} /><span /></button>
            <button className="invite-button" onClick={() => notify('Invite link copied')}><Users size={17} /> Invite</button>
            <Avatar initials="MP" large />
          </div>
        </header>

        <section className="content">
          <div className="project-header">
            <div>
              <div className="eyebrow"><span>Projects</span><span>/</span><span>Prototype build</span></div>
              <div className="title-row">
                <h1>Prototype build</h1>
                <button className="star-button" aria-label="Favorite project"><Star size={19} /></button>
              </div>
              <p>Track the hardware prototype from bench to packaging.</p>
            </div>
            <div className="project-actions">
              <div className="avatar-stack">
                {['MP', 'AK', 'JL', 'TD'].map((person) => <Avatar key={person} initials={person} />)}
                <span className="avatar-more">+3</span>
              </div>
              <button className="share-button" onClick={() => notify('Project link copied')}><Share2 size={16} /> Share</button>
              <button className="new-task-button" onClick={() => setShowNewTask(true)}><Plus size={17} /> New task</button>
            </div>
          </div>

          <div className="board-toolbar">
            <div className="view-tabs">
              <button className="selected"><LayoutGrid size={16} /> Board</button>
              <button><List size={16} /> List</button>
              <button><CalendarDays size={16} /> Timeline</button>
            </div>
            <div className="toolbar-right">
              <span className="summary">{completed} of {totalTasks} complete</span>
              <div className="filter-menu">
                <Filter size={15} />
                <select value={activeFilter} onChange={(event) => setActiveFilter(event.target.value as Priority | 'All')}>
                  <option>All</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <button className="more-button"><MoreHorizontal size={18} /></button>
            </div>
          </div>

          <div className="board">
            {visibleColumns.map((column, columnIndex) => (
              <section className={`kanban-column column-${column.id}`} key={column.id}>
                <div className="column-header">
                  <div><span className="status-dot" /><h2>{column.title}</h2><span className="task-count">{column.tasks.length}</span></div>
                  <div><button aria-label={`Add to ${column.title}`} onClick={() => setShowNewTask(true)}><Plus size={17} /></button><button aria-label="Column options"><MoreHorizontal size={18} /></button></div>
                </div>
                <div className="task-list">
                  {column.tasks.map((task, index) => (
                    <article className={`task-card style-${(index + columnIndex) % 4} ${task.accent ?? ''}`} key={task.id}>
                      {task.accent === 'feature' && <div className="card-visual"><Sparkles size={25} /><span>Prototype bench</span></div>}
                      {task.accent === 'prototype' && <div className="prototype-banner"><span /><span /><span /></div>}
                      <div className="task-top">
                        <span className={`category category-${task.category.toLowerCase()}`}>{task.category}</span>
                        <button aria-label="Task options"><MoreHorizontal size={18} /></button>
                      </div>
                      <h3>{task.title}</h3>
                      {task.accent === 'note' && <p className="task-note">Compare hinge spacing, foam inserts, and mounting points.</p>}
                      <div className="task-details">
                        <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                        <span className={`due ${task.due === 'Today' ? 'urgent' : ''}`}>
                          {task.completed ? <Check size={14} /> : <Clock3 size={14} />}
                          {task.due}
                        </span>
                      </div>
                      <div className="task-footer">
                        <div className="mini-avatars">{task.assignees.map((person) => <Avatar key={person} initials={person} />)}</div>
                        <div className="task-stats">
                          {task.attachments > 0 && <span><Paperclip size={14} />{task.attachments}</span>}
                          <span><MessageCircle size={14} />{task.comments}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                  <button className="add-card" onClick={() => setShowNewTask(true)}><Plus size={16} /> Add task</button>
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>

      {showNewTask && (
        <div className="modal-backdrop" onMouseDown={() => setShowNewTask(false)}>
          <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowNewTask(false)}><X size={19} /></button>
            <span className="modal-kicker">QUICK CAPTURE</span>
            <h2>Create a build step</h2>
            <p>This demo adds a hardcoded task to the backlog.</p>
            <label>Build item<input defaultValue="Untitled build task" /></label>
            <div className="modal-actions">
              <button onClick={() => setShowNewTask(false)}>Cancel</button>
              <button onClick={addTask}><Plus size={16} /> Create task</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast"><Check size={17} />{toast}</div>}
    </div>
  )
}

export default App
