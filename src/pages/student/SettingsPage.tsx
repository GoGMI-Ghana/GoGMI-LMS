import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";

export default function SettingsPage() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [country, setCountry] = useState("");
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPw, setChangingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    if (user) { setFirstName(user.firstName || ""); setLastName(user.lastName || ""); setPhone((user as any).phone || ""); setOrganization((user as any).organization || ""); setCountry((user as any).country || ""); }
  }, [user]);

  const handleSaveProfile = async () => {
    setSaving(true); setProfileMsg("");
    try {
      await api.patch("/auth/profile", { firstName, lastName, phone, organization, country });
      setProfileMsg("Profile updated"); setTimeout(() => setProfileMsg(""), 3000);
    } catch {}
    finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    setPwError(""); setPwMsg("");
    if (newPassword.length < 8) { setPwError("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setPwError("Passwords don't match."); return; }
    setChangingPw(true);
    try {
      await api.post("/auth/change-password", { currentPassword, newPassword });
      setPwMsg("Password changed"); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); setTimeout(() => setPwMsg(""), 3000);
    } catch (err) { setPwError(err instanceof Error ? err.message : "Failed to change password"); }
    finally { setChangingPw(false); }
  };

  return (
    <div>
      <div className="mb-7"><h1 className="text-[22px] font-semibold text-gray-800 mb-1">Settings</h1><p className="text-[14px] text-gray-500">Manage your account and preferences.</p></div>

      <div className="grid grid-cols-[1fr_360px] gap-6">
        <div className="flex flex-col gap-6">
          {/* Profile */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Profile Information</h2>
            {profileMsg && <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-green-700">{profileMsg}</p></div>}
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">First Name</label><input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-teal-500" /></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Last Name</label><input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-teal-500" /></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Phone</label><input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-teal-500" /></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Country</label><input type="text" value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-teal-500" /></div>
              <div className="col-span-2"><label className="block text-[13px] font-medium text-gray-700 mb-1">Organisation</label><input type="text" value={organization} onChange={e => setOrganization(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-teal-500" /></div>
            </div>
            <div className="mt-4"><button onClick={handleSaveProfile} disabled={saving} className="bg-brand-navy text-white rounded-md px-5 py-2 text-[13px] font-medium cursor-pointer hover:bg-brand-navy-light">{saving ? "Saving..." : "Save Changes"}</button></div>
          </div>

          {/* Password */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-[15px] font-semibold text-gray-800 mb-4">Change Password</h2>
            {pwMsg && <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-green-700">{pwMsg}</p></div>}
            {pwError && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-red-700">{pwError}</p></div>}
            <div className="flex flex-col gap-3 max-w-sm">
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Current Password</label><input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-teal-500" /></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">New Password</label><input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-teal-500" /></div>
              <div><label className="block text-[13px] font-medium text-gray-700 mb-1">Confirm New Password</label><input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-teal-500" /></div>
            </div>
            <div className="mt-4"><button onClick={handleChangePassword} disabled={changingPw} className="bg-brand-navy text-white rounded-md px-5 py-2 text-[13px] font-medium cursor-pointer hover:bg-brand-navy-light">{changingPw ? "Changing..." : "Change Password"}</button></div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-brand-navy flex items-center justify-center text-[18px] font-bold text-white">{(user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")}</div>
              <div><div className="text-[15px] font-semibold text-gray-800">{user?.firstName} {user?.lastName}</div><div className="text-[13px] text-gray-500">{user?.email}</div><div className="text-[11px] text-gray-400 capitalize mt-0.5">{user?.role?.toLowerCase()}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}