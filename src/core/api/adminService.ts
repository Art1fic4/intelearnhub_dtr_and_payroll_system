import { supabase } from './supabaseClient';
import type {
  AppBootstrapData,
  AttendanceRecord,
  CreateFacultyPayload,
  CreateStudentPayload,
  CreateSubjectPayload,
  Faculty,
  Student,
  Subject,
  TimeLog,
  UpdateSubjectPayload,
} from '../contracts/models';

const USE_MOCKS = import.meta.env.VITE_ENABLE_MOCKS !== 'false';

const mockDb: AppBootstrapData = {
  faculty: [
    {
      id: 'FA-1001',
      name: 'Dr. Sarah Martinez',
      email: 'sarah.martinez@interlearn.edu',
      phone: '+1 (555) 123-4567',
      address: '123 Academic Ave, Education City',
      educationLevel: 'Doctorate',
      hourlyRate: 75,
      subjects: ['MATH-101'],
      bankAccount: '****-****-1234',
      hasProfilePic: true,
      hasTOR: true,
      hasDiploma: true,
    },
    {
      id: 'FA-1002',
      name: 'Prof. Daniel Kim',
      email: 'daniel.kim@interlearn.edu',
      phone: '+1 (555) 333-8181',
      address: '87 Learning Blvd, Education City',
      educationLevel: 'Masteral',
      hourlyRate: 68,
      subjects: ['SCI-201', 'ENG-301'],
      bankAccount: '****-****-7788',
      hasProfilePic: true,
      hasTOR: true,
      hasDiploma: true,
    },
    {
      id: 'FA-1003',
      name: 'Ms. Priya Nair',
      email: 'priya.nair@interlearn.edu',
      phone: '+1 (555) 262-1122',
      address: '22 Mentor St, Education City',
      educationLevel: 'Masteral',
      hourlyRate: 64,
      subjects: ['HIS-210'],
      bankAccount: '****-****-9012',
      hasProfilePic: true,
      hasTOR: true,
      hasDiploma: true,
    },
    {
      id: 'FA-1004',
      name: 'Mr. Carlos Mendez',
      email: 'carlos.mendez@interlearn.edu',
      phone: '+1 (555) 188-4001',
      address: '54 Scholar Rd, Education City',
      educationLevel: 'Bachelor',
      hourlyRate: 58,
      subjects: ['ICT-120'],
      bankAccount: '****-****-4455',
      hasProfilePic: true,
      hasTOR: true,
      hasDiploma: true,
    },
    {
      id: 'FA-1005',
      name: 'Dr. Amelia Cruz',
      email: 'amelia.cruz@interlearn.edu',
      phone: '+1 (555) 915-6622',
      address: '6 Faculty Lane, Education City',
      educationLevel: 'Doctorate',
      hourlyRate: 79,
      subjects: ['PHY-220'],
      bankAccount: '****-****-3321',
      hasProfilePic: true,
      hasTOR: true,
      hasDiploma: true,
    },
  ],
  students: [
    {
      id: 'ST-10001',
      name: 'Alex Johnson',
      email: 'alex.johnson@student.interlearn.edu',
      phone: '+1 (555) 111-2222',
      address: '321 Student St, Campus Town',
      gradeLevel: 'Grade 10',
      subjects: ['MATH-101'],
    },
    {
      id: 'ST-10002',
      name: 'Jamie Rivera',
      email: 'jamie.rivera@student.interlearn.edu',
      phone: '+1 (555) 444-9080',
      address: '91 Campus Loop, Campus Town',
      gradeLevel: 'Grade 10',
      subjects: ['MATH-101', 'SCI-201'],
    },
    {
      id: 'ST-10003',
      name: 'Morgan Lee',
      email: 'morgan.lee@student.interlearn.edu',
      phone: '+1 (555) 222-7070',
      address: '14 Scholar Ave, Campus Town',
      gradeLevel: 'Grade 11',
      subjects: ['ENG-301', 'SCI-201'],
    },
    {
      id: 'ST-10004',
      name: 'Taylor Brooks',
      email: 'taylor.brooks@student.interlearn.edu',
      phone: '+1 (555) 714-3003',
      address: '45 Elm St, Campus Town',
      gradeLevel: 'Grade 9',
      subjects: ['HIS-210', 'ICT-120'],
    },
    {
      id: 'ST-10005',
      name: 'Jordan Miles',
      email: 'jordan.miles@student.interlearn.edu',
      phone: '+1 (555) 640-1188',
      address: '92 Oak Drive, Campus Town',
      gradeLevel: 'Grade 10',
      subjects: ['MATH-101', 'ICT-120'],
    },
    {
      id: 'ST-10006',
      name: 'Riley Stone',
      email: 'riley.stone@student.interlearn.edu',
      phone: '+1 (555) 805-5511',
      address: '5 Maple Ave, Campus Town',
      gradeLevel: 'Grade 11',
      subjects: ['ENG-301', 'PHY-220'],
    },
    {
      id: 'ST-10007',
      name: 'Casey Morgan',
      email: 'casey.morgan@student.interlearn.edu',
      phone: '+1 (555) 224-7779',
      address: '33 Cedar St, Campus Town',
      gradeLevel: 'Grade 12',
      subjects: ['PHY-220', 'ENG-301'],
    },
    {
      id: 'ST-10008',
      name: 'Avery Gomez',
      email: 'avery.gomez@student.interlearn.edu',
      phone: '+1 (555) 339-4810',
      address: '71 Birch Rd, Campus Town',
      gradeLevel: 'Grade 9',
      subjects: ['HIS-210', 'SCI-201'],
    },
    {
      id: 'ST-10009',
      name: 'Noah Patel',
      email: 'noah.patel@student.interlearn.edu',
      phone: '+1 (555) 118-9322',
      address: '16 Pine St, Campus Town',
      gradeLevel: 'Grade 12',
      subjects: ['ICT-120', 'PHY-220'],
    },
    {
      id: 'ST-10010',
      name: 'Skylar Bennett',
      email: 'skylar.bennett@student.interlearn.edu',
      phone: '+1 (555) 470-6001',
      address: '8 Riverwalk, Campus Town',
      gradeLevel: 'Grade 10',
      subjects: ['MATH-101', 'SCI-201'],
    },
  ],
  subjects: [
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
      id: 'SCI-201',
      code: 'SCI-201',
      name: 'General Science',
      description: 'Core scientific concepts with lab-style activities',
      days: ['Tuesday', 'Thursday'],
      startTime: '10:45',
      endTime: '12:00',
      gradeLevel: 'Grade 10',
      facultyId: 'FA-1002',
    },
    {
      id: 'ENG-301',
      code: 'ENG-301',
      name: 'English Composition',
      description: 'Writing fundamentals, grammar, and composition practice',
      days: ['Monday', 'Wednesday'],
      startTime: '13:00',
      endTime: '14:30',
      gradeLevel: 'Grade 11',
      facultyId: 'FA-1002',
    },
    {
      id: 'HIS-210',
      code: 'HIS-210',
      name: 'World History',
      description: 'Survey of key historical events and civilizations',
      days: ['Tuesday', 'Thursday'],
      startTime: '08:00',
      endTime: '09:15',
      gradeLevel: 'Grade 9',
      facultyId: 'FA-1003',
    },
    {
      id: 'ICT-120',
      code: 'ICT-120',
      name: 'Digital Literacy',
      description: 'Foundations of computing, productivity tools, and online safety',
      days: ['Monday', 'Friday'],
      startTime: '11:00',
      endTime: '12:15',
      gradeLevel: 'Grade 10',
      facultyId: 'FA-1004',
    },
    {
      id: 'PHY-220',
      code: 'PHY-220',
      name: 'Applied Physics',
      description: 'Practical physics concepts with problem-based learning',
      days: ['Wednesday', 'Friday'],
      startTime: '14:45',
      endTime: '16:00',
      gradeLevel: 'Grade 12',
      facultyId: 'FA-1005',
    },
  ],
  timeLogs: [
    {
      id: 'TL-2026-0411-001',
      date: '2026-04-11',
      time: '09:05',
      facultyId: 'FA-1001',
      facultyName: 'Dr. Sarah Martinez',
      subject: 'MATH-101',
      grade: 'Grade 10',
      hours: 2,
      hourlyRate: 75,
      isOvertime: false,
      hasTOR: true,
      hasDiploma: true,
      periodStart: '2026-04-11',
      periodEnd: '2026-04-25',
      periodLabel: '2026-04-11_to_2026-04-25',
    },
    {
      id: 'TL-2026-0415-002',
      date: '2026-04-15',
      time: '10:50',
      facultyId: 'FA-1002',
      facultyName: 'Prof. Daniel Kim',
      subject: 'SCI-201',
      grade: 'Grade 10',
      hours: 1.5,
      hourlyRate: 68,
      isOvertime: false,
      hasTOR: true,
      hasDiploma: true,
      periodStart: '2026-04-11',
      periodEnd: '2026-04-25',
      periodLabel: '2026-04-11_to_2026-04-25',
    },
    {
      id: 'TL-2026-0422-003',
      date: '2026-04-22',
      time: '13:10',
      facultyId: 'FA-1002',
      facultyName: 'Prof. Daniel Kim',
      subject: 'ENG-301',
      grade: 'Grade 11',
      hours: 2.5,
      hourlyRate: 68,
      isOvertime: true,
      hasTOR: true,
      hasDiploma: true,
      periodStart: '2026-04-11',
      periodEnd: '2026-04-25',
      periodLabel: '2026-04-11_to_2026-04-25',
    },
  ],
  attendance: [
    {
      id: 'AT-2026-0411-001',
      studentId: 'ST-10001',
      studentName: 'Alex Johnson',
      date: '2026-04-11',
      time: '09:00',
      subject: 'MATH-101',
      status: 'Present',
      periodStart: '2026-04-11',
      periodEnd: '2026-04-25',
      periodLabel: '2026-04-11_to_2026-04-25',
    },
    {
      id: 'AT-2026-0415-002',
      studentId: 'ST-10002',
      studentName: 'Jamie Rivera',
      date: '2026-04-15',
      time: '10:45',
      subject: 'SCI-201',
      status: 'Present',
      periodStart: '2026-04-11',
      periodEnd: '2026-04-25',
      periodLabel: '2026-04-11_to_2026-04-25',
    },
    {
      id: 'AT-2026-0422-003',
      studentId: 'ST-10003',
      studentName: 'Morgan Lee',
      date: '2026-04-22',
      time: '13:00',
      subject: 'ENG-301',
      status: 'Absent',
      periodStart: '2026-04-11',
      periodEnd: '2026-04-25',
      periodLabel: '2026-04-11_to_2026-04-25',
    },
  ],
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

type FacultyRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  education_level: string;
  hourly_rate: number;
  subjects: string[];
  bank_account: string | null;
  has_profile_pic: boolean;
  has_tor: boolean;
  has_diploma: boolean;
  profile_picture: Faculty['profilePicture'] | null;
  documents: Faculty['documents'] | null;
};

type StudentRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  grade_level: string;
  subjects: string[];
  profile_picture: Student['profilePicture'] | null;
  documents: Student['documents'] | null;
};

type SubjectRow = {
  id: string;
  code: string;
  name: string;
  description: string;
  days: string[];
  start_time: string;
  end_time: string;
  grade_level: string;
  faculty_id: string | null;
};

type TimeLogRow = {
  id: string;
  date: string;
  time: string;
  faculty_id: string;
  faculty_name: string;
  subject: string;
  grade: string;
  hours: number;
  hourly_rate: number;
  is_overtime: boolean;
  has_tor: boolean;
  has_diploma: boolean;
  period_start: string | null;
  period_end: string | null;
  period_label: string | null;
};

type AttendanceRow = {
  id: string;
  student_id: string;
  student_name: string;
  date: string;
  time: string;
  subject: string;
  status: AttendanceRecord['status'];
  period_start: string | null;
  period_end: string | null;
  period_label: string | null;
};

