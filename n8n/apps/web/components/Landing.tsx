"use client";
import React from "react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-6">
        {/* Left section */}
        <section>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Build automations like <span className="text-indigo-600">n8n</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Connect triggers, actions, and middlewares visually. Extend your workflows with flexibility and power.
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="/dashboard"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition font-medium"
            >
              Open dashboard
            </a>
            <a
              href="/signup"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Sign up
            </a>
          </div>
        </section>

        {/* Right section */}
        <section>
          <div className="bg-white border rounded-xl p-8 shadow-lg">
            <h3 className="font-semibold text-lg text-gray-800">Quick preview</h3>
            <div className="mt-6 h-72 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-lg font-medium">
              Node canvas preview (placeholder)
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
