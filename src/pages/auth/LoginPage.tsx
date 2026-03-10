import { useState } from "react";
import gogmiLogo from "../../assets/images/gogmilogo.png";

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-[480px] bg-brand-navy relative overflow-hidden">
        {/* Subtle grid pattern */}
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
              <img
                src={gogmiLogo}
                alt="GoGMI"
                className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
              />
              <div>
                <div className="text-white text-[17px] font-semibold tracking-tight">
                  GoGMI
                </div>
                <div className="text-white/60 text-[11px] tracking-wide">
                  Learning Platform
                </div>
              </div>
            </div>

            <h1 className="text-white text-[28px] font-semibold leading-tight mb-4">
              Advancing Maritime<br />Knowledge in the<br />Gulf of Guinea
            </h1>
            <p className="text-white/60 text-[14.5px] leading-relaxed max-w-sm">
              Access professional maritime courses, earn certifications, and track your CPD points — all in one platform.
            </p>
          </div>

          <div className="flex gap-8">
            <div>
              <div className="text-white text-[22px] font-semibold">12+</div>
              <div className="text-white/50 text-[12px]">Courses</div>
            </div>
            <div>
              <div className="text-white text-[22px] font-semibold">2,000+</div>
              <div className="text-white/50 text-[12px]">Learners</div>
            </div>
            <div>
              <div className="text-white text-[22px] font-semibold">15+</div>
              <div className="text-white/50 text-[12px]">Experts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <img
              src={gogmiLogo}
              alt="GoGMI"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="text-gray-800 text-[16px] font-semibold">GoGMI</div>
              <div className="text-gray-400 text-[11px]">Learning Platform</div>
            </div>
          </div>

          {/* Desktop logo */}
          <div className="hidden lg:flex items-center gap-3 mb-8">
            <img
              src={gogmiLogo}
              alt="GoGMI"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="text-gray-800 text-[16px] font-semibold">GoGMI</div>
              <div className="text-gray-400 text-[11px]">Learning Platform</div>
            </div>
          </div>

          <h2 className="text-[22px] font-semibold text-gray-800 mb-1">
            Welcome back
          </h2>
          <p className="text-[14px] text-gray-500 mb-8">
            Sign in with your credentials to access your courses.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-5">
              <p className="text-[13px] text-red-700">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 pr-10 text-[14px] text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-brand-teal focus:ring-brand-teal cursor-pointer"
                />
                <span className="text-[13px] text-gray-600">Remember me</span>
              </label>
              <button className="text-[13px] text-brand-teal font-medium hover:underline cursor-pointer">
                Forgot password?
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-2.5 rounded-md text-[14px] font-medium text-white transition-colors cursor-pointer mt-1
                ${isLoading ? "bg-brand-navy-muted" : "bg-brand-navy hover:bg-brand-navy-light"}
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>

          <p className="text-center text-[13px] text-gray-400 mt-8">
            Don't have login credentials? Contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}