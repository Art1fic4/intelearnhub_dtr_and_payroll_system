import { createContext, useContext, useState, ReactNode } from 'react';

export interface Faculty {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  educationLevel: string;
  hourlyRate: number;
  subjects: string[];
  bankAccount?: string;
  hasProfilePic: boolean;
  hasTOR: boolean;
  hasDiploma: boolean;
  password?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gradeLevel: string;
  subjects: string[];
  password?: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  description: string;
  days: string[];
  startTime: string;
  endTime: string;
  gradeLevel: string;
  facultyId: string;
}

export interface TimeLog {
  id: string;
  date: string;
  time: string;
  facultyId: string;
  facultyName: string;
  subject: string;
  grade: string;
  hours: number;
  hourlyRate: number;
  isOvertime: boolean;
  hasTOR: boolean;
  hasDiploma: boolean;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  subject: string;
  status: 'Present' | 'Absent';
}

interface AppState {
  faculty: Faculty[];
  students: Student[];
  subjects: Subject[];
  timeLogs: TimeLog[];
  attendance: AttendanceRecord[];
  addFaculty: (faculty: Faculty) => void;
  updateFaculty: (id: string, faculty: Partial<Faculty>) => void;
  deleteFaculty: (id: string) => void;
  addStudent: (student: Student) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addSubject: (subject: Subject) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  addTimeLog: (log: TimeLog) => void;
  deleteTimeLog: (id: string) => void;
  addAttendance: (record: AttendanceRecord) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

// Generate mock data
const generateMockData = () => {
  const faculty: Faculty[] = [
    {
      id: 'FA-1001',
      name: 'Dr. Sarah Martinez',
      email: 'sarah.martinez@intelearn.edu',
      phone: '+1 (555) 123-4567',
      address: '123 Academic Ave, Education City',
      educationLevel: 'Doctorate',
      hourlyRate: 75,
      subjects: ['MATH-101', 'MATH-201'],
      bankAccount: '****-****-1234',
      hasProfilePic: true,
      hasTOR: true,
      hasDiploma: true,
    },
    {
      id: 'FA-1002',
      name: 'Prof. James Chen',
      email: 'james.chen@intelearn.edu',
      phone: '+1 (555) 234-5678',
      address: '456 Scholar Lane, University Park',
      educationLevel: 'Masters',
      hourlyRate: 65,
      subjects: ['SCI-101', 'SCI-102'],
      bankAccount: '****-****-5678',
      hasProfilePic: true,
      hasTOR: true,
      hasDiploma: false,
    },
    {
      id: 'FA-1003',
      name: 'Ms. Emily Rodriguez',
      email: 'emily.rodriguez@intelearn.edu',
      phone: '+1 (555) 345-6789',
      address: '789 Learning Blvd, Campus District',
      educationLevel: 'Bachelors',
      hourlyRate: 55,
      subjects: ['ENG-101'],
      bankAccount: '****-****-9012',
      hasProfilePic: true,
      hasTOR: false,
      hasDiploma: true,
    },
  ];

  const students: Student[] = [
    {
      id: 'ST-10001',
      name: 'Alex Johnson',
      email: 'alex.johnson@student.intelearn.edu',
      phone: '+1 (555) 111-2222',
      address: '321 Student St, Campus Town',
      gradeLevel: 'Grade 10',
      subjects: ['MATH-101', 'SCI-101', 'ENG-101'],
    },
    {
      id: 'ST-10002',
      name: 'Maya Patel',
      email: 'maya.patel@student.intelearn.edu',
      phone: '+1 (555) 222-3333',
      address: '654 Learner Ave, Education District',
      gradeLevel: 'Grade 11',
      subjects: ['MATH-201', 'SCI-102'],
    },
    {
      id: 'ST-10003',
      name: 'Liam Thompson',
      email: 'liam.thompson@student.intelearn.edu',
      phone: '+1 (555) 333-4444',
      address: '987 Knowledge Road, Scholar City',
      gradeLevel: 'Grade 9',
      subjects: ['ENG-101', 'SCI-101'],
    },
  ];

  const subjects: Subject[] = [
    {
      id: 'MATH-101',
      code: 'MATH-101',
      name: 'Algebra Fundamentals',
      description: 'Introduction to algebraic concepts and problem-solving',
      days: ['Monday', 'Wednesday', 'Friday'],
      startTime: '09:00',
      endTime: '10:30',
      gradeLevel: 'Grade 10',
      facultyId: 'FA-1001',
    },
    {
      id: 'MATH-201',
      code: 'MATH-201',
      name: 'Advanced Calculus',
      description: 'Calculus for advanced learners',
      days: ['Tuesday', 'Thursday'],
      startTime: '10:00',
      endTime: '11:30',
      gradeLevel: 'Grade 11',
      facultyId: 'FA-1001',
    },
    {
      id: 'SCI-101',
      code: 'SCI-101',
      name: 'General Science',
      description: 'Introduction to scientific methods and principles',
      days: ['Monday', 'Wednesday'],
      startTime: '13:00',
      endTime: '14:30',
      gradeLevel: 'Grade 9',
      facultyId: 'FA-1002',
    },
    {
      id: 'SCI-102',
      code: 'SCI-102',
      name: 'Physics Basics',
      description: 'Fundamentals of physics and mechanics',
      days: ['Tuesday', 'Thursday'],
      startTime: '14:00',
      endTime: '15:30',
      gradeLevel: 'Grade 11',
      facultyId: 'FA-1002',
    },
    {
      id: 'ENG-101',
      code: 'ENG-101',
      name: 'English Literature',
      description: 'Classic and contemporary literature analysis',
      days: ['Monday', 'Wednesday', 'Friday'],
      startTime: '11:00',
      endTime: '12:30',
      gradeLevel: 'Grade 9',
      facultyId: 'FA-1003',
    },
  ];

  const timeLogs: TimeLog[] = [
    {
      id: 'TL-001',
      date: '2026-04-10',
      time: '09:00',
      facultyId: 'FA-1001',
      facultyName: 'Dr. Sarah Martinez',
      subject: 'MATH-101',
      grade: 'Grade 10',
      hours: 1.5,
      hourlyRate: 75,
      isOvertime: false,
      hasTOR: true,
      hasDiploma: true,
    },
    {
      id: 'TL-002',
      date: '2026-04-10',
      time: '10:00',
      facultyId: 'FA-1001',
      facultyName: 'Dr. Sarah Martinez',
      subject: 'MATH-201',
      grade: 'Grade 11',
      hours: 1.5,
      hourlyRate: 75,
      isOvertime: false,
      hasTOR: true,
      hasDiploma: true,
    },
    {
      id: 'TL-003',
      date: '2026-04-10',
      time: '13:00',
      facultyId: 'FA-1002',
      facultyName: 'Prof. James Chen',
      subject: 'SCI-101',
      grade: 'Grade 9',
      hours: 1.5,
      hourlyRate: 65,
      isOvertime: false,
      hasTOR: true,
      hasDiploma: false,
    },
    {
      id: 'TL-004',
      date: '2026-04-09',
      time: '09:00',
      facultyId: 'FA-1001',
      facultyName: 'Dr. Sarah Martinez',
      subject: 'MATH-101',
      grade: 'Grade 10',
      hours: 1.5,
      hourlyRate: 75,
      isOvertime: false,
      hasTOR: true,
      hasDiploma: true,
    },
    {
      id: 'TL-005',
      date: '2026-04-09',
      time: '11:00',
      facultyId: 'FA-1003',
      facultyName: 'Ms. Emily Rodriguez',
      subject: 'ENG-101',
      grade: 'Grade 9',
      hours: 1.5,
      hourlyRate: 55,
      isOvertime: false,
      hasTOR: false,
      hasDiploma: true,
    },
    {
      id: 'TL-006',
      date: '2026-04-08',
      time: '14:00',
      facultyId: 'FA-1002',
      facultyName: 'Prof. James Chen',
      subject: 'SCI-102',
      grade: 'Grade 11',
      hours: 2.0,
      hourlyRate: 65,
      isOvertime: true,
      hasTOR: true,
      hasDiploma: false,
    },
    {
      id: 'TL-007',
      date: '2026-04-08',
      time: '09:00',
      facultyId: 'FA-1001',
      facultyName: 'Dr. Sarah Martinez',
      subject: 'MATH-101',
      grade: 'Grade 10',
      hours: 1.5,
      hourlyRate: 75,
      isOvertime: false,
      hasTOR: true,
      hasDiploma: true,
    },
    {
      id: 'TL-008',
      date: '2026-04-07',
      time: '15:00',
      facultyId: 'FA-1003',
      facultyName: 'Ms. Emily Rodriguez',
      subject: 'ENG-101',
      grade: 'Grade 9',
      hours: 3.0,
      hourlyRate: 55,
      isOvertime: true,
      hasTOR: false,
      hasDiploma: true,
    },
    {
      id: 'TL-009',
      date: '2026-04-07',
      time: '10:00',
      facultyId: 'FA-1001',
      facultyName: 'Dr. Sarah Martinez',
      subject: 'MATH-201',
      grade: 'Grade 11',
      hours: 1.5,
      hourlyRate: 75,
      isOvertime: false,
      hasTOR: true,
      hasDiploma: true,
    },
    {
      id: 'TL-010',
      date: '2026-04-06',
      time: '13:00',
      facultyId: 'FA-1002',
      facultyName: 'Prof. James Chen',
      subject: 'SCI-101',
      grade: 'Grade 9',
      hours: 1.5,
      hourlyRate: 65,
      isOvertime: false,
      hasTOR: true,
      hasDiploma: false,
    },
  ];

  const attendance: AttendanceRecord[] = [
    {
      id: 'ATT-001',
      studentId: 'ST-10001',
      studentName: 'Alex Johnson',
      date: '2026-04-10',
      time: '09:00',
      subject: 'MATH-101',
      status: 'Present',
    },
    {
      id: 'ATT-002',
      studentId: 'ST-10001',
      studentName: 'Alex Johnson',
      date: '2026-04-10',
      time: '13:00',
      subject: 'SCI-101',
      status: 'Present',
    },
    {
      id: 'ATT-003',
      studentId: 'ST-10002',
      studentName: 'Maya Patel',
      date: '2026-04-10',
      time: '10:00',
      subject: 'MATH-201',
      status: 'Absent',
    },
    {
      id: 'ATT-004',
      studentId: 'ST-10003',
      studentName: 'Liam Thompson',
      date: '2026-04-10',
      time: '13:00',
      subject: 'SCI-101',
      status: 'Present',
    },
  ];

  return { faculty, students, subjects, timeLogs, attendance };
};

export function AppProvider({ children }: { children: ReactNode }) {
  const mockData = generateMockData();
  const [faculty, setFaculty] = useState<Faculty[]>(mockData.faculty);
  const [students, setStudents] = useState<Student[]>(mockData.students);
  const [subjects, setSubjects] = useState<Subject[]>(mockData.subjects);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(mockData.timeLogs);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockData.attendance);

