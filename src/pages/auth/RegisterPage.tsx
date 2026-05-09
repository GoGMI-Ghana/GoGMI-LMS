import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { api, setAccessToken } from "../../services/api";
import gogmiLogo from "../../assets/images/gogmilogo.png";

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<"role" | "form" | "pending">("role");
  const [role, setRole] = useState<"STUDENT" | "INSTRUCTOR">("STUDENT");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [country, setCountry] = useState("Ghana");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [bio, setBio] = useState("");
  const [expertise, setExpertise] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async () => {
    setError("");
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await api.post<{ user?: { id: string; email: string; firstName: string; lastName: string; role: string; initials: string }; accessToken?: string; status: string; message?: string }>(
        "/auth/register",
        { email, password, firstName, lastName, phone: phone || undefined, organization: organization || undefined, country, role, bio: bio || undefined, expertise: expertise || undefined }
      );

      if (data.status === "PENDING") {
        setStep("pending");
      } else if (data.accessToken && data.user) {
        setAccessToken(data.accessToken);
        sessionStorage.setItem("gogmi_user", JSON.stringify(data.user));
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Pending approval screen for instructors
  if (step === "pending") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <img src={gogmiLogo} alt="GoGMI" className="w-14 h-14 rounded-full object-cover mx-auto mb-6" />
          <h2 className="text-[22px] font-semibold text-gray-800 mb-2">Application Submitted</h2>
          <p className="text-[14px] text-gray-500 leading-relaxed mb-6">
            Thank you for applying as an instructor. Your application is under review by the GoGMI team. You will receive an email once your account has been approved.
          </p>
          <Link to="/login" className="text-[14px] text-brand-teal font-medium hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[480px] bg-brand-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          <div>
            <div className="flex items-center gap-3 mb-16">
              <img src={gogmiLogo} alt="GoGMI" className="w-12 h-12 rounded-full object-cover border-2 border-white/20" />
              <div>
                <div className="text-white text-[17px] font-semibold tracking-tight">GoGMI</div>
                <div className="text-white/60 text-[11px] tracking-wide">Learning Platform</div>
              </div>
            </div>
            <h1 className="text-white text-[28px] font-semibold leading-tight mb-4">
              Join a Growing<br />Community of<br />Maritime Professionals
            </h1>
            <p className="text-white/60 text-[14.5px] leading-relaxed max-w-sm">
              Build your expertise with courses designed by leading maritime practitioners across West and Central Africa.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/10">
            <p className="text-white/80 text-[13.5px] leading-relaxed mb-4 italic">
              "The GoGMI courses have been instrumental in advancing my understanding of maritime security."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-teal flex items-center justify-center text-[12px] font-semibold text-white">AK</div>
              <div>
                <div className="text-white text-[13px] font-medium">Akua Konadu</div>
                <div className="text-white/50 text-[11.5px]">Maritime Security Analyst</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[440px]">
          <div className="flex items-center gap-3 mb-8">
            <img src={gogmiLogo} alt="GoGMI" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="text-gray-800 text-[16px] font-semibold">GoGMI</div>
              <div className="text-gray-400 text-[11px]">Learning Platform</div>
            </div>
          </div>

          {/* Step 1: Role selection */}
          {step === "role" && (
            <div>
              <h2 className="text-[22px] font-semibold text-gray-800 mb-1">Create your account</h2>
              <p className="text-[14px] text-gray-500 mb-8">How would you like to use the platform?</p>

              <div className="flex flex-col gap-3 mb-8">
                <button
                  onClick={() => { setRole("STUDENT"); setStep("form"); }}
                  className="bg-white border border-gray-200 rounded-lg p-5 text-left cursor-pointer hover:border-brand-teal hover:bg-brand-teal-light/30 transition-all group"
                >
                  <div className="text-[15px] font-semibold text-gray-800 mb-1 group-hover:text-brand-teal">Student</div>
                  <p className="text-[13px] text-gray-500 leading-relaxed">
                    Enroll in maritime courses, earn certificates, and track your CPD points.
                  </p>
                </button>

                <button
                  onClick={() => { setRole("INSTRUCTOR"); setStep("form"); }}
                  className="bg-white border border-gray-200 rounded-lg p-5 text-left cursor-pointer hover:border-brand-navy hover:bg-blue-50/30 transition-all group"
                >
                  <div className="text-[15px] font-semibold text-gray-800 mb-1 group-hover:text-brand-navy">Instructor</div>
                  <p className="text-[13px] text-gray-500 leading-relaxed">
                    Apply to facilitate courses and share your maritime expertise. Subject to approval.
                  </p>
                </button>
              </div>

              <p className="text-center text-[13.5px] text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-brand-teal font-medium hover:underline">Sign in</Link>
              </p>
            </div>
          )}

          {/* Step 2: Registration form */}
          {step === "form" && (
            <div>
              <button onClick={() => setStep("role")} className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-700 cursor-pointer mb-5 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
                Back
              </button>

              <h2 className="text-[22px] font-semibold text-gray-800 mb-1">
                {role === "STUDENT" ? "Student Registration" : "Instructor Application"}
              </h2>
              <p className="text-[14px] text-gray-500 mb-6">
                {role === "STUDENT"
                  ? "Fill in your details to start learning."
                  : "Fill in your details. Your application will be reviewed by the GoGMI team."}
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-5" role="alert">
                  <p className="text-[13px] text-red-700">{error}</p>
                </div>
              )}

              <div className="flex flex-col gap-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">First name <span className="text-red-500">*</span></label>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">Last name <span className="text-red-500">*</span></label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">Organisation</label>
                  <input type="text" value={organization} onChange={e => setOrganization(e.target.value)} placeholder="e.g. Ghana Maritime Authority" className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">Country</label>
                  <select value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors cursor-pointer">
                    <option value="Ghana">Ghana</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="Togo">Togo</option>
                    <option value="Benin">Benin</option>
                    <option value="Senegal">Senegal</option>
                    <option value="Gabon">Gabon</option>
                    <option value="Angola">Angola</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Instructor-only fields */}
                {role === "INSTRUCTOR" && (
                  <>
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 mb-1">Area of expertise <span className="text-red-500">*</span></label>
                      <input type="text" value={expertise} onChange={e => setExpertise(e.target.value)} placeholder="e.g. Maritime Security, Port Operations" className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-gray-700 mb-1">Professional bio <span className="text-red-500">*</span></label>
                      <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Briefly describe your professional background and experience..." className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors resize-none" />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 8 characters" className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 pr-10 text-[14px] text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1">Confirm password <span className="text-red-500">*</span></label>
                  <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" />
                </div>

                <button onClick={handleSubmit} disabled={isLoading} className={`w-full py-2.5 rounded-md text-[14px] font-medium text-white transition-colors cursor-pointer mt-1 ${isLoading ? "bg-brand-navy-muted" : "bg-brand-navy hover:bg-brand-navy-light"}`}>
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      {role === "STUDENT" ? "Creating account..." : "Submitting application..."}
                    </span>
                  ) : (role === "STUDENT" ? "Create account" : "Submit application")}
                </button>
              </div>

              <p className="text-center text-[13.5px] text-gray-500 mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-brand-teal font-medium hover:underline">Sign in</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}