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
  enrolledCount: 2,
  completedCount: 1,
};

export const enrolledCourses: Course[] = [
  { id: "crs_001", title: "Maritime Governance", instructor: "Prof. Jeffrey Landsman", progress: 45, nextLesson: "Module 3: Strategy Development Process", thumbnail: "MG", category: "Governance", lastAccessed: "2 hours ago" },
  { id: "crs_002", title: "Marine Casualty Investigation", instructor: "GoGMI Faculty", progress: 12, nextLesson: "Module 2: Investigation Procedures", thumbnail: "MC", category: "Safety", lastAccessed: "Yesterday" },
];

export interface CatalogCourse {
  id: string;
  title: string;
  subtitle: string;
  instructor: string;
  instructorTitle: string;
  facilitators: string[];
  thumbnailCode: string;
  thumbnailColor: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  modules: number;
  students: number;
  rating: number;
  reviews: number;
  price: number;
  currency: string;
  description: string;
  enrolled: boolean;
  featured: boolean;
  tags: string[];
  format: string;
  targetGroup: string;
  syllabus: { title: string; lessons: { title: string; facilitator: string; duration: string }[] }[];
  outcomes: string[];
}

export const catalogCourses: CatalogCourse[] = [
  {
    id: "crs_001",
    title: "Maritime Governance",
    subtitle: "Maritime Security Strategy Development and Implementation: A Focus on Africa",
    instructor: "Prof. Jeffrey Landsman (ret), CAPT, USN (ret)",
    instructorTitle: "Lead Facilitator",
    facilitators: [
      "Prof. Jeffrey Landsman (ret), CAPT, USN (ret)",
      "Dr. Alberta Ama Sagoe, GoGMI",
      "Vice Admiral Issah Adam Yakubu (ret)",
      "Naval Captain Ebenezer Kwame Yirenkyi",
      "Lt. Cmdr. Kofi Amponsah Duodu, GoGMI",
      "Lawrence Dogli, GoGMI",
      "Juliet Afrah Obeng, GoGMI",
      "Enoch Nikoi, GoGMI",
    ],
    thumbnailCode: "MG",
    thumbnailColor: "bg-brand-navy",
    category: "Governance",
    level: "Intermediate",
    duration: "4 weeks",
    modules: 8,
    students: 56,
    rating: 4.9,
    reviews: 12,
    price: 0,
    currency: "GHS",
    description: "Equip professionals, stakeholders, and decision-makers with the knowledge, skills, and tools necessary to understand maritime strategy development and implementation within the African context.",
    enrolled: true,
    featured: true,
    tags: ["Maritime Strategy", "African Maritime Security", "Yaoundé Architecture", "ECOWAS", "Stakeholder Analysis", "Interagency Coordination"],
    format: "Live/Virtual (Zoom) sessions with interactive simulations, group discussions, forums and assignments. 8 modules over 4 weeks.",
    targetGroup: "Government Agencies, NGOs, Private Sector, Institutions, Students, and the General Public with an interest in the maritime domain.",
    outcomes: [
      "Develop a team of skilled actors to enhance maritime strategy development across the continent",
      "Enhance the implementation of existing continental, regional and national strategies in Africa",
      "Foster more effective inter-agency and NGO coordination toward maritime security strategy implementation",
      "Enhance networking and collaboration among stakeholders involved in maritime security across Africa",
    ],
    syllabus: [
      {
        title: "Introductions & Maritime Strategy Theory",
        lessons: [
          { title: "Welcome and Course Overview", facilitator: "Lawrence Dogli & Prof. Jeffrey Landsman", duration: "10 min" },
          { title: "Participants Introduction", facilitator: "Lawrence Dogli", duration: "10 min" },
          { title: "LMS Onboarding", facilitator: "Enoch Nikoi", duration: "10 min" },
          { title: "Strategy Development Directives and Instruments", facilitator: "Dr. Alberta Ama Sagoe", duration: "60 min" },
          { title: "Purpose and the Need to Develop Maritime Strategies", facilitator: "Prof. Jeffrey Landsman", duration: "60 min" },
          { title: "Overview of the Strategy Development Process", facilitator: "Prof. Jeffrey Landsman", duration: "60 min" },
          { title: "Introduction to Maritime Domain & Maritime Sector Reform", facilitator: "Prof. Jeffrey Landsman", duration: "60 min" },
        ],
      },
      {
        title: "Assessing Maritime Domain Challenges & Opportunities",
        lessons: [
          { title: "Preliminary Assessment Process", facilitator: "Prof. Jeffrey Landsman", duration: "60 min" },
          { title: "SWOT Assessment Tool & Maritime Sector Reform", facilitator: "Prof. Jeffrey Landsman", duration: "60 min" },
          { title: "Group Discussions / SWOT Activity", facilitator: "Lawrence Dogli & Juliet Afrah Obeng", duration: "30 min" },
        ],
      },
      {
        title: "Strategy Development Process",
        lessons: [
          { title: "Developing the Vision Statement", facilitator: "Prof. Jeffrey Landsman", duration: "60 min" },
        ],
      },
      {
        title: "Interagency Coordination and Stakeholder Analysis I",
        lessons: [
          { title: "Role of Actors/Stakeholders in Maritime Strategy", facilitator: "Naval Captain Ebenezer Kwame Yirenkyi", duration: "60 min" },
          { title: "How Agencies Align Within the Maritime Sector", facilitator: "Naval Captain Ebenezer Kwame Yirenkyi", duration: "60 min" },
        ],
      },
      {
        title: "Interagency Coordination and Stakeholder Analysis II",
        lessons: [
          { title: "Importance and Challenges of Interagency Coordination", facilitator: "Lt. Cmdr. Kofi Amponsah Duodu", duration: "60 min" },
          { title: "Stakeholder Analysis & Best Practices", facilitator: "Prof. Jeffrey Landsman", duration: "60 min" },
        ],
      },
      {
        title: "Ends, Ways, Means, and Risk",
        lessons: [
          { title: "Introduction to Ends, Ways, Means, and Risk", facilitator: "Prof. Jeffrey Landsman", duration: "60 min" },
        ],
      },
      {
        title: "Maritime Strategy Implementation",
        lessons: [
          { title: "Successes and Failures of Maritime Strategy Implementation", facilitator: "Vice Admiral Issah Adam Yakubu", duration: "60 min" },
          { title: "Maritime Sector Planning Process — Course of Action Development", facilitator: "Prof. Jeffrey Landsman", duration: "60 min" },
          { title: "Maritime Strategy Sector Planning — In-Class Exercise", facilitator: "Prof. Jeffrey Landsman", duration: "120 min" },
        ],
      },
      {
        title: "Case Study Group Report and Course Conclusion",
        lessons: [
          { title: "Groups Present Course of Action Development Justification", facilitator: "Prof. Jeffrey Landsman & GoGMI Staff", duration: "60 min" },
          { title: "Course Conclusion and Discussion", facilitator: "Prof. Jeffrey Landsman", duration: "60 min" },
          { title: "Evaluation of Course", facilitator: "Juliet Afrah Obeng", duration: "20 min" },
        ],
      },
    ],
  },
  {
    id: "crs_002",
    title: "Marine Casualty Investigation and Safety Management",
    subtitle: "Enhancing Maritime and Inland Waterways Transport Safety Frameworks",
    instructor: "GoGMI Faculty",
    instructorTitle: "Executive Training Programme",
    facilitators: [
      "GoGMI Senior Maritime Safety Experts",
    ],
    thumbnailCode: "MC",
    thumbnailColor: "bg-brand-teal",
    category: "Safety",
    level: "Intermediate",
    duration: "6 weeks",
    modules: 6,
    students: 42,
    rating: 4.7,
    reviews: 8,
    price: 500,
    currency: "GHS",
    description: "Build competence in marine accident investigation, safety management, and compliance with statutory maritime instruments. Covers the IMO Casualty Investigation Code, SOLAS requirements, evidence handling, root cause analysis, human factors, and safety data management.",
    enrolled: true,
    featured: true,
    tags: ["Marine Casualty", "Investigation", "IMO CIC", "SOLAS", "Safety Management", "Human Factors", "Evidence Handling", "Root Cause Analysis"],
    format: "In-person (Ghana-based participants) and Virtual (International participants). Interactive lectures, regulatory framework analysis, tabletop exercises, simulation, group case analysis, roleplay exercises, report-writing and peer review sessions, field scenario (Volta Lake case-based simulation).",
    targetGroup: "Maritime Law Enforcement Agencies, Maritime Administrations, National and Regional Transport Authorities, Marine Surveyors, Maritime Lawyers and Prosecutors, Vessel Operators and Safety Managers, Representatives from Academia and Civil Society working in Maritime Safety and Governance.",
    outcomes: [
      "Conduct credible and procedurally compliant marine casualty investigations",
      "Apply the IMO Casualty Investigation Code to real-world accident cases",
      "Draft clear, evidence-based investigation reports and safety recommendations",
      "Strengthen institutional learning and accident prevention mechanisms",
      "Support building a national accident database for safety policy formulation",
    ],
    syllabus: [
      {
        title: "Marine Casualty Investigation — Concepts, Scope and Legal Framework",
        lessons: [
          { title: "Philosophy and Importance of Marine Casualty Investigation", facilitator: "GoGMI Faculty", duration: "60 min" },
          { title: "Nature, Types and Legal Classification of Marine Casualties", facilitator: "GoGMI Faculty", duration: "60 min" },
          { title: "IMO Casualty Investigation Code and SOLAS Requirements", facilitator: "GoGMI Faculty", duration: "60 min" },
          { title: "Legal and Institutional Frameworks (Ghana Shipping Act 645)", facilitator: "GoGMI Faculty", duration: "60 min" },
          { title: "Roles of Maritime Administration, Wreck Commissioner, and Assessors", facilitator: "GoGMI Faculty", duration: "45 min" },
          { title: "Procedures: Preliminary Inquiry, Formal Investigation, The Stop Rule", facilitator: "GoGMI Faculty", duration: "60 min" },
          { title: "Inter-agency Coordination and Responsibilities", facilitator: "GoGMI Faculty", duration: "45 min" },
        ],
      },
      {
        title: "Investigation Procedures and Evidence Handling",
        lessons: [
          { title: "Step-by-Step Process of Investigation", facilitator: "GoGMI Faculty", duration: "60 min" },
          { title: "Scene Management and Preservation of Evidence", facilitator: "GoGMI Faculty", duration: "60 min" },
          { title: "Witness Interviewing and Record-Keeping", facilitator: "GoGMI Faculty", duration: "60 min" },
          { title: "Causal Chain and Root Cause Analysis Models", facilitator: "GoGMI Faculty", duration: "60 min" },
          { title: "Drafting Structured Investigation Reports", facilitator: "GoGMI Faculty", duration: "60 min" },
        ],
      },
      {
        title: "Safety Data Management and Reporting",
        lessons: [
          { title: "Standard Formats for Casualty Reporting and Documentation", facilitator: "GoGMI Faculty", duration: "60 min" },
          { title: "Integration of Data into National and IMO Systems (GISIS)", facilitator: "GoGMI Faculty", duration: "60 min" },
          { title: "Safety Trend Analysis and Data Visualisation Techniques", facilitator: "GoGMI Faculty", duration: "60 min" },
          { title: "Developing Feedback Loops for Policy Improvement", facilitator: "GoGMI Faculty", duration: "60 min" },
        ],
      },
      {
        title: "Human Factors, Safety Culture, and Crisis Response",
        lessons: [
          { title: "Human Performance, Organisational Culture, and Accident Causation", facilitator: "GoGMI Faculty", duration: "60 min" },
          { title: "Decision-Making Under Pressure and Coordination Failures", facilitator: "GoGMI Faculty", duration: "60 min" },
          { title: "Communication and Leadership During Emergency Response", facilitator: "GoGMI Faculty", duration: "60 min" },
          { title: "Promoting Proactive Safety Behaviour Across Agencies and Communities", facilitator: "GoGMI Faculty", duration: "60 min" },
        ],
      },
      {
        title: "Basic Analysis of Marine Casualties",
        lessons: [
          { title: "Purpose and Principles of Casualty Analysis", facilitator: "GoGMI Faculty", duration: "45 min" },
          { title: "Critical Thinking in Marine Casualty Contexts", facilitator: "GoGMI Faculty", duration: "45 min" },
          { title: "Causation Models — Human Factors Analysis and Classification System", facilitator: "GoGMI Faculty", duration: "60 min" },
          { title: "Basic Analytical Techniques — Safety Issues and Deficiencies", facilitator: "GoGMI Faculty", duration: "60 min" },
          { title: "Evaluating Evidence and Drawing Conclusions", facilitator: "GoGMI Faculty", duration: "45 min" },
        ],
      },
      {
        title: "Case Study — Mock Marine Accident Investigation and Report",
        lessons: [
          { title: "Case Scenario Briefing and Evidence Pack Distribution", facilitator: "GoGMI Faculty", duration: "30 min" },
          { title: "Group Investigation Exercise — Evidence Evaluation and Root Cause Identification", facilitator: "GoGMI Faculty", duration: "120 min" },
          { title: "Group Investigation Exercise — Sequence of Events and Findings", facilitator: "GoGMI Faculty", duration: "90 min" },
          { title: "Formal Investigation Report Drafting", facilitator: "GoGMI Faculty", duration: "120 min" },
          { title: "Group Presentations and Peer Review", facilitator: "GoGMI Faculty", duration: "90 min" },
          { title: "Course Conclusion, Evaluation and Certificates", facilitator: "GoGMI Faculty", duration: "30 min" },
        ],
      },
    ],
  },
];

