import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, Clock, FileText, Search } from "lucide-react";

import { useAuth } from "@/features/auth";
import { FACULTY_ATTENDANCE_HISTORY, FACULTY_NAV_ITEMS } from "@/features/portal/faculty/model/constants";

import PortalHeader from "@/app/components/portal/PortalHeader";
import PortalLayout from "@/app/components/portal/PortalLayout";
import PortalSidebar from "@/app/components/portal/PortalSidebar";

export default function FacultyPortal() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const shouldReduceMotion = useReducedMotion();
  const [activeView, setActiveView] = useState("dashboard");
  const [isTimedIn, setIsTimedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.type !== "faculty") {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.type !== "faculty") {
    return null;
  }

  const facultyData = {
    name: currentUser.name,
    code: currentUser.id,
    role: "Senior Faculty",
    email: `${currentUser.id.toLowerCase().replace("-", "")}@intelearnhub.com`,
    department: "Computer Science",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  };

  const filteredHistory = useMemo(
    () =>
      FACULTY_ATTENDANCE_HISTORY.filter(
        (record) => record.date.includes(searchTerm) || record.subject.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = useMemo(
    () => filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredHistory, currentPage]
  );

  const handleTimeIn = () => {
    setIsTimedIn(true);
  };

  const handleTimeOut = () => {
    setIsTimedIn(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const surfaceClass =
    "rounded-2xl border border-border/80 bg-card/95 p-6 shadow-[0_18px_36px_rgba(11,11,11,0.08)] backdrop-blur-sm sm:p-8";
  const metricClass = "rounded-xl border border-accent/20 bg-gradient-to-br from-secondary/50 via-card to-card p-5";
  const mutedInputClass =
    "w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-foreground placeholder:text-muted-foreground/80 focus:border-accent focus:outline-none";
  const searchInputClass =
    "w-full rounded-xl border border-border bg-background/80 py-3 pr-4 pl-10 text-foreground placeholder:text-muted-foreground/80 focus:border-accent focus:outline-none";
  const sidebarWidth = isSidebarCollapsed ? "96px" : "320px";

  const renderDashboard = () => (
    <>
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={surfaceClass}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center rounded-full border border-accent/35 bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#b08d18]">
              Faculty Workspace
            </p>
            <h2 className="mb-2 text-3xl font-bold text-foreground">Welcome, {facultyData.name.split(" ")[1]}!</h2>
            <p className="text-muted-foreground">
              {isTimedIn ? "You are currently Timed In" : "Ready to start your day?"}
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className={metricClass}>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Shift Status</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{isTimedIn ? "Active" : "Standby"}</p>
          </div>
          <div className={metricClass}>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Courses Handled</p>
            <p className="mt-2 text-2xl font-bold text-foreground">3</p>
          </div>
          <div className={metricClass}>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Department</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{facultyData.department}</p>
          </div>
        </div>
      </motion.div>

      {/* Time In/Out Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={surfaceClass}
      >
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-[#d4af37]" />
          <h3 className="text-2xl font-bold text-black">Time Logging</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTimeIn}
            disabled={isTimedIn}
            className={`rounded-2xl border p-8 text-left transition-all duration-300 ${
              isTimedIn
                ? "cursor-not-allowed border-border bg-muted text-muted-foreground"
                : "border-accent/60 bg-gradient-to-br from-accent/80 to-secondary text-accent-foreground hover:shadow-xl"
            }`}
          >
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4" />
              <div className="text-2xl font-bold mb-2">Time In</div>
              <div className="text-sm opacity-80">{isTimedIn ? "Already timed in" : "Click to start your shift"}</div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTimeOut}
            disabled={!isTimedIn}
            className={`rounded-2xl border p-8 text-left transition-all duration-300 ${
              !isTimedIn
                ? "cursor-not-allowed border-border bg-muted text-muted-foreground"
                : "border-primary bg-gradient-to-br from-primary to-primary/90 font-bold text-primary-foreground hover:shadow-xl"
            }`}
          >
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4" />
              <div className="text-2xl font-bold mb-2">Time Out</div>
              <div className="text-sm opacity-80">{!isTimedIn ? "Time in first" : "Click to end your shift"}</div>
            </div>
          </motion.button>
        </div>

        {isTimedIn && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 rounded-xl border border-accent/40 bg-secondary/60 p-4"
          >
            <div className="flex items-center gap-2 text-foreground">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="font-semibold">Status: Active - Timed In at {new Date().toLocaleTimeString()}</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Attendance History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={surfaceClass}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground">Attendance History</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search date or subject..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-border bg-background/80 py-2 pr-4 pl-10 transition-colors duration-300 focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="max-h-[24rem] overflow-auto rounded-xl border border-border/80">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
              <tr className="border-b-2 border-border">
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Date</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Time In</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Time Out</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Subject</th>
              </tr>
            </thead>
            <tbody>
              {paginatedHistory.map((record, index) => (
                <motion.tr
                  key={record.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={shouldReduceMotion ? undefined : { duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-border/70 hover:bg-muted/50 transition-colors duration-200"
                >
                  <td className="py-4 px-4 text-foreground font-medium">{record.date}</td>
                  <td className="py-4 px-4 text-muted-foreground">{record.timeIn}</td>
                  <td className="py-4 px-4 text-muted-foreground">{record.timeOut}</td>
                  <td className="py-4 px-4 text-muted-foreground">{record.subject}</td>
                </motion.tr>
              ))}
              {paginatedHistory.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No attendance records match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredHistory.length)} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredHistory.length)} of {filteredHistory.length} records
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous attendance page"
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border rounded-lg transition-colors duration-300 ${
                  currentPage === page
                    ? "bg-accent text-accent-foreground border-accent font-semibold"
                    : "border-border hover:bg-muted"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              aria-label="Next attendance page"
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );

  const renderAttendance = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={surfaceClass}
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Full Attendance Records</h2>
          <p className="mt-1 text-sm text-muted-foreground">Review your time logs and tracked teaching sessions.</p>
        </div>
        <div className="inline-flex items-center rounded-full border border-accent/35 bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#b08d18]">
          Faculty Attendance
        </div>
      </div>

      <div className="mb-5 rounded-xl border border-border/80 bg-muted/35 p-3 sm:p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
            <input
              type="text"
              placeholder="Search date or subject..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={searchInputClass}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary">
              This Week
            </button>
            <button className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary">
              This Month
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border/80">
        <table className="w-full min-w-[700px]">
          <thead className="sticky top-0 z-10 bg-muted/85 backdrop-blur-sm">
            <tr className="border-b-2 border-border bg-muted/80">
              <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Date</th>
              <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Time In</th>
              <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Time Out</th>
              <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Subject</th>
              <th className="px-4 py-4 text-left font-semibold text-muted-foreground">Hours</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((record) => (
              <tr
                key={record.id}
                className="border-b border-border/60 transition-colors duration-200 hover:bg-muted/40"
              >
                <td className="px-4 py-4 font-medium text-foreground">{record.date}</td>
                <td className="px-4 py-4 text-muted-foreground">{record.timeIn}</td>
                <td className="px-4 py-4 text-muted-foreground">{record.timeOut}</td>
                <td className="px-4 py-4 text-muted-foreground">{record.subject}</td>
                <td className="px-4 py-4 text-muted-foreground">9 hrs</td>
              </tr>
            ))}
            {filteredHistory.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No attendance records match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        Showing {filteredHistory.length} attendance record{filteredHistory.length === 1 ? "" : "s"}.
      </div>
    </motion.div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={surfaceClass}
      >
        <h2 className="mb-6 text-3xl font-bold text-foreground">Performance Reports</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-secondary to-card p-6">
            <div className="mb-2 text-sm text-muted-foreground">Total Classes</div>
            <div className="text-4xl font-bold text-foreground">24</div>
            <div className="text-sm text-green-600 mt-2">+3 this month</div>
          </div>
          <div className="rounded-xl border border-border/80 bg-gradient-to-br from-muted to-card p-6">
            <div className="mb-2 text-sm text-muted-foreground">Hours Taught</div>
            <div className="text-4xl font-bold text-foreground">216</div>
            <div className="text-sm text-green-600 mt-2">+18 this month</div>
          </div>
          <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-secondary to-card p-6">
            <div className="mb-2 text-sm text-muted-foreground">Attendance Rate</div>
            <div className="text-4xl font-bold text-foreground">98%</div>
            <div className="text-sm text-green-600 mt-2">Excellent</div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">Monthly Summary</h3>
          <div className="rounded-xl border border-border/70 bg-muted/60 p-6">
            <p className="text-muted-foreground">
              Your performance this month has been outstanding. You've maintained excellent attendance and covered all
              scheduled classes.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={surfaceClass}
      >
        <h3 className="mb-4 text-2xl font-bold text-foreground">Download Reports</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-primary-foreground transition-colors duration-300 hover:bg-accent hover:text-accent-foreground">
            <FileText className="w-5 h-5" />
            Monthly Report (PDF)
          </button>
          <button className="flex items-center justify-center gap-2 rounded-xl border border-accent/60 bg-secondary px-6 py-4 text-foreground transition-colors duration-300 hover:bg-accent hover:text-accent-foreground">
            <FileText className="w-5 h-5" />
            Attendance Summary (CSV)
          </button>
        </div>
      </motion.div>
    </div>
  );

  const renderSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={surfaceClass}
    >
      <h2 className="mb-6 text-3xl font-bold text-foreground">Account Settings</h2>

      <div className="space-y-6">
        <div>
          <h3 className="mb-4 text-xl font-bold text-foreground">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Full Name</label>
              <input type="text" defaultValue={facultyData.name} className={mutedInputClass} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Email</label>
              <input type="email" defaultValue={facultyData.email} className={mutedInputClass} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Department</label>
              <input type="text" defaultValue={facultyData.department} className={mutedInputClass} />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="mb-4 text-xl font-bold text-foreground">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Current Password</label>
              <input type="password" placeholder="Enter current password" className={mutedInputClass} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">New Password</label>
              <input type="password" placeholder="Enter new password" className={mutedInputClass} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Confirm New Password</label>
              <input type="password" placeholder="Confirm new password" className={mutedInputClass} />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button className="rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground transition-colors duration-300 hover:bg-accent hover:text-accent-foreground">
            Save Changes
          </button>
          <button className="rounded-xl border border-border bg-muted px-8 py-3 font-semibold text-foreground transition-colors duration-300 hover:bg-secondary">
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <PortalLayout>
      <PortalSidebar
        title="Faculty Portal"
        navItems={[...FACULTY_NAV_ITEMS]}
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1" style={{ ["--sidebar-width" as "--sidebar-width"]: sidebarWidth } as any}>
        <PortalHeader
          title="Faculty Dashboard"
          subtitle={`Welcome back, ${facultyData.name}`}
          avatar={facultyData.avatar}
          name={facultyData.name}
          meta={facultyData.role}
          onProfileClick={() => setShowProfile((prev) => !prev)}
          onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
        />

        {/* Main Content */}
        <main className="min-h-screen bg-gradient-to-b from-muted/70 via-background to-secondary/30 p-4 pt-28 sm:p-6 sm:pt-28 lg:pr-8 lg:pt-32 lg:pl-[calc(var(--sidebar-width)+2rem)] lg:transition-[padding-left] lg:duration-300 lg:ease-in-out">
          <div className="max-w-7xl mx-auto space-y-8">
            {activeView === "dashboard" && renderDashboard()}
            {activeView === "attendance" && renderAttendance()}
            {activeView === "reports" && renderReports()}
            {activeView === "settings" && renderSettings()}
          </div>
        </main>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowProfile(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Faculty profile details"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 border border-border"
          >
            <div className="text-center">
              <img
                src={facultyData.avatar}
                alt={facultyData.name}
                className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-accent object-cover"
              />
              <h3 className="text-3xl font-bold text-foreground mb-2">{facultyData.name}</h3>
              <p className="text-accent font-semibold mb-6">{facultyData.role}</p>

              <div className="space-y-4 text-left bg-muted p-6 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Faculty Code</div>
                  <div className="font-semibold text-foreground">{facultyData.code}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-semibold text-foreground">{facultyData.email}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Department</div>
                  <div className="font-semibold text-foreground">{facultyData.department}</div>
                </div>
              </div>

              <button
                onClick={() => setShowProfile(false)}
                className="mt-6 w-full px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-[#b08d18] hover:text-primary-foreground transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </PortalLayout>
  );
}

