"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Plus, Pencil, Trash2, Loader2, X, Save, ShieldCheck, User } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UserForm {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<UserForm | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => setForm({ name: "", email: "", password: "", role: "staff" });
  const openEdit = (u: AdminUser) => setForm({ id: u.id, name: u.name, email: u.email, password: "", role: u.role });
  const closeForm = () => { setForm(null); setError(""); };

  const handleSave = async () => {
    if (!form) return;
    if (!form.name || (!form.id && (!form.email || !form.password))) {
      setError("নাম, ইমেইল ও পাসওয়ার্ড আবশ্যক");
      return;
    }
    setSaving(true);
    setError("");

    const method = form.id ? "PUT" : "POST";
    const body = form.id
      ? { id: form.id, name: form.name, role: form.role, ...(form.password ? { password: form.password } : {}) }
      : { name: form.name, email: form.email, password: form.password, role: form.role };

    const res = await fetch("/api/admin/users", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);
    if (res.ok) {
      setSuccess(form.id ? "আপডেট হয়েছে!" : "ইউজার তৈরি হয়েছে!");
      setTimeout(() => setSuccess(""), 3000);
      closeForm();
      load();
    } else {
      const d = await res.json();
      setError(d.error || "সমস্যা হয়েছে");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("এই ইউজারটি মুছে ফেলবেন?")) return;
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) load();
    else {
      const d = await res.json();
      alert(d.error || "মুছতে পারা যায়নি");
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">অ্যাডমিন ইউজার</h1>
            <p className="text-gray-500 text-sm mt-1">অ্যাডমিন প্যানেলের ব্যবহারকারী ব্যবস্থাপনা</p>
          </div>
          <div className="flex items-center gap-3">
            {success && <span className="text-green-600 text-sm font-medium">{success}</span>}
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
            >
              <Plus size={16} /> নতুন ইউজার
            </button>
          </div>
        </div>

        {/* Role Legend */}
        <div className="flex gap-4 mb-5">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ShieldCheck size={16} className="text-green-500" />
            <span><strong>Admin</strong> — সব কিছু নিয়ন্ত্রণ করতে পারে</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={16} className="text-blue-500" />
            <span><strong>Staff</strong> — শুধু অর্ডার ও ড্যাশবোর্ড দেখতে পারে</span>
          </div>
        </div>

        {/* Modal */}
        {form && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">{form.id ? "ইউজার সম্পাদনা" : "নতুন ইউজার তৈরি"}</h2>
                <button onClick={closeForm} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">নাম *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="পূর্ণ নাম"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                {!form.id && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">ইমেইল *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {form.id ? "নতুন পাসওয়ার্ড (পরিবর্তন না করতে চাইলে খালি রাখুন)" : "পাসওয়ার্ড *"}
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">রোল *</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <option value="admin">Admin (সম্পূর্ণ অ্যাক্সেস)</option>
                    <option value="staff">Staff (শুধু অর্ডার ও ড্যাশবোর্ড)</option>
                  </select>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
              <div className="flex gap-3 p-5 border-t border-gray-100">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
                >
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                </button>
                <button onClick={closeForm} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center"><Loader2 size={28} className="animate-spin text-green-500 mx-auto" /></div>
          ) : (
            <div className="divide-y divide-gray-50">
              {users.map((u) => (
                <div key={u.id} className="flex items-center gap-4 p-5 hover:bg-gray-50">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${u.role === "admin" ? "bg-green-100" : "bg-blue-100"}`}>
                    {u.role === "admin"
                      ? <ShieldCheck size={18} className="text-green-600" />
                      : <User size={18} className="text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{u.name}</p>
                    <p className="text-gray-500 text-sm">{u.email}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                    {u.role === "admin" ? "Admin" : "Staff"}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => openEdit(u)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(u.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
