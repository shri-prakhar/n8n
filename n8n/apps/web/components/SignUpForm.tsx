"use client";
import React, { useState } from "react";
import { signUpApi } from "../lib/api";
import { motion } from "framer-motion";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await signUpApi({ name, email, password });
    window.location.href = "/signin";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2d2e2e] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#3a3b3b] shadow-2xl rounded-3xl p-8 border border-gray-700"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Create your account</h2>
          <p className="mt-2 text-gray-400">Join and start building workflows</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            className="w-full bg-[#2d2e2e] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full bg-[#2d2e2e] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full bg-[#2d2e2e] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full bg-indigo-600 text-white rounded-lg py-3 font-medium shadow hover:bg-indigo-700 transition"
          >
            Sign up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-indigo-400 font-medium hover:underline"
          >
            Sign in
          </a>
        </p>
      </motion.div>
    </div>
  );
}
