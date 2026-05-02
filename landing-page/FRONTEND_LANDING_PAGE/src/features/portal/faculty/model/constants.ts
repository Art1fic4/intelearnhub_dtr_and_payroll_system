import { Calendar, FileText, Home, Settings } from "lucide-react";

export const FACULTY_NAV_ITEMS = [
  { icon: Home, label: "Dashboard", view: "dashboard" },
  { icon: Calendar, label: "Attendance", view: "attendance" },
  { icon: FileText, label: "Reports", view: "reports" },
  { icon: Settings, label: "Settings", view: "settings" },
] as const;

export const FACULTY_ATTENDANCE_HISTORY = [
  { id: 1, date: "2026-04-11", timeIn: "08:00 AM", timeOut: "05:00 PM", subject: "SE102 - Software Engineering" },
  { id: 2, date: "2026-04-10", timeIn: "08:15 AM", timeOut: "05:15 PM", subject: "AL102 - Algorithm Design" },
  { id: 3, date: "2026-04-09", timeIn: "08:00 AM", timeOut: "05:00 PM", subject: "SE102 - Software Engineering" },
  { id: 4, date: "2026-04-08", timeIn: "08:10 AM", timeOut: "05:10 PM", subject: "DM104 - Data Management" },
  { id: 5, date: "2026-04-07", timeIn: "08:00 AM", timeOut: "05:00 PM", subject: "SE102 - Software Engineering" },
  { id: 6, date: "2026-04-04", timeIn: "08:05 AM", timeOut: "05:05 PM", subject: "AL102 - Algorithm Design" },
  { id: 7, date: "2026-04-03", timeIn: "08:00 AM", timeOut: "05:00 PM", subject: "SE102 - Software Engineering" },
  { id: 8, date: "2026-04-02", timeIn: "08:20 AM", timeOut: "05:20 PM", subject: "DM104 - Data Management" },
];
