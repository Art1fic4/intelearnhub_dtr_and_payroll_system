import { useMemo, useState } from 'react';
import { AlertTriangle, Flag } from 'lucide-react';
import { useApp } from '@/core/state/store';
import type { TimeLog } from '@/core/contracts/models';

type MainTab = 'Faculty' | 'Student';
type SubTab = 'pending' | 'approved';

function toMinutes(value: string): number {
  const [h = '0', m = '0'] = value.split(':');
  return Number(h) * 60 + Number(m);
}

function calculateHours(startTime: string, endTime: string): number {
  const diff = Math.max(0, toMinutes(endTime) - toMinutes(startTime));
  return Number((diff / 60).toFixed(2));
}

function isAnomalousLog(log: TimeLog): boolean {
  const expectedHours = Math.max(1, calculateHours(log.startTime, log.endTime));
  const loggedOvertime = Math.max(0, log.hours - expectedHours);
  const belowExpected = log.hours < expectedHours * 0.75;
  return belowExpected || loggedOvertime > 4;
}

export function Records() {
  const { timeLogs, updateTimeLog, batchApproveTimeLogs } = useApp();
  const [activeTab, setActiveTab] = useState<MainTab>('Faculty');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingTimes, setEditingTimes] = useState<Record<string, { startTime: string; endTime: string }>>({});
  const [submitError, setSubmitError] = useState('');

  const visibleLogs = useMemo(() => {
    const roleFiltered = timeLogs.filter((log) => log.role === activeTab);
    const status = activeSubTab === 'pending' ? 'pending' : 'approved';
    const statusFiltered = roleFiltered.filter((log) => log.status === status);
    const query = searchQuery.trim().toLowerCase();
    if (!query) return statusFiltered;
    return statusFiltered.filter((log) => log.name.toLowerCase().includes(query));
  }, [activeSubTab, activeTab, searchQuery, timeLogs]);

  const pendingVisibleIds = useMemo(
    () => visibleLogs.filter((log) => log.status === 'pending').map((log) => log.id),
    [visibleLogs],
  );

  const allSelected = pendingVisibleIds.length > 0 && pendingVisibleIds.every((id) => selectedIds.includes(id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pendingVisibleIds.includes(id)));
      return;
    }
    setSelectedIds((prev) => Array.from(new Set([...prev, ...pendingVisibleIds])));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleBatchApprove = async () => {
    setSubmitError('');
    try {
      await batchApproveTimeLogs(selectedIds);
      setSelectedIds([]);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to approve selected logs.');
    }
  };

  const handleTimeEdit = async (log: TimeLog) => {
    const draft = editingTimes[log.id];
    if (!draft) return;
    const hours = calculateHours(draft.startTime, draft.endTime);
    setSubmitError('');
    try {
      await updateTimeLog(log.id, {
        startTime: draft.startTime,
        endTime: draft.endTime,
        hours,
        auditNote: 'Manually edited by admin',
        editedByAdmin: true,
      });
      setEditingTimes((prev) => {
        const next = { ...prev };
        delete next[log.id];
        return next;
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to edit time log.');
    }
  };

  const handleReject = async (id: string) => {
    setSubmitError('');
    try {
      await updateTimeLog(id, { status: 'rejected' });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to reject log.');
    }
  };

  return (
    <div className="p-8 h-full text-foreground bg-background overflow-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Records & Timesheet Approval</h1>
        <p className="text-muted-foreground mt-1">Human verification layer for logs before payroll inclusion.</p>
      </div>

      <div className="flex gap-3 mb-4 border-b border-border">
        {(['Faculty', 'Student'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab);
              setSelectedIds([]);
            }}
            className={`px-3 py-2 border-b-2 text-sm ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
            }`}
          >
            {tab} Logs
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('pending')}
            className={`px-3 py-2 rounded text-sm ${activeSubTab === 'pending' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
          >
            The Inbox (Pending Approvals)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('approved')}
            className={`px-3 py-2 rounded text-sm ${activeSubTab === 'approved' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
          >
            The Timesheet (Approved Data)
          </button>
        </div>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by name..."
          className="w-full md:w-80 px-3 py-2 border border-border bg-input-background rounded"
        />
      </div>

      {submitError && <p className="text-sm text-destructive mb-3">{submitError}</p>}

      {activeSubTab === 'pending' && (
        <div className="mb-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => void handleBatchApprove()}
            disabled={selectedIds.length === 0}
            className="px-3 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50"
          >
            Approve Selected ({selectedIds.length})
          </button>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              {activeSubTab === 'pending' && (
                <th className="px-3 py-2">
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                </th>
              )}
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Time</th>
              <th className="px-3 py-2 text-left">Start</th>
              <th className="px-3 py-2 text-left">End</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Role</th>
              <th className="px-3 py-2 text-left">Subject Code</th>
              <th className="px-3 py-2 text-left">Subject Description</th>
              <th className="px-3 py-2 text-left">Grade</th>
              <th className="px-3 py-2 text-left">Hours</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Audit Note</th>
              {activeSubTab === 'pending' && <th className="px-3 py-2 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visibleLogs.map((log) => {
              const isAnomaly = activeSubTab === 'pending' && isAnomalousLog(log);
              const draft = editingTimes[log.id];
              return (
                <tr key={log.id} className={isAnomaly ? 'bg-amber-50' : ''}>
                  {activeSubTab === 'pending' && (
                    <td className="px-3 py-2">
                      <input type="checkbox" checked={selectedIds.includes(log.id)} onChange={() => toggleOne(log.id)} />
                    </td>
                  )}
                  <td className="px-3 py-2">{log.date}</td>
                  <td className="px-3 py-2">{log.time}</td>
                  <td className="px-3 py-2">
                    {activeSubTab === 'pending' ? (
                      <input
                        type="time"
                        value={draft?.startTime ?? log.startTime}
                        onChange={(e) =>
                          setEditingTimes((prev) => ({
                            ...prev,
                            [log.id]: { startTime: e.target.value, endTime: prev[log.id]?.endTime ?? log.endTime },
                          }))
                        }
                        className="px-2 py-1 border border-border rounded bg-input-background"
                      />
                    ) : (
                      log.startTime
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {activeSubTab === 'pending' ? (
                      <input
                        type="time"
                        value={draft?.endTime ?? log.endTime}
                        onChange={(e) =>
                          setEditingTimes((prev) => ({
                            ...prev,
                            [log.id]: { startTime: prev[log.id]?.startTime ?? log.startTime, endTime: e.target.value },
                          }))
                        }
                        className="px-2 py-1 border border-border rounded bg-input-background"
                      />
                    ) : (
                      log.endTime
                    )}
                  </td>
                  <td className="px-3 py-2">{log.name}</td>
                  <td className="px-3 py-2">{log.role}</td>
                  <td className="px-3 py-2">{log.subjectCode}</td>
                  <td className="px-3 py-2">{log.subjectDescription}</td>
                  <td className="px-3 py-2">{log.gradeLevel}</td>
                  <td className="px-3 py-2">{log.hours.toFixed(2)}</td>
                  <td className="px-3 py-2 capitalize">{log.status}</td>
                  <td className="px-3 py-2">
                    <div className="inline-flex items-center gap-1">
                      {log.editedByAdmin && <Flag className="w-3 h-3 text-amber-600" />}
                      <span>{log.auditNote ?? '-'}</span>
                      {isAnomaly && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                    </div>
                  </td>
                  {activeSubTab === 'pending' && (
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => void handleTimeEdit(log)}
                          className="px-2 py-1 border border-border rounded"
                        >
                          Save Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void updateTimeLog(log.id, { status: 'approved' })}
                          className="px-2 py-1 rounded bg-primary text-primary-foreground"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleReject(log.id)}
                          className="px-2 py-1 rounded border border-destructive text-destructive"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
            {visibleLogs.length === 0 && (
              <tr>
                <td colSpan={activeSubTab === 'pending' ? 15 : 14} className="px-4 py-10 text-center text-muted-foreground">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
