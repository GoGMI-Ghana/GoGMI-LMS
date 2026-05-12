import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../services/api";
import gogmiLogo from "../../assets/images/gogmilogo.png";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="w-full max-w-[400px] text-center">
          <img src={gogmiLogo} alt="GoGMI" className="w-12 h-12 rounded-full object-cover mx-auto mb-6" />
          <h2 className="text-[20px] font-semibold text-gray-800 mb-2">Invalid Reset Link</h2>
          <p className="text-[14px] text-gray-500 mb-6">This password reset link is invalid or has expired.</p>
          <Link to="/forgot-password" className="text-[14px] text-brand-teal font-medium hover:underline">Request a new link</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    setError("");
    if (newPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }

    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", { token, newPassword });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed. The link may have expired.");
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <div className="flex items-center gap-3 mb-8">
          <img src={gogmiLogo} alt="GoGMI" className="w-10 h-10 rounded-full object-cover" />
          <div><div className="text-gray-800 text-[16px] font-semibold">GoGMI</div><div className="text-gray-400 text-[11px]">Learning Platform</div></div>
        </div>

        {success ? (
          <div>
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h2 className="text-[22px] font-semibold text-gray-800 mb-2">Password reset</h2>
            <p className="text-[14px] text-gray-500 leading-relaxed mb-6">Your password has been updated. You can now sign in with your new password.</p>
            <Link to="/login" className="inline-block w-full text-center bg-brand-navy text-white rounded-md py-2.5 text-[14px] font-medium hover:bg-brand-navy-light transition-colors">Sign in</Link>
          </div>
        ) : (
          <div>
            <h2 className="text-[22px] font-semibold text-gray-800 mb-1">Set new password</h2>
            <p className="text-[14px] text-gray-500 mb-8">Enter your new password below.</p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-5">
                <p className="text-[13px] text-red-700">{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">New password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimum 8 characters" className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 pr-10 text-[14px] text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" />
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
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Confirm new password</label>
                <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" />
              </div>
              <button onClick={handleSubmit} disabled={isLoading} className={`w-full py-2.5 rounded-md text-[14px] font-medium text-white transition-colors cursor-pointer ${isLoading ? "bg-brand-navy-muted" : "bg-brand-navy hover:bg-brand-navy-light"}`}>
                {isLoading ? "Resetting..." : "Reset password"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}