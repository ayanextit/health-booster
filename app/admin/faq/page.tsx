"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, GripVertical, Loader2, X, Save } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  sortOrder: number;
}

interface EditForm {
  id?: string;
  question: string;
  answer: string;
  isActive: boolean;
}

export default function FAQAdminPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/faq");
    if (res.ok) {
      const data = await res.json();
      setFaqs(data.faqs);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => setEditForm({ question: "", answer: "", isActive: true });
  const openEdit = (faq: FAQ) => setEditForm({ id: faq.id, question: faq.question, answer: faq.answer, isActive: faq.isActive });
  const closeEdit = () => { setEditForm(null); setError(""); };

  const handleSave = async () => {
    if (!editForm) return;
    if (!editForm.question.trim() || !editForm.answer.trim()) {
      setError("প্রশ্ন ও উত্তর আবশ্যক");
      return;
    }
    setSaving(true);
    setError("");

    const method = editForm.id ? "PUT" : "POST";
    const res = await fetch("/api/admin/faq", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });

    setSaving(false);
    if (res.ok) {
      setSuccess(editForm.id ? "আপডেট হয়েছে!" : "যোগ হয়েছে!");
      setTimeout(() => setSuccess(""), 3000);
      closeEdit();
      load();
    } else {
      const d = await res.json();
      setError(d.error || "সমস্যা হয়েছে");
    }
  };

  const toggleActive = async (faq: FAQ) => {
    await fetch("/api/admin/faq", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: faq.id, isActive: !faq.isActive }),
    });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("এই প্রশ্নটি মুছে ফেলবেন?")) return;
    await fetch("/api/admin/faq", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">FAQ পরিচালনা</h1>
            <p className="text-gray-500 text-sm mt-1">সাধারণ প্রশ্ন ও উত্তর যোগ, সম্পাদনা বা মুছুন</p>
          </div>
          <div className="flex items-center gap-3">
            {success && (
              <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                <CheckCircle2 size={16} /> {success}
              </div>
            )}
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
            >
              <Plus size={16} /> নতুন প্রশ্ন
            </button>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {editForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">{editForm.id ? "প্রশ্ন সম্পাদনা" : "নতুন প্রশ্ন যোগ"}</h2>
                <button onClick={closeEdit} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">প্রশ্ন *</label>
                  <input
                    value={editForm.question}
                    onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                    placeholder="প্রশ্ন লিখুন..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">উত্তর *</label>
                  <textarea
                    value={editForm.answer}
                    onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                    placeholder="উত্তর লিখুন..."
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                    className="w-4 h-4 accent-green-600"
                  />
                  <span className="text-sm text-gray-700 font-medium">সক্রিয় (ওয়েবসাইটে দেখাবে)</span>
                </label>
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
                <button onClick={closeEdit} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAQ List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 size={28} className="animate-spin text-green-500 mx-auto" />
            </div>
          ) : faqs.length === 0 ? (
            <div className="p-12 text-center text-gray-400">কোনো প্রশ্ন নেই</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {faqs.map((faq, idx) => (
                <div key={faq.id} className="flex items-start gap-4 p-5 hover:bg-gray-50">
                  <GripVertical size={18} className="text-gray-300 mt-0.5 shrink-0 cursor-grab" />
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-green-700 text-xs font-bold">{idx + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 text-sm">{faq.question}</p>
                      {!faq.isActive && (
                        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">লুকানো</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleActive(faq)}
                      title={faq.isActive ? "লুকান" : "দেখান"}
                      className={`p-2 rounded-lg transition-colors ${faq.isActive ? "text-green-500 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}
                    >
                      {faq.isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    </button>
                    <button
                      onClick={() => openEdit(faq)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                    >
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
