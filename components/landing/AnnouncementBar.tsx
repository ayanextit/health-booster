"use client";
import { Truck } from "lucide-react";

interface AnnouncementBarProps {
  text: string;
}

export default function AnnouncementBar({ text }: AnnouncementBarProps) {
  return (
    <div className="bg-green-700 text-white py-2 px-4 text-center text-sm font-medium">
      <div className="flex items-center justify-center gap-2">
        <Truck size={16} className="shrink-0" />
        <span>{text}</span>
      </div>
    </div>
  );
}
