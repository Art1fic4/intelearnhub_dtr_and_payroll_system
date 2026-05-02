import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import logo from "@/imports/LEARNHUB-GOLD.png";
import studentIcon from "figma:asset/student-icon.svg";
import { ArrowLeft, Lock } from "lucide-react";

export default function StudentLogin() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (isRegister) {
      // Registration
      if (!formData.name || !formData.password) {
        setError("Please fill in all fields");
        return;
      }
      const newId = register(formData.name, formData.password, "student");
      setSuccessMessage(`Registration successful! Your Student ID is: ${newId}`);
      setFormData({ id: "", password: "", name: "" });
      setTimeout(() => {
        setIsRegister(false);
        setSuccessMessage("");
      }, 3000);
    } else {
      // Login
      if (!formData.id || !formData.password) {
        setError("Please enter your Student ID and password");
        return;
      }
      const success = login(formData.id, formData.password, "student");
      if (success) {
        navigate("/student/dashboard");
      } else {
        setError("Invalid Student ID or password");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-2xl shadow-2xl p-8 border border-border">
          {/* Header */}
          <div className="text-center mb-8">
            <img src={logo} alt="Intelearn Hub" className="h-16 mx-auto mb-4" />
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-accent/10 to-transparent border-2 border-accent/30 rounded-lg flex items-center justify-center p-4">
              <img src={studentIcon} alt="Student Portal" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Student Portal</h1>
            <p className="text-muted-foreground">
              {isRegister ? "Create your student account" : "Sign in to access your dashboard"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg"
            >
              {successMessage}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5">
                    <img src={studentIcon} alt="Student" className="w-full h-full object-contain opacity-60" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-accent transition-colors duration-300 text-foreground placeholder:text-muted-foreground"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            {!isRegister && (
              <div>
                <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5">
                    <img src={studentIcon} alt="Student" className="w-full h-full object-contain opacity-60" />
                  </div>
                  <input
                    type="text"
                    id="id"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value.toUpperCase() })}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-accent transition-colors duration-300 text-foreground placeholder:text-muted-foreground"
                    placeholder="ST-10001"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-accent transition-colors duration-300 text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-[#b08d18] hover:text-primary-foreground transition-colors duration-300"
            >
              {isRegister ? "Register" : "Sign In"}
            </motion.button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
                setSuccessMessage("");
                setFormData({ id: "", password: "", name: "" });
              }}
              className="text-sm text-muted-foreground hover:text-accent transition-colors duration-300"
            >
              {isRegister ? "Already have an account? Sign in" : "Don't have an account? Register"}
            </button>
          </div>

          {/* Demo Credentials */}
          {!isRegister && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                Demo: <span className="font-semibold">ST-10001</span> /{" "}
                <span className="font-semibold">student123</span>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