function ensureNoSupabaseError(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

function toFacultyModel(row: FacultyRow): Faculty {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    educationLevel: row.education_level,
    hourlyRate: row.hourly_rate,
    subjects: row.subjects ?? [],
    bankAccount: row.bank_account ?? undefined,
    hasProfilePic: row.has_profile_pic,
    hasTOR: row.has_tor,
    hasDiploma: row.has_diploma,
    profilePicture: row.profile_picture ?? undefined,
    documents: row.documents ?? undefined,
  };
}

function toStudentModel(row: StudentRow): Student {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    gradeLevel: row.grade_level,
    subjects: row.subjects ?? [],
    profilePicture: row.profile_picture ?? undefined,
    documents: row.documents ?? undefined,
  };
}

function toSubjectModel(row: SubjectRow): Subject {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    days: row.days ?? [],
    startTime: row.start_time,
    endTime: row.end_time,
    gradeLevel: row.grade_level,
    facultyId: row.faculty_id ?? '',
  };
}

function toTimeLogModel(row: TimeLogRow): TimeLog {
  return {
    id: row.id,
    date: row.date,
    time: row.time,
    facultyId: row.faculty_id,
    facultyName: row.faculty_name,
    subject: row.subject,
    grade: row.grade,
    hours: row.hours,
    hourlyRate: row.hourly_rate,
    isOvertime: row.is_overtime,
    hasTOR: row.has_tor,
    hasDiploma: row.has_diploma,
    periodStart: row.period_start ?? undefined,
    periodEnd: row.period_end ?? undefined,
    periodLabel: row.period_label ?? undefined,
  };
}

