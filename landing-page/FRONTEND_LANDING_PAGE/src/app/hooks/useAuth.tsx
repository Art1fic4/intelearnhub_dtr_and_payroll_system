import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  type: "faculty" | "student";
  password: string;
  avatarUrl?: string;
}

interface FacultyScheduleSlot {
  startHour: number;
  startMinute?: number;
  endHour: number;
  endMinute?: number;
  subjectCode: string;
}

interface AttendanceLog {
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

interface AuthContextType {
  currentUser: User | null;
  login: (id: string, password: string, type: "faculty" | "student") => boolean;
  loginWithId: (
    id: string,
    password: string
  ) => { success: boolean; message: string; userType?: "faculty" | "student"; user?: User };
  recordAttendanceEvent: (user: User) => { action: "time-in" | "time-out"; entry: AttendanceLog };
  getAttendanceLogsByUser: (userId: string, limit?: number) => AttendanceLog[];
  logout: () => void;
  register: (name: string, password: string, type: "faculty" | "student") => string;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const ATTENDANCE_STORAGE_KEY = "attendanceLogs";

const getDefaultAvatarUrl = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E6B325&color=1A1A1A`;

const FACULTY_SCHEDULES: Record<string, FacultyScheduleSlot[]> = {
  "FA-1001": [
    { startHour: 7, startMinute: 30, endHour: 10, endMinute: 0, subjectCode: "SE102" },
    { startHour: 10, startMinute: 0, endHour: 13, endMinute: 0, subjectCode: "AL102" },
    { startHour: 13, startMinute: 0, endHour: 17, endMinute: 30, subjectCode: "DM104" },
  ],
};

const STUDENT_SCHEDULES: Record<string, FacultyScheduleSlot[]> = {
  "ST-1001": [{ startHour: 14, startMinute: 30, endHour: 17, endMinute: 30, subjectCode: "SE102" }],
};

const toMinutes = (hour: number, minute = 0) => hour * 60 + minute;

const getTimeRangeLabel = (slot: FacultyScheduleSlot): string => {
  const from = new Date();
  from.setHours(slot.startHour, slot.startMinute ?? 0, 0, 0);
  const to = new Date();
  to.setHours(slot.endHour, slot.endMinute ?? 0, 0, 0);

  const format = (value: Date) =>
    value.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  return `${format(from)} - ${format(to)}`;
};

const getAssignedSlot = (
  schedules: Record<string, FacultyScheduleSlot[]>,
  userId: string,
  now: Date,
  fallbackSubject: string
): { subjectCode: string; subjectTime: string } => {
  const schedule = schedules[userId];
  if (!schedule || schedule.length === 0) {
    return { subjectCode: fallbackSubject, subjectTime: "TBD" };
  }

  const nowMinutes = toMinutes(now.getHours(), now.getMinutes());
  const activeSlot = schedule.find((slot) => {
    const startMinutes = toMinutes(slot.startHour, slot.startMinute ?? 0);
    const endMinutes = toMinutes(slot.endHour, slot.endMinute ?? 0);
    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
  });
  const selectedSlot = activeSlot ?? schedule[0];
  return {
    subjectCode: selectedSlot.subjectCode,
    subjectTime: getTimeRangeLabel(selectedSlot),
  };
};

const getSubjectAssignmentForUser = (user: User, now: Date): { subjectCode: string; subjectTime: string } => {
  if (user.type === "faculty") {
    return getAssignedSlot(FACULTY_SCHEDULES, user.id, now, "FACULTY");
  }
  return getAssignedSlot(STUDENT_SCHEDULES, user.id, now, "STUDENT");
};

const normalizeSubjectCode = (subject: string): string => {
  if (!subject) return "N/A";
  const trimmed = subject.trim();
  if (!trimmed) return "N/A";
  if (trimmed.includes("-")) {
    return trimmed.split("-")[0].trim().toUpperCase();
  }
  if (trimmed.toLowerCase() === "faculty duty") return "FACULTY";
  if (trimmed.toLowerCase() === "student attendance") return "STUDENT";
  return trimmed.toUpperCase();
};

const normalizeSubjectTime = (subjectTime?: string): string => {
  if (!subjectTime) return "TBD";
  const trimmed = subjectTime.trim();
  return trimmed || "TBD";
};

const getDateLabel = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

const getTimeLabel = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    // Ensure demo accounts always exist for quick portal access.
    const defaultUsers: User[] = [
      {
        id: "FA-1001",
        name: "Dr. John Anderson",
        type: "faculty",
        password: "faculty123",
        avatarUrl: getDefaultAvatarUrl("Dr. John Anderson"),
      },
      {
        id: "ST-1001",
        name: "Emma Wilson",
        type: "student",
        password: "student123",
        avatarUrl: getDefaultAvatarUrl("Emma Wilson"),
      },
    ];
    const savedUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const mergedUsers = [...savedUsers];

    for (const defaultUser of defaultUsers) {
      const hasUser = mergedUsers.some((user) => user.id === defaultUser.id);
      if (!hasUser) {
        mergedUsers.push(defaultUser);
      }
    }

    localStorage.setItem("users", JSON.stringify(mergedUsers));
    if (!localStorage.getItem("nextFacultyId")) {
      localStorage.setItem("nextFacultyId", "1002");
    }
    if (!localStorage.getItem("nextStudentId")) {
      localStorage.setItem("nextStudentId", "1002");
    }
  }, []);

  const login = (id: string, password: string, type: "faculty" | "student"): boolean => {
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => u.id === id && u.password === password && u.type === type);

    if (user) {
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      return true;
    }
    return false;
  };

  const loginWithId = (
    id: string,
    password: string
  ): { success: boolean; message: string; userType?: "faculty" | "student"; user?: User } => {
    const normalizedId = id.trim().toUpperCase();
    const normalizedPassword = password.trim();

    if (!normalizedId || !normalizedPassword) {
      return {
        success: false,
        message: "Please enter both your ID and password.",
      };
    }

    let userType: "faculty" | "student" | null = null;
    if (normalizedId.startsWith("FA-")) userType = "faculty";
    if (normalizedId.startsWith("ST-")) userType = "student";

    if (!userType) {
      return {
        success: false,
        message: "Invalid ID format. Use FA-xxxx for faculty or ST-xxxx for students.",
      };
    }

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (entry) =>
        entry.id.toUpperCase() === normalizedId && entry.password === normalizedPassword && entry.type === userType
    );

    if (!user) {
      return {
        success: false,
        message: "Incorrect ID or password. Please try again.",
      };
    }

    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
    return { success: true, message: "Login successful.", userType, user };
  };

  const getAttendanceLogsByUser = (userId: string, limit = 5): AttendanceLog[] => {
    const logs: AttendanceLog[] = JSON.parse(localStorage.getItem(ATTENDANCE_STORAGE_KEY) || "[]");
    return logs
      .filter((entry) => entry.userId === userId)
      .map((entry) => ({
        ...entry,
        subject: normalizeSubjectCode(entry.subject),
        subjectTime: normalizeSubjectTime(entry.subjectTime),
      }))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  };

  const recordAttendanceEvent = (user: User): { action: "time-in" | "time-out"; entry: AttendanceLog } => {
    const logs: AttendanceLog[] = JSON.parse(localStorage.getItem(ATTENDANCE_STORAGE_KEY) || "[]");
    const now = new Date();
    const nowTime = getTimeLabel(now);
    const nowDate = getDateLabel(now);
    const openEntryIndex = [...logs]
      .reverse()
      .findIndex((entry) => entry.userId === user.id && entry.status === "open");

    const subjectAssignment = getSubjectAssignmentForUser(user, now);

    if (openEntryIndex !== -1) {
      const actualIndex = logs.length - 1 - openEntryIndex;
      const updatedEntry: AttendanceLog = {
        ...logs[actualIndex],
        subject: subjectAssignment.subjectCode,
        subjectTime: subjectAssignment.subjectTime,
        timeOut: nowTime,
        status: "closed",
        updatedAt: now.toISOString(),
      };
      logs[actualIndex] = updatedEntry;
      localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(logs));
      return { action: "time-out", entry: updatedEntry };
    }

    const newEntry: AttendanceLog = {
      id: `${user.id}-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      subject: subjectAssignment.subjectCode,
      subjectTime: subjectAssignment.subjectTime,
      date: nowDate,
      timeIn: nowTime,
      timeOut: "-",
      status: "open",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    logs.push(newEntry);
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(logs));
    return { action: "time-in", entry: newEntry };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const register = (name: string, password: string, type: "faculty" | "student"): string => {
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

    let newId: string;
    if (type === "faculty") {
      const nextId = parseInt(localStorage.getItem("nextFacultyId") || "1001");
      newId = `FA-${nextId}`;
      localStorage.setItem("nextFacultyId", (nextId + 1).toString());
    } else {
      const nextId = parseInt(localStorage.getItem("nextStudentId") || "1001");
      newId = `ST-${nextId}`;
      localStorage.setItem("nextStudentId", (nextId + 1).toString());
    }

    const newUser: User = {
      id: newId,
      name,
      type,
      password,
      avatarUrl: getDefaultAvatarUrl(name),
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    return newId;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        loginWithId,
        recordAttendanceEvent,
        getAttendanceLogsByUser,
        logout,
        register,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