  const addFaculty = (newFaculty: Faculty) => {
    setFaculty([...faculty, newFaculty]);
  };

  const updateFaculty = (id: string, updates: Partial<Faculty>) => {
    setFaculty(faculty.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteFaculty = (id: string) => {
    setFaculty(faculty.filter(f => f.id !== id));
  };

  const addStudent = (newStudent: Student) => {
    setStudents([...students, newStudent]);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(students.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const addSubject = (newSubject: Subject) => {
    setSubjects([...subjects, newSubject]);
    // Auto-generate time logs for new subjects
    const faculty = mockData.faculty.find(f => f.id === newSubject.facultyId);
    if (faculty) {
      const duration = 1.5; // hours
      const newLog: TimeLog = {
        id: `TL-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        time: newSubject.startTime,
        facultyId: newSubject.facultyId,
        facultyName: faculty.name,
        subject: newSubject.code,
        grade: newSubject.gradeLevel,
        hours: duration,
        hourlyRate: faculty.hourlyRate,
        isOvertime: false,
        hasTOR: faculty.hasTOR,
        hasDiploma: faculty.hasDiploma,
      };
      setTimeLogs([...timeLogs, newLog]);
    }
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const addTimeLog = (log: TimeLog) => {
    setTimeLogs([...timeLogs, log]);
  };

  const deleteTimeLog = (id: string) => {
    setTimeLogs(timeLogs.filter(l => l.id !== id));
  };

  const addAttendance = (record: AttendanceRecord) => {
    setAttendance([...attendance, record]);
  };

  return (
    <AppContext.Provider
      value={{
        faculty,
        students,
        subjects,
        timeLogs,
        attendance,
        addFaculty,
        updateFaculty,
        deleteFaculty,
        addStudent,
        updateStudent,
        deleteStudent,
        addSubject,
        updateSubject,
        deleteSubject,
        addTimeLog,
        deleteTimeLog,
        addAttendance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
