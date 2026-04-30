export interface AuthUser {
  id: string;
  name: string;
  type: "faculty" | "student";
  avatarUrl?: string;
}

export interface AttendanceLog {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  subjectTime: string;
  date: string;
  timeIn: string;
  timeOut: string;
  status: "open" | "closed";
  createdAt: string;
  updatedAt: string;
}