export const catalogCategories = ["All", "Governance", "Safety"];
export const catalogLevels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export const upcomingItems: UpcomingItem[] = [
  { id: "up_001", type: "assignment", title: "SWOT Analysis Activity", course: "Maritime Governance", due: "May 7, 2026", urgent: true },
  { id: "up_002", type: "live", title: "Live Session: Strategy Development Process", course: "Maritime Governance", due: "May 12, 2026", urgent: false },
  { id: "up_003", type: "quiz", title: "Module 1 Assessment — Legal Framework", course: "Marine Casualty Investigation", due: "May 15, 2026", urgent: false },
  { id: "up_004", type: "assignment", title: "Case Study Group Report", course: "Maritime Governance", due: "May 28, 2026", urgent: false },
];

export const announcements: Announcement[] = [
  { id: "ann_001", title: "Maritime Governance Course Begins May 5th", date: "Apr 20, 2026", from: "GoGMI Admin", excerpt: "The Maritime Governance modular course starts on Tuesday, May 5th 2026. Ensure you have access to Zoom and a reliable internet connection." },
  { id: "ann_002", title: "Marine Casualty Investigation — Registration Open", date: "Apr 18, 2026", from: "Programme Office", excerpt: "The Executive Training Course on Marine Casualty Investigation and Safety Management is now open for enrollment. In-person and virtual options available." },
  { id: "ann_003", title: "CPD Submission Deadline Reminder", date: "Apr 15, 2026", from: "Academic Registry", excerpt: "Please ensure all CPD evidence for Q2 2026 is submitted by June 30th." },
];