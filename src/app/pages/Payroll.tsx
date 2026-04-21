import { useState, useMemo } from 'react';
import { useApp } from '../data/store';
import { FileText, Calendar, DollarSign, Calculator } from 'lucide-react';
import learnhubLogo from "../../imports/LEARNHUB-BLACK.png";

const formatTime = (time: string) => {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${(m || 0).toString().padStart(2, '0')} ${ampm}`;
};

const addHoursToTime = (time: string, hours: number) => {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const totalMins = (h || 0) * 60 + (m || 0) + (hours || 0) * 60;
  const newH = Math.floor(totalMins / 60) % 24;
  const newM = Math.round(totalMins % 60);
  const ampm = newH >= 12 ? 'PM' : 'AM';
  const h12 = newH % 12 || 12;
  return `${h12}:${newM.toString().padStart(2, '0')} ${ampm}`;
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatLongDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
};

const formatDayAndDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const date = d.getDate();
  const day = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  return `${month} ${date} - ${day}`;
};

export function Payroll() {
  const { faculty, timeLogs, subjects } = useApp();
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deduction, setDeduction] = useState<number>(0);

  const selectedFacultyData = faculty.find(f => f.id === selectedFaculty);
  
  const filteredLogs = useMemo(() => {
    return timeLogs.filter(
      log => log.facultyId === selectedFaculty &&
             (!startDate || log.date >= startDate) &&
             (!endDate || log.date <= endDate)
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [timeLogs, selectedFaculty, startDate, endDate]);

  const facultySubjects = useMemo(() => {
    return subjects.filter(s => s.facultyId === selectedFaculty);
  }, [subjects, selectedFaculty]);

  const totalHours = filteredLogs.reduce((sum, log) => sum + log.hours, 0);
  const hourlyRate = selectedFacultyData?.hourlyRate || 0;
  const grossPay = totalHours * hourlyRate;
  const netPay = grossPay - deduction;

  const handlePrint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacultyData || !startDate || !endDate) {
      alert("Please select a faculty member and specify a date range.");
      return;
    }
    window.print();
  };

  return (
    <div className="p-8 pb-20 print:p-0 print:m-0 text-foreground bg-background h-full overflow-auto">
      {/* Preload logo for print so it shows up instantly in PDF */}
      <img src={learnhubLogo} alt="" className="fixed top-0 left-0 w-0 h-0 opacity-0 pointer-events-none" aria-hidden="true" />
      
      {/* --- UI Section (Hidden on Print) --- */}
      <div className="print:hidden max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Generate Payroll</h1>
          <p className="text-muted-foreground mt-1">Calculate and prepare payroll documents</p>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-border bg-muted">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-border bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-border bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Faculty Name</label>
                <select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  className="w-full px-3 py-2 border border-border bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                >
                  <option value="">Choose faculty member</option>
                  {faculty.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Total Hours Rendered</label>
                <div className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-foreground font-semibold text-right">
                  {totalHours > 0 ? `${totalHours} Hrs` : '0 Hrs'}
                </div>
              </div>
            </div>
          </div>

          <div className="p-0 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted border-b border-border text-muted-foreground font-medium uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Time Start</th>
                  <th className="px-6 py-3">Time End</th>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3 text-right">Hours Rendered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-foreground">{formatDate(log.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{formatTime(log.time)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{addHoursToTime(log.time, log.hours)}</td>
                      <td className="px-6 py-4 text-foreground">{log.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-foreground">
                        {log.hours}
                        {log.isOvertime && <span className="ml-2 text-xs text-primary-foreground bg-primary/80 px-2 py-0.5 rounded-full">Overtime</span>}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      No records found for the selected criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-border bg-muted">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-foreground whitespace-nowrap">Total Salary</label>
                  <div className="w-32 px-3 py-2 bg-input-background border border-border rounded-lg text-foreground font-bold text-right text-lg">
                    ${grossPay.toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-foreground whitespace-nowrap">Total Deduction</label>
                  <div className="relative w-32">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      value={deduction || ''}
                      onChange={(e) => setDeduction(parseFloat(e.target.value) || 0)}
                      className="w-full pl-9 pr-3 py-2 border border-border bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-right text-foreground"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-foreground whitespace-nowrap">Net Pay</label>
                  <div className="w-32 px-3 py-2 bg-input-background border border-border rounded-lg text-foreground font-bold text-right text-lg text-primary">
                    ${netPay.toFixed(2)}
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground italic font-mono flex items-center">
                  <Calculator className="w-3 h-3 mr-1" />
                  200 / 60 = 3.33 per min
                </div>
              </div>

              <button
                onClick={handlePrint}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedFacultyData || !startDate || !endDate}
              >
                <FileText className="w-5 h-5" />
                GENERATE PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Print Section --- */}
      {selectedFacultyData && startDate && endDate && (
        <div className="hidden print:block print:p-12 w-full max-w-4xl mx-auto bg-white text-black">
          <style>
            {`
              @media print {
                @page { margin: 0; }
                body { padding: 1.6cm; }
              }
            `}
          </style>
          {/* Header */}
          <div className="text-center mb-10 font-sans text-black flex flex-col items-center">
            <img src={learnhubLogo} alt="Logo" className="w-64 object-contain mb-4" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }} />
            <div className="text-lg font-bold uppercase tracking-wider">PAYROLL SUMMARY</div>
          </div>

          {/* Info Section */}
          <div className="mb-6 space-y-4 text-sm font-medium text-black">
            <div className="flex items-start gap-4">
              <span className="uppercase font-bold w-48 shrink-0">NAME :</span>
              <span className="font-bold uppercase tracking-widest">{selectedFacultyData.name}</span>
            </div>
            
            <div className="flex items-start gap-4">
              <span className="uppercase font-bold w-48 shrink-0">PAYROLL DATE :</span>
              <span className="uppercase max-w-md leading-relaxed">
                {formatLongDate(startDate)} TO {formatLongDate(endDate)}<br/>
                / {new Date(startDate).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()} {new Date(startDate).getDate()} - {new Date(endDate).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()} {new Date(endDate).getDate()}
              </span>
            </div>

            <div className="flex items-start gap-4">
              <span className="uppercase font-bold w-48 shrink-0">DISBURSEMENT DATE :</span>
              <span className="uppercase max-w-md leading-relaxed">
                15TH DAY OF THE MO. /<br/>END OF THE MON. - DAY
              </span>
            </div>
          </div>

          {/* Logs Box */}
          <div className="border border-black p-4 mb-8 min-h-[250px] text-black">
            <div className="flex justify-between font-bold pb-4 text-sm uppercase">
              <div>MON DATE - DAY - [ST - ET]</div>
              <div>TOTAL HRS</div>
            </div>
            
            <div className="space-y-2 text-sm font-medium">
              {filteredLogs.map(log => (
                <div key={log.id} className="flex justify-between uppercase">
                  <div>
                    {formatDayAndDate(log.date)} - [{formatTime(log.time)} - {addHoursToTime(log.time, log.hours)}]
                  </div>
                  <div className="w-24 text-right pr-4">
                    {log.hours.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Hours & Name */}
          <div className="mb-10 space-y-6 text-sm font-bold uppercase text-black">
            <div className="flex items-end gap-2">
              <span className="w-24">TOTAL HRS</span>
              <span className="border-b border-black w-64 px-2">{totalHours.toFixed(2)}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="w-24 leading-snug">FACULTY<br/>NAME :</span>
              <span className="border-b border-black w-80 px-2">{selectedFacultyData.name}</span>
            </div>
          </div>

          {/* Subject Schedule */}
          <div className="mb-12 text-black">
            <div className="font-bold uppercase mb-4 text-sm">SUBJECT SCHEDULE</div>
            <div className="ml-8">
              <div className="text-sm font-bold uppercase mb-2 tracking-wide flex flex-wrap gap-2">
                <span>SUBJECT CODE</span> <span className="font-normal">|</span> <span>DESCRIPTION</span> <span className="font-normal">|</span> <span>DAY</span> <span className="font-normal">|</span> <span>TIME</span>
              </div>
              
              <div className="space-y-2 text-sm font-medium">
                {facultySubjects.length > 0 ? (
                  facultySubjects.map(sub => (
                    <div key={sub.id} className="uppercase tracking-wide flex flex-wrap gap-2">
                      <span>{sub.code}</span> <span className="font-normal">|</span> <span>{sub.name}</span> <span className="font-normal">|</span> <span>{sub.days.join(', ')}</span> <span className="font-normal">|</span> <span>{formatTime(sub.startTime)} - {formatTime(sub.endTime)}</span>
                    </div>
                  ))
                ) : (
                  <div className="italic opacity-70">No scheduled subjects found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
