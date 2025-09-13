"use client";
import React from "react";

export default function Landing() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-12">
      <section>
        <h1 className="text-4xl font-extrabold leading-tight">
          Build automations like n8n — visual, flexible, and extendable
        </h1>
        <p className="mt-4 text-gray-600">
          Connect triggers, actions, and middlewares. This starter UI includes a landing page,
          auth forms, and a dashboard canvas where you can drag & drop your nodes.
        </p>

        <div className="mt-6 flex gap-3">
          <a href="/dashboard" className="px-5 py-3 bg-indigo-600 text-white rounded shadow">Open dashboard</a>
          <a href="/signup" className="px-5 py-3 border rounded">Sign up</a>
        </div>
      </section>

      <section>
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold">Quick preview</h3>
          <div className="mt-4 h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
            Node canvas preview (placeholder)
          </div>
        </div>
      </section>
    </div>
  );
}
