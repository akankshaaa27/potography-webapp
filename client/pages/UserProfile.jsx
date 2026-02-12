import React, { useMemo, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Settings, Globe, Phone, MapPin, Mail, Calendar } from "lucide-react";

const defaultProfile = {
  name: "",
  role: "",
  location: "",
  bio: "",
  email: "",
  phone: "",
  socials: {
    instagram: "",
    behance: "",
    website: "",
  },
  stats: {
    shoots: 0,
    avgRating: 0,
    turnaroundDays: 0,
  },
  focus: [],
  gear: {
    cameras: [],
    lenses: [],
    lighting: [],
  },
  payoutMethod: "",
  backupPayout: "",
};

const activityLog = [
  { id: 1, title: "Updated custom preset pack", timestamp: "Today • 09:24", type: "preset" },
  { id: 2, title: "Uploaded Aditi & Neel prewedding selects", timestamp: "Yesterday • 21:10", type: "upload" },
  { id: 3, title: "Signed Studio Samarth NDA", timestamp: "Jan 06 • 18:52", type: "contract" },
  { id: 4, title: "Synced lighting checklist", timestamp: "Jan 04 • 07:35", type: "gear" },
];

export default function UserProfile() {
  const { user, token } = useAuth() || {};

  const [profile, setProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutPassword, setPayoutPassword] = useState("");
  const [payoutDetails, setPayoutDetails] = useState(null);
  const [globalSettings, setGlobalSettings] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [userStats, setUserStats] = useState(null);

  const [preferences, setPreferences] = useState({
    notifications: {
      briefs: true,
      payouts: true,
      reminders: false,
    },
    security: {
      mfa: true,
      biometric: false,
      deviceAlerts: true,
    },
  });

  const shootsPerFocus = useMemo(() => {
    return profile.focus.map((focusArea, index) => ({
      label: focusArea,
      value: (profile.focusCounts && profile.focusCounts[focusArea]) || [42, 31, 24][index] || 12,
    }));
  }, [profile.focus, profile.focusCounts]);

  // Fetch profile & global settings
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        // Fetch current user profile
        let userData = null;
        const res = await fetch("/api/users/me", { headers });
        if (!mounted) return;
        if (res.ok) {
          userData = await res.json();
        }

        // Fetch global settings
        let globalSettingsData = null;
        const gs = await fetch("/api/global-settings", { headers });
        if (gs.ok) {
          globalSettingsData = await gs.json();
        }

        // Fetch all users for stats
        let allUsersData = [];
        const usersRes = await fetch("/api/users", { headers });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          if (Array.isArray(usersData)) {
            allUsersData = usersData;
            setAllUsers(usersData);
            // Calculate user stats
            setUserStats({
              total: usersData.length,
              active: usersData.filter(u => u.status === 'Active').length,
              inactive: usersData.filter(u => u.status !== 'Active').length,
              admins: usersData.filter(u => u.role === 'admin').length,
            });
          }
        }

        // Build merged profile from user data + global settings
        const mergedProfile = {
          ...defaultProfile,
          ...(userData && {
            name: userData.name || "",
            role: userData.role || "",
            location: userData.location || "",
            bio: userData.bio || "",
            email: userData.email || "",
            phone: userData.phone || "",
            socials: userData.socials || defaultProfile.socials,
            stats: userData.stats || defaultProfile.stats,
            focus: userData.focus || defaultProfile.focus,
            gear: userData.gear || defaultProfile.gear,
            payoutMethod: userData.payoutMethod || "",
            backupPayout: userData.backupPayout || "",
            preferences: userData.preferences,
            status: userData.status,
            _id: userData._id || userData.id,
          }),
        };

        setProfile(mergedProfile);
        setGlobalSettings(globalSettingsData);
        
        if (userData?.preferences) {
          setPreferences((prev) => ({ ...prev, ...userData.preferences }));
        }
        
        setIsOwner(!user || user.id === userData?.id || true);
        setIsAdmin(user?.role === "admin");
        
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [token, user]);

  // Helpers to persist bio & preferences
  async function saveBio() {
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : undefined },
        body: JSON.stringify({ bio: profile.bio }),
      });
      if (!res.ok) throw new Error("Save failed");
      alert("Bio saved");
    } catch (err) {
      console.error(err);
      alert("Failed to save bio");
    }
  }

  async function savePreferences() {
    try {
      const res = await fetch("/api/users/me/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : undefined },
        body: JSON.stringify(preferences),
      });
      if (!res.ok) throw new Error("Save failed");
      alert("Preferences saved");
    } catch (err) {
      console.error(err);
      alert("Failed to save preferences");
    }
  }

  async function revealPayout(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/users/me/payout-view", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : undefined },
        body: JSON.stringify({ password: payoutPassword }),
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setPayoutDetails(data);
      setShowPayoutModal(false);
    } catch (err) {
      console.error(err);
      alert("Unable to reveal payout details. Check your password.");
    }
  }

  if (loading) return (
    <section className="page-shell mt-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center">Loading profile...</div>
    </section>
  );

  function togglePref(section, key) {
    setPreferences((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: !prev[section][key] },
    }));
  }

  function handleBioChange(e) {
    setProfile((prev) => ({ ...prev, bio: e.target.value }));
  }

  return (
    <section className="min-h-screen bg-white">
      {/* User & Settings Header Section */}
      <div className="bg-gradient-to-r from-charcoal-900 to-charcoal-800 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Profile Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-slate-300">Manage your account and preferences</p>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Information Card - Dynamic from User Management */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <User size={20} className="text-gold-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider">User Information</h3>
              </div>
              
              {/* Profile Section */}
              <div className="mb-4 pb-4 border-b border-white/10">
                <p className="text-2xl font-bold mb-1">{profile.name || 'Not Set'}</p>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail size={14} />
                    <span>{profile.email || 'No email'}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* User Status & Role */}
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Role:</span>
                  <span className="font-semibold text-white">{profile.role || 'User'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-semibold px-2 py-0.5 rounded ${profile.status === 'Active' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-500/30 text-slate-300'}`}>
                    {profile.status || 'Active'}</span>
                </div>
              </div>

              {/* User Management Stats - from allUsers */}
              {userStats && (
                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-400 space-y-1">
                  <p className="text-slate-300 font-semibold mb-2">Team Overview</p>
                  <div className="flex justify-between">
                    <span>Total Users:</span>
                    <span className="font-semibold text-white">{userStats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active:</span>
                    <span className="font-semibold text-emerald-300">{userStats.active}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Admins:</span>
                    <span className="font-semibold text-gold-300">{userStats.admins}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Professional Info Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-5">
              <div className="flex items-center gap-3 mb-4">
                <Globe size={20} className="text-gold-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Professional</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-300 text-xs">Role</p>
                  <p className="font-semibold">{profile.role || 'Not Set'}</p>
                </div>
                <div>
                  <p className="text-slate-300 text-xs">Specialization</p>
                  <p className="font-semibold text-sm">{profile.focus?.join(', ') || 'Not Set'}</p>
                </div>
                <div>
                  <p className="text-slate-300 text-xs">Rating</p>
                  <p className="font-semibold">{profile.stats?.avgRating || 'N/A'}★</p>
                </div>
              </div>
            </div>

            {/* Global Settings Card - Dynamic Organization Data */}
            {globalSettings && (
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Settings size={20} className="text-gold-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">Organization</h3>
                </div>
                
                {/* Organization Settings */}
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-300 text-xs">Timezone</p>
                    <p className="font-semibold">{globalSettings.timezone || 'Not Set'}</p>
                  </div>
                  <div>
                    <p className="text-slate-300 text-xs">Currency</p>
                    <p className="font-semibold">{globalSettings.currency || 'Not Set'}</p>
                  </div>
                  <div>
                    <p className="text-slate-300 text-xs">Contract Template</p>
                    <p className="font-semibold text-xs truncate">{globalSettings.contractTemplate || 'Standard'}</p>
                  </div>
                </div>

                {/* Organization Name/Details */}
                {(globalSettings.companyName || globalSettings.organizationName) && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-slate-300 text-xs">Organization</p>
                    <p className="font-semibold text-sm">{globalSettings.companyName || globalSettings.organizationName}</p>
                  </div>
                )}

                {/* Additional Settings */}
                {(globalSettings.defaultLanguage || globalSettings.defaultEmail) && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs text-slate-400">
                    {globalSettings.defaultLanguage && (
                      <div className="flex justify-between">
                        <span>Language:</span>
                        <span className="text-white">{globalSettings.defaultLanguage}</span>
                      </div>
                    )}
                    {globalSettings.defaultEmail && (
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span className="text-white truncate">{globalSettings.defaultEmail}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.8fr,1fr]">
          {/* Left Column */}
          <div className="space-y-4">
            {/* About & Bio Card */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-charcoal-900">About & Bio</h2>
                  <p className="text-xs text-slate-500">Public profile copy used in proposals</p>
                </div>
                <button className="text-sm font-medium text-gold-600 hover:text-gold-700">Share</button>
              </div>
              <textarea
                value={profile.bio}
                onChange={handleBioChange}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-charcoal-900 focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                rows={4}
                placeholder="Write your professional bio..."
              />
              <div className="mt-4 flex gap-2">
                <button onClick={saveBio} className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-600 transition">
                  Save
                </button>
                <button onClick={() => { setProfile((prev) => ({ ...prev, bio: "" })); alert('Bio cleared'); }} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                  Clear
                </button>
              </div>

              {/* Social Links & Specialty */}
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">Social Profiles</h3>
                  <div className="space-y-2 text-sm text-charcoal-700">
                    <p><span className="text-slate-500">Instagram:</span> <span className="font-medium">{profile.socials?.instagram || '—'}</span></p>
                    <p><span className="text-slate-500">Behance:</span> <span className="font-medium">{profile.socials?.behance || '—'}</span></p>
                    <p><span className="text-slate-500">Website:</span> <span className="font-medium">{profile.socials?.website || '—'}</span></p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">Specialty Breakdown</h3>
                  <div className="space-y-2 text-sm text-charcoal-700">
                    {shootsPerFocus.length > 0 ? (
                      shootsPerFocus.map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <span>{item.label}</span>
                          <span className="text-slate-500">{item.value} shoots</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500">No specialties set</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Equipment Card */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-charcoal-900">Camera & Lighting Kit</h2>
                <button className="text-sm font-medium text-slate-600 hover:text-slate-700">Export</button>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">Bodies</h3>
                  <ul className="space-y-1 text-sm text-charcoal-700">
                    {profile.gear?.cameras && profile.gear.cameras.length > 0 ? (
                      profile.gear.cameras.map((item) => (
                        <li key={item}>{item}</li>
                      ))
                    ) : (
                      <li className="text-slate-500">No cameras added</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">Lenses</h3>
                  <ul className="space-y-1 text-sm text-charcoal-700">
                    {profile.gear?.lenses && profile.gear.lenses.length > 0 ? (
                      profile.gear.lenses.map((item) => (
                        <li key={item}>{item}</li>
                      ))
                    ) : (
                      <li className="text-slate-500">No lenses added</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">Lighting</h3>
                  <ul className="space-y-1 text-sm text-charcoal-700">
                    {profile.gear?.lighting && profile.gear.lighting.length > 0 ? (
                      profile.gear.lighting.map((item) => (
                        <li key={item}>{item}</li>
                      ))
                    ) : (
                      <li className="text-slate-500">No lighting equipment added</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Payout Preferences Card */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-charcoal-900">Payout Preferences</h2>
                <button className="text-sm font-medium text-slate-600 hover:text-slate-700">Update</button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border-l-4 border-gold-500 pl-4 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">Primary Account</p>
                  <p className="mt-2 text-sm font-semibold text-charcoal-900">{payoutDetails ? payoutDetails.primary : (profile.payoutMethod || 'Not configured')}</p>
                  <p className="text-xs text-slate-500 mt-1">Weekly settlements</p>
                  {profile.payoutMethod && <button onClick={() => setShowPayoutModal(true)} className="text-sm font-medium text-gold-600 hover:text-gold-700 mt-2">View details</button>}
                </div>
                <div className="border-l-4 border-slate-300 pl-4 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">Backup Account</p>
                  <p className="mt-2 text-sm font-semibold text-charcoal-900">{payoutDetails ? payoutDetails.backup : (profile.backupPayout || 'Not configured')}</p>
                  <p className="text-xs text-slate-500 mt-1">Used when primary unavailable</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Activity Timeline */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-charcoal-900 mb-4">Recent Activity</h2>
              <ul className="space-y-2">
                {activityLog.map((item) => (
                  <li key={item.id} className="border-l-2 border-slate-200 pl-4 py-2">
                    <p className="text-sm font-medium text-charcoal-900">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.timestamp}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-charcoal-900 mb-4">Notifications</h2>
              <div className="space-y-3">
                <ToggleRow
                  label="New brief alerts"
                  helper="Ping when projects match your style"
                  active={preferences.notifications.briefs}
                  onToggle={() => togglePref("notifications", "briefs")}
                />
                <ToggleRow
                  label="Payout confirmations"
                  helper="Alerts for every settlement"
                  active={preferences.notifications.payouts}
                  onToggle={() => togglePref("notifications", "payouts")}
                />
                <ToggleRow
                  label="Shoot reminders"
                  helper="Pre-shoot prep reminders"
                  active={preferences.notifications.reminders}
                  onToggle={() => togglePref("notifications", "reminders")}
                />
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={savePreferences} className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-white hover:bg-gold-600">Save</button>
                <button onClick={() => setPreferences({ notifications: { briefs: true, payouts: true, reminders: false }, security: { mfa: true, biometric: false, deviceAlerts: true } })} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">Reset</button>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-charcoal-900 mb-4">Security</h2>
              <button
                onClick={() => setPasswordModalOpen(true)}
                className="w-full rounded-lg bg-gold-500 py-2.5 text-sm font-semibold text-white hover:bg-gold-600 transition"
              >
                Change Password
              </button>

              <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                <ToggleRow
                  label="Multi-factor sign-in"
                  helper="OTP + device push verification"
                  active={preferences.security.mfa}
                  onToggle={() => togglePref("security", "mfa")}
                />
                <ToggleRow
                  label="Face ID on mobile"
                  helper="Biometric unlock in the app"
                  active={preferences.security.biometric}
                  onToggle={() => togglePref("security", "biometric")}
                />
                <ToggleRow
                  label="New device alerts"
                  helper="Notified of new sign-ins"
                  active={preferences.security.deviceAlerts}
                  onToggle={() => togglePref("security", "deviceAlerts")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChangePasswordModal isOpen={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />
      <PayoutModal open={showPayoutModal} onClose={() => setShowPayoutModal(false)} password={payoutPassword} setPassword={setPayoutPassword} revealPayout={revealPayout} details={payoutDetails} />
    </section>
  );
}

function ToggleRow({ label, helper, active, onToggle }) {
  return (
    <div className="flex items-start justify-between gap-4 p-3 border-b border-slate-100 last:border-b-0">
      <div>
        <p className="font-semibold text-charcoal-900 text-sm">{label}</p>
        <p className="text-xs text-slate-500 mt-1">{helper}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`relative flex h-6 w-12 items-center rounded-full transition flex-shrink-0 ${active ? "bg-gold-500" : "bg-slate-300"}`}
      >
        <span
          className={`h-5 w-5 transform rounded-full bg-white shadow transition ${active ? "translate-x-6" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
}

function ChangePasswordModal({ isOpen, onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user ID from local storage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!isOpen) return null;

  // Re-use existing password modal
  // NOTE: keep security calls server-side in production. This is a simple UX wrapper.

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);

    try {
      // NOTE: We are using a direct update.
      // In a real app, you should verify 'oldPassword' on the server.
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ password: newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      alert("Password updated successfully!");
      onClose();
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-charcoal-900">Change Password</h2>
        <p className="text-sm text-slate-500 mb-6">Enter your details to set a new password.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-white hover:bg-gold-600 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* Payout modal */
function PayoutModal({ open, onClose, password, setPassword, revealPayout, details }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-charcoal-900">View Payout Details</h2>
        <p className="text-sm text-slate-500 mb-4">Enter your password to unlock your stored payout methods.</p>
        {!details ? (
          <form onSubmit={revealPayout} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition">Cancel</button>
              <button type="submit" className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-white hover:bg-gold-600 transition">Unlock</button>
            </div>
          </form>
        ) : (
          <div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Primary</p>
              <p className="mt-2 font-semibold">{details.primary}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

