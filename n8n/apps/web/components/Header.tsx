"use client";
import React from "react";

type Props = {
  user: any;
  
};

export default function Header({ user,  }: Props) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">n8n</div>
          <div>
            <div className="font-semibold">YourFlow</div>
            <div className="text-xs text-gray-500">automation studio</div>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          {!user ? (
            <>
              <a href="/signin" className="px-3 py-1 bg-indigo-600 text-white rounded">Sign in</a>
              <a href="/signup" className="px-3 py-1 border rounded">Sign up</a>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm">{user.name ?? user.email}</span>
              <button className="px-2 py-1 border rounded" >Sign out</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
