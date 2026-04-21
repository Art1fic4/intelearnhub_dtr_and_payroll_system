import { useState, useRef } from 'react';
import { useApp } from '../data/store';
import { Search, X, Mail, Phone, MapPin, GraduationCap, DollarSign, BookOpen, Plus, Upload, Lock } from 'lucide-react';

export function Faculty() {
  const { faculty, subjects, addFaculty } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    educationLevel: '',
    hourlyRate: '',
    bankName: '',
    bankAccountName: '',
    bankAccountNumber: '',
    hasProfilePic: false,
    hasTOR: false,
    hasDiploma: false,
    subjects: [] as string[],
    additionalDocs: [] as string[], // just mock names
  });

  const filteredFaculty = faculty.filter(
    f => f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         f.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selected = selectedFaculty ? faculty.find(f => f.id === selectedFaculty) : null;
  const facultySubjects = selected ? subjects.filter(s => s.facultyId === selected.id) : [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const random = Math.floor(1000 + Math.random() * 9000);
    
    addFaculty({
      id: `FA-${random}`,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      educationLevel: formData.educationLevel,
      hourlyRate: parseFloat(formData.hourlyRate) || 0,
      bankAccount: `${formData.bankName} - ${formData.bankAccountNumber} (${formData.bankAccountName})`,
      hasProfilePic: formData.hasProfilePic,
      hasTOR: formData.hasTOR,
      hasDiploma: formData.hasDiploma,
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
      educationLevel: '',
      hourlyRate: '',
      bankName: '',
      bankAccountName: '',
      bankAccountNumber: '',
      hasProfilePic: false,
      hasTOR: false,
      hasDiploma: false,
      subjects: [],
      additionalDocs: [],
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileNames = Array.from(e.target.files).map(f => f.name);
      setFormData(prev => ({
        ...prev,
        additionalDocs: [...prev.additionalDocs, ...fileNames]
      }));
    }
  };

  if (isCreating) {
    const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
    
    return (
      <div className="h-full bg-background overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
        <div className="p-8 md:p-12 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Registration Form - FACULTY</h1>
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
            {/* Section 1: Personal Details */}
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
                    placeholder="e.g. Dr. John Smith"
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
                    placeholder="john.smith@intelearn.edu"
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
                  placeholder="123 Academic Ave, Education City"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className="block text-sm font-semibold text-foreground/90 mb-2.5">Highest Educational Attainment</label>
                  <select
                    required
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-input-background focus:ring-2 focus:ring-primary focus:outline-none text-foreground appearance-none transition-all"
                  >
                    <option value="">Select education level</option>
                    <option value="Bachelors">Bachelor's Degree</option>
                    <option value="Masters">Master's Degree</option>
                    <option value="Doctorate">Doctorate / PhD</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground/90 mb-2.5">Faculty Setup Password</label>
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

            {/* Section 2: Subject Assignment */}
            <div className="bg-card rounded-2xl border border-border p-8 md:p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-primary mb-8 pb-4 border-b border-primary/10">Subject Assignment</h2>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-8">
                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-foreground/90 mb-2.5">Subject Code</label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-input-background focus:ring-2 focus:ring-primary focus:outline-none text-foreground appearance-none transition-all cursor-pointer"
                  >
                    <option value="">Select subject code</option>
                    {subjects.map(s => (
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
                  <label className="block text-sm font-semibold text-foreground/90 mb-2.5">Grade Level</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedSubject?.gradeLevel || ''}
                    className="w-full px-4 py-3 border border-border/50 rounded-xl bg-muted/50 text-muted-foreground focus:outline-none cursor-not-allowed"
                    placeholder="Auto-filled"
                  />
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
                  <p className="text-sm font-semibold text-foreground mb-3">Assigned Subjects:</p>
                  <div className="overflow-x-auto border border-border rounded-xl bg-card">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead className="bg-muted/50 border-b border-border">
                        <tr>
                          <th className="px-4 py-3 text-sm font-semibold text-foreground">Subject Code</th>
                          <th className="px-4 py-3 text-sm font-semibold text-foreground">Description</th>
                          <th className="px-4 py-3 text-sm font-semibold text-foreground">Days</th>
                          <th className="px-4 py-3 text-sm font-semibold text-foreground">Time</th>
                          <th className="px-4 py-3 text-sm font-semibold text-foreground">Grade Level</th>
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
                              <td className="px-4 py-3 text-sm text-foreground">{s.gradeLevel}</td>
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

            {/* Section 3: Compensation & Bank Details */}
            <div className="bg-card rounded-2xl border border-border p-8 md:p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-primary mb-8 pb-4 border-b border-primary/10">Compensation & Bank Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-foreground/90 mb-2.5">Rate per Hour (USD)</label>
                  <input
                    type="number"
                    required
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-input-background focus:ring-2 focus:ring-primary focus:outline-none text-foreground transition-all"
                    placeholder="e.g. 65.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground/90 mb-2.5">Bank Name</label>
                  <input
                    type="text"
                    required
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-input-background focus:ring-2 focus:ring-primary focus:outline-none text-foreground transition-all"
                    placeholder="e.g. BDO"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className="block text-sm font-semibold text-foreground/90 mb-2.5">Account Name</label>
                  <input
                    type="text"
                    required
                    value={formData.bankAccountName}
                    onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-input-background focus:ring-2 focus:ring-primary focus:outline-none text-foreground transition-all"
                    placeholder="e.g. John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground/90 mb-2.5">Account Number</label>
                  <input
                    type="text"
                    required
                    value={formData.bankAccountNumber}
                    onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-input-background focus:ring-2 focus:ring-primary focus:outline-none text-foreground transition-all"
                    placeholder="1234-5678-9012"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Required Documents */}
            <div className="bg-card rounded-2xl border border-border p-8 md:p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-primary mb-8 pb-4 border-b border-primary/10">Required Documents</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-input-background border border-border rounded-xl p-5 gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-base font-semibold text-foreground">Profile Picture</span>
                    <span className="text-sm text-muted-foreground">Upload a clear, recent photo</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {formData.hasProfilePic && <span className="text-sm text-primary font-bold bg-primary/10 px-3 py-1 rounded-full">✓ Uploaded</span>}
                    <label className="cursor-pointer px-6 py-2.5 bg-background border-2 border-border hover:border-primary/50 rounded-lg text-sm font-bold text-foreground transition-all shrink-0">
                      Browse Files
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setFormData({ ...formData, hasProfilePic: !!e.target.files?.length })}
                      />
                    </label>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-input-background border border-border rounded-xl p-5 gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-base font-semibold text-foreground">Transcript of Records</span>
                    <span className="text-sm text-muted-foreground">Official university transcript</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {formData.hasTOR && <span className="text-sm text-primary font-bold bg-primary/10 px-3 py-1 rounded-full">✓ Uploaded</span>}
                    <label className="cursor-pointer px-6 py-2.5 bg-background border-2 border-border hover:border-primary/50 rounded-lg text-sm font-bold text-foreground transition-all shrink-0">
                      Browse Files
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setFormData({ ...formData, hasTOR: !!e.target.files?.length })}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-input-background border border-border rounded-xl p-5 gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-base font-semibold text-foreground">Diploma</span>
                    <span className="text-sm text-muted-foreground">Highest educational degree</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {formData.hasDiploma && <span className="text-sm text-primary font-bold bg-primary/10 px-3 py-1 rounded-full">✓ Uploaded</span>}
                    <label className="cursor-pointer px-6 py-2.5 bg-background border-2 border-border hover:border-primary/50 rounded-lg text-sm font-bold text-foreground transition-all shrink-0">
                      Browse Files
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setFormData({ ...formData, hasDiploma: !!e.target.files?.length })}
                      />
                    </label>
                  </div>
                </div>
              </div>
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
                Register Faculty
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
            <h1 className="text-3xl font-bold text-foreground">Faculty Accounts</h1>
            <p className="text-muted-foreground mt-1">Manage and provision teaching staff</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Account
          </button>
        </div>

        {/* Search */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or employee ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-border bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
          />
        </div>

        {/* Faculty List */}
        <div className="flex-1 bg-card rounded-lg border border-border overflow-auto shadow-sm">
          <div className="divide-y divide-border">
            {filteredFaculty.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFaculty(f.id)}
                className={`w-full p-4 text-left hover:bg-muted transition-colors ${
                  selectedFaculty === f.id ? 'bg-primary/10' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{f.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{f.id}</p>
                    <p className="text-xs text-muted-foreground mt-1">{f.educationLevel}</p>
                  </div>
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
                    ${f.hourlyRate}/hr
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Profile Details */}
      {selected && (
        <div className="w-96 bg-card rounded-lg border border-border p-6 overflow-auto shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">{selected.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{selected.id}</p>
            </div>
            <button
              onClick={() => setSelectedFaculty(null)}
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

          {/* Academic Background */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Academic Background</h3>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <GraduationCap className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Education Level</p>
                <p className="text-sm font-medium text-foreground">{selected.educationLevel}</p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Transcript of Records (TOR)</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selected.hasTOR ? 'bg-primary/20 text-primary-foreground/90' : 'bg-destructive/20 text-destructive-foreground'
                }`}>
                  {selected.hasTOR ? 'Verified' : 'Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Diploma</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selected.hasDiploma ? 'bg-primary/20 text-primary-foreground/90' : 'bg-destructive/20 text-destructive-foreground'
                }`}>
                  {selected.hasDiploma ? 'Verified' : 'Missing'}
                </span>
              </div>
            </div>
          </div>

          {/* Hourly Rate */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Compensation</h3>
            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Hourly Rate</p>
                <p className="text-xl font-bold text-foreground">${selected.hourlyRate}</p>
              </div>
            </div>
            {selected.bankAccount && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground">Bank Account</p>
                <p className="text-sm text-foreground font-mono">{selected.bankAccount}</p>
              </div>
            )}
          </div>

          {/* Subject Assignments */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Subject Assignments</h3>
            <div className="space-y-2">
              {facultySubjects.length > 0 ? facultySubjects.map((subject) => (
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
              )) : (
                <p className="text-sm text-muted-foreground italic">No subjects assigned.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {!selected && (
        <div className="w-96 bg-card rounded-lg border border-border p-6 flex items-center justify-center shadow-sm">
          <div className="text-center text-muted-foreground">
            <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Select a faculty member to view details</p>
          </div>
        </div>
      )}
    </div>
  );
}
