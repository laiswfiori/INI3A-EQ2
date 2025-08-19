type TaskCategory = 
  | "assignment"
  | "exam"
  | "project"
  | "reading"
  | "thesis"
  | "meeting"
  | "other";

type TaskPriority = "low" | "medium" | "high";

type TaskStatus = "todo" | "in-progress" | "completed";

interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  course?: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedHours?: number;
  completedHours?: number;
  attachments?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  category: TaskCategory;
  taskId?: string;
}

interface StudySession {
  id: string;
  taskId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  completed: boolean;
}

interface StudyPlan {
  id: string;
  userId: string;
  weekStart: string;
  weekEnd: string;
  sessions: StudySession[];
  createdAt: string;
}

interface AcademicResource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  createdAt: string;
}

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Research Paper on Quantum Computing",
    description: "Write a 10-page research paper on quantum computing applications in cryptography",
    category: "assignment",
    course: "CS 401: Advanced Computing Concepts",
    dueDate: "2025-05-15T23:59:59Z",
    priority: "high",
    status: "in-progress",
    estimatedHours: 20,
    completedHours: 8,
    attachments: [],
    notes: "Need to include at least 15 references",
    createdAt: "2025-04-20T14:23:10Z",
    updatedAt: "2025-04-25T09:15:42Z",
  },
  {
    id: "task-2",
    title: "Midterm Exam: Statistics",
    description: "Covers chapters 1-7 from the textbook, focus on regression analysis and hypothesis testing",
    category: "exam",
    course: "MATH 302: Statistical Methods",
    dueDate: "2025-05-10T10:00:00Z",
    priority: "high",
    status: "todo",
    estimatedHours: 15,
    completedHours: 5,
    attachments: [],
    notes: "Review practice problems from chapters 3 and 5",
    createdAt: "2025-04-15T08:30:00Z",
    updatedAt: "2025-04-22T16:45:12Z",
  },
  {
    id: "task-3",
    title: "Group Project Presentation",
    description: "Prepare and deliver a 15-minute presentation on market analysis findings",
    category: "project",
    course: "BUS 250: Marketing Fundamentals",
    dueDate: "2025-05-08T14:30:00Z",
    priority: "medium",
    status: "todo",
    estimatedHours: 10,
    completedHours: 2,
    attachments: [],
    notes: "Need to coordinate with team members for slide preparation",
    createdAt: "2025-04-10T11:20:33Z",
    updatedAt: "2025-04-21T13:10:05Z",
  },
  {
    id: "task-4",
    title: "Psychology Reading Assignment",
    description: "Read chapters 8-10 on cognitive development",
    category: "reading",
    course: "PSYC 201: Developmental Psychology",
    dueDate: "2025-05-03T23:59:59Z",
    priority: "low",
    status: "completed",
    estimatedHours: 6,
    completedHours: 6,
    attachments: [],
    notes: "Take notes on key theories and researchers",
    createdAt: "2025-04-01T10:00:00Z",
    updatedAt: "2025-04-15T19:22:45Z",
  },
  {
    id: "task-5",
    title: "Meet with Thesis Advisor",
    description: "Discuss preliminary research findings and next steps",
    category: "meeting",
    course: "Senior Thesis",
    dueDate: "2025-05-05T13:00:00Z",
    priority: "medium",
    status: "todo",
    estimatedHours: 1,
    completedHours: 0,
    attachments: [],
    notes: "Prepare questions about methodology section",
    createdAt: "2025-04-18T16:30:00Z",
    updatedAt: "2025-04-18T16:30:00Z",
  },
  {
    id: "task-6",
    title: "Lab Report: Organic Chemistry",
    description: "Write up findings from the organic synthesis experiment",
    category: "assignment",
    course: "CHEM 301: Organic Chemistry II",
    dueDate: "2025-05-12T11:59:59Z",
    priority: "high",
    status: "todo",
    estimatedHours: 8,
    completedHours: 0,
    attachments: [],
    notes: "Include all spectroscopy data in the appendix",
    createdAt: "2025-04-22T15:10:23Z",
    updatedAt: "2025-04-22T15:10:23Z",
  }
];

