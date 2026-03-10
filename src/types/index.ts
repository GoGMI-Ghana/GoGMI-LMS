export type UserRole = "student" | "instructor" | "admin";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  initials: string;
  cpdPoints: number;
  cpdTarget: number;
  enrolledCount: number;
  completedCount: number;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  nextLesson: string;
  thumbnail: string;
  category: string;
  lastAccessed: string;
  description?: string;
  duration?: string;
}

export type UpcomingType = "assignment" | "live" | "quiz";

export interface UpcomingItem {
  id: string;
  type: UpcomingType;
  title: string;
  course: string;
  due: string;
  urgent: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  from: string;
  excerpt: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  badge?: number;
}