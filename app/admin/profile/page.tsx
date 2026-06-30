"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { CheckCircle2, Loader2, Lock, User, ShieldCheck } from "lucide-react";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => {
        if (r.status === 401) { router.push("/admin/login"); return null; }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        if (d.user) { setProfile(d.user); setName(d.user.name); }
      })
      .catch(() => {});
  }, [router]);

  const handleNameSave = async () => {
    setProfileSaving(true);
    setProfileMsg({ type: "", text: "" });
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setProfileSaving(false);
    if (res.ok) {
      setProfileMsg({ type: "success", text: "নাম আপডেট হয়েছে!" });
      if (profile) setProfile({ ...profile, name });
      setTimeout(() => setProfileMsg({ type: "", text: "" }), 3000);
    } else {
      const d = await res.json().catch(() => ({}));
      setProfileMsg({ type: "error", text: (d as { error?: string }).error || "সমস্যা হয়েছে" });
    }
  };

  const handlePasswordChange = async () => {
    setPwMsg({ type: "", text: "" });
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwMsg({ type: "error", text: "সব ঘর পূরণ করুন" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg({ type: "error", text: "নতুন পাসওয়ার্ড মিলছে না" });
      return;
    }
    if (newPassword.length < 6) {
      setPwMsg({ type: "error", text: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে" });
      return;
    }
    setPwSaving(true);
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setPwSaving(false);
    if (res.ok) {
      setPwMsg({ type: "success", text: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwMsg({ type: "", text: "" }), 4000);
    } else {
      const d = await res.json().catch(() => ({}));
      setPwMsg({ type: "error", text: (d as { error?: string }).error || "পাসওয়ার্ড পরিবর্তন ব্যর্থ" });
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">প্রোফাইল সেটিংস</h1>
          <p className="text-gray-500 text-sm mt-1">আপনার অ্যাকাউন্ট তথ্য ও পাসওয়ার্ড পরিচালনা</p>
        </div>

        <div className="max-w-xl space-y-6">
          {/* Account Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <User size={20} className="text-green-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">অ্যাকাউন্ট তথ্য</h2>
            </div>

            {profile && (
              <div className="flex items-center gap-3 mb-5 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{profile.name}</p>
                  <p className="text-gray-500 text-sm">{profile.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ShieldCheck size={13} className={profile.role === "admin" ? "text-green-500" : "text-blue-500"} />
                    <span className={`text-xs font-medium ${profile.role === "admin" ? "text-green-600" : "text-blue-600"}`}>
                      {profile.role === "admin" ? "Admin" : "Staff"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">নাম</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ইমেইল</label>
                <input
                  value={profile?.email || ""}
                  disabled
                  className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">ইমেইল পরিবর্তন করা যাবে না</p>
              </div>
              {profileMsg.text && (
                <div className={`flex items-center gap-1.5 text-sm font-medium ${profileMsg.type === "success" ? "text-green-600" : "text-red-500"}`}>
                  {profileMsg.type === "success" && <CheckCircle2 size={15} />}
                  {profileMsg.text}
                </div>
              )}
              <button
                onClick={handleNameSave}
                disabled={profileSaving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
              >
                {profileSaving ? <Loader2 size={15} className="animate-spin" /> : null}
                {profileSaving ? "সংরক্ষণ হচ্ছে..." : "নাম সংরক্ষণ করুন"}
              </button>
            </div>
          </div>

          {/* Password Change */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Lock size={20} className="text-orange-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">পাসওয়ার্ড পরিবর্তন</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">বর্তমান পাসওয়ার্ড *</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">নতুন পাসওয়ার্ড *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">নতুন পাসওয়ার্ড নিশ্চিত করুন *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড আবার লিখুন"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              {pwMsg.text && (
                <div className={`flex items-center gap-1.5 text-sm font-medium ${pwMsg.type === "success" ? "text-green-600" : "text-red-500"}`}>
                  {pwMsg.type === "success" && <CheckCircle2 size={15} />}
                  {pwMsg.text}
                </div>
              )}
              <button
                onClick={handlePasswordChange}
                disabled={pwSaving}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
              >
                {pwSaving ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
                {pwSaving ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