export const mockEvents: CalendarEvent[] = [
  {
    id: "event-1",
    title: "Research Paper on Quantum Computing",
    start: "2025-05-15T23:59:59Z",
    end: "2025-05-15T23:59:59Z",
    category: "assignment",
    taskId: "task-1",
  },
  {
    id: "event-2",
    title: "Midterm Exam: Statistics",
    start: "2025-05-10T10:00:00Z",
    end: "2025-05-10T12:00:00Z",
    category: "exam",
    taskId: "task-2",
  },
  {
    id: "event-3",
    title: "Group Project Presentation",
    start: "2025-05-08T14:30:00Z",
    end: "2025-05-08T15:30:00Z",
    category: "project",
    taskId: "task-3",
  },
  {
    id: "event-4",
    title: "Psychology Reading Assignment",
    start: "2025-05-03T23:59:59Z",
    end: "2025-05-03T23:59:59Z",
    category: "reading",
    taskId: "task-4",
  },
  {
    id: "event-5",
    title: "Meet with Thesis Advisor",
    start: "2025-05-05T13:00:00Z",
    end: "2025-05-05T14:00:00Z",
    category: "meeting",
    taskId: "task-5",
  },
  {
    id: "event-6",
    title: "Lab Report: Organic Chemistry",
    start: "2025-05-12T11:59:59Z",
    end: "2025-05-12T11:59:59Z",
    category: "assignment",
    taskId: "task-6",
  }
];

export const mockStudyPlan: StudyPlan = {
  id: "plan-1",
  userId: "user-1",
  weekStart: "2025-05-01T00:00:00Z",
  weekEnd: "2025-05-07T23:59:59Z",
  sessions: [
    {
      id: "session-1",
      taskId: "task-1",
      date: "2025-05-01",
      startTime: "10:00",
      endTime: "12:00",
      durationMinutes: 120,
      completed: true,
    },
    {
      id: "session-2",
      taskId: "task-2",
      date: "2025-05-01",
      startTime: "14:00",
      endTime: "16:00",
      durationMinutes: 120,
      completed: true,
    },
    {
      id: "session-3",
      taskId: "task-1",
      date: "2025-05-02",
      startTime: "09:00",
      endTime: "11:00",
      durationMinutes: 120,
      completed: false,
    },
    {
      id: "session-4",
      taskId: "task-3",
      date: "2025-05-02",
      startTime: "13:00",
      endTime: "15:00",
      durationMinutes: 120,
      completed: false,
    },
    {
      id: "session-5",
      taskId: "task-2",
      date: "2025-05-03",
      startTime: "11:00",
      endTime: "13:00",
      durationMinutes: 120,
      completed: false,
    },
    {
      id: "session-6",
      taskId: "task-6",
      date: "2025-05-04",
      startTime: "14:00",
      endTime: "17:00",
      durationMinutes: 180,
      completed: false,
    },
    {
      id: "session-7",
      taskId: "task-1",
      date: "2025-05-05",
      startTime: "16:00",
      endTime: "18:00",
      durationMinutes: 120,
      completed: false,
    },
    {
      id: "session-8",
      taskId: "task-2",
      date: "2025-05-06",
      startTime: "09:00",
      endTime: "12:00",
      durationMinutes: 180,
      completed: false,
    },
    {
      id: "session-9",
      taskId: "task-1",
      date: "2025-05-07",
      startTime: "13:00",
      endTime: "16:00",
      durationMinutes: 180,
      completed: false,
    }
  ],
  createdAt: "2025-04-28T08:15:30Z",
};

export const mockResources: AcademicResource[] = [
  {
    id: "resource-1",
    title: "APA Citation Guide",
    description: "Comprehensive guide to APA citation format, 7th edition",
    url: "https://apastyle.apa.org/",
    category: "writing",
    tags: ["citation", "writing", "research"],
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    id: "resource-2",
    title: "Khan Academy: Statistics",
    description: "Free video tutorials covering key statistical concepts",
    url: "https://www.khanacademy.org/math/statistics-probability",
    category: "learning",
    tags: ["statistics", "math", "tutorials"],
    createdAt: "2025-02-20T14:45:12Z",
  },
  {
    id: "resource-3",
    title: "LaTeX Thesis Template",
    description: "Standard LaTeX template for university thesis documents",
    url: "https://www.overleaf.com/latex/templates/thesis",
    category: "template",
    tags: ["thesis", "latex", "template"],
    createdAt: "2025-03-05T09:10:33Z",
  },
  {
    id: "resource-4",
    title: "MIT OpenCourseWare: Computer Science",
    description: "Free computer science course materials from MIT",
    url: "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/",
    category: "learning",
    tags: ["computer science", "programming", "courses"],
    createdAt: "2025-02-28T16:25:18Z",
  },
  {
    id: "resource-5",
    title: "Research Paper Outline Template",
    description: "Structure and guidelines for academic research papers",
    url: "https://owl.purdue.edu/owl/research_and_citation/",
    category: "template",
    tags: ["research", "writing", "template"],
    createdAt: "2025-03-15T11:40:55Z",
  }
];