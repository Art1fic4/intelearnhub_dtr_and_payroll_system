import { useState } from 'react';
import { useApp } from '@/core/state/store';
import { Plus, Trash2, Edit2, X, Filter } from 'lucide-react';

export function Subjects() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterGrade, setFilterGrade] = useState<string>('');
  const [submitError, setSubmitError] = useState('');
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    days: [] as string[],
    startTime: '',
    endTime: '',
    gradeLevel: '',
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const gradeLevels = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  const timeOptions = Array.from({ length: 23 }, (_, index) => {
    const totalMinutes = 7 * 60 + index * 30;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    const label = `${displayHour}:${String(minutes).padStart(2, '0')} ${meridiem}`;
    return { value, label };
  });

  const filteredSubjects = filterGrade 
    ? subjects.filter(s => s.gradeLevel === filterGrade)
    : subjects;

  const handleCreateSubjectClick = () => {
    setIsCreating(true);
  };

  const handleDeleteSubjectClick = async (subjectId: string) => {
    await deleteSubject(subjectId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    try {
      if (editingId) {
        await updateSubject(editingId, { ...formData, facultyId: undefined }); // Keep it undefined or empty
      } else {
        const newSubject = {
          id: formData.code,
          ...formData,
          facultyId: '', // Default empty if not used here
        };
        await addSubject(newSubject);
      }

      setIsCreating(false);
      setEditingId(null);
      setFormData({
        code: '',
        name: '',
        description: '',
        days: [],
        startTime: '',
        endTime: '',
        gradeLevel: '',
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to save subject record.');
    }
  };

  const handleEdit = (subject: typeof subjects[0]) => {
    setFormData({
      code: subject.code,
      name: subject.name,
      description: subject.description,
      days: subject.days,
      startTime: subject.startTime,
      endTime: subject.endTime,
      gradeLevel: subject.gradeLevel,
    });
    setEditingId(subject.id);
    setIsCreating(true);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setSubmitError('');
    setFormData({
      code: '',
      name: '',
      description: '',
      days: [],
      startTime: '',
      endTime: '',
      gradeLevel: '',
    });
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };

  return (
    <div className="p-8 text-foreground bg-background h-full overflow-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subject</h1>
          <p className="text-muted-foreground mt-1">Manage course library</p>
        </div>
        {!isCreating && (
          <button
            onClick={handleCreateSubjectClick}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Subject
          </button>
        )}
      </div>

      {isCreating && (
        <div className="mb-8 bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">
              {editingId ? 'Edit Subject' : 'Create New Subject'}
            </h2>
            <button onClick={handleCancel} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          {submitError && <p className="px-6 pt-4 text-sm text-destructive">{submitError}</p>}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Subject Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="e.g. MTH101"
                  required
                  disabled={!!editingId}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Subject Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="e.g. Advanced Calculus"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Grade Level</label>
                <select
                  value={formData.gradeLevel}
                  onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  required
                >
                  <option value="">Select grade level</option>
                  {gradeLevels.map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Start Time</label>
                  <select
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-border bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    required
                  >
                    <option value="">Select start time</option>
                    {timeOptions.map((time) => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">End Time</label>
                  <select
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-border bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    required
                  >
                    <option value="">Select end time</option>
                    {timeOptions.map((time) => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Days of Week</label>
              <div className="flex flex-wrap gap-4">
                {daysOfWeek.map((day) => (
                  <label key={day} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.days.includes(day)}
                      onChange={() => toggleDay(day)}
                      className="w-4 h-4 text-primary border-border bg-input-background rounded focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-sm text-foreground">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-border bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                rows={3}
                placeholder="Enter a brief description of the course content and objectives..."
                required
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-border">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-border bg-transparent text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                {editingId ? 'Update' : 'Create'} Subject
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card rounded-lg border border-border shadow-sm">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Curriculum Library</h2>
            <p className="text-sm text-muted-foreground mt-1">{filteredSubjects.length} subjects</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="px-3 py-2 border border-border bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground"
            >
              <option value="">All Grades</option>
              {gradeLevels.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {filteredSubjects.length > 0 ? filteredSubjects.map((subject) => (
                <tr key={subject.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono font-medium text-foreground">{subject.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-foreground">{subject.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground max-w-xs truncate">{subject.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-muted-foreground">{subject.days.join(', ')}</p>
                    <p className="text-xs text-muted-foreground opacity-80">{subject.startTime} - {subject.endTime}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-primary/20 text-primary-foreground/90 font-medium text-xs rounded-full">
                      {subject.gradeLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(subject)}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => void handleDeleteSubjectClick(subject.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground text-sm">
                    No subjects found for the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
