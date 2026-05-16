import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { api, setAccessToken } from "../../services/api";
import gogmiLogo from "../../assets/images/gogmilogo.png";

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();

  const [step, setStep] = useState<"role" | "form" | "otp" | "pending" | "success">("role");
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
  const [otp, setOtp] = useState("");
  const [verificationKey, setVerificationKey] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmitForm = async () => {
    setError("");
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) { setError("Please fill in all required fields."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (role === "INSTRUCTOR" && (!expertise.trim() || !bio.trim())) { setError("Please fill in your expertise and bio."); return; }

    setIsLoading(true);
    try {
      const data = await api.post<{ verificationKey: string; maskedEmail: string; message: string }>(
        "/auth/register",
        { email, password, firstName, lastName, phone: phone || undefined, organization: organization || undefined, country, role, bio: bio || undefined, expertise: expertise || undefined }
      );
      setVerificationKey(data.verificationKey);
      setMaskedEmail(data.maskedEmail);
      setStep("otp");
    } catch (err) { setError(err instanceof Error ? err.message : "Registration failed."); }
    finally { setIsLoading(false); }
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (otp.length !== 6) { setError("Please enter the 6-digit code."); return; }
    setIsLoading(true);
    try {
      const data = await api.post<{ user?: { id: string; email: string; firstName: string; lastName: string; role: string; initials: string }; accessToken?: string; status: string; message?: string }>(
        "/auth/register/verify", { verificationKey, otp }
      );
      if (data.status === "PENDING") { setStep("pending"); }
      else if (data.accessToken && data.user) {
        setAccessToken(data.accessToken);
        sessionStorage.setItem("gogmi_user", JSON.stringify(data.user));
        setStep("success");
        setTimeout(() => { window.location.href = "/dashboard"; }, 2000);
      }
    } catch (err) { setError(err instanceof Error ? err.message : "Verification failed."); }
    finally { setIsLoading(false); }
  };

  // Pending screen
  if (step === "pending") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <img src={gogmiLogo} alt="GoGMI" className="w-14 h-14 rounded-full object-cover mx-auto mb-6" />
          <h2 className="text-[22px] font-semibold text-gray-800 mb-2">Application Submitted</h2>
          <p className="text-[14px] text-gray-500 leading-relaxed mb-6">Thank you for applying as an instructor. Your application is under review. You will receive an email once approved.</p>
          <Link to="/login" className="text-[14px] text-brand-teal font-medium hover:underline">Back to sign in</Link>
        </div>
      </div>
    );
  }

  // Success screen
  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2 className="text-[22px] font-semibold text-gray-800 mb-2">Account Created!</h2>
          <p className="text-[14px] text-gray-500">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[480px] bg-brand-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"><svg width="100%" height="100%"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs><rect width="100%" height="100%" fill="url(#grid)" /></svg></div>
        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          <div>
            <div className="flex items-center gap-3 mb-16"><img src={gogmiLogo} alt="GoGMI" className="w-12 h-12 rounded-full object-cover border-2 border-white/20" /><div><div className="text-white text-[17px] font-semibold tracking-tight">GoGMI</div><div className="text-white/60 text-[11px] tracking-wide">Learning Platform</div></div></div>
            <h1 className="text-white text-[28px] font-semibold leading-tight mb-4">Join a Growing<br />Community of<br />Maritime Professionals</h1>
            <p className="text-white/60 text-[14.5px] leading-relaxed max-w-sm">Build your expertise with courses designed by leading maritime practitioners across West and Central Africa.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/10">
            <p className="text-white/80 text-[13.5px] leading-relaxed mb-4 italic">"The GoGMI courses have been instrumental in advancing my understanding of maritime security."</p>
            <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-brand-teal flex items-center justify-center text-[12px] font-semibold text-white">AK</div><div><div className="text-white text-[13px] font-medium">Akua Konadu</div><div className="text-white/50 text-[11.5px]">Maritime Security Analyst</div></div></div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[440px]">
          <div className="flex items-center gap-3 mb-8"><img src={gogmiLogo} alt="GoGMI" className="w-10 h-10 rounded-full object-cover" /><div><div className="text-gray-800 text-[16px] font-semibold">GoGMI</div><div className="text-gray-400 text-[11px]">Learning Platform</div></div></div>

          {/* Step: Role selection */}
          {step === "role" && (
            <div>
              <h2 className="text-[22px] font-semibold text-gray-800 mb-1">Create your account</h2>
              <p className="text-[14px] text-gray-500 mb-8">How would you like to use the platform?</p>
              <div className="flex flex-col gap-3 mb-8">
                <button onClick={() => { setRole("STUDENT"); setStep("form"); }} className="bg-white border border-gray-200 rounded-lg p-5 text-left cursor-pointer hover:border-brand-teal hover:bg-brand-teal-light/30 transition-all group">
                  <div className="text-[15px] font-semibold text-gray-800 mb-1 group-hover:text-brand-teal">Student</div>
                  <p className="text-[13px] text-gray-500 leading-relaxed">Enroll in maritime courses, earn certificates, and track your CPD points.</p>
                </button>
                <button onClick={() => { setRole("INSTRUCTOR"); setStep("form"); }} className="bg-white border border-gray-200 rounded-lg p-5 text-left cursor-pointer hover:border-brand-navy hover:bg-blue-50/30 transition-all group">
                  <div className="text-[15px] font-semibold text-gray-800 mb-1 group-hover:text-brand-navy">Instructor</div>
                  <p className="text-[13px] text-gray-500 leading-relaxed">Apply to facilitate courses and share your maritime expertise. Subject to approval.</p>
                </button>
              </div>
              <p className="text-center text-[13.5px] text-gray-500">Already have an account? <Link to="/login" className="text-brand-teal font-medium hover:underline">Sign in</Link></p>
            </div>
          )}

          {/* Step: Form */}
          {step === "form" && (
            <div>
              <button onClick={() => setStep("role")} className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-700 cursor-pointer mb-5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>Back</button>
              <h2 className="text-[22px] font-semibold text-gray-800 mb-1">{role === "STUDENT" ? "Student Registration" : "Instructor Application"}</h2>
              <p className="text-[14px] text-gray-500 mb-6">{role === "STUDENT" ? "Fill in your details. We'll verify your email." : "Fill in your details. Your application will be reviewed."}</p>
              {error && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-5"><p className="text-[13px] text-red-700">{error}</p></div>}
              <div className="flex flex-col gap-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-[13px] font-medium text-gray-700 mb-1">First name <span className="text-red-500">*</span></label><input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" /></div>
                  <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Last name <span className="text-red-500">*</span></label><input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" /></div>
                </div>
                <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" /></div>
                <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Phone</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" /></div>
                <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Organisation</label><input type="text" value={organization} onChange={e => setOrganization(e.target.value)} placeholder="e.g. Ghana Maritime Authority" className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" /></div>
                <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Country</label><select value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none cursor-pointer"><option>Ghana</option><option>Nigeria</option><option>Cameroon</option><option>Togo</option><option>Benin</option><option>Senegal</option><option>Gabon</option><option>Angola</option><option>Other</option></select></div>
                {role === "INSTRUCTOR" && (
                  <>
                    <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Area of expertise <span className="text-red-500">*</span></label><input type="text" value={expertise} onChange={e => setExpertise(e.target.value)} placeholder="e.g. Maritime Security, Port Operations" className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" /></div>
                    <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Professional bio <span className="text-red-500">*</span></label><textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Briefly describe your background..." className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors resize-none" /></div>
                  </>
                )}
                <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                  <div className="relative"><input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 8 characters" className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 pr-10 text-[14px] text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                      {showPassword ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><line x1="1" y1="1" x2="23" y2="23" /></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
                    </button>
                  </div>
                </div>
                <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Confirm password <span className="text-red-500">*</span></label><input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" /></div>
                <button onClick={handleSubmitForm} disabled={isLoading} className={`w-full py-2.5 rounded-md text-[14px] font-medium text-white transition-colors cursor-pointer mt-1 ${isLoading ? "bg-brand-navy-muted" : "bg-brand-navy hover:bg-brand-navy-light"}`}>
                  {isLoading ? "Sending verification..." : "Continue"}
                </button>
              </div>
              <p className="text-center text-[13.5px] text-gray-500 mt-6">Already have an account? <Link to="/login" className="text-brand-teal font-medium hover:underline">Sign in</Link></p>
            </div>
          )}

          {/* Step: OTP verification */}
          {step === "otp" && (
            <div onKeyDown={e => { if (e.key === "Enter") handleVerifyOtp(); }}>
              <button onClick={() => { setStep("form"); setOtp(""); setError(""); }} className="flex items-center gap-1 text-[13px] text-gray-500 hover:text-gray-700 cursor-pointer mb-5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>Back
              </button>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B1F3F" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,7 12,13 2,7" /></svg>
              </div>
              <h2 className="text-[22px] font-semibold text-gray-800 mb-1">Verify your email</h2>
              <p className="text-[14px] text-gray-500 mb-6">We sent a 6-digit code to <span className="font-medium text-gray-700">{maskedEmail}</span>.</p>
              {error && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-5"><p className="text-[13px] text-red-700">{error}</p></div>}
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Verification Code</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" maxLength={6} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-3 text-[20px] text-center text-gray-800 outline-none placeholder:text-gray-300 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors font-mono tracking-[12px]" />
              </div>
              <button onClick={handleVerifyOtp} disabled={isLoading} className={`w-full py-2.5 rounded-md text-[14px] font-medium text-white transition-colors cursor-pointer mt-5 ${isLoading ? "bg-brand-navy-muted" : "bg-brand-navy hover:bg-brand-navy-light"}`}>
                {isLoading ? "Verifying..." : role === "STUDENT" ? "Create Account" : "Submit Application"}
              </button>
              <p className="text-[11.5px] text-gray-400 text-center mt-4">Code expires in 10 minutes. Check your spam folder.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}