import type { User, Course, UpcomingItem, Announcement } from "../types";

export const currentUser: User = {
  id: "usr_001",
  firstName: "Kwame",
  lastName: "Asante",
  email: "k.asante@example.com",
  role: "student",
  initials: "KA",
  cpdPoints: 24,
  cpdTarget: 40,
  enrolledCount: 4,
  completedCount: 7,
};

export const enrolledCourses: Course[] = [
  {
    id: "crs_001",
    title: "Maritime Security Fundamentals",
    instructor: "Capt. Frank Hanson",
    progress: 72,
    nextLesson: "Module 5: Threat Assessment",
    thumbnail: "🛡️",
    category: "Security",
    lastAccessed: "2 hours ago",
  },
  {
    id: "crs_002",
    title: "Blue Economy & Sustainable Development",
    instructor: "Dr. Juliet Obeng",
    progress: 45,
    nextLesson: "Module 3: Fisheries Management",
    thumbnail: "🌊",
    category: "Blue Economy",
    lastAccessed: "Yesterday",
  },
  {
    id: "crs_003",
    title: "Port Operations & Logistics",
    instructor: "Lawrence Dogli",
    progress: 18,
    nextLesson: "Module 2: Cargo Handling",
    thumbnail: "⚓",
    category: "Operations",
    lastAccessed: "3 days ago",
  },
  {
    id: "crs_004",
    title: "International Maritime Law",
    instructor: "Prof. Nana Mensah",
    progress: 91,
    nextLesson: "Module 9: Case Studies",
    thumbnail: "⚖️",
    category: "Law",
    lastAccessed: "1 hour ago",
  },
];

export const upcomingItems: UpcomingItem[] = [
  { id: "up_001", type: "assignment", title: "Threat Assessment Report", course: "Maritime Security Fundamentals", due: "Mar 2, 2026", urgent: true },
  { id: "up_002", type: "live", title: "Live Session: Port Safety Standards", course: "Port Operations & Logistics", due: "Mar 3, 2026", urgent: false },
  { id: "up_003", type: "quiz", title: "Module 3 Quiz", course: "Blue Economy & Sustainable Development", due: "Mar 5, 2026", urgent: false },
  { id: "up_004", type: "assignment", title: "Maritime Law Case Brief", course: "International Maritime Law", due: "Mar 7, 2026", urgent: false },
];

export const announcements: Announcement[] = [
  { id: "ann_001", title: "New Course: Piracy & Armed Robbery Prevention", date: "Feb 25, 2026", from: "GoGMI Admin", excerpt: "Enroll now for the upcoming 8-week course starting March 15th. Early bird pricing available." },
  { id: "ann_002", title: "IMSWG Q1 Meeting — Open to Students", date: "Feb 22, 2026", from: "Programme Office", excerpt: "Students are invited to observe the International Maritime Security Working Group quarterly session." },
  { id: "ann_003", title: "CPD Submission Deadline Reminder", date: "Feb 20, 2026", from: "Academic Registry", excerpt: "Please ensure all CPD evidence for Q1 2026 is submitted by March 31st." },
];