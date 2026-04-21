import { useState } from 'react';
import { useApp } from '../data/store';
import { Search, X, Mail, Phone, MapPin, BookOpen, Calendar, Plus, Filter, Lock } from 'lucide-react';

export function Students() {
  const { students, subjects, attendance, addStudent } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    gradeLevel: '',
    subjects: [] as string[],
  });

  const gradeLevels = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

  const filteredStudents = students.filter(
    s => (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
         (filterGrade === '' || s.gradeLevel === filterGrade)
  );

  const selected = selectedStudent ? students.find(s => s.id === selectedStudent) : null;
  const studentSubjects = selected ? subjects.filter(s => selected.subjects.includes(s.id)) : [];
  const studentAttendance = selected ? attendance.filter(a => a.studentId === selected.id) : [];

  const attendanceRate = studentAttendance.length > 0
    ? (studentAttendance.filter(a => a.status === 'Present').length / studentAttendance.length * 100).toFixed(0)
    : 0;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const random = Math.floor(10000 + Math.random() * 90000);
    
    addStudent({
      id: `ST-${random}`,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      gradeLevel: formData.gradeLevel,
      subjects: formData.subjects,
    });
    
    setIsCreating(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      gradeLevel: '',
      subjects: [],
    });
    setSelectedSubjectId('');
  };

  const handleAddSubject = () => {
    if (selectedSubjectId && !formData.subjects.includes(selectedSubjectId)) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, selectedSubjectId],
      }));
      setSelectedSubjectId('');
    }
  };

  const removeSubject = (subjectId: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subjectId),
    }));
  };

  if (isCreating) {
    const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
    const availableSubjects = formData.gradeLevel 
      ? subjects.filter(s => s.gradeLevel === formData.gradeLevel)
      : subjects;

    return (
      <div className="h-full bg-background overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
        <div className="p-8 md:p-12 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Registration Form - STUDENT</h1>
              <p className="text-muted-foreground mt-2 text-base">Complete all required information to provision a new account</p>
            </div>
            <button
              onClick={() => setIsCreating(false)}
              className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleCreate} className="space-y-10">
            {/* Personal Details */}
            <div className="bg-card rounded-2xl border border-border p-8 md:p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-primary mb-8 pb-4 border-b border-primary/10">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-8">
                <div className="md:col-span-5">
                  <label className="block text-sm font-semibold text-foreground/90 mb-2.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-input-background focus:ring-2 focus:ring-primary focus:outline-none text-foreground transition-all"
                    placeholder="e.g. Jane Doe"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-foreground/90 mb-2.5">Contact Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-input-background focus:ring-2 focus:ring-primary focus:outline-none text-foreground transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="md:col-span-4">
                  <label className="block text-sm font-semibold text-foreground/90 mb-2.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-input-background focus:ring-2 focus:ring-primary focus:outline-none text-foreground transition-all"
                    placeholder="jane.doe@student.intelearn.edu"
                  />
                </div>
              </div>
              <div className="mb-8">
                <label className="block text-sm font-semibold text-foreground/90 mb-2.5">Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-input-background focus:ring-2 focus:ring-primary focus:outline-none text-foreground transition-all"
                  placeholder="456 Student St, Campus Town"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className="block text-sm font-semibold text-foreground/90 mb-2.5">Grade Level</label>
                  <select
                    required
                    value={formData.gradeLevel}
                    onChange={(e) => {
                      setFormData({ ...formData, gradeLevel: e.target.value, subjects: [] });
                      setSelectedSubjectId('');
                    }}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-input-background focus:ring-2 focus:ring-primary focus:outline-none text-foreground appearance-none transition-all"
                  >
                    <option value="">Select grade level</option>
                    {gradeLevels.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground/90 mb-2.5">Student Setup Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-input-background focus:ring-2 focus:ring-primary focus:outline-none text-foreground transition-all"
                    placeholder="Enter secure password"
                  />
                </div>
              </div>
            </div>

            {/* Subject Assignment */}
            <div className="bg-card rounded-2xl border border-border p-8 md:p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-primary mb-8 pb-4 border-b border-primary/10">Subject Assignment</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-8">
                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-foreground/90 mb-2.5">Subject Code</label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    disabled={!formData.gradeLevel}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-input-background focus:ring-2 focus:ring-primary focus:outline-none text-foreground appearance-none transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <option value="">{formData.gradeLevel ? 'Select subject code' : 'Select grade level first'}</option>
                    {availableSubjects.map(s => (
                      <option key={s.id} value={s.id}>{s.code}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-6">
                  <label className="block text-sm font-semibold text-foreground/90 mb-2.5">Description</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedSubject?.name || ''}
                    className="w-full px-4 py-3 border border-border/50 rounded-xl bg-muted/50 text-muted-foreground focus:outline-none cursor-not-allowed"
                    placeholder="Auto-filled"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-foreground/90 mb-2.5">Days</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedSubject?.days.join(', ') || ''}
                    className="w-full px-4 py-3 border border-border/50 rounded-xl bg-muted/50 text-muted-foreground focus:outline-none cursor-not-allowed"
                    placeholder="Auto-filled"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-end mb-4">
                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-foreground/90 mb-2.5">Start Time</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedSubject?.startTime || ''}
                    className="w-full px-4 py-3 border border-border/50 rounded-xl bg-muted/50 text-muted-foreground focus:outline-none cursor-not-allowed"
                    placeholder="Auto-filled"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-foreground/90 mb-2.5">End Time</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedSubject?.endTime || ''}
                    className="w-full px-4 py-3 border border-border/50 rounded-xl bg-muted/50 text-muted-foreground focus:outline-none cursor-not-allowed"
                    placeholder="Auto-filled"
                  />
                </div>
                <div className="md:col-span-4">
                  {/* Empty space or additional fields could go here, but for now we'll match Faculty layout structure */}
                </div>
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    disabled={!selectedSubjectId || formData.subjects.includes(selectedSubjectId)}
                    className="w-full h-[50px] bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> Add
                  </button>
                </div>
              </div>

              {formData.subjects.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border/50">
                  <p className="text-sm font-semibold text-foreground mb-3">Enrolled Subjects:</p>
                  <div className="overflow-x-auto border border-border rounded-xl bg-card">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          <th className="px-4 py-3 text-sm font-semibold text-foreground">Subject Code</th>
                          <th className="px-4 py-3 text-sm font-semibold text-foreground">Description</th>
                          <th className="px-4 py-3 text-sm font-semibold text-foreground">Days</th>
                          <th className="px-4 py-3 text-sm font-semibold text-foreground">Time</th>
                          <th className="px-4 py-3 text-sm font-semibold text-foreground text-center w-20">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.subjects.map((subId, index) => {
                          const s = subjects.find(x => x.id === subId);
                          if (!s) return null;
                          return (
                            <tr key={subId} className={index !== formData.subjects.length - 1 ? "border-b border-border hover:bg-muted/30" : "hover:bg-muted/30"}>
                              <td className="px-4 py-3 text-sm font-medium text-primary">{s.code}</td>
                              <td className="px-4 py-3 text-sm text-foreground">{s.name}</td>
                              <td className="px-4 py-3 text-sm text-foreground">{s.days.join(', ')}</td>
                              <td className="px-4 py-3 text-sm text-foreground">{s.startTime} - {s.endTime}</td>
                              <td className="px-4 py-3 text-sm text-center">
                                <button
                                  type="button"
                                  onClick={() => removeSubject(subId)}
                                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                >
                                  <X className="w-4 h-4 mx-auto" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 pb-8">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-8 py-3.5 border-2 border-border text-foreground font-bold rounded-xl hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
              >
                Register Student
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 flex gap-6 h-full text-foreground bg-background">
      {/* Left Panel - Directory */}
      <div className="flex-1 flex flex-col">
        {/* Header & Actions */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Student Accounts</h1>
            <p className="text-muted-foreground mt-1">Manage and provision student records</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Account
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or student ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
            />
          </div>
          <div className="relative w-48 shrink-0">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="w-full pl-9 pr-4 py-3 border border-border bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground appearance-none"
            >
              <option value="">All Grades</option>
              {gradeLevels.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Student List */}
        <div className="flex-1 bg-card rounded-lg border border-border overflow-auto shadow-sm">
          <div className="divide-y divide-border">
            {filteredStudents.length > 0 ? filteredStudents.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStudent(s.id)}
                className={`w-full p-4 text-left hover:bg-muted transition-colors ${
                  selectedStudent === s.id ? 'bg-primary/10' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{s.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{s.id}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.gradeLevel}</p>
                  </div>
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
                    {s.subjects.length} subjects
                  </span>
                </div>
              </button>
            )) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No students match your criteria.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Student Details */}
      {selected && (
        <div className="w-96 bg-card rounded-lg border border-border p-6 overflow-auto shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">{selected.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{selected.id}</p>
            </div>
            <button
              onClick={() => setSelectedStudent(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contact Info */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-foreground">{selected.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Password</p>
                  <p className="text-sm text-foreground font-mono bg-muted px-2 py-0.5 rounded mt-0.5 inline-block">{selected.password || '••••••••'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm text-foreground">{selected.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm text-foreground">{selected.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grade Level */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Academic Info</h3>
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-xs text-muted-foreground">Current Grade Level</p>
              <p className="text-lg font-semibold text-foreground">{selected.gradeLevel}</p>
            </div>
          </div>

          {/* Attendance Rate */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Attendance</h3>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Attendance Rate</span>
                <span className="text-2xl font-bold text-primary">{attendanceRate}%</span>
              </div>
              <div className="w-full bg-input-background rounded-full h-2 overflow-hidden border border-border">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {studentAttendance.filter(a => a.status === 'Present').length} present out of {studentAttendance.length} sessions
              </p>
            </div>
          </div>

          {/* Enrolled Subjects */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Enrolled Subjects</h3>
            <div className="space-y-2">
              {studentSubjects.map((subject) => (
                <div key={subject.id} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{subject.name}</p>
                      <p className="text-xs text-muted-foreground">{subject.code}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {subject.days.join(', ')} • {subject.startTime} - {subject.endTime}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance History */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Attendance History</h3>
            <div className="space-y-2">
              {studentAttendance.slice(0, 10).map((record) => (
                <div key={record.id} className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{record.subject}</p>
                        <p className="text-xs text-muted-foreground">{record.date} at {record.time}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      record.status === 'Present'
                        ? 'bg-primary/20 text-primary-foreground/90'
                        : 'bg-destructive/20 text-destructive-foreground'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                </div>
              ))}
              {studentAttendance.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No attendance records.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {!selected && (
        <div className="w-96 bg-card rounded-lg border border-border p-6 flex items-center justify-center shadow-sm">
          <div className="text-center text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Select a student to view details</p>
          </div>
        </div>
      )}
    </div>
  );
}
