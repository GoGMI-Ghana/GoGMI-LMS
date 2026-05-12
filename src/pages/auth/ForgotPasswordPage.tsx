import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import gogmiLogo from "../../assets/images/gogmilogo.png";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <div className="flex items-center gap-3 mb-8">
          <img src={gogmiLogo} alt="GoGMI" className="w-10 h-10 rounded-full object-cover" />
          <div><div className="text-gray-800 text-[16px] font-semibold">GoGMI</div><div className="text-gray-400 text-[11px]">Learning Platform</div></div>
        </div>

        {sent ? (
          <div>
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h2 className="text-[22px] font-semibold text-gray-800 mb-2">Check your email</h2>
            <p className="text-[14px] text-gray-500 leading-relaxed mb-6">
              If an account exists for <span className="font-medium text-gray-700">{email}</span>, we've sent a password reset link. Check your inbox and spam folder.
            </p>
            <Link to="/login" className="text-[14px] text-brand-teal font-medium hover:underline">Back to sign in</Link>
          </div>
        ) : (
          <div>
            <h2 className="text-[22px] font-semibold text-gray-800 mb-1">Forgot your password?</h2>
            <p className="text-[14px] text-gray-500 mb-8">Enter your email and we'll send you a link to reset your password.</p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-5">
                <p className="text-[13px] text-red-700">{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" />
              </div>
              <button onClick={handleSubmit} disabled={isLoading} className={`w-full py-2.5 rounded-md text-[14px] font-medium text-white transition-colors cursor-pointer ${isLoading ? "bg-brand-navy-muted" : "bg-brand-navy hover:bg-brand-navy-light"}`}>
                {isLoading ? "Sending..." : "Send reset link"}
              </button>
            </div>

            <p className="text-center text-[13.5px] text-gray-500 mt-8">
              <Link to="/login" className="text-brand-teal font-medium hover:underline">Back to sign in</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}