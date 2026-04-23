import { useState } from "react";
import { currentUser } from "../../data/mock";

type Tab = "profile" | "security" | "notifications" | "preferences";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Profile fields
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [email] = useState(currentUser.email);
  const [phone, setPhone] = useState("+233 54 640 8096");
  const [organization, setOrganization] = useState("Ghana Maritime Authority");
  const [jobTitle, setJobTitle] = useState("Maritime Security Analyst");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("Ghana");
  const [profileSaved, setProfileSaved] = useState(false);

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [securitySaved, setSecuritySaved] = useState(false);

  // Notifications
  const [emailNotif, setEmailNotif] = useState({
    courseUpdates: true,
    assignments: true,
    announcements: true,
    messages: true,
    cpdReminders: true,
    marketing: false,
  });

  // Preferences
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("Africa/Accra");

  const handleProfileSave = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleSecuritySave = () => {
    setSecuritySaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSecuritySaved(false), 3000);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "security", label: "Security" },
    { key: "notifications", label: "Notifications" },
    { key: "preferences", label: "Preferences" },
  ];

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Settings</h1>
        <p className="text-[14px] text-gray-500">Manage your account, security, and preferences.</p>
      </div>

      <div className="grid grid-cols-[200px_1fr] gap-6">
        {/* Tab nav */}
        <div className="flex flex-col gap-0.5">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-left px-3 py-2.5 rounded-md text-[13.5px] font-medium transition-colors cursor-pointer
                ${activeTab === tab.key ? "bg-gray-100 text-gray-800" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {/* ─── Profile ─── */}
          {activeTab === "profile" && (
            <div>
              <h2 className="text-[16px] font-semibold text-gray-800 mb-1">Profile Information</h2>
              <p className="text-[13px] text-gray-500 mb-6">Update your personal details.</p>

              {profileSaved && (
                <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-5">
                  <p className="text-[13px] text-green-700">Profile updated successfully.</p>
                </div>
              )}

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 rounded-full bg-brand-navy flex items-center justify-center text-[20px] font-semibold text-white">
                  {currentUser.initials}
                </div>
                <div>
                  <button className="border border-gray-200 rounded-md px-3.5 py-1.5 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">
                    Change photo
                  </button>
                  <p className="text-[11.5px] text-gray-400 mt-1.5">JPG or PNG. Max 2MB.</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 max-w-lg">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">First name</label>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Last name</label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Email address</label>
                  <input type="email" value={email} disabled className="w-full bg-gray-50 border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-500 outline-none cursor-not-allowed" />
                  <p className="text-[11.5px] text-gray-400 mt-1">Contact your administrator to change your email.</p>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Phone number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Organisation</label>
                  <input type="text" value={organization} onChange={e => setOrganization(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Job title</label>
                  <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Country</label>
                  <select value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors cursor-pointer">
                    <option value="Ghana">Ghana</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="Togo">Togo</option>
                    <option value="Benin">Benin</option>
                    <option value="Cote d'Ivoire">Côte d'Ivoire</option>
                    <option value="Senegal">Senegal</option>
                    <option value="Gabon">Gabon</option>
                    <option value="Angola">Angola</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Bio</label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Tell us about yourself and your maritime background..." className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors resize-none" />
                </div>

                <div className="pt-2">
                  <button onClick={handleProfileSave} className="bg-brand-navy text-white rounded-md px-5 py-2.5 text-[14px] font-medium cursor-pointer hover:bg-brand-navy-light transition-colors">
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Security ─── */}
          {activeTab === "security" && (
            <div>
              <h2 className="text-[16px] font-semibold text-gray-800 mb-1">Security</h2>
              <p className="text-[13px] text-gray-500 mb-6">Update your password.</p>

              {securitySaved && (
                <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-5">
                  <p className="text-[13px] text-green-700">Password updated successfully.</p>
                </div>
              )}

              <div className="flex flex-col gap-4 max-w-lg">
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Current password</label>
                  <input type={showPasswords ? "text" : "password"} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">New password</label>
                  <input type={showPasswords ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimum 8 characters" className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none placeholder:text-gray-400 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Confirm new password</label>
                  <input type={showPasswords ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors" />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showPasswords} onChange={e => setShowPasswords(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-brand-teal focus:ring-brand-teal cursor-pointer" />
                  <span className="text-[13px] text-gray-600">Show passwords</span>
                </label>

                <div className="pt-2">
                  <button onClick={handleSecuritySave} className="bg-brand-navy text-white rounded-md px-5 py-2.5 text-[14px] font-medium cursor-pointer hover:bg-brand-navy-light transition-colors">
                    Update password
                  </button>
                </div>
              </div>

              {/* Sessions */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-[14px] font-semibold text-gray-800 mb-1">Active Sessions</h3>
                <p className="text-[13px] text-gray-500 mb-4">Manage devices where you're currently signed in.</p>
                <div className="flex flex-col gap-2 max-w-lg">
                  <div className="flex items-center justify-between bg-gray-50 rounded-md px-4 py-3">
                    <div>
                      <div className="text-[13.5px] font-medium text-gray-800">Windows — Chrome</div>
                      <div className="text-[12px] text-gray-500">Accra, Ghana · Current session</div>
                    </div>
                    <span className="text-[11px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">Active</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded-md px-4 py-3">
                    <div>
                      <div className="text-[13.5px] font-medium text-gray-800">iPhone — Safari</div>
                      <div className="text-[12px] text-gray-500">Accra, Ghana · Last active 2 days ago</div>
                    </div>
                    <button className="text-[12px] text-red-600 font-medium hover:underline cursor-pointer">Revoke</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Notifications ─── */}
          {activeTab === "notifications" && (
            <div>
              <h2 className="text-[16px] font-semibold text-gray-800 mb-1">Notification Preferences</h2>
              <p className="text-[13px] text-gray-500 mb-6">Choose what you'd like to be notified about.</p>

              <div className="flex flex-col gap-1 max-w-lg">
                {[
                  { key: "courseUpdates" as const, label: "Course updates", desc: "New modules, content changes, and schedule updates" },
                  { key: "assignments" as const, label: "Assignment reminders", desc: "Upcoming deadlines and submission confirmations" },
                  { key: "announcements" as const, label: "Announcements", desc: "Institutional and programme-wide announcements" },
                  { key: "messages" as const, label: "Messages", desc: "New direct messages from facilitators and peers" },
                  { key: "cpdReminders" as const, label: "CPD reminders", desc: "CPD submission deadlines and point updates" },
                  { key: "marketing" as const, label: "News and events", desc: "GoGMI events, webinars, and programme launches" },
                ].map(item => (
                  <label key={item.key} className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0 cursor-pointer">
                    <div>
                      <div className="text-[14px] font-medium text-gray-800">{item.label}</div>
                      <div className="text-[12.5px] text-gray-500 mt-0.5">{item.desc}</div>
                    </div>
                    <div className="relative shrink-0 ml-4">
                      <input
                        type="checkbox"
                        checked={emailNotif[item.key]}
                        onChange={e => setEmailNotif({ ...emailNotif, [item.key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-brand-teal transition-colors" />
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm peer-checked:translate-x-4 transition-transform" />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ─── Preferences ─── */}
          {activeTab === "preferences" && (
            <div>
              <h2 className="text-[16px] font-semibold text-gray-800 mb-1">Preferences</h2>
              <p className="text-[13px] text-gray-500 mb-6">Customise your learning experience.</p>

              <div className="flex flex-col gap-5 max-w-lg">
                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Language</label>
                  <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors cursor-pointer">
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="pt">Português</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Timezone</label>
                  <select value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3.5 py-2.5 text-[14px] text-gray-800 outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-colors cursor-pointer">
                    <option value="Africa/Accra">Africa/Accra (GMT+0)</option>
                    <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                    <option value="Africa/Douala">Africa/Douala (GMT+1)</option>
                    <option value="Africa/Libreville">Africa/Libreville (GMT+1)</option>
                    <option value="Africa/Luanda">Africa/Luanda (GMT+1)</option>
                    <option value="Africa/Dakar">Africa/Dakar (GMT+0)</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-[14px] font-semibold text-gray-800 mb-1">Danger zone</h3>
                  <p className="text-[13px] text-gray-500 mb-3">Permanent actions that cannot be undone.</p>
                  <button className="border border-red-200 text-red-600 rounded-md px-4 py-2 text-[13px] font-medium cursor-pointer hover:bg-red-50 transition-colors">
                    Request account deletion
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}