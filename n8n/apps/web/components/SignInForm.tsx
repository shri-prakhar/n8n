"use client";
import React, { useState } from "react";
import { signInApi } from "../lib/api";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await signInApi({ email, password }); // -
    window.location.href = "/dashboard"; // redirect after success
  }

  return (
    <form onSubmit={handleSubmit}>
      <input className="w-full border rounded px-3 py-2 mb-3" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full border rounded px-3 py-2 mb-3" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="px-4 py-2 bg-indigo-600 text-white rounded w-full cursor-pointer">Sign in</button>
    </form>
  );
}
    