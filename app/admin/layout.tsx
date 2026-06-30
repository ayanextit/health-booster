import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | Health Booster",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Spacer for fixed mobile top bar (h-14 = 56px) */}
      <div className="h-14 lg:hidden" />
      {children}
    </div>
  );
}
