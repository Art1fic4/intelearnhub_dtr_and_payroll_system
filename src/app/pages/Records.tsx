import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useApp } from '../data/store';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function Records() {
  const { faculty, students, subjects } = useApp();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'faculty' | 'students'>(
    location.state?.tab === 'students' ? 'students' : 'faculty'
  );
  
  useEffect(() => {
    if (location.state?.tab === 'faculty' || location.state?.tab === 'students') {
      setActiveTab(location.state.tab);
    }
  }, [location.state?.tab]);
  
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    if (expandedRowId === id) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(id);
    }
  };

  const getSubjPopulation = (subjectId: string) => {
    return students.filter(s => s.subjects.includes(subjectId)).length;
  };

  const getWeeklyInput = (subject: typeof subjects[0]) => {
    if (!subject.startTime || !subject.endTime) return '0 hrs';
    // basic mock calculation for weekly input
    const start = parseInt(subject.startTime.split(':')[0]) || 0;
    const end = parseInt(subject.endTime.split(':')[0]) || 0;
    const diff = Math.max(1, end - start);
    return `${diff * subject.days.length} hrs`;
  };

  const formatDays = (days: string[]) => {
    const map: Record<string, string> = {
      'Monday': 'M',
      'Tuesday': 'T',
      'Wednesday': 'W',
      'Thursday': 'TH',
      'Friday': 'F'
    };
    return days.map(d => map[d] || d.charAt(0)).join(',');
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [h, m] = time.split(':');
    let hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m}${ampm}`;
  };

  return (
    <div className="p-8 h-full text-foreground bg-background overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Master Records</h1>
        <p className="text-muted-foreground mt-1">Detailed directory of all faculty and student information</p>
      </div>

      <div className="flex gap-4 mb-6 border-b border-border pb-2">
        <button
          onClick={() => { setActiveTab('faculty'); setExpandedRowId(null); }}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'faculty' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Faculty Records
        </button>
        <button
          onClick={() => { setActiveTab('students'); setExpandedRowId(null); }}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'students' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Student Records
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        {activeTab === 'faculty' ? (
          <table className="w-full text-left">
            <thead className="bg-muted border-b border-border text-muted-foreground text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-3 w-8"></th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Faculty ID</th>
                <th className="px-6 py-3">Phone Number</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Educational Level</th>
                <th className="px-6 py-3 text-right">Compensation Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {faculty.map((f) => (
                <React.Fragment key={f.id}>
                  <tr 
                    onClick={() => toggleRow(f.id)}
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      {expandedRowId === f.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{f.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{f.id}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{f.phone}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{f.email}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{f.educationLevel}</td>
                    <td className="px-6 py-4 text-sm text-foreground text-right font-medium">${f.hourlyRate}/hr</td>
                  </tr>
                  
                  {expandedRowId === f.id && (
                    <tr className="bg-muted/30">
                      <td colSpan={7} className="px-14 py-6 border-b border-border/50">
                        <div className="mb-3">
                          <h3 className="text-sm font-semibold text-foreground">Assigned Subjects</h3>
                        </div>
                        <div className="bg-background border border-border shadow-sm">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-muted border-b border-border text-muted-foreground font-medium text-xs">
                              <tr>
                                <th className="px-4 py-3">Subject Code</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3 text-center">Day</th>
                                <th className="px-4 py-3 text-center">Time</th>
                                <th className="px-4 py-3 text-center">Total Subj. Population</th>
                                <th className="px-4 py-3 text-right">Total Expected Weekly Input</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {subjects.filter(s => s.facultyId === f.id).length > 0 ? (
                                subjects.filter(s => s.facultyId === f.id).map(sub => (
                                  <tr key={sub.id} className="hover:bg-muted/50 transition-colors bg-background">
                                    <td className="px-4 py-3 text-foreground font-medium">{sub.code}</td>
                                    <td className="px-4 py-3 text-foreground uppercase">{sub.name}</td>
                                    <td className="px-4 py-3 text-foreground text-center">{formatDays(sub.days)}</td>
                                    <td className="px-4 py-3 text-foreground text-center">{formatTime(sub.startTime)} - {formatTime(sub.endTime)}</td>
                                    <td className="px-4 py-3 text-foreground text-center">{getSubjPopulation(sub.id)}</td>
                                    <td className="px-4 py-3 text-foreground text-right">{getWeeklyInput(sub)}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={6} className="px-4 py-4 text-center text-muted-foreground italic bg-background">No assigned subjects found.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-muted border-b border-border text-muted-foreground text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-3 w-8"></th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Student ID</th>
                <th className="px-6 py-3">Phone Number</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Academic Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.map((s) => (
                <React.Fragment key={s.id}>
                  <tr 
                    onClick={() => toggleRow(s.id)}
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      {expandedRowId === s.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{s.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{s.id}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{s.phone}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{s.email}</td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium">
                      <span className="px-2.5 py-0.5 bg-primary/20 text-primary-foreground/90 rounded-full text-xs">
                        {s.gradeLevel}
                      </span>
                    </td>
                  </tr>
                  
                  {expandedRowId === s.id && (
                    <tr className="bg-muted/30">
                      <td colSpan={6} className="px-14 py-6 border-b border-border/50">
                        <div className="mb-3">
                          <h3 className="text-sm font-semibold text-foreground">Enrolled Subjects</h3>
                        </div>
                        <div className="bg-background border border-border shadow-sm">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-muted border-b border-border text-muted-foreground font-medium text-xs">
                              <tr>
                                <th className="px-4 py-3">Subject Code</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3 text-center">Day</th>
                                <th className="px-4 py-3 text-center">Time</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {s.subjects.length > 0 ? (
                                subjects.filter(sub => s.subjects.includes(sub.id)).map(sub => (
                                  <tr key={sub.id} className="hover:bg-muted/50 transition-colors bg-background">
                                    <td className="px-4 py-3 text-foreground font-medium">{sub.code}</td>
                                    <td className="px-4 py-3 text-foreground uppercase">{sub.name}</td>
                                    <td className="px-4 py-3 text-foreground text-center">{formatDays(sub.days)}</td>
                                    <td className="px-4 py-3 text-foreground text-center">{formatTime(sub.startTime)} - {formatTime(sub.endTime)}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={4} className="px-4 py-4 text-center text-muted-foreground italic bg-background">No enrolled subjects found.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
