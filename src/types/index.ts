export type UserRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  initials: string;
  organization?: string;
  jobTitle?: string;
  country?: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  badge?: number;
}