function toAttendanceModel(row: AttendanceRow): AttendanceRecord {
  return {
    id: row.id,
    studentId: row.student_id,
    studentName: row.student_name,
    date: row.date,
    time: row.time,
    subject: row.subject,
    status: row.status,
    periodStart: row.period_start ?? undefined,
    periodEnd: row.period_end ?? undefined,
    periodLabel: row.period_label ?? undefined,
  };
}

export const adminService = {
  async getBootstrapData(): Promise<AppBootstrapData> {
    if (USE_MOCKS) return clone(mockDb);
    const [facultyRes, studentsRes, subjectsRes, timeLogsRes, attendanceRes] = await Promise.all([
      supabase.from('faculty').select('*').order('id'),
      supabase.from('students').select('*').order('id'),
      supabase.from('subjects').select('*').order('id'),
      supabase.from('time_logs').select('*').order('date', { ascending: false }),
      supabase.from('attendance_records').select('*').order('date', { ascending: false }),
    ]);

    ensureNoSupabaseError(facultyRes.error);
    ensureNoSupabaseError(studentsRes.error);
    ensureNoSupabaseError(subjectsRes.error);
    ensureNoSupabaseError(timeLogsRes.error);
    ensureNoSupabaseError(attendanceRes.error);

    return {
      faculty: (facultyRes.data as FacultyRow[]).map(toFacultyModel),
      students: (studentsRes.data as StudentRow[]).map(toStudentModel),
      subjects: (subjectsRes.data as SubjectRow[]).map(toSubjectModel),
      timeLogs: (timeLogsRes.data as TimeLogRow[]).map(toTimeLogModel),
      attendance: (attendanceRes.data as AttendanceRow[]).map(toAttendanceModel),
    };
  },
  async createFaculty(payload: CreateFacultyPayload): Promise<Faculty> {
    if (USE_MOCKS) {
      mockDb.faculty.push(payload);
      return clone(payload);
    }
    const { data, error } = await supabase
      .from('faculty')
      .insert([
        {
          id: payload.id,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          address: payload.address,
          education_level: payload.educationLevel,
          hourly_rate: payload.hourlyRate,
          subjects: payload.subjects,
          bank_account: payload.bankAccount ?? null,
          has_profile_pic: payload.hasProfilePic,
          has_tor: payload.hasTOR,
          has_diploma: payload.hasDiploma,
          profile_picture: payload.profilePicture ?? null,
          documents: payload.documents ?? null,
        },
      ])
      .select()
      .single();
    ensureNoSupabaseError(error);
    return toFacultyModel(data as FacultyRow);
  },
  async updateFaculty(id: string, payload: Partial<Faculty>): Promise<void> {
    if (USE_MOCKS) {
      const current = mockDb.faculty.find((item) => item.id === id);
      if (!current) throw new Error('Faculty not found');
      Object.assign(current, payload);
      return;
    }

    const updatePayload: Record<string, unknown> = {};
    if (payload.name !== undefined) updatePayload.name = payload.name;
    if (payload.email !== undefined) updatePayload.email = payload.email;
    if (payload.phone !== undefined) updatePayload.phone = payload.phone;
    if (payload.address !== undefined) updatePayload.address = payload.address;
    if (payload.educationLevel !== undefined) updatePayload.education_level = payload.educationLevel;
    if (payload.hourlyRate !== undefined) updatePayload.hourly_rate = payload.hourlyRate;
    if (payload.subjects !== undefined) updatePayload.subjects = payload.subjects;
    if (payload.bankAccount !== undefined) updatePayload.bank_account = payload.bankAccount ?? null;
    if (payload.hasProfilePic !== undefined) updatePayload.has_profile_pic = payload.hasProfilePic;
    if (payload.hasTOR !== undefined) updatePayload.has_tor = payload.hasTOR;
    if (payload.hasDiploma !== undefined) updatePayload.has_diploma = payload.hasDiploma;
    if (payload.profilePicture !== undefined) updatePayload.profile_picture = payload.profilePicture ?? null;
    if (payload.documents !== undefined) updatePayload.documents = payload.documents ?? null;

    const { data, error } = await supabase
      .from('faculty')
      .update(updatePayload)
      .eq('id', id)
      .select('id')
      .maybeSingle();
    ensureNoSupabaseError(error);
    if (!data) throw new Error(`Unable to update faculty ${id}. Check Supabase RLS update policy.`);
  },
  async deleteFaculty(id: string): Promise<void> {
    if (USE_MOCKS) {
      mockDb.faculty = mockDb.faculty.filter((item) => item.id !== id);
      return;
    }

    const { error } = await supabase.from('faculty').delete().eq('id', id);
    ensureNoSupabaseError(error);
  },
  async createStudent(payload: CreateStudentPayload): Promise<Student> {
    if (USE_MOCKS) {
      mockDb.students.push(payload);
      return clone(payload);
    }
    const { data, error } = await supabase
      .from('students')
      .insert([
        {
          id: payload.id,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          address: payload.address,
          grade_level: payload.gradeLevel,
          subjects: payload.subjects,
          profile_picture: payload.profilePicture ?? null,
          documents: payload.documents ?? null,
        },
      ])
      .select()
      .single();
    ensureNoSupabaseError(error);
    return toStudentModel(data as StudentRow);
  },
  async updateStudent(id: string, payload: Partial<Student>): Promise<void> {
    if (USE_MOCKS) {
      const current = mockDb.students.find((item) => item.id === id);
      if (!current) throw new Error('Student not found');
      Object.assign(current, payload);
      return;
    }

    const updatePayload: Record<string, unknown> = {};
    if (payload.name !== undefined) updatePayload.name = payload.name;
    if (payload.email !== undefined) updatePayload.email = payload.email;
    if (payload.phone !== undefined) updatePayload.phone = payload.phone;
    if (payload.address !== undefined) updatePayload.address = payload.address;
    if (payload.gradeLevel !== undefined) updatePayload.grade_level = payload.gradeLevel;
    if (payload.subjects !== undefined) updatePayload.subjects = payload.subjects;
    if (payload.profilePicture !== undefined) updatePayload.profile_picture = payload.profilePicture ?? null;
    if (payload.documents !== undefined) updatePayload.documents = payload.documents ?? null;

    const { data, error } = await supabase
      .from('students')
      .update(updatePayload)
      .eq('id', id)
      .select('id')
      .maybeSingle();
    ensureNoSupabaseError(error);
    if (!data) throw new Error(`Unable to update student ${id}. Check Supabase RLS update policy.`);
  },
  async deleteStudent(id: string): Promise<void> {
    if (USE_MOCKS) {
      mockDb.students = mockDb.students.filter((item) => item.id !== id);
      return;
    }

    const { error } = await supabase.from('students').delete().eq('id', id);
    ensureNoSupabaseError(error);
  },
  async createSubject(payload: CreateSubjectPayload): Promise<Subject> {
    if (USE_MOCKS) {
      mockDb.subjects.push(payload);
      return clone(payload);
    }
    const { data, error } = await supabase
      .from('subjects')
      .insert([
        {
          id: payload.id,
          code: payload.code,
          name: payload.name,
          description: payload.description,
          days: payload.days,
          start_time: payload.startTime,
          end_time: payload.endTime,
          grade_level: payload.gradeLevel,
          faculty_id: payload.facultyId || null,
        },
      ])
      .select()
      .single();
    ensureNoSupabaseError(error);
    return toSubjectModel(data as SubjectRow);
  },
  async updateSubject(id: string, payload: UpdateSubjectPayload): Promise<void> {
    if (USE_MOCKS) {
      const current = mockDb.subjects.find((item) => item.id === id);
      if (!current) throw new Error('Subject not found');
      Object.assign(current, payload);
      return;
    }
    const updatePayload: Record<string, unknown> = {};
    if (payload.code !== undefined) updatePayload.code = payload.code;
    if (payload.name !== undefined) updatePayload.name = payload.name;
    if (payload.description !== undefined) updatePayload.description = payload.description;
    if (payload.days !== undefined) updatePayload.days = payload.days;
    if (payload.startTime !== undefined) updatePayload.start_time = payload.startTime;
    if (payload.endTime !== undefined) updatePayload.end_time = payload.endTime;
    if (payload.gradeLevel !== undefined) updatePayload.grade_level = payload.gradeLevel;
    if (payload.facultyId !== undefined) updatePayload.faculty_id = payload.facultyId || null;

    const { data, error } = await supabase
      .from('subjects')
      .update(updatePayload)
      .eq('id', id)
      .select('id')
      .maybeSingle();
    ensureNoSupabaseError(error);
    if (!data) throw new Error(`Unable to update subject ${id}. Check Supabase RLS update policy.`);
  },
  async deleteSubject(id: string): Promise<void> {
    if (USE_MOCKS) {
      mockDb.subjects = mockDb.subjects.filter((item) => item.id !== id);
      return;
    }
    const { error } = await supabase.from('subjects').delete().eq('id', id);
    ensureNoSupabaseError(error);
  },
  async addTimeLog(payload: TimeLog): Promise<TimeLog> {
    if (USE_MOCKS) {
      mockDb.timeLogs.push(payload);
      return clone(payload);
    }
    const { data, error } = await supabase
      .from('time_logs')
      .insert([
        {
          id: payload.id,
          date: payload.date,
          time: payload.time,
          faculty_id: payload.facultyId,
          faculty_name: payload.facultyName,
          subject: payload.subject,
          grade: payload.grade,
          hours: payload.hours,
          hourly_rate: payload.hourlyRate,
          is_overtime: payload.isOvertime,
          has_tor: payload.hasTOR,
          has_diploma: payload.hasDiploma,
          period_start: payload.periodStart ?? null,
          period_end: payload.periodEnd ?? null,
          period_label: payload.periodLabel ?? null,
        },
      ])
      .select()
      .single();
    ensureNoSupabaseError(error);
    return toTimeLogModel(data as TimeLogRow);
  },
  async deleteTimeLog(id: string): Promise<void> {
    if (USE_MOCKS) {
      mockDb.timeLogs = mockDb.timeLogs.filter((item) => item.id !== id);
      return;
    }

    const { error } = await supabase.from('time_logs').delete().eq('id', id);
    ensureNoSupabaseError(error);
  },
  async addAttendance(payload: AttendanceRecord): Promise<AttendanceRecord> {
    if (USE_MOCKS) {
      mockDb.attendance.push(payload);
      return clone(payload);
    }
    const { data, error } = await supabase
      .from('attendance_records')
      .insert([
        {
          id: payload.id,
          student_id: payload.studentId,
          student_name: payload.studentName,
          date: payload.date,
          time: payload.time,
          subject: payload.subject,
          status: payload.status,
          period_start: payload.periodStart ?? null,
          period_end: payload.periodEnd ?? null,
          period_label: payload.periodLabel ?? null,
        },
      ])
      .select()
      .single();
    ensureNoSupabaseError(error);
    return toAttendanceModel(data as AttendanceRow);
  },
};
