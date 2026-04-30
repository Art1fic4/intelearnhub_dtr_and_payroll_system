import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Clock3, Eye, EyeOff, Loader2, Lock, TimerReset, UserRound } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface UnifiedLoginProps {
  embedded?: boolean;
}

export default function UnifiedLogin({ embedded = false }: UnifiedLoginProps) {
  const navigate = useNavigate();
  const { loginWithId, logout, recordAttendanceEvent, getAttendanceLogsByUser } = useAuth();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [clock, setClock] = useState(() => new Date());
  const [sessionState, setSessionState] = useState<{
    userId: string;
    userName: string;
    avatarUrl?: string;
    subject: string;
    subjectTime: string;
    timeIn: string;
    timeOut: string;
    action: "time-in" | "time-out";
  } | null>(null);
  const [historyRows, setHistoryRows] = useState<
    Array<{
      id: string;
      date: string;
      timeIn: string;
      timeOut: string;
      userName: string;
      subject: string;
    }>
  >([]);

  const displayClock = useMemo(
    () =>
      clock.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    [clock]
  );

  const resetToLoginState = () => {
    logout();
    setSessionState(null);
    setHistoryRows([]);
    setCountdown(30);
    setPassword("");
    setShowPassword(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIdError("");
    setPasswordError("");

    const normalizedId = id.trim().toUpperCase();
    const normalizedPassword = password.trim();

    if (!normalizedId) {
      setIdError("Please enter your ID.");
      return;
    }
    if (!normalizedId.startsWith("FA-") && !normalizedId.startsWith("ST-")) {
      setIdError("Use FA-xxxx for faculty or ST-xxxx for student IDs.");
      return;
    }
    if (!normalizedPassword) {
      setPasswordError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    const result = loginWithId(normalizedId, normalizedPassword);
    if (!result.success) {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }

    if (!result.user) {
      setError("Unable to load user profile. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const attendanceResult = recordAttendanceEvent(result.user);
    const recentHistory = getAttendanceLogsByUser(result.user.id, 6).map((entry) => ({
      id: entry.id,
      date: entry.date,
      timeIn: entry.timeIn,
      timeOut: entry.timeOut,
      userName: entry.userName,
      subject: entry.subject,
    }));

    setSessionState({
      userId: result.user.id,
      userName: result.user.name,
      avatarUrl: result.user.avatarUrl,
      subject: attendanceResult.entry.subject,
      subjectTime: attendanceResult.entry.subjectTime,
      timeIn: attendanceResult.entry.timeIn,
      timeOut: attendanceResult.entry.timeOut,
      action: attendanceResult.action,
    });
    setHistoryRows(recentHistory);
    setCountdown(30);
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (!sessionState) {
      return;
    }

    const tickClock = setInterval(() => {
      setClock(new Date());
    }, 1000);

    const countdownTimer = setInterval(() => {
      setCountdown((previous) => {
        if (previous <= 1) {
          clearInterval(countdownTimer);
          resetToLoginState();
          return 30;
        }
        return previous - 1;
      });
    }, 1000);

    return () => {
      clearInterval(tickClock);
      clearInterval(countdownTimer);
    };
  }, [sessionState]);

  return (
    <div
      className={`${embedded ? "bg-transparent px-0 py-2" : "min-h-screen bg-muted px-4 py-10 sm:px-6"} text-foreground`}
    >
      <div className="mx-auto max-w-[1400px]">
        {!embedded && (
          <button
            onClick={() => navigate("/")}
            className="mb-6 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Landing Page
          </button>
        )}

        <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-xl">
          <div className="border-b border-border bg-muted/30 px-6 py-4 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Attendance Login</p>
            <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">Quick and Secure Time In/Out</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Use your ID credentials. First successful login records time-in, the next login records time-out.
            </p>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 xl:p-12">
            {!sessionState ? (
              <>
                <h2 className="text-2xl font-bold text-foreground">Login</h2>
                <p className="mt-2 text-sm text-muted-foreground">Enter your ID and password to continue.</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-2 rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground sm:grid-cols-3 sm:text-sm">
                    <p>`FA-1001` for faculty accounts</p>
                    <p>`ST-1001` for student accounts</p>
                    <p>First login: time-in | next login: time-out</p>
                  </div>

                  <div>
                    <label htmlFor="user-id" className="mb-2 block text-sm font-semibold text-muted-foreground">
                      ID Number
                    </label>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="user-id"
                        type="text"
                        value={id}
                        onChange={(event) => {
                          setId(event.target.value.toUpperCase());
                          if (idError) setIdError("");
                        }}
                        placeholder="FA-1001 or ST-1001"
                        required
                        autoComplete="username"
                        autoCapitalize="off"
                        autoCorrect="off"
                        inputMode="text"
                        aria-invalid={!!idError}
                        aria-describedby={idError ? "user-id-error" : undefined}
                        className={`h-12 w-full rounded-lg border bg-background pl-11 pr-4 text-foreground outline-none transition-colors duration-300 focus:border-accent focus-visible:ring-2 focus-visible:ring-ring/40 ${
                          idError ? "border-red-400" : "border-border"
                        }`}
                      />
                    </div>
                    {idError && (
                      <p id="user-id-error" className="mt-2 text-xs text-red-700">
                        {idError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-semibold text-muted-foreground">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          if (passwordError) setPasswordError("");
                        }}
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                        aria-invalid={!!passwordError}
                        aria-describedby={passwordError ? "password-error" : undefined}
                        className={`h-12 w-full rounded-lg border bg-background pl-11 pr-12 text-foreground outline-none transition-colors duration-300 focus:border-accent focus-visible:ring-2 focus-visible:ring-ring/40 ${
                          passwordError ? "border-red-400" : "border-border"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {passwordError && (
                      <p id="password-error" className="mt-2 text-xs text-red-700">
                        {passwordError}
                      </p>
                    )}
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      aria-live="polite"
                      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-lg bg-accent font-semibold text-accent-foreground transition-colors duration-300 hover:bg-[#b08d18] hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span className="inline-flex items-center gap-2">
                      {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      {isSubmitting ? "Signing in..." : "Login"}
                    </span>
                  </button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 lg:space-y-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Attendance Recorded</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      You are automatically logged out after 30 seconds.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-foreground">{displayClock}</p>
                    <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                      <TimerReset className="h-3.5 w-3.5" />
                      {countdown}s
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 rounded-xl border border-border bg-muted/50 p-5 sm:grid-cols-[auto,1fr] sm:items-center">
                  <img
                    src={
                      sessionState.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(sessionState.userName)}&background=E6B325&color=1A1A1A`
                    }
                    alt={`${sessionState.userName} profile`}
                    className="h-24 w-24 rounded-xl border border-border object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                      {sessionState.action === "time-in" ? "Time In Successful" : "Time Out Successful"}
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold text-foreground">Welcome, {sessionState.userName}</h3>
                    <div className="mt-3 text-sm text-muted-foreground">
                      <p className="inline-flex items-center gap-2">
                        <UserRound className="h-4 w-4" /> {sessionState.userId}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 rounded-xl border border-border bg-secondary/35 px-4 py-3 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between lg:px-6">
                  <p className="inline-flex items-center gap-2 font-medium">
                    <Clock3 className="h-4 w-4 text-muted-foreground" />
                    Subject: <span className="font-semibold">{sessionState.subject}</span>
                  </p>
                  <p className="font-medium">{sessionState.subjectTime}</p>
                </div>

                <div className="rounded-xl border border-border">
                  <div>
                    <div className="grid grid-cols-5 gap-3 bg-secondary/60 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:px-6">
                      <span>Date</span>
                      <span>Time In</span>
                      <span>End</span>
                      <span>Name</span>
                      <span>Subject</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto bg-background">
                      {historyRows.map((row) => (
                        <div
                          key={row.id}
                          className="grid grid-cols-5 gap-3 px-4 py-3 text-sm text-foreground odd:bg-muted/30 lg:px-6"
                        >
                          <span>{row.date}</span>
                          <span>{row.timeIn}</span>
                          <span>{row.timeOut}</span>
                          <span className="break-words pr-2">{row.userName}</span>
                          <span className="break-words">{row.subject}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
