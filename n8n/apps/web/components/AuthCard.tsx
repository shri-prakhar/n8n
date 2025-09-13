import React from "react";

export default function AuthCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 mt-12">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}
