import { BookOpen, Calendar, Home, Settings } from "lucide-react";

export const STUDENT_NAV_ITEMS = [
  { icon: Home, label: "Dashboard", view: "dashboard" },
  { icon: Calendar, label: "Attendance", view: "attendance" },
  { icon: BookOpen, label: "Courses", view: "courses" },
  { icon: Settings, label: "Settings", view: "settings" },
] as const;

export const STUDENT_ATTENDANCE_HISTORY = [
  { id: 1, date: "2026-04-11", timeIn: "09:00 AM", timeOut: "12:00 PM", subject: "SE102 - Software Engineering" },
  { id: 2, date: "2026-04-11", timeIn: "01:00 PM", timeOut: "03:00 PM", subject: "DM104 - Data Management" },
  { id: 3, date: "2026-04-10", timeIn: "09:00 AM", timeOut: "11:00 AM", subject: "STAT1 - Statistics I" },
  { id: 4, date: "2026-04-10", timeIn: "02:00 PM", timeOut: "04:00 PM", subject: "AL102 - Algorithm Design" },
  { id: 5, date: "2026-04-09", timeIn: "09:00 AM", timeOut: "12:00 PM", subject: "SE102 - Software Engineering" },
  { id: 6, date: "2026-04-09", timeIn: "01:00 PM", timeOut: "03:00 PM", subject: "GV101 - Graphic & Visual Computing" },
  { id: 7, date: "2026-04-08", timeIn: "09:00 AM", timeOut: "11:00 AM", subject: "SIA101 - Systems Integration" },
  { id: 8, date: "2026-04-08", timeIn: "02:00 PM", timeOut: "04:00 PM", subject: "DM104 - Data Management" },
  { id: 9, date: "2026-04-07", timeIn: "09:00 AM", timeOut: "12:00 PM", subject: "SE102 - Software Engineering" },
  { id: 10, date: "2026-04-07", timeIn: "01:00 PM", timeOut: "03:00 PM", subject: "STAT1 - Statistics I" },
];

export const STUDENT_COURSES = [
  { code: "SE102", name: "Software Engineering", instructor: "Dr. Anderson", schedule: "Mon, Wed 9:00 AM" },
  { code: "DM104", name: "Data Management", instructor: "Prof. Williams", schedule: "Tue, Thu 2:00 PM" },
  { code: "STAT1", name: "Statistics I", instructor: "Dr. Martinez", schedule: "Mon, Wed 2:00 PM" },
  { code: "AL102", name: "Algorithm Design", instructor: "Prof. Chen", schedule: "Tue, Thu 10:00 AM" },
  { code: "GV101", name: "Graphic & Visual Computing", instructor: "Dr. Rodriguez", schedule: "Fri 1:00 PM" },
  { code: "SIA101", name: "Systems Integration", instructor: "Prof. Johnson", schedule: "Wed, Fri 10:00 AM" },
];
