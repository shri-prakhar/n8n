"use client";
import React from "react";
import { Zap, Workflow, Shield, Rocket } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navbar */}
      <header className="w-full flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-extrabold text-indigo-700 tracking-tight">
          FlowForge
        </h1>
        <nav className="flex gap-6 text-gray-600 font-medium">
          <a href="#features" className="hover:text-indigo-600">Features</a>
          <a href="#preview" className="hover:text-indigo-600">Preview</a>
          <a href="/signup" className="hover:text-indigo-600">Sign up</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-8 py-16 gap-12">
        {/* Left */}
        <div className="flex-1">
          <h2 className="text-6xl font-extrabold text-gray-900 leading-tight">
            Automate your world <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              visually & effortlessly
            </span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-lg">
            Build workflows with triggers, actions, and AI agents. Save time and
            focus on what matters — let automations run your tasks.
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="/dashboard"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition font-medium"
            >
              Open Dashboard
            </a>
            <a
              href="/signup"
              className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition font-medium"
            >
              Get Started
            </a>
          </div>
        </div>

        {/* Right */}
        <div className="flex-1">
          <div className="bg-white border rounded-2xl shadow-xl p-6 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-40"></div>
            <h3 className="font-semibold text-gray-800 text-lg mb-4">
              Workflow preview
            </h3>
            <div className="h-72 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-medium">
              [Canvas Preview Placeholder]
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Why choose <span className="text-indigo-600">FlowForge</span>?
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition">
            <Zap className="w-10 h-10 text-indigo-600 mb-4" />
            <h3 className="font-semibold text-lg text-gray-800">Fast Setup</h3>
            <p className="text-gray-600 mt-2">
              Start building workflows in minutes with our intuitive drag-and-drop canvas.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition">
            <Workflow className="w-10 h-10 text-indigo-600 mb-4" />
            <h3 className="font-semibold text-lg text-gray-800">Visual Editor</h3>
            <p className="text-gray-600 mt-2">
              Connect triggers, actions, and AI agents seamlessly with no coding required.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition">
            <Rocket className="w-10 h-10 text-indigo-600 mb-4" />
            <h3 className="font-semibold text-lg text-gray-800">Scalable</h3>
            <p className="text-gray-600 mt-2">
              Scale your automations from small tasks to enterprise workflows effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} FlowForge. All rights reserved.
      </footer>
    </div>
  );
}